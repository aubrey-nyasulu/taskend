import TaskContext from "@/context/TaskProvider"
import clsx from "clsx"
import { useContext } from "react"

export default function UndoRedo() {
    const { undo, redo, undoStack, redoStack } = useContext(TaskContext)

    return (
        <div className="flex gap-4 items-center">
            <button
                onClick={undo}
                disabled={undoStack.length === 0}
                className={clsx(
                    "",
                    {
                        "opacity-50": undoStack.length === 0
                    }
                )}
            >
                Undo
            </button>

            <button
                onClick={redo}
                disabled={redoStack.length === 0}
                className={clsx(
                    "",
                    {
                        "opacity-50": redoStack.length === 0
                    }
                )}
            >
                Redo
            </button>
        </div>
    )
}
