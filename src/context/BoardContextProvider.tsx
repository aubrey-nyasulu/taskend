"use client"

import { createContext, Dispatch, ReactNode, useContext, useEffect, useReducer, useRef } from "react"
import { RowType } from "@/types"
import TaskContext from "./TaskProvider"
import { getStoredBoardSnapShot, setStoredBoardSnapShot } from "@/lib/utils"

export type ColumnType = "none" | "low" | "medium" | "high" | "urgent"
export type BoardState = [ColumnType, number[]][]

type TaskAction = {
    type: "initialise" | "update"
    payload: {
        draggingFrom?: { index: number, column: number } // The original position of the dragged task
        draggedTo?: { index: number, column: number }   // The new position where the task is dropped
        data?: BoardState  // Optional board state data (used during initialization)
    }
}

type TaskState = {
    columns: BoardState // The board's state containing columns and task indexes.
    dispatch: Dispatch<TaskAction>
    fetchColumns: () => void
}

const initialState: TaskState = {
    columns: [],
    dispatch: () => { },
    fetchColumns: () => { },
}

const BoardContext = createContext<TaskState>(initialState)

// Reducer function to handle actions and update state accordingly
const reducer = (state: BoardState, { type, payload }: TaskAction): BoardState => {
    switch (type) {
        case "initialise":
            return payload.data || []

        case "update": {
            return [...updateBoard({ payload, state })]
        }
        default:
            return state
    }
}

export const BoardContextProvider = ({ children }: { children: ReactNode }) => {
    const [columns, dispatch] = useReducer(reducer, [])

    const { rows } = useContext(TaskContext)

    const fetchColumns = () => {
        console.log('fetching')
        let columns = getStoredBoardSnapShot()

        if (!columns.length) columns = transformTasksToState(rows)

        dispatch({ type: "initialise", payload: { data: columns } })

        setStoredBoardSnapShot(columns)
    }

    return (
        <BoardContext.Provider value={{ columns, dispatch, fetchColumns }}>
            {children}
        </BoardContext.Provider>
    )
}

export default BoardContext

// Function to transform tasks into a structured board state
export const transformTasksToState = (tasks: RowType[]): BoardState => {
    const stateMap: Record<ColumnType, number[]> = {
        none: [],
        low: [],
        medium: [],
        high: [],
        urgent: []
    }

    // Iterate over tasks and sort them into the correct priority column
    tasks.forEach(({ priority }, index) => {
        stateMap[priority as ColumnType].push(index)
    })

    return Object.entries(stateMap) as BoardState
}

type updateBoardPropTypes = {
    payload: {
        draggingFrom?: {
            index: number;
            column: number;
        };
        draggedTo?: {
            index: number;
            column: number;
        };
        data?: BoardState;
    }
    state: BoardState
}

// Function to update the board state when a task is moved between columns
export function updateBoard({ payload, state }: updateBoardPropTypes) {
    if (!payload.draggingFrom || !payload.draggedTo) return state

    const { draggingFrom, draggedTo } = payload

    const draggedCard = state[draggingFrom.column][1][draggingFrom.index]

    state[draggingFrom.column][1].splice(draggingFrom.index, 1) // Remove task from original position
    state[draggedTo.column][1].splice(draggedTo.index, 0, draggedCard) // Insert task into new position

    setStoredBoardSnapShot(state)

    return state
}