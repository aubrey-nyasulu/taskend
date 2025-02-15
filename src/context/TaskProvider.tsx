"use client"

import { ColumnType, RowType } from "@/types"
import { createContext, ReactNode, useEffect, useState } from "react"

type TaskState = {
    columns: ColumnType[]
    rows: RowType[]
    addNewField: (name: string, type: string) => void
}

const initialState: TaskState = {
    columns: [],
    rows: [],
    addNewField: () => { }
}

const TaskContext = createContext<TaskState>(initialState)

export const TaskContextProvider = ({ children }: { children: ReactNode }) => {
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

    const addNewField = (name: string, type: string) => {
        console.log("New field added:", { name, type })

        addColumn(name, type)
        addColumnToRows(name)
    }

    useEffect(() => {
        console.log('seting state..')

        setColumns([
            { name: "Title", type: 'text' },
            { name: "Status", type: 'text' },
            { name: "Priority", type: 'text' }
        ])

        setRows([
            { Title: "Complete setup", Status: "In Progress", Priority: "High" },
            { Title: "Add dark theme", Status: "Not Started", Priority: "Medium" }
        ])
    }, [])

    return (
        <TaskContext.Provider value={{
            columns,
            rows,
            addNewField
        }}
        >
            {children}
        </TaskContext.Provider>
    )
}

export default TaskContext 