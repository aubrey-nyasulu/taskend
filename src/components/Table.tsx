"use client"

import { useContext, useState } from "react"
import clsx from "clsx"
import AddNewFieldModal from "./AddNewFieldModal"
import TaskContext from "@/context/TaskProvider"
import FieldNameOptionsModal from "./FieldNameOptionsModal"
import EditableCell from "./EditableCell"

function Table() {
    const [addNewFieldModalIsOpen, setAddNewFieldModalIsOpen] = useState(false)
    const [deleFieldModalIsOpen, setDeleFieldModalIsOpen] = useState(false)
    const [rightClickedField, setRightClickedField] = useState('')

    const { columns, rows, ProtectedFields, deleteTask } = useContext(TaskContext)

    const temp1 = (name: string) => {
        if (name in ProtectedFields) return

        setDeleFieldModalIsOpen(true)
        setRightClickedField(name)
    }

    return (
        <div className="relative w-fit  max-w-4xl mx-auto rounded-b-lg flex-1 ">
            <table className="w-full border-collapse">
                {/* Table Header */}
                <thead>
                    <tr className="border-t text-left text-gray-600 text-sm font-medium">
                        <th className="px-4 py-3 relative">
                            <div className="w-full h-4 bg-white absolute left-0 -top-3"></div>
                        </th>

                        {
                            columns.map(({ name }, index) => (
                                <th
                                    key={name + index}
                                    className={clsx(
                                        "px-4 py-3 border cursor-context-menu",
                                        {
                                            "cursor-not-allowed": name in ProtectedFields,
                                            "cursor-pointer": !(name in ProtectedFields),
                                            "border-l-0": index === 0,
                                        }
                                    )}

                                    onClick={(e) => temp1(name)}

                                    onContextMenu={(e) => {
                                        e.preventDefault()
                                        temp1(name)
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
                            <td className="px-0 py-3  h-full grid place-content-center">
                                <button
                                    onClick={() => deleteTask(row.id)}
                                    className="w-fit"
                                >
                                    Del
                                </button>
                            </td>

                            {
                                columns.map(({ name, type }, index) => (
                                    <td
                                        key={index + name}
                                        className={clsx(
                                            "px-4 border",
                                            {
                                                "border-l-0": index === 0,
                                            }
                                        )}
                                    >
                                        {
                                            type === 'text'
                                                ? <EditableCell
                                                    {...{ id: row.id, value: row[name] as string, fieldName: name }}
                                                />
                                                : type === 'checkbox'
                                                    ? <input type="checkbox" />
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

