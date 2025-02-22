"use client"
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react"
import { countPages, deepClone, getStoredColumns, setStoredColumns } from "@/lib/utils"
import { ColumnType, RowType } from "@/types"
import { filterTasks, sortTasks, getStoredTasks, setStoredTasks } from "@/lib/utils"

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
    const limit = 20
    const [cachedTasks, setCachedTasks] = useState<RowType[]>([])
    const [columns, setColumns] = useState<ColumnType[]>([])
    const [rows, setRows] = useState<RowType[]>([])
    const [pages, setPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [undoStack, setUndoStack] = useState<{ rows: RowType[], columns: ColumnType[] }[]>([])
    const [redoStack, setRedoStack] = useState<{ rows: RowType[], columns: ColumnType[] }[]>([])
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]) // Store selected task IDs

    const MAX_STACK_SIZE = 10
    const saveState = () => {
        setUndoStack(prev => {
            const newStack = [...prev, { rows: cachedTasks, columns }]
            return newStack.length > MAX_STACK_SIZE ? newStack.slice(1) : newStack
        })

        setRedoStack([]) // Clear redo stack on new changes
    }

    // Undo last change
    const undo = () => {
        if (undoStack.length === 0) return
        setRedoStack(prev => [...prev, { rows: cachedTasks, columns }]) // Save current state before undoing
        setStoredTasks(undoStack[undoStack.length - 1].rows) // Restore previous state
        setStoredColumns(undoStack[undoStack.length - 1].columns)
        setUndoStack(prev => prev.slice(0, -1)) // Remove last state

        fetchTasks({ page: currentPage })
    }

    // Redo last undone change
    const redo = () => {
        if (redoStack.length === 0) return
        setUndoStack(prev => [...prev, { rows: cachedTasks, columns }]) // Save current state before redoing
        setStoredTasks(redoStack[redoStack.length - 1]?.rows || []) // Restore next state
        setStoredColumns(undoStack[undoStack.length - 1]?.columns)
        setRedoStack(prev => prev.slice(0, -1)) // Remove last state

        fetchTasks({ page: currentPage })
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

        const updatedRows = rows.map(task =>
            task.id === id ? { ...task, [fieldName]: value } : task
        )
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

        if (!task.id || !task?.title || !task?.priority || !task?.status) return

        tasks.push(task)
        setRows([task, ...rows].slice(0, limit))

        setPages(countPages(tasks.length, limit))

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
        let tasks = getStoredTasks()

        setCachedTasks(tasks)

        if (filterConstraint && filterValue) {
            tasks = filterTasks(tasks, filterValue, filterConstraint)
        }

        if (sortBy && order) {
            tasks = sortTasks(tasks, sortBy, order)
        }

        let sliceStartIndex = tasks.length - (limit * page)
        let sliceEndIndex = tasks.length - (limit * (page - 1))

        sliceStartIndex = sliceStartIndex >= 0 ? sliceStartIndex : 0
        sliceEndIndex = sliceEndIndex >= 0 ? sliceEndIndex : 0
        const rows = tasks.slice(sliceStartIndex, sliceEndIndex).reverse()
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
