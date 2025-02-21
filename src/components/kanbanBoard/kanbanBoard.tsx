import BoardContext from "@/context/BoardContextProvider"
import TaskContext from "@/context/TaskProvider"
import clsx from "clsx"
import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react"

export default function KanbanBoard() {
    const { columns, dispatch, fetchColumns } = useContext(BoardContext)
    const { editTask, rows } = useContext(TaskContext)

    console.log({ columns, rows })

    const [draggingFrom, setDraggingFrom] = useState<{ id: number, index: number, column: number }>()
    const [draggedTo, setDraggedTo] = useState<{ index: number, column: number }>()
    const [dragFinished, setDragFinished] = useState(false)

    useEffect(() => {
        if (!dragFinished) return
        setDragFinished(false)

        if (draggedTo && draggingFrom) {

            if (JSON.stringify(draggingFrom) === JSON.stringify(draggedTo)) return console.log('returned')

            setDraggedTo(undefined)

            dispatch({ type: 'update', payload: { draggingFrom, draggedTo } })

            const value = columns[draggedTo.column][0]

            editTask(draggingFrom.id, 'priority', value)
        }

    }, [dragFinished])

    useEffect(() => {
        fetchColumns()
    }, [rows])

    return (
        <div className="relative w-fit  max-w-4xl mx-auto rounded-b-lg flex-1 pt-8">
            <div className="w-[1500px] h-fit pb-8 grid gap-x-4 grid-cols-5">
                {
                    columns.map(([columnName, tasks], columnIndex) => (
                        <div key={columnIndex} className="bg-stone-50 rounded-md  h-fit ">
                            <div className="flex gap-4 items-end justify-between mb-2 py-4 border-b px-2">
                                <p className="w-fit bg-stone-200 px-3 rounded-full ">{columnName}</p>

                                <div className="w-6 h-6 grid place-content-center rounded-full bg-stone-200">{tasks.length}</div>
                            </div>

                            {
                                tasks.map((taskIndex, index) => {
                                    const task = rows[taskIndex]

                                    if (!task) return null

                                    const { id, status, title, priority } = task
                                    if (title === 'Optimize Redis caching') console.log({ title, priority })

                                    return (
                                        <div
                                            key={id}
                                            className="px-2"
                                        >
                                            <DraggableCard {...{ id, status, title, index, column: columnIndex, setDragFinished, setDraggingFrom, setDraggedTo }} />
                                        </div>
                                    )
                                })
                            }

                            <KanBanAddTaskButton {...{ column: columnIndex, index: tasks.length, setDraggedTo }} />
                        </div>
                    ))
                }

                {/* <div className="bg-stone-50 rounded-md p-2 h-fit">
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
                </div> */}

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
    id: number
    title: string
    status: string
    index: number
    column: number
    setDraggingFrom: Dispatch<SetStateAction<{ id: number, index: number, column: number } | undefined>>
    setDraggedTo: Dispatch<SetStateAction<{ index: number, column: number } | undefined>>
    setDragFinished: Dispatch<SetStateAction<boolean>>
}

function DraggableCard({ id, title, status, index, column, setDraggedTo, setDraggingFrom, setDragFinished }: DraggableCardPropTypes) {
    const cardRef = useRef<HTMLButtonElement>(null)
    const [signalDropPosition, setSignalDropPosition] = useState(false)

    useEffect(() => {
        const card = cardRef.current

        if (!card) return

        const handleDragStart = (e: Event) => {
            card.style.background = '#93c5fd30'

            setDraggingFrom({ id, column, index })
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
                <h2 className="text-start text-lg mb-2">{title}</h2>
                <small>{status}</small>
            </button>
        </>
    )
}

type KanBanAddTaskButtonPropTypes = {
    index: number
    column: number
    setDraggedTo: Dispatch<SetStateAction<{ index: number, column: number } | undefined>>
}

function KanBanAddTaskButton({ column, index, setDraggedTo }: KanBanAddTaskButtonPropTypes) {
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
