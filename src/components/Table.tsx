"use client"

import { useContext, useState } from "react"
import clsx from "clsx"
import AddNewFieldModal from "./AddNewFieldModal"
import TaskContext from "@/context/TaskProvider"
import FieldNameOptionsModal from "./FieldNameOptionsModal"
import EditableCell from "./EditableCell"
import { useRouter } from "next/navigation"

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
                    <tr className={clsx(
                        "border-t text-left text-gray-600 text-sm font-medium",
                    )} >
                        <th className="relative flex items-center gap-2  px-0 py-3  h-full place-content-center">
                            <div className="w-full h-4 bg-white absolute left-0 -top-3">
                            </div>
                            <button
                                disabled={true}
                                className="w-fit opacity-0"
                            >
                                Del
                            </button>

                            <CheckboxController />
                        </th>

                        {
                            columns.map(({ name }, index) => (
                                <th
                                    key={name + index}
                                    className={clsx(
                                        "px-4 py-3 border cursor-context-menu",
                                        {
                                            "border-l-0": index === 0,
                                        }
                                    )}

                                    onClick={(e) => temp1(name)}

                                    onContextMenu={(e) => {
                                        e.preventDefault()
                                        temp1(name)
                                    }}
                                >
                                    <div className="w-full flex gap-4 items-center justify-between">
                                        {name}

                                        <Solter field={name} />
                                    </div>
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
                            <td className="flex items-center gap-2  px-0 py-3  h-full place-content-center">
                                <button
                                    onClick={() => deleteTask(row.id)}
                                    className="w-fit"
                                >
                                    Del
                                </button>

                                <Checkbox id={`${row.id}`} />
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

function Solter({ field }: { field: string }) {
    const [order, setOrder] = useState('a')

    const router = useRouter()

    const sortByField = (arg: any) => {
        const searchParams = new URLSearchParams(location.href.split('?')[1])

        const page = searchParams.get('page')
        const currentSortField = searchParams.get('sort')
        const currentSortOrder = searchParams.get('order')

        const order = currentSortField !== field ? 'a' : currentSortOrder === 'a' ? 'd' : 'a'

        searchParams.set('page', page || '1')
        searchParams.set('sort', field)
        searchParams.set('order', order)

        router.push(`/tasks?${searchParams}`)

        // if (page) {
        //     router.push(`/tasks?page=${page}&sort=${field}&order=${order}`)
        // } else {
        //     router.push(`/tasks?sort=${field}&order=${order}`)
        // }

        setOrder(order)
    }

    return (
        <button onClick={sortByField}>{order}</button>
    )
}

function Checkbox({ id }: { id: string }) {
    const { setSelectedTasks, selectedTasks } = useContext(TaskContext)

    return (
        <input
            type="checkbox"
            className="pt-2"
            checked={selectedTasks.includes(id)}
            onChange={e => {
                if (e.target.checked) {
                    setSelectedTasks(prev => [...prev, id])
                } else {
                    setSelectedTasks(prev => prev.filter(taskId => taskId !== id))
                }
            }}
        />
    )
}

function CheckboxController() {
    const { setSelectedTasks, rows } = useContext(TaskContext)

    return (
        <input
            type="checkbox"
            className="pt-2"
            onChange={e => {
                if (e.target.checked) {
                    setSelectedTasks(rows.map(({ id }) => id.toString()))
                } else {
                    setSelectedTasks([])
                }
            }}
        />
    )
}