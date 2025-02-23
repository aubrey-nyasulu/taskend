"use client"

import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react"
import { countPages, deepClone, getStoredBoardSnapShot, getStoredColumns, setStoredBoardSnapShot, setStoredColumns } from "@/lib/utils"
import { ColumnType, RowType } from "@/types"
import { filterTasks, sortTasks, getStoredTasks, setStoredTasks } from "@/lib/utils"
import { updateBoard } from "./BoardContextProvider"

export type FetchTasksPropTypes = {
    page: number
    sortBy?: string
    order?: 'a' | 'd'
    filterValue?: string
    filterConstraint?: 'contains' | 'does not contain' | 'starts with' | 'ends with'
}

type TaskState = {
    pages: number
    currentPage: number
    ProtectedFields: Record<string, string>
    columns: ColumnType[]
    rows: RowType[]
    cachedTasks: RowType[]
    undoStack: { rows: RowType[], columns: ColumnType[] }[]
    redoStack: { rows: RowType[], columns: ColumnType[] }[]
    selectedTasks: string[]
    setSelectedTasks: Dispatch<SetStateAction<string[]>>
    setCachedTasks: Dispatch<SetStateAction<RowType[]>>
    setRows: Dispatch<SetStateAction<RowType[]>>
    undo: () => void
    redo: () => void
    saveState: () => void
    addNewField: (name: string, type: 'text' | 'number' | 'checkbox') => void
    removeColumn: (columnId: string) => void
    editTask: (id: number, fieldName: string, value: string) => void
    createTask: (task: RowType) => void
    deleteTask: (taskToDeleteId: number) => void
    bulkEdit: (fieldName: string, value: string) => void
    bulkDelete: () => void
    fetchTasks: (params: FetchTasksPropTypes) => void
}

const initialState: TaskState = {
    ProtectedFields: { title: "title", status: "status", priority: "priority" },
    pages: 0,
    currentPage: 1,
    columns: [],
    rows: [],
    cachedTasks: [],
    undoStack: [],
    redoStack: [],
    selectedTasks: [],
    setRows: () => { },
    setCachedTasks: () => { },
    setSelectedTasks: () => { },
    undo: () => { },
    redo: () => { },
    saveState: () => { },
    addNewField: () => { },
    removeColumn: () => { },
    editTask: () => { },
    createTask: () => { },
    deleteTask: () => { },
    bulkEdit: () => { },
    bulkDelete: () => { },
    fetchTasks: () => { },
}

const TaskContext = createContext<TaskState>(initialState)

