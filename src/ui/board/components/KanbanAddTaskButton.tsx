import clsx from "clsx"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"

type KanbanAddTaskButtonPropTypes = {
    index: number
    column: number
    setCreateTask: Dispatch<SetStateAction<boolean>>
    setDraggedTo: Dispatch<SetStateAction<{ index: number, column: number } | undefined>>
}

export default function KanbanAddTaskButton({ column, index, setDraggedTo, setCreateTask }: KanbanAddTaskButtonPropTypes) {
    const cardRef = useRef<HTMLButtonElement>(null)
    const [highlightDrop, setHighlightDrop] = useState(false)

    useEffect(() => {
        const card = cardRef.current
        if (!card) return

        const handleDragEnter = (e: Event) => {
            e.preventDefault()
            setDraggedTo({ column, index })
            setHighlightDrop(true)
        }

        const handleDragLeave = () => {
            setHighlightDrop(false)
        }

        card.addEventListener("dragenter", handleDragEnter)
        card.addEventListener("dragleave", handleDragLeave)

        return () => {
            card.removeEventListener("dragenter", handleDragEnter)
            card.removeEventListener("dragleave", handleDragLeave)
        }
    }, [index])

    return (
        <>
            <div className={clsx("h-2 w-full", { "bg-blue-300": highlightDrop })}></div>
            <button
                ref={cardRef}
                onClick={() => setCreateTask(true)}
                className="w-full px-4 h-12 rounded-md flex gap-1 items-center border hover:bg-stone-200"
            >
                <p className="opacity-60">Add Task</p>
            </button>
        </>
    )
}