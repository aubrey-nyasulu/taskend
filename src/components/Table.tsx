"use client"

import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from "react"
import UIContext from "@/context/UIProvider"
import AddNewFieldModal from "./AddNewFieldModal"
import TaskContext from "@/context/TaskProvider"
import clsx from "clsx"
import FieldNameOptionsModal from "./FieldNameOptionsModal"
import { RowType } from "@/types"

function Table() {
    const [addNewFieldModalIsOpen, setAddNewFieldModalIsOpen] = useState(false)
    const [deleFieldModalIsOpen, setDeleFieldModalIsOpen] = useState(false)
    const [rightClickedField, setRightClickedField] = useState('')

    const { columns, rows, ProtectedFields } = useContext(TaskContext)

    return (
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-b-lg ">
            <table className="w-full border-collapse">
                {/* Table Header */}
                <thead>
                    <tr className="bg-stone-100 text-left text-gray-600 text-sm font-medium">
                        {
                            columns.map(({ name }, index) => (
                                <th
                                    key={name + index}
                                    className={clsx(
                                        "px-4 py-3 border-b cursor-context-menu",
                                        {
                                            "cursor-not-allowed": name in ProtectedFields,
                                            "cursor-pointer": !(name in ProtectedFields),
                                        }
                                    )}
                                    onClick={(e) => {
                                        e.preventDefault()

                                        if (name in ProtectedFields) return

                                        setDeleFieldModalIsOpen(true)
                                        setRightClickedField(name)
                                    }}

                                    onContextMenu={(e) => {
                                        e.preventDefault()

                                        if (name in ProtectedFields) return

                                        setDeleFieldModalIsOpen(true)
                                        setRightClickedField(name)
                                    }}
                                >
                                    {name}
                                </th>
                            ))
                        }
                        <th className="border-b">
                            <button
                                // onClick={() => setAddNewFieldModalIsOpen(true)}
                                onClick={() => setAddNewFieldModalIsOpen(true)}
                                className="text-2xl font-bold w-full h-full focus:ring-1 focus:ring-stone-700"
                            >
                                +
                            </button>
                        </th>
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody className="text-gray-800">
                    {rows.map((row, index) => (
                        <tr
                            key={index}
                            className="hover:bg-gray-50 cursor-pointer"
                        >
                            {
                                columns.map(({ name }) => (
                                    <td
                                        key={index + name}
                                        className={clsx("px-4 border-b")}
                                    >
                                        {
                                            name === 'title'
                                                ? <EditableCell
                                                    {...{ id: row.id, value: row[name] as string, fieldName: name }}
                                                />
                                                : <>{row[name]}</>
                                        }
                                    </td>
                                ))
                            }

                            <td className="px-4 py-3 border-b bg-stone-50"></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <AddNewFieldModal isOpen={addNewFieldModalIsOpen} onClose={() => setAddNewFieldModalIsOpen(false)} />

            <FieldNameOptionsModal
                fieldName={rightClickedField}
                isOpen={deleFieldModalIsOpen}
                onClose={() => setDeleFieldModalIsOpen(false)}
            />
        </div >
    )
}

export default Table

type EditableCellPropTypes = { fieldName: string, value: string, id: number }

const EditableCell = ({ id, value, fieldName }: EditableCellPropTypes) => {
    const [inputValue, setInputValue] = useState('')

    const { editTask } = useContext(TaskContext)

    useEffect(() => {
        setInputValue(value)
    }, [])

    const save = () => {
        console.log({ inputValue })
        editTask({ id, fieldName, value: inputValue })
    }

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.addEventListener('blur', save)
        }

        return () => inputRef.current?.removeEventListener('blur', save)
    }, [inputValue])

    const handleInputChange = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (inputRef.current) {
            inputRef.current.blur()
        }
    }

    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <form onSubmit={handleInputChange}>
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className="focus:bg-stone-100 focus:shadow-md focus:pl-2 focus:rounded-lg focus:scale-110 h-full py-3 cursor-pointer focus:cursor-text"
            />
        </form>
    )
}