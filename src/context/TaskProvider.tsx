"use client"

import { tasks } from "@/lib/data"
import { ColumnType, RowType } from "@/types"
import { createContext, ReactNode, useEffect, useState } from "react"

type TaskState = {
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
    ProtectedFields: {
        title: string;
        status: string;
        priority: string;
    }
}

const initialState: TaskState = {
    columns: [],
    rows: [],
    addNewField: () => { },
    removeColumn: () => { },
    editTask: () => { },
    createTask: () => { },
    deleteTask: () => { },
    ProtectedFields: { title: 'title', status: 'status', priority: 'priority' }
}

const TaskContext = createContext<TaskState>(initialState)

export const TaskContextProvider = ({ children }: { children: ReactNode }) => {
    const ProtectedFields = { title: 'title', status: 'status', priority: 'priority' }

    const [columns, setColumns] = useState<ColumnType[]>([])
    const [rows, setRows] = useState<RowType[]>([])

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
    }

    const deleteTask = (taskToDeleteId: number) => {
        const tasks: RowType[] = JSON.parse(localStorage.getItem('tasks') || '')

        const filteredTasks = tasks.filter(({ id }) => id !== taskToDeleteId)

        localStorage.setItem('tasks', JSON.stringify(filteredTasks))

        fetchTasks()
    }

    function fetchTasks(limit = 10, page = 1) {
        let tasks: RowType[] = JSON.parse(localStorage.getItem('tasks') || '')

        if (tasks && tasks.length > 1) {
            const sliceStartIndex = tasks.length - (limit * page)
            const sliceEndIndex = tasks.length - (limit * (page - 1))
            tasks = tasks.slice(sliceStartIndex, sliceEndIndex)

            setRows(tasks.reverse())

            setColumns([
                { name: "title", type: 'text' },
                { name: "status", type: 'button' },
                { name: "priority", type: 'button' }
            ])
        }
    }

    useEffect(() => {
        // localStorage.setItem('tasks', JSON.stringify(tasks))
        fetchTasks()
    }, [])

    return (
        <TaskContext.Provider value={{
            columns,
            rows,
            addNewField,
            removeColumn,
            editTask,
            createTask,
            deleteTask,
            ProtectedFields
        }}
        >
            {children}
        </TaskContext.Provider>
    )
}

export default TaskContext 