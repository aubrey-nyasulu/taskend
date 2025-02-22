import { useContext, useEffect, useState } from "react"
import ModalCloserBackground from "./ModalCloserBackground"
import TaskContext from "@/context/TaskProvider"
import { useEscape } from "@/customHooks/useEscape"

export default function PrioritySelectorBulkEdit() {
    const { bulkEdit } = useContext(TaskContext)

    const [isOpen, setIsOpen] = useState(false)

    useEscape(() => setIsOpen(false), isOpen)

    const handleSelect = (value: string) => {
        setIsOpen(false)
        bulkEdit('priority', value)
    }

    return (
        <>
            <ModalCloserBackground {...{ isOpen, setIsOpen }} />

            <div className="w-fit">
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-2 w-full text-start"
                >priority</button>

                {
                    isOpen &&
                    <div className="w-fit rounded-md bg-white absolute top-0 z-40 shadow-lg border ">
                        <p className="px-4 py-[11px] cursor-default bg-stone-200">priority</p>

                        <div className="w-fit px-4 py-3 pr-24 border-t">
                            <button onClick={() => handleSelect('none')}>none</button>
                        </div>

                        <div className="w-fit px-4 py-3 pr-24 border-t">
                            <button onClick={() => handleSelect('low')}>low</button>
                        </div>

                        <div className="w-fit px-4 py-3 pr-24 border-t">
                            <button onClick={() => handleSelect('medium')}>medium</button>
                        </div>

                        <div className="w-fit px-4 py-3 pr-24 border-t">
                            <button onClick={() => handleSelect('high')}>high</button>
                        </div>

                        <div className="w-fit px-4 py-3 pr-24 border-t">
                            <button onClick={() => handleSelect('urgent')}>urgent</button>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}