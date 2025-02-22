import BoardContext from "@/context/BoardContextProvider"
import TaskContext from "@/context/TaskProvider"
import UIContext from "@/context/UIProvider"
import { useContext, useEffect, useState } from "react"
import KanbanColumn from "./components/KanbanColumn"

export default function KanbanBoard() {
    const { columns, dispatch, fetchColumns } = useContext(BoardContext)
    const { rows, editTask } = useContext(TaskContext)
    const { openCreateTaskModal } = useContext(UIContext)

    const [draggingFrom, setDraggingFrom] = useState<{ id: number, index: number, column: number } | null>(null)
    const [draggedTo, setDraggedTo] = useState<{ index: number, column: number } | null>(null)
    const [dragFinished, setDragFinished] = useState(false)

    useEffect(() => {
        fetchColumns()
    }, [])

    useEffect(() => {
        if (!dragFinished || !draggingFrom || !draggedTo) return
        setDragFinished(false)

        if (JSON.stringify(draggingFrom) === JSON.stringify(draggedTo)) return

        setDraggedTo(null)
        dispatch({ type: "update", payload: { draggingFrom, draggedTo } })

        if (draggingFrom.column !== draggedTo.column) {
            const newPriority = columns[draggedTo.column][0]
            editTask(draggingFrom.id, "priority", newPriority)
        }
    }, [dragFinished])

    return (
        <div className="relative w-fit max-w-4xl mx-auto rounded-b-lg flex-1 pt-2">
            <div className="w-[1500px] h-fit pb-8 grid gap-x-4 grid-cols-5">
                {
                    columns.map(([columnName, tasks], columnIndex) => (
                        <KanbanColumn
                            key={columnIndex}
                            columnName={columnName}
                            tasks={tasks}
                            columnIndex={columnIndex}
                            rows={rows}
                            openCreateTaskModal={openCreateTaskModal}
                            setDraggingFrom={setDraggingFrom}
                            setDraggedTo={setDraggedTo}
                            setDragFinished={setDragFinished}
                        />
                    ))}
            </div>
        </div>
    )
}