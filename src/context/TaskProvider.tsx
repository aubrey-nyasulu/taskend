"use client"

import { ColumnType, RowType } from "@/types"
import { createContext, ReactNode, useEffect, useState } from "react"

type TaskState = {
    columns: ColumnType[]
    rows: RowType[]
    addNewField: (name: string, type: string) => void
    removeColumn: (columnId: string) => void
    editTask: ({ id, fieldName, value }: {
        id: number;
        fieldName: string;
        value: string;
    }) => void
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
    removeColumn: (columnId: string) => { },
    editTask: () => { },
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

    const addColumn = (name: string, type: string) => {
        const newColumn = { name, type }
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

    const addNewField = (name: string, type: string) => {
        addColumn(name, type)
        addColumnToRows(name)
    }

    function fetchTasks(limit = 10, page = 1) {
        let tasks = JSON.parse(localStorage.getItem('tasks') || '')

        if (tasks && tasks.length > 1) {
            tasks = tasks.slice(limit * (page - 1), limit * page)

            console.log({ tasks })
            setRows(tasks)

            setColumns([
                { name: "title", type: 'text' },
                { name: "status", type: 'text' },
                { name: "priority", type: 'text' }
            ])
        }
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

    useEffect(() => {
        fetchTasks()
    }, [])

    return (
        <TaskContext.Provider value={{
            columns,
            rows,
            addNewField,
            removeColumn,
            editTask,
            ProtectedFields
        }}
        >
            {children}
        </TaskContext.Provider>
    )
}

export default TaskContext 