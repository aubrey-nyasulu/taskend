import { UndoIcon } from "@/assets/svgAssets"
import TaskContext from "@/context/TaskProvider"
import clsx from "clsx"
import { useContext } from "react"

export default function UndoRedo() {
    const { undo, redo, undoStack, redoStack } = useContext(TaskContext)

    return (
        <div className="flex gap-2 items-center flex-col fixed bottom-24 right-2 md:right-8 w-16 h-16 bg-white py-2 rounded-md">
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
        </div>
    )
}