export const TaskContextProvider = ({ children }: { children: ReactNode }) => {
    const [cachedTasks, setCachedTasks] = useState<RowType[]>([])
    const [columns, setColumns] = useState<ColumnType[]>([])
    const [rows, setRows] = useState<RowType[]>([])
    const [pages, setPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [undoStack, setUndoStack] = useState<{ rows: RowType[], columns: ColumnType[] }[]>([])
    const [redoStack, setRedoStack] = useState<{ rows: RowType[], columns: ColumnType[] }[]>([])
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]) // Store selected task IDs

    const limit = 20
    const MAX_STACK_SIZE = 10

    // Save the current state before making a change (for undo/redo)
    const saveState = () => {
        setUndoStack(prev => {
            const newStack = [...prev, { rows: deepClone(rows), columns: deepClone(columns) }]
            return newStack.length > MAX_STACK_SIZE ? newStack.slice(1) : newStack
        })

        setRedoStack([]) // Clear redo stack
    }

    const undo = () => {
        if (!undoStack.length) return

        const prevState = undoStack[undoStack.length - 1]

        setRedoStack(prev => [...prev, { rows: deepClone(rows), columns: deepClone(columns) }])
        setRows(prevState.rows)
        setColumns(prevState.columns)
        setUndoStack(prev => prev.slice(0, -1))
    }

    const redo = () => {
        if (!redoStack.length) return

        const nextState = redoStack[redoStack.length - 1]

        setUndoStack(prev => [...prev, { rows: deepClone(rows), columns: deepClone(columns) }])
        setRows(nextState.rows)
        setColumns(nextState.columns)
        setRedoStack(prev => prev.slice(0, -1))
    }

    const addNewField = (name: string, type: 'text' | 'number' | 'checkbox') => {
        saveState()

        const updatedColumns = [...columns, { name, type }]
        setColumns(updatedColumns)
        setRows(prevRows => prevRows.map(row => ({ ...row, [name]: "" })))
        setStoredColumns(updatedColumns)
    }

    const removeColumn = (columnId: string) => {
        if (initialState.ProtectedFields[columnId]) return

        saveState()

        const filteredColumns = columns.filter(col => col.name !== columnId)

        setColumns(filteredColumns)
        setRows(prev => prev.map(row => {
            const { [columnId]: _, ...rest } = row
            return rest as RowType
        }))

        setStoredColumns(filteredColumns)
    }

    const editTask = (id: number, fieldName: string, value: string) => {
        saveState()

        const updatedRows = rows.map((task, index) => {
            const targetTask = task.id === id

            if (targetTask) {
                saveSnapShot(task.priority, index, value)
            }

            return targetTask ? { ...task, [fieldName]: value } : task
        })
        setRows(updatedRows)

        const updatedStorageTasks = cachedTasks.map(task =>
            task.id === id ? { ...task, [fieldName]: value } : task
        )
        setStoredTasks(updatedStorageTasks)
        setCachedTasks(updatedStorageTasks)
    }

    const createTask = (task: RowType) => {
        saveState()

        const tasks = cachedTasks
        task.id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1

        console.log('pas', { task })

        if (!task.id || !task?.title || !task?.priority || !task?.status) return

        tasks.push(task)
        setRows([task, ...rows].slice(0, limit))
        setPages(countPages(tasks.length, limit))

        saveSnapShot(task.priority, 19, task.priority)

        setStoredTasks(tasks)
        setCachedTasks(tasks)
    }

    const deleteTask = (taskToDeleteId: number) => {
        saveState()

        const tasks = cachedTasks.filter(({ id }) => id !== taskToDeleteId)
        setStoredTasks(tasks)

        setPages(countPages(tasks.length, limit))

        fetchTasks({ page: currentPage })
    }

    const bulkEdit = (fieldName: string, value: string) => {
        saveState()

        const updatedRows = rows.map(task =>
            selectedTasks.includes(task.id.toString()) ? { ...task, [fieldName]: value } : task
        )
        setRows(updatedRows)

        const updatedStorageTasks = cachedTasks.map(task =>
            selectedTasks.includes(task.id.toString()) ? { ...task, [fieldName]: value } : task
        )

        setStoredTasks(updatedStorageTasks)
        setCachedTasks(updatedStorageTasks)
    }

    const bulkDelete = () => {
        saveState()

        const tasks = cachedTasks.filter(({ id }) => !selectedTasks.includes(id.toString()))
        setStoredTasks(tasks)

        setPages(countPages(tasks.length, limit))

        fetchTasks({ page: currentPage })
    }

    const fetchTasks = ({ filterConstraint, page, order, sortBy, filterValue }: FetchTasksPropTypes) => {
        const tasks = getStoredTasks()

        setCachedTasks(tasks)

        let sliceStartIndex = tasks.length - (limit * page)
        let sliceEndIndex = tasks.length - (limit * (page - 1))

        sliceStartIndex = sliceStartIndex >= 0 ? sliceStartIndex : 0
        sliceEndIndex = sliceEndIndex >= 0 ? sliceEndIndex : 0
        let rows = tasks.slice(sliceStartIndex, sliceEndIndex).reverse()

        if (filterConstraint && filterValue) {
            rows = filterTasks(rows, filterValue, filterConstraint)
        }

        if (sortBy && order) {
            rows = sortTasks(rows, sortBy, order)
        }

        setRows(rows)

        const columns = getStoredColumns()
        setColumns(columns)

        setPages(countPages(tasks.length, limit))
        setCurrentPage(page)
    }

    return (
        <TaskContext.Provider value={{ pages, currentPage, ProtectedFields: initialState.ProtectedFields, columns, rows, cachedTasks, undoStack, redoStack, selectedTasks, setRows, setCachedTasks, setSelectedTasks, undo, redo, saveState, addNewField, removeColumn, editTask, createTask, deleteTask, bulkEdit, bulkDelete, fetchTasks }}>
            {children}
        </TaskContext.Provider>
    )
}

export default TaskContext

function saveSnapShot(taskPriority: string, index: number, destinationColumn: string) {
    const boardSnapShot = getStoredBoardSnapShot()

    console.log({ destinationColumn, boardSnapShot })

    if (!boardSnapShot?.length) return

    let draggingFrom: { index: number, column: number } = { column: -1, index: -1 }
    let draggedTo: { index: number, column: number } = { column: -1, index: 0 }

    draggingFrom.column = ['none', 'low', 'medium', 'high', 'urgent']
        .findIndex(priority => priority === taskPriority)
    draggingFrom.index = boardSnapShot[draggingFrom.column][1]
        .findIndex(taskId => taskId === index)
    draggedTo.column = boardSnapShot.findIndex(column => column[0] === destinationColumn)

    if (draggingFrom.index === -1) {
        draggingFrom.index = boardSnapShot[draggingFrom.column][1].length
        boardSnapShot[draggingFrom.column][1][draggingFrom.index] = index
    }

    console.log({ draggingFrom, draggedTo })
    if (
        draggingFrom.column > -1 &&
        draggedTo.index > -1 &&
        draggedTo.column > -1
    ) {
        updateBoard({ payload: { draggingFrom, draggedTo }, state: boardSnapShot })
    }
}