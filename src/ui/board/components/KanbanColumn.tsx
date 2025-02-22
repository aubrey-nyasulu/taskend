import { RowType } from "@/types"
import { Dispatch, SetStateAction, useRef, useState, useEffect } from "react"
import DraggableCard from "./DraggableCard"
import KanbanAddTaskButton from "./KanbanAddTaskButton"

type KanbanColumnPropTypes = {
    columnName: string,
    tasks: number[],
    columnIndex: number,
    rows: any,
    openCreateTaskModal: any,
    setDraggingFrom: any,
    setDraggedTo: any,
    setDragFinished: any
}

export default function KanbanColumn({ columnName, tasks, columnIndex, rows, openCreateTaskModal, setDraggingFrom, setDraggedTo, setDragFinished }: KanbanColumnPropTypes) {
    return (
        <div className="bg-stone-100 rounded-md h-fit">
            <div className="flex gap-4 items-end justify-between mb-2 py-4 border-b border-b-white px-2">
                <p className="w-fit bg-gray-400 text-white px-3 rounded-full">
                    {columnName}
                </p>

                <div className="w-6 h-6 grid place-content-center rounded-full bg-gray-400 text-white">
                    {tasks.length}
                </div>
            </div>

            {
                tasks.map((taskIndex, index) => {
                    const task = rows[taskIndex]

                    if (!task) return null
                    return (
                        <div
                            key={task.id}
                            className="px-2"
                            onClick={() => {
                                console.log({ task })
                                openCreateTaskModal(task, true)
                            }}
                        >
                            <DraggableCard
                                {...{
                                    task,
                                    index,
                                    columnIndex,
                                    setDraggingFrom,
                                    setDraggedTo,
                                    setDragFinished
                                }} />
                        </div>
                    )
                })}

            <KanbanAddTaskButton {...{ column: columnIndex, index: tasks.length, setDraggedTo }} />
        </div>
    )
}