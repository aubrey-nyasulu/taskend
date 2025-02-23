"use client"

import TaskContext from "@/context/TaskProvider"
import { duplicateFielNameExists } from "@/lib/utils"
import clsx from "clsx"
import { ChangeEvent, FormEvent, ReactNode, useContext, useState } from "react"
import { useEffect, useRef } from "react"
import ModalContainer from "../../components/ModalContainer"

type NewFieldModalProps = {
    isOpen: boolean
    onClose: () => void
}

export default function AddNewFieldModal({ isOpen, onClose }: NewFieldModalProps) {
    const [fieldName, setFieldName] = useState('')
    const [fieldNameExist, setFieldNameExist] = useState<boolean>(false)

    const { columns, addNewField } = useContext(TaskContext)

    const modalRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Trap Focus inside Modal
    useEffect(() => {
        if (!isOpen) return

        const focusableElements = modalRef.current?.querySelectorAll("input, button")

        let lastFocusibleElementIndex = 0

        if (focusableElements?.length) {
            if (fieldNameExist) {
                lastFocusibleElementIndex = focusableElements.length - 2
            } else {
                lastFocusibleElementIndex = focusableElements.length - 1
            }
        }

        const firstElement = focusableElements?.[0] as HTMLElement
        const lastElement = focusableElements?.[lastFocusibleElementIndex] as HTMLElement

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
    }, [isOpen, fieldNameExist])

    useEffect(() => {
        if (isOpen) inputRef.current?.focus()
    }, [isOpen])

    const handleFieldNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setFieldName(value)

        if (!value) {
            setFieldNameExist(false)
            return
        }

        const columnExist = duplicateFielNameExists({ columns, value })
        setFieldNameExist(columnExist)
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.target as HTMLFormElement)

        const name = formData.get('name') as string
        const type = formData.get('field-type') as 'text' | 'number' | 'checkbox'

        if (name && type) {
            addNewField(name, type)
            onClose()
            setFieldName('')
        }
    }

    if (!isOpen) return null
    return (
        <ModalContainer {...{ isOpen, onClose }}>
            <div ref={modalRef} className="relative bg-white p-6 rounded-lg shadow-lg z-50 w-96">
                <button
                    onClick={(e) => {
                        setFieldName('')
                        onClose()
                    }}
                    className="text-lg font-semibold w-fit h-fit absolute right-4 top-2">
                    X
                </button>

                <form onSubmit={handleSubmit}>
                    <div className="w-full flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Add New Field</h2>
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        name="name"
                        placeholder="Field name"
                        required
                        value={fieldName}
                        onChange={handleFieldNameChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-stone-500"
                    />

                    <p className=" mt-4">Field Type</p>

                    <div className="flex items-center gap-2">
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

                    <div className="flex items-center gap-2">
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

                    <div className="flex items-center gap-2">
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
                        <button
                            arial-disabled={`${fieldNameExist}`}
                            type="submit"
                            className={clsx(
                                'px-4 py-2 bg-stone-600 text-white rounded hover:bg-stone-700',
                                {
                                    'opacity-30 pointer-events-none': fieldNameExist
                                }
                            )}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </ModalContainer>


    )
}