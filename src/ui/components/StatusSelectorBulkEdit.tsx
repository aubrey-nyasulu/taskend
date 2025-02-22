import TaskContext from "@/context/TaskProvider"
import { useContext, useEffect, useState } from "react"
import ModalCloserBackground from "./ModalCloserBackground"
import { useEscape } from "@/customHooks/useEscape"

export default function StatusSelectorBulkEdit() {
    const [isOpen, setIsOpen] = useState(false)

    useEscape(() => setIsOpen(false), isOpen)

    const { bulkEdit } = useContext(TaskContext)

    const handleSelect = (value: string) => {
        setIsOpen(false)
        bulkEdit('status', value)
    }

    return (
        <>
            <ModalCloserBackground {...{ isOpen, setIsOpen }} />

            <div className="w-fit">
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-2 w-full text-start"
                >
                    status
                </button>

                {
                    isOpen &&
                    <div className="w-fit rounded-md bg-white absolute top-0 z-40 shadow-lg border ">
                        <p className="px-4 py-[11px] cursor-default ">status</p>

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