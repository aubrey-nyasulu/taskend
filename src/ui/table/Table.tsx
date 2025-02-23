"use client"

import { useContext, useEffect, useState } from "react"
import clsx from "clsx"
import AddNewFieldModal from "./components/AddNewFieldModal"
import FieldNameOptionsModal from "./components/FieldNameOptionsModal"
import EditableCell from "./components/EditableCell"
import Solt from "./components/Solt"
import { BulkSelectCheckbox } from "./components/BulkSelectCheckbox"
import CheckboxController from "./components/CheckboxController"
import StatusSelector from "./components/StatusSelector"
import PrioritySelector from "./components/PrioritySelector"
import TaskContext from "@/context/TaskProvider"
import { RowType } from "@/types"
import { SvgComponent } from "@/assets/svgAssets"

export default function Table() {
    const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false)
    const [isDeleteFieldModalOpen, setIsDeleteFieldModalOpen] = useState(false)
    const [selectedField, setSelectedField] = useState("")

    const { columns, rows, ProtectedFields, deleteTask } = useContext(TaskContext)

    const handleFieldRightClick = (fieldName: string) => {
        if (ProtectedFields[fieldName]) return

        setIsDeleteFieldModalOpen(true)
        setSelectedField(fieldName)
    }

    return (
        <div className="relative w-fit max-w-4xl mx-auto rounded-b-lg flex-1 pt-2">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-t text-left text-gray-600 text-sm font-medium">
                        <th className="relative flex items-center gap-2 px-0 py-3 h-full place-content-center">
                            <div className="w-full h-4 bg-white absolute left-0 -top-3"></div>

                            <button disabled className="w-fit opacity-0">
                                <SvgComponent />
                            </button>

                            <CheckboxController />
                        </th>

                        {
                            columns.map(({ name }, index) => (
                                <th
                                    key={name + index}
                                    className={clsx(
                                        "px-4 py-3 border cursor-context-menu",
                                        { "border-l-0": index === 0 }
                                    )}
                                    onClick={() => handleFieldRightClick(name)}
                                    onContextMenu={(e) => {
                                        e.preventDefault()
                                        handleFieldRightClick(name)
                                    }}
                                >
                                    <div className="w-full flex gap-4 items-center justify-between">
                                        {name}

                                        <Solt field={name} />
                                    </div>
                                </th>
                            ))
                        }

                        <th className="border-b">
                            <button
                                onClick={() => setIsAddFieldModalOpen(true)}
                                className="text-2xl font-bold w-full h-full focus:ring-1 focus:ring-stone-700"
                            >
                                +
                            </button>
                        </th>
                    </tr>
                </thead>

                <tbody className="text-gray-800">
                    {
                        rows.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="hover:bg-gray-50 cursor-pointer group"
                            >
                                <td className="flex items-center gap-2 px-0 py-3 h-full place-content-center">
                                    <button
                                        onClick={() => deleteTask(row.id)}
                                        className="w-fit md:opacity-0 md:group-hover:opacity-100 "
                                    >
                                        <SvgComponent />
                                    </button>

                                    <BulkSelectCheckbox id={`${row.id}`} />
                                </td>

                                {
                                    columns.map(({ name, type }, colIndex) => (
                                        <TableData
                                            key={colIndex + name}
                                            {...{ colIndex, name, row, type }}
                                        />

                                    ))
                                }

                                <td className="px-4 py-3 border-b bg-stone-50"></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <AddNewFieldModal
                isOpen={isAddFieldModalOpen}
                onClose={() => setIsAddFieldModalOpen(false)}
            />

            <FieldNameOptionsModal fieldName={selectedField} isOpen={isDeleteFieldModalOpen} onClose={() => setIsDeleteFieldModalOpen(false)} />
        </div>
    )
}

type TableDataPropTypes = {
    name: string
    type: "number" | "text" | "checkbox" | "button"
    colIndex: number
    row: RowType
}

function TableData({ colIndex, name, type, row }: TableDataPropTypes) {
    return (
        <td
            className={clsx(
                "border relative",
                {
                    "border-l-0": colIndex === 0
                }
            )}
        >
            {
                type === 'text' &&
                <EditableCell id={row.id} value={row[name] as string} fieldName={name} />
            }

            {
                type === 'checkbox' &&
                <input
                    type="checkbox"
                    className="w-6 h-6 block mx-auto"
                />
            }

            {
                type === 'number' &&
                <input
                    type="number"
                    className="block mx-auto"
                />
            }

            {
                (type === 'button' && name === 'status') &&
                <StatusSelector value={row[name] as string} id={row.id} />
            }

            {
                (type === 'button' && name === 'priority') &&
                <PrioritySelector value={row[name] as string} id={row.id} />
            }
        </td>
    )
}