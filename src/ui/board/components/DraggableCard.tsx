import { RowType } from "@/types"
import clsx from "clsx"
import { Dispatch, SetStateAction, useRef, useState, useEffect } from "react"

type DraggableCardPropTypes = {
    task: RowType
    index: number
    columnIndex: number
    setDraggingFrom: Dispatch<SetStateAction<{ id: number, index: number, column: number } | undefined>>
    setDraggedTo: Dispatch<SetStateAction<{ index: number, column: number } | undefined>>
    setDragFinished: Dispatch<SetStateAction<boolean>>
}

export default function DraggableCard({ task, index, columnIndex, setDraggingFrom, setDraggedTo, setDragFinished }: DraggableCardPropTypes) {
    const { id, title, status } = task
    const cardRef = useRef<HTMLButtonElement>(null)
    const [highlightDrop, setHighlightDrop] = useState(false)

    useEffect(() => {
        const card = cardRef.current
        if (!card) return

        const handleDragStart = () => {
            card.style.background = "#93c5fd30"
            setDraggingFrom({ id, column: columnIndex, index })
        }

        const handleDragEnter = (e: Event) => {
            e.preventDefault()
            setDraggedTo({ column: columnIndex, index })
            setHighlightDrop(true)
        }

        const handleDragLeave = () => {
            setHighlightDrop(false)
        }

        const handleDragEnd = () => {
            card.style.background = "#fff"
            setHighlightDrop(false)
            setDragFinished(true)
        }

        card.addEventListener("dragstart", handleDragStart)
        card.addEventListener("dragenter", handleDragEnter)
        card.addEventListener("dragleave", handleDragLeave)
        card.addEventListener("dragend", handleDragEnd)

        return () => {
            card.removeEventListener("dragstart", handleDragStart)
            card.removeEventListener("dragenter", handleDragEnter)
            card.removeEventListener("dragleave", handleDragLeave)
            card.removeEventListener("dragend", handleDragEnd)
        }
    }, [title, status, index])

    return (
        <>
            <div className={clsx("h-2 w-full", { "bg-blue-300": highlightDrop })}></div>

            <button
                ref={cardRef}
                draggable
                className="w-full px-4 py-2 rounded-md border bg-white flex gap-1 flex-col items-start"
            >
                <h2 className="text-start text-lg mb-2">{title}</h2>
                <small>{status}</small>
            </button>
        </>
    )
}