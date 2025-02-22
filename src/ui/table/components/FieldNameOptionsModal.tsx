import TaskContext from "@/context/TaskProvider"
import { useContext, useEffect, useRef } from "react"
import ModalContainer from "../../components/ModalContainer"

type FieldNameOptionsModalPropTypes = {
    fieldName: string
    isOpen: boolean
    onClose: () => void
}

export default function FieldNameOptionsModal({ fieldName, isOpen, onClose }: FieldNameOptionsModalPropTypes) {
    const { ProtectedFields, removeColumn } = useContext(TaskContext)

    const modalRef = useRef<HTMLDivElement>(null)

    // Focus Trap inside Modal
    useEffect(() => {
        if (!isOpen) return

        const focusableElements = modalRef.current?.querySelectorAll("input, button")
        const firstElement = focusableElements?.[0] as HTMLElement
        const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement

        const handleTabKey = (e: KeyboardEvent) => {
            if (e.key === "Tab") {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault()
                    lastElement.focus()
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault()
                    firstElement.focus()
                }
            }
        }

        document.addEventListener("keydown", handleTabKey)
        return () => document.removeEventListener("keydown", handleTabKey)
    }, [isOpen])

    if (!isOpen) return null

    return (
        <ModalContainer {...{ isOpen, onClose }}>
            <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg z-50 w-96 relative">

                <h2 className="text-lg font-semibold mb-4">Delete Field</h2>

                <div className="w-full">
                    <button
                        onClick={() => {
                            removeColumn(fieldName)
                            onClose()
                        }}
                        disabled={fieldName in ProtectedFields}
                        className="bg-red-500 text-white w-full rounded-md mb-4 py-3"
                    >
                        Delete Field
                    </button>

                    <button
                        onClick={onClose}
                        className="border w-full rounded-md py-3"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </ModalContainer>


    )
}