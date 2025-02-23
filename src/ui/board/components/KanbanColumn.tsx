import { RowType } from "@/types"
import { Dispatch, SetStateAction, useRef, useState, useEffect, FormEvent, useContext } from "react"
import DraggableCard from "./DraggableCard"
import KanbanAddTaskButton from "./KanbanAddTaskButton"
import StatusSelector from "@/ui/table/components/StatusSelector"
import { useEscape } from "@/customHooks/useEscape"
import TaskContext from "@/context/TaskProvider"
import clsx from "clsx"

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
    const [createTask, setCreateTask] = useState(false)

    return (
        <div className={clsx(
            " rounded-md h-fit",
            {
                "bg-stone-100": columnName === 'none',
                "bg-green-50": columnName === 'low',
                "bg-blue-50": columnName === 'medium',
                "bg-orange-50": columnName === 'high',
                "bg-red-50": columnName === 'urgent'
            }
        )
        }>
            <div className="flex gap-4 items-end justify-between mb-2 py-4 border-b border-b-white px-2">
                <p
                    className={clsx(
                        "w-fit px-3 rounded-full",
                        {
                            "bg-stone-300": columnName === 'none',
                            "bg-green-200": columnName === 'low',
                            "bg-blue-200": columnName === 'medium',
                            "bg-orange-200": columnName === 'high',
                            "bg-red-200": columnName === 'urgent'
                        }
                    )}
                >
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

            {
                createTask &&
                <CreateTask {...{ setCreateTask, priority: columnName, isCreatingATask: createTask }} />
            }

            <KanbanAddTaskButton {...{ column: columnIndex, index: tasks.length, setDraggedTo, setCreateTask }}
            />
        </div>
    )
}

function CreateTask({ setCreateTask, priority, isCreatingATask }:
    {
        isCreatingATask: boolean
        priority: string
        setCreateTask: Dispatch<SetStateAction<boolean>>,
    }) {

    useEscape(() => setCreateTask(false), isCreatingATask)

    const { createTask } = useContext(TaskContext)

    useEffect(() => {
        if (inputRef?.current) {
            inputRef.current.focus()
        }
    }, [])
    const handleSubmit = (formData: FormData) => {
        const data = Object.fromEntries(formData.entries()) as RowType
        data.priority = priority

        console.log({ data })

        createTask(data)
        setCreateTask(false)
    }

    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <div
            className="w-[calc(100%_-_16px)] mx-auto px-4 py-2 rounded-md border bg-white flex gap-1 flex-col items-start mt-2 overflow-hidden"
        >
            <form
                action={handleSubmit}
                className="w-full"
            >
                <input
                    ref={inputRef}
                    type="text"
                    name="title"
                    required
                    placeholder="Enter task here"
                    // onBlur={() => setCreateTask(false)}
                    className="text-xl px-3"
                />

                <select
                    name="status"
                    id=""
                    className="px-3 mt-2"
                    required
                >
                    <option disabled>Status</option>
                    <option value="not_started">not_started</option>
                    <option value="in_progress">in_progress</option>
                    <option value="completed">completed</option>
                </select>

                <button
                    type="submit"
                    className="w-full block mx-4 py-2 bg-black/70 hover:bg-black/90 text-white rounded-md mt-4"
                >
                    Create
                </button>
            </form>

            <button
                onClick={() => setCreateTask(false)}
                className="w-full block mx-4 py-2 bg-red-500/50 hover:bg-red-500/90 text-white rounded-md"
            >
                Cancel
            </button>
        </div>
    )
}