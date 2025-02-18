"use client"

import { tasks } from "@/lib/data"
import { countPages } from "@/lib/utils"
import { ColumnType, RowType } from "@/types"
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react"

type FetchTasksPropTypes = {
    page: number,
    sortBy?: string,
    order?: string,
    filterValue?: string
    filterConstraint?: 'contains' | 'does not contain' | 'starts with' | 'ends with'
}

type TaskState = {
    pages: number
    ProtectedFields: {
        title: string;
        status: string;
        priority: string;
    }
    columns: ColumnType[]
    rows: RowType[]
    addNewField: (name: string, type: 'text' | 'number' | 'checkbox') => void
    removeColumn: (columnId: string) => void
    editTask: ({ id, fieldName, value }: {
        id: number;
        fieldName: string;
        value: string;
    }) => void
    createTask: (task: RowType) => void
    deleteTask: (taskToDeleteId: number) => void
    fetchTasks(tasks: FetchTasksPropTypes): void
}

const initialState: TaskState = {
    ProtectedFields: { title: 'title', status: 'status', priority: 'priority' },
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
    const ProtectedFields = { title: 'title', status: 'status', priority: 'priority' }
    const limit = 20

    const [columns, setColumns] = useState<ColumnType[]>([])
    const [rows, setRows] = useState<RowType[]>([])
    const [pages, setPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    const addColumnToRows = (columnId: string) => {
        setRows((prevRows) =>
            prevRows.map((row) => ({ ...row, [columnId]: "" })) // Empty value for new column
        )
    }

    const addColumn = (name: string, type: 'text' | 'number' | 'checkbox') => {
        const newColumn: ColumnType = { name, type }
        setColumns([...columns, newColumn])
    }

    const removeColumn = (columnId: string) => {
        if (columnId in ProtectedFields) return

        setColumns(columns.filter((col) => col.name !== columnId));

        // @ts-ignore
        setRows(rows.map((row) => {
            const { [columnId]: _, ...rest } = row

            return rest
        }))
    }

    const addNewField = (name: string, type: 'text' | 'number' | 'checkbox') => {
        addColumn(name, type)
        addColumnToRows(name)
    }

    const editTask = ({ id, fieldName, value }: { id: number, fieldName: string, value: string }) => {
        const tasks: RowType[] = JSON.parse(localStorage.getItem('tasks') || '')

        const updatedTasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, [fieldName]: value }
            }

            return task
        })

        console.log({ updatedTasks })

        localStorage.setItem('tasks', JSON.stringify(updatedTasks))
    }

    const createTask = (task: RowType) => {
        const tasks: RowType[] = JSON.parse(localStorage.getItem('tasks') || '')

        task.id = tasks[tasks.length - 1].id + 1
        tasks.push(task)

        localStorage.setItem('tasks', JSON.stringify(tasks))

        const updatedList = [task, ...rows]

        updatedList.pop()
        setRows(updatedList)

        setPages(countPages(tasks.length + 1, limit))
    }

    const deleteTask = (taskToDeleteId: number) => {
        const tasks: RowType[] = JSON.parse(localStorage.getItem('tasks') || '')

        const filteredTasks = tasks.filter(({ id }) => id !== taskToDeleteId)

        localStorage.setItem('tasks', JSON.stringify(filteredTasks))

        fetchTasks({ page: currentPage })

        setPages(countPages(tasks.length - 1, limit))
    }

    function fetchTasks({ filterConstraint, page, order, sortBy, filterValue }: FetchTasksPropTypes) {
        let tasks: RowType[] = JSON.parse(localStorage.getItem('tasks') || '')

        if (tasks && tasks.length > 1) {
            if (filterConstraint && filterValue) {
                tasks = filterTasks({ tasks, filterConstraint, filterValue })
            }

            if (sortBy && order) {
                tasks = sortTasks(tasks, sortBy, order)
            }

            const sliceStartIndex = tasks.length - (limit * page)
            const sliceEndIndex = tasks.length - (limit * (page - 1))
            const currentPageTasks = tasks
                .slice(sliceStartIndex, sliceEndIndex)
                .reverse()

            setRows(currentPageTasks)

            setColumns([
                { name: "title", type: 'text' },
                { name: "status", type: 'button' },
                { name: "priority", type: 'button' }
            ])

            setPages(countPages(tasks.length, limit))
        }
    }

    // localStorage.setItem('tasks', JSON.stringify(tasks))

    return (
        <TaskContext.Provider value={{
            pages,
            ProtectedFields,
            columns,
            rows,
            addNewField,
            removeColumn,
            editTask,
            createTask,
            deleteTask,
            fetchTasks,
        }}
        >
            {children}
        </TaskContext.Provider>
    )
}

export default TaskContext

type FilterTasksPropTypes = {
    tasks: RowType[],
    filterValue: string,
    filterConstraint: 'contains' | 'does not contain' | 'starts with' | 'ends with'
}

function filterTasks({ filterValue, filterConstraint, tasks }: FilterTasksPropTypes): RowType[] {
    return tasks.filter(task => {
        const title = task.title.toLowerCase()
        const query = filterValue.toLowerCase()

        switch (filterConstraint) {
            case 'contains':
                return title.includes(query)
            case 'does not contain':
                return !title.includes(query)
            case 'starts with':
                return title.startsWith(query)
            case 'ends with':
                return title.endsWith(query)
            default:
                return true // Return all tasks if the constraint is unknown
        }
    })
}

function sortTasks(tasks: RowType[], sortBy?: string, order?: string) {
    tasks.sort((a, b) => {
        // @ts-ignore
        if (!a[sortBy]) return 1 // Move undefined/null to the end
        // @ts-ignore
        if (!b[sortBy]) return -1
        if (order === 'a') {
            // @ts-ignore
            return a[sortBy].toLowerCase().localeCompare(b[sortBy].toLowerCase())
        } else {
            // @ts-ignore
            return b[sortBy].toLowerCase().localeCompare(a[sortBy].toLowerCase())
        }
    })

    return tasks
}