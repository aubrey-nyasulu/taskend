"use client"
import { createContext, ReactNode, useEffect, useState } from "react"
import { countPages, getStoredColumns, setStoredColumns } from "@/lib/utils"
import { ColumnType, RowType } from "@/types"
import { filterTasks, sortTasks, getStoredTasks, setStoredTasks } from "@/lib/utils"

type FetchTasksPropTypes = {
    page: number
    sortBy?: string
    order?: 'a' | 'd'
    filterValue?: string
    filterConstraint?: 'contains' | 'does not contain' | 'starts with' | 'ends with'
}

type TaskState = {
    pages: number
    ProtectedFields: Record<string, string>
    columns: ColumnType[]
    rows: RowType[]
    addNewField: (name: string, type: 'text' | 'number' | 'checkbox') => void
    removeColumn: (columnId: string) => void
    editTask: (id: number, fieldName: string, value: string) => void
    createTask: (task: RowType) => void
    deleteTask: (taskToDeleteId: number) => void
    fetchTasks: (params: FetchTasksPropTypes) => void
}

const initialState: TaskState = {
    ProtectedFields: { title: "title", status: "status", priority: "priority" },
    pages: 0,
    columns: [],
    rows: [],
    addNewField: () => { },
    removeColumn: () => { },
    editTask: () => { },
    createTask: () => { },
    deleteTask: () => { },
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

    const defaultCloumns: ColumnType[] = [
        { name: "title", type: "text" },
        { name: "status", type: "button" },
        { name: "priority", type: "button" },
    ]

    useEffect(() => {
        const columns = getStoredColumns()

        if (!columns) {
            setStoredColumns(defaultCloumns)
        }
    }, [])

    const addNewField = (name: string, type: 'text' | 'number' | 'checkbox') => {
        const updatedColumns = [...columns, { name, type }]
        setColumns(updatedColumns)

        setRows(prevRows => prevRows.map(row => ({ ...row, [name]: "" })))

        setStoredColumns(updatedColumns)
    }

    const removeColumn = (columnId: string) => {
        if (initialState.ProtectedFields[columnId]) return

        const filteredColumns = columns.filter(col => col.name !== columnId)

        setColumns(filteredColumns)

        setRows(prev => prev.map(row => {
            const { [columnId]: _, ...rest } = row
            return rest as RowType
        }))

        setStoredColumns(filteredColumns)
    }

    const editTask = (id: number, fieldName: string, value: string) => {
        const updatedRows = rows.map(task =>
            task.id === id ? { ...task, [fieldName]: value } : task
        )
        setRows(updatedRows)

        const updatedStorageTasks = cachedTasks.map(task =>
            task.id === id ? { ...task, [fieldName]: value } : task
        )
        setStoredTasks(updatedStorageTasks)
    }

    const createTask = (task: RowType) => {
        const tasks = getStoredTasks()
        task.id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1
        tasks.push(task)
        setStoredTasks(tasks)

        setRows([task, ...rows].slice(0, limit))

        setPages(countPages(tasks.length, limit))
    }

    const deleteTask = (taskToDeleteId: number) => {
        const tasks = getStoredTasks().filter(({ id }) => id !== taskToDeleteId)
        setStoredTasks(tasks)

        setPages(countPages(tasks.length, limit))

        fetchTasks({ page: currentPage })
    }

    const fetchTasks = ({ filterConstraint, page, order, sortBy, filterValue }: FetchTasksPropTypes) => {
        let tasks = getStoredTasks()
        setCachedTasks(tasks)

        if (filterConstraint && filterValue) tasks = filterTasks(tasks, filterValue, filterConstraint)
        if (sortBy && order) tasks = sortTasks(tasks, sortBy, order)

        let sliceStartIndex = tasks.length - (limit * page)
        let sliceEndIndex = tasks.length - (limit * (page - 1))

        sliceStartIndex = sliceStartIndex >= 0 ? sliceStartIndex : 0
        sliceEndIndex = sliceEndIndex >= 0 ? sliceEndIndex : 0
        setRows(tasks.slice(sliceStartIndex, sliceEndIndex).reverse())

        const columns = getStoredColumns()
        setColumns(columns)

        setPages(countPages(tasks.length, limit))
        setCurrentPage(page)
    }

    return (
        <TaskContext.Provider value={{ pages, ProtectedFields: initialState.ProtectedFields, columns, rows, addNewField, removeColumn, editTask, createTask, deleteTask, fetchTasks }}>
            {children}
        </TaskContext.Provider>
    )
}

export default TaskContext
