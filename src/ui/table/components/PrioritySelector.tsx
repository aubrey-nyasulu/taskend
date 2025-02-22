import TaskContext from "@/context/TaskProvider"
import { useEscape } from "@/customHooks/useEscape"
import ModalCloserBackground from "@/ui/components/ModalCloserBackground"
import { useContext, useEffect, useState } from "react"

export default function PrioritySelector({ id, value }: { id: number, value: string }) {
    const { editTask } = useContext(TaskContext)

    const [isOpen, setIsOpen] = useState(false)

    useEscape(() => setIsOpen(false), isOpen)

    const handleSelect = (value: string) => {
        setIsOpen(false)
        editTask(id, 'priority', value)
    }

    return (
        <>
            <ModalCloserBackground {...{ isOpen, setIsOpen }} />

            <div className="min-w-full w-fit">
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-2 w-full text-start"
                >
                    {value}
                </button>

                {
                    isOpen &&
                    <div className="w-fit rounded-md bg-white absolute top-0 z-40 shadow-lg border ">
                        <p className="px-4 py-[11px] cursor-default bg-stone-200">{value}</p>

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