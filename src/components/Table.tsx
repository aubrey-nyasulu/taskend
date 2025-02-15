"use client"

import { useContext, useEffect, useState } from "react"
import UIContext from "@/context/UIProvider"
import AddNewFieldModal from "./AddNewFieldModal"
import NewFieldModal from "./AddNewFieldModal"
import TaskContext from "@/context/TaskProvider"

function Table() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const { columns, rows } = useContext(TaskContext)

    console.log({ columns, rows })

    return (
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-b-lg border">
            <table className="w-full border-collapse">
                {/* Table Header */}
                <thead>
                    <tr className="bg-stone-100 text-left text-gray-600 text-sm font-medium">
                        {
                            columns.map(({ name }, index) => (
                                <th
                                    key={name + index}
                                    className="px-4 py-3 border-b"
                                >
                                    {name}
                                </th>
                            ))
                        }
                        <th className="border-b">
                            <button
                                // onClick={() => setAddNewFieldModalIsOpen(true)}
                                onClick={() => setIsModalOpen(true)}
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
                            className="hover:bg-gray-50"
                        >
                            {
                                columns.map(({ name }) => (
                                    <td
                                        key={index + name}
                                        className="px-4 py-3 border-b"
                                    >
                                        {row[name]}
                                    </td>
                                ))
                            }
                            <td className="px-4 py-3 border-b bg-stone-200"></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <NewFieldModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div >
    )
}

export default Table