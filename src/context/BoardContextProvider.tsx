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
        draggingFrom?: { index: number, column: number }
        draggedTo?: { index: number, column: number }
        data?: BoardState
    }
}

type TaskState = {
    columns: BoardState
    dispatch: Dispatch<TaskAction>
    fetchColumns: () => void
}

const initialState: TaskState = {
    columns: [],
    dispatch: () => { },
    fetchColumns: () => { },
}

const BoardContext = createContext<TaskState>(initialState)

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

export const transformTasksToState = (tasks: RowType[]): BoardState => {
    const stateMap: Record<ColumnType, number[]> = {
        none: [],
        low: [],
        medium: [],
        high: [],
        urgent: []
    }

    tasks.forEach(({ priority }, index) => {
        stateMap[priority as ColumnType].push(index)
    })

    return Object.entries(stateMap) as BoardState
}

type tempPropTypes = {
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

export function updateBoard({ payload, state }: tempPropTypes) {
    if (!payload.draggingFrom || !payload.draggedTo) return state

    const { draggingFrom, draggedTo } = payload

    const draggedCard = state[draggingFrom.column][1][draggingFrom.index]

    state[draggingFrom.column][1].splice(draggingFrom.index, 1)
    state[draggedTo.column][1].splice(draggedTo.index, 0, draggedCard)

    setStoredBoardSnapShot(state)

    return state
}