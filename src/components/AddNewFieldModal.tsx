"use client"

import UIContext from "@/context/UIProvider"
import { FormEvent, useContext } from "react"

// export default function AddNewFieldModal() {
//     const { addNewFieldmodalIsOpen } = useContext(UIContext)

//     return (
//         <div className={`absolute top-12 right-0 bg-stone-100 p-4 rounded-md ${addNewFieldmodalIsOpen ? 'block' : 'hidden'}`}>
//             <p>one</p>
//             <p>two</p>
//             <p>three</p>
//         </div>
//     )
// }


import { useEffect, useRef } from "react"

interface NewFieldModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (name: string, type: string) => void
}

export default function NewFieldModal({ isOpen, onClose, onSave }: NewFieldModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Close on Escape Key
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, onClose])

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

    useEffect(() => {
        if (isOpen) inputRef.current?.focus()
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="absolute inset-0" onClick={onClose}></div>

            <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg z-50 w-96 relative">
                <form onSubmit={e => {
                    e.preventDefault()

                    const formData = new FormData(e.target as HTMLFormElement)

                    const name = formData.get('name') as string
                    const type = formData.get('field-type') as string

                    if (name && type) {
                        onSave(name, type)
                        onClose()
                    }
                }}>
                    <h2 className="text-lg font-semibold mb-4">Add New Field</h2>

                    <input
                        ref={inputRef}
                        type="text"
                        name="name"
                        placeholder="Field name"
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-stone-500"
                    />

                    <div>
                        <input
                            type="radio"
                            value="text"
                            placeholder="Field Type"
                            name="field-type"
                            id="text"
                            required
                        />

                        <label htmlFor="text">Text</label>
                    </div>

                    <div>
                        <input
                            type="radio"
                            value="number"
                            placeholder="Field Type"
                            name="field-type"
                            id="number"
                            required
                        />

                        <label htmlFor="number">Number</label>
                    </div>

                    <div>
                        <input
                            type="radio"
                            value="checkbox"
                            placeholder="Field Type"
                            name="field-type"
                            id="checkbox"
                            required
                        />

                        <label htmlFor="checkbox">Checkbox</label>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-stone-600 text-white rounded hover:bg-stone-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
