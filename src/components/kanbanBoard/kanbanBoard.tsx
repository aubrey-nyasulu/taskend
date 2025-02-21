import clsx from "clsx"
import { Dispatch, SetStateAction, useEffect, useReducer, useRef, useState } from "react"

type ColumnType = 'statusNone' | 'low'

type CardType = {
    id: number
    title: string
    status: string
}

type StateType = {
    statusNone: CardType[],
    low: CardType[]
}

const initialState: StateType = {
    statusNone: [
        { id: 1, title: 'some title', status: 'completed' },
        { id: 2, title: 'another title', status: 'not_started' },
    ],
    low: [
        { id: 3, title: 'some other title', status: 'in_progress' },
        { id: 4, title: 'another some title', status: 'completed' },
    ],
}

function reducer(
    state: StateType,
    action: {
        type: string,
        payload: {
            draggingFrom: {
                index: number,
                column: ColumnType,
            },
            draggedTo: {
                index: number,
                column: ColumnType
            }
        }
    }) {
    const { type, payload } = action

    switch (type) {
        case 'update': {
            console.log('in', { payload })
            const draggedCard = state[payload.draggingFrom.column][payload.draggingFrom.index]
            console.log({ draggedCard })

            state[payload.draggingFrom.column].splice(payload.draggingFrom.index, 1)

            state[payload.draggedTo.column].splice(payload.draggedTo.index, 0, draggedCard)

            console.log({ state })

            return state
        }

        default: return state
    }
}

export default function KanbanBoard() {
    const [columns, dispatch] = useReducer(reducer, initialState)

    const [draggingFrom, setDraggingFrom] = useState<{ index: number, column: ColumnType }>()
    const [draggedTo, setDraggedTo] = useState<{ index: number, column: ColumnType }>()
    const [dragFinished, setDragFinished] = useState(false)

    useEffect(() => {
        if (!dragFinished) return

        console.log({ draggingFrom, draggedTo })
        if (draggedTo && draggingFrom) {

            setDraggedTo(undefined)

            dispatch({ type: 'update', payload: { draggingFrom, draggedTo } })
        }

        setDragFinished(false)
    }, [dragFinished])

    return (
        <div className="w-full h-fit overflow-auto pb-8 px-[10%] mt-4">
            <div className="w-[1300px] h-fit pb-8 grid gap-x-4 grid-cols-5">
                <div className="bg-stone-50 rounded-md p-2 h-fit">
                    <p className="w-fit bg-stone-200 px-3 rounded-full mb-4">none</p>

                    {
                        columns.statusNone.map(({ id, status, title }, index) => (
                            <div
                                key={id}
                            >
                                <DraggableCard {...{ status, title, index, column: 'statusNone', setDragFinished, setDraggingFrom, setDraggedTo }} />
                            </div>
                        ))
                    }

                    <KanBanAddTaskButton {...{ column: 'statusNone', index: columns.statusNone.length, setDragFinished, setDraggedTo }} />
                </div>

                <div className="bg-stone-50 rounded-md p-2 h-fit">
                    <p className="w-fit bg-stone-200 px-3 rounded-full mb-4">low</p>

                    {
                        columns.low.map(({ id, status, title }, index) => (
                            <div
                                key={id}
                            >
                                <DraggableCard {...{ status, title, index, column: 'low', setDragFinished, setDraggingFrom, setDraggedTo }} />
                            </div>
                        ))
                    }

                    <KanBanAddTaskButton {...{ column: 'low', index: columns.low.length, setDragFinished, setDraggedTo }} />
                </div>

                {/* <div className="bg-stone-50 rounded-md p-2 h-fit">
                    <p className="w-fit bg-stone-200 px-3 rounded-full mb-4">medium</p>

                    <KanBanAddTaskButton {...{column: 'temp', index:0, setDragFinished, setDraggedTo}} />
                </div>

                <div className="bg-stone-50 rounded-md p-2 h-fit">
                    <p className="w-fit bg-stone-200 px-3 rounded-full mb-4">high</p>

                    <KanBanAddTaskButton {...{column: 'temp', index:0, setDragFinished, setDraggedTo}} />
                </div>

                <div className="bg-stone-50 rounded-md p-2 h-fit">
                    <p className="w-fit bg-stone-200 px-3 rounded-full mb-4">urgent</p>

                    <KanBanAddTaskButton {...{column: 'temp', index:0, setDragFinished, setDraggedTo}} />
                </div> */}
            </div>
        </div>
    )
}

