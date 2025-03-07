import TaskContext from "@/context/TaskProvider"
import ModalCloserBackground from "@/ui/components/ModalCloserBackground"
import { useState, useEffect, useContext } from "react"

export default function StatusSelector({ id, value }: { id: number, value: string }) {
    const { editTask } = useContext(TaskContext)

    const [isOpen, setIsOpen] = useState(false)

    // Close on Escape Key
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false)
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [isOpen])

    const handleSelect = (value: string) => {
        setIsOpen(false)
        editTask(id, 'status', value)
    }

    return (
        <>
            <ModalCloserBackground {...{ isOpen, setIsOpen }} />

            <div className="min-w-full w-fit">
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-2 w-full text-start"
                >{value}</button>

                {
                    isOpen &&
                    <div className="w-fit rounded-md bg-white absolute top-0 z-40 shadow-lg border ">
                        <p className="px-4 py-[11px] cursor-default bg-stone-200">{value}</p>

                        <div className="w-fit px-4 py-3 pr-24 border-t">
                            <button onClick={() => handleSelect('not_started')}>not_started</button>
                        </div>

                        <div className="w-fit px-4 py-3 pr-24 border-t">
                            <button onClick={() => handleSelect('in_progress')}>in_progress</button>
                        </div>

                        <div className="w-fit px-4 py-3 pr-24 border-t">
                            <button onClick={() => handleSelect('completed')}>completed</button>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}