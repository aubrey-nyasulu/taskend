"use client"
import { RowType } from "@/types";
import { createContext, Dispatch, ReactNode, useContext, useEffect, useReducer, useRef } from "react"
import TaskContext, { FetchTasksPropTypes } from "./TaskProvider";
import { getStoredBoardSnapShot, setStoredBoardSnapShot, setStoredTasks } from "@/lib/utils";

type TaskState = {
    columns: BoardState,
    dispatch: Dispatch<{
        type: "initialise" | "update";
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
        };
    }>
    fetchColumns: () => void
}

const initialState: TaskState = {
    columns: [],
    dispatch: () => { },
    fetchColumns: () => { },
}

const BoardContext = createContext<TaskState>(initialState)

type ColumnType = 'none' | 'low' | 'medium' | 'high' | 'urgent'

export type BoardState = [ColumnType, number[]][]

function reducer(
    state: BoardState,
    action: {
        type: 'initialise' | 'update',
        payload: {
            draggingFrom?: {
                index: number,
                column: number,
            },
            draggedTo?: {
                index: number,
                column: number
            },
            data?: BoardState
        }
    }) {
    const { type, payload } = action

    switch (type) {
        case 'initialise': {
            return payload?.data || []
        }

        case 'update': {
            if (!payload.draggingFrom || !payload.draggedTo) return state

            const draggedCard = state[payload.draggingFrom.column][1][payload.draggingFrom.index]
            console.log({ draggedCard })

            state[payload.draggingFrom.column][1].splice(payload.draggingFrom.index, 1)

            state[payload.draggedTo.column][1].splice(payload.draggedTo.index, 0, draggedCard)

            setStoredBoardSnapShot(state)

            return state
        }

        default: return state
    }
}

export const BoardContextProvider = ({ children }: { children: ReactNode }) => {
    const [columns, dispatch] = useReducer(reducer, [])

    const { rows, saveState, setRows, cachedTasks, setCachedTasks, currentPage } = useContext(TaskContext)

    const firstTimeLoading = useRef<boolean>(true)

    useEffect(() => {
        const columns = getStoredBoardSnapShot()

        if (columns.length > 0) {
            dispatch({ type: 'initialise', payload: { data: columns } })
        }
    }, [])

    const fetchColumns = () => {
        let columns: BoardState = []

        if (firstTimeLoading.current) {
            columns = getStoredBoardSnapShot()

            firstTimeLoading.current = false
        }

        if (!columns.length) {
            columns = transformTasksToState(rows)
        }

        dispatch({ type: "initialise", payload: { data: columns } })
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