type DraggableCardPropTypes = {
    title: string
    status: string
    index: number
    column: ColumnType
    setDraggingFrom: Dispatch<SetStateAction<{ index: number, column: ColumnType } | undefined>>
    setDraggedTo: Dispatch<SetStateAction<{ index: number, column: ColumnType } | undefined>>
    setDragFinished: Dispatch<SetStateAction<boolean>>
}

function DraggableCard({ title, status, index, column, setDraggedTo, setDraggingFrom, setDragFinished }: DraggableCardPropTypes) {
    const cardRef = useRef<HTMLButtonElement>(null)
    const [signalDropPosition, setSignalDropPosition] = useState(false)

    useEffect(() => {
        const card = cardRef.current

        if (!card) return

        const handleDragStart = (e: Event) => {
            card.style.background = '#93c5fd30'

            setDraggingFrom({ column, index })
        }

        const handleDragEnter = (e: Event) => {
            e.preventDefault()

            setDraggedTo({ column, index })
            setSignalDropPosition(true)
        }

        const handleDragLeave = (e: Event) => {
            e.preventDefault()

            // setDraggedTo(undefined)
            setSignalDropPosition(false)
        }

        const handleDragEnd = (e: Event) => {
            e.preventDefault()

            card.style.background = '#fff'
            setSignalDropPosition(false)

            setDragFinished(true)
        }

        card.addEventListener('dragstart', handleDragStart)
        card.addEventListener('dragenter', handleDragEnter)
        card.addEventListener('dragleave', handleDragLeave)
        card.addEventListener('dragend', handleDragEnd)

        return () => {
            card.removeEventListener('dragstart', handleDragStart)
            card.removeEventListener('dragenter', handleDragEnter)
            card.removeEventListener('dragleave', handleDragLeave)
            card.removeEventListener('dragend', handleDragEnd)
        }
    }, [title, status, index])

    return (
        <>
            <div
                className={clsx(
                    "h-2 w-full",
                    {
                        "bg-blue-300": signalDropPosition
                    }
                )}
            ></div>

            <button
                ref={cardRef}
                draggable={true}
                className="w-full px-4 py-2 rounded-md border bg-white flex gap-1 flex-col items-start"
            >
                <h2 className="font-semibold text-lg">{title}</h2>
                <p>{status}</p>
            </button>
        </>
    )
}

type KanBanAddTaskButtonPropTypes = {
    index: number
    column: ColumnType
    setDraggedTo: Dispatch<SetStateAction<{ index: number, column: ColumnType } | undefined>>
    setDragFinished: Dispatch<SetStateAction<boolean>>
}

function KanBanAddTaskButton({ column, index, setDragFinished, setDraggedTo }: KanBanAddTaskButtonPropTypes) {
    const cardRef = useRef<HTMLButtonElement>(null)
    const [signalDropPosition, setSignalDropPosition] = useState(false)

    useEffect(() => {
        const card = cardRef.current

        if (!card) return

        const handleDragEnter = (e: Event) => {
            e.preventDefault()

            setDraggedTo({ column, index })
            setSignalDropPosition(true)
        }

        const handleDragLeave = (e: Event) => {
            e.preventDefault()

            // setDraggedTo(undefined)
            setSignalDropPosition(false)
        }

        card.addEventListener('dragenter', handleDragEnter)
        card.addEventListener('dragleave', handleDragLeave)

        return () => {
            card.removeEventListener('dragenter', handleDragEnter)
            card.removeEventListener('dragleave', handleDragLeave)
        }
    }, [index])

    return (
        <>
            <div
                className={clsx(
                    "h-2 w-full",
                    {
                        "bg-blue-300": signalDropPosition
                    }
                )}
            ></div>

            <button
                ref={cardRef}
                className="w-full px-4 h-12 rounded-md flex gap-1 items-center border hover:bg-stone-200"
            >
                <p className="opacity-60">Add Task</p>
            </button>
        </>
    )
}
