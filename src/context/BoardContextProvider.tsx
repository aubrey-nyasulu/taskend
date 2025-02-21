"use client"
import { getStoredBoardSnapShot, getStoredTasks, setStoredBoardSnapShot } from "@/lib/utils";
import { RowType } from "@/types";
import { createContext, Dispatch, ReactNode, useEffect, useReducer } from "react"
import { useFormState } from "react-dom";

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
}

const initialState: TaskState = {
    columns: [],
    dispatch: () => { }
}

const BoardContext = createContext<TaskState>(initialState)

type ColumnType = 'none' | 'low' | 'medium' | 'high' | 'urgent'

type CardType = {
    id: number
    title: string
    status: string
}

export type BoardState = [ColumnType, CardType[]][]

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
            setStoredBoardSnapShot(payload?.data || [])

            return payload?.data || []
        }

        case 'update': {
            if (!payload.draggingFrom || !payload.draggedTo) return state

            const draggedCard = state[payload.draggingFrom.column][1][payload.draggingFrom.index]
            console.log({ draggedCard })

            state[payload.draggingFrom.column][1].splice(payload.draggingFrom.index, 1)

            state[payload.draggedTo.column][1].splice(payload.draggedTo.index, 0, draggedCard)

            console.log({ state })

            setStoredBoardSnapShot(state)

            return state
        }

        default: return state
    }
}

export const BoardContextProvider = ({ children }: { children: ReactNode }) => {
    const [columns, dispatch] = useReducer(reducer, [])

    useEffect(() => {
        let columns = getStoredBoardSnapShot()

        if (columns?.length > 0) {
            dispatch({ type: "initialise", payload: { data: columns } })
        } else {
            const tasks = getStoredTasks()

            columns = transformTasksToState(tasks)

            dispatch({ type: "initialise", payload: { data: columns } })
        }

    }, [])

    return (
        <BoardContext.Provider value={{ columns, dispatch }}>
            {children}
        </BoardContext.Provider>
    )
}

export default BoardContext


export const transformTasksToState = (tasks: RowType[]): BoardState => {
    const stateMap: Record<ColumnType, CardType[]> = {
        none: [],
        low: [],
        medium: [],
        high: [],
        urgent: []
    }

    tasks.forEach(({ id, title, status, priority }) => {
        stateMap[priority as ColumnType].push({ id, title, status })
    })

    return Object.entries(stateMap) as BoardState
}