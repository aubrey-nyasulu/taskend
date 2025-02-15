"use client"

import { ColumnType, RowType } from "@/types"
import { createContext, ReactNode, useEffect, useState } from "react"

type TaskState = {
    columns: ColumnType[]
    rows: RowType[]
    addNewField: (name: string, type: string) => void
    removeColumn: (columnId: string) => void
    ProtectedFields: {
        Title: string;
        Status: string;
        Priority: string;
    }
}

const initialState: TaskState = {
    columns: [],
    rows: [],
    addNewField: () => { },
    removeColumn: (columnId: string) => { },
    ProtectedFields: { Title: 'Title', Status: 'Status', Priority: 'Priority' }
}

const TaskContext = createContext<TaskState>(initialState)

export const TaskContextProvider = ({ children }: { children: ReactNode }) => {
    const ProtectedFields = { Title: 'Title', Status: 'Status', Priority: 'Priority' }

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

    useEffect(() => {
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
            addNewField,
            removeColumn,
            ProtectedFields
        }}
        >
            {children}
        </TaskContext.Provider>
    )
}

export default TaskContext 