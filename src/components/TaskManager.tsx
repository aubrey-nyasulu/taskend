"use client"

import CreateTaskModal from "@/components/CreateTaskModal"
import Table from "@/components/Table"
import TaskContext from "@/context/TaskProvider"
import UIContext from "@/context/UIProvider"
import clsx from "clsx"
import { useContext, useEffect, useState } from "react"
import Pagenation from "./Pagenation"
import { useRouter } from "next/navigation"
import ModalCloserBackground from "./ModalCloserBackground"
import { debounce } from "@/lib/utils"
import { TaskPageSearchParams } from "@/app/tasks/page"
import UndoRedo from "./UndoRedo"
import KanbanBoard from "./kanbanBoard/kanbanBoard"

export default function TaskManager({ searchParams }: TaskPageSearchParams) {
    const { setIsCreateTaskModalOpen, isCreateTaskModalOpen, isViewing, setIsViewing } = useContext(UIContext)
    const { fetchTasks, selectedTasks } = useContext(TaskContext)

    const page = Number(searchParams?.page) || 1
    const sort = searchParams?.sort
    const order = searchParams?.order
    const filterValue = searchParams?.filter
    const filterConstraint = searchParams?.filterConstraint

    useEffect(() => {
        fetchTasks({ page, sortBy: sort, order, filterValue, filterConstraint })
    }, [page, sort, order, filterValue, filterConstraint])

    return (
        <section className="relative w-full h-[calc(100%_-80px)] px-2 md:px-0">
            <div className={clsx(
                "bg-white shadow-sm dark:bg-stone-900 w-full h-full rounded-t-[32px] pt-8 pb-20",
                {
                    "opacity-40 scale-95": isCreateTaskModalOpen
                }
            )}>
                <div className="w-full max-w-4xl mx-auto flex flex-col gap-0 items-center mb-0">

                    <div className="w-full max-w-4xl flex gap-4 items-center justify-between mb-0 border-b">
                        <div className="w-full flex gap-4 items-center ">
                            <button
                                onClick={() => setIsViewing('table')}
                                className="border-b-[3px] border-b-stone-700 h-fit pb-2 px-4 focus:ring-1 focus:ring-stone-700"
                            >
                                Table
                            </button>

                            <button
                                onClick={() => setIsViewing('board')}
                                className="focus:ring-1 focus:ring-stone-700 pb-1 px-4"
                            >
                                Board
                            </button>
                        </div>

                        <div className="flex gap-4 items-center pb-1">
                            <UndoRedo />
                            <TableSort />
                            <TableFilter />
                        </div>
                    </div>

                    {
                        selectedTasks.length > 0 &&
                        <div className="flex gap-4 items-center   py-3 px-4 relative ">
                            <SelectedCounter />

                            <StatusSelectorBulkEdit />
                            <PrioritySelectorBulkEdit />
                            <BulkDeleteButton />
                        </div>
                    }
                </div>

                {
                    isViewing === 'table' &&
                    <div className="w-full h-full overflow-auto pb-4 px-[10%]">
                        <div className="w-fit min-w-full flex mb-8">
                            <Table />
                        </div>

                        <Pagenation />
                    </div>
                }

                {
                    isViewing === 'board' &&

                    <KanbanBoard />
                }
            </div>

            <CreateTaskModal {...{ isOpen: isCreateTaskModalOpen, setIsOpen: setIsCreateTaskModalOpen }} />
        </section>
    )
}

function TableSort() {
    const [filterBy, setFilterBy] = useState('status')
    const [filterOrder, setFilterOrder] = useState<'a' | 'd'>('a')

    const { isSortOpen, setIsSortOpen } = useContext(UIContext)

    // Close on Escape Key
    useEffect(() => {
        if (!isSortOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsSortOpen(false)
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [isSortOpen, setIsSortOpen])

    const router = useRouter()

    useEffect(() => {
        const searchParams = new URLSearchParams(location.href.split('?')[1])

        searchParams.set('sort', filterBy)
        searchParams.set('order', filterOrder)
        router.push(`/tasks?${searchParams}`)

        setFilterBy(filterBy)
        setFilterOrder(filterOrder)
    }, [filterBy, filterOrder])

    const deleteSort = () => {
        const searchParams = new URLSearchParams(location.href.split('?')[1])

        searchParams.delete('sort')
        searchParams.delete('order')
        router.push(`/tasks?${searchParams}`)
    }

    return (
        <>
            <ModalCloserBackground {...{ isOpen: isSortOpen, setIsOpen: setIsSortOpen }} />

            <div className="flex gap-2 items-center relative z-50">

                <button
                    onClick={() => setIsSortOpen(prevState => !prevState)}
                    className="px-3 py-1 border rounded-md"
                >
                    sort
                </button>

                <div className={clsx(
                    "py-2 px-4 bg-stone-50 shadow-lg border rounded-md absolute top-12 right-0",
                    {
                        "block": isSortOpen,
                        "hidden": !isSortOpen
                    }
                )}>
                    <div className="flex gap-4 items-center mb-4">
                        <select
                            name="sortBy"
                            id="sortBy"
                            onChange={e => setFilterBy(e.currentTarget.value)}
                            className="py-2 px-3"
                        >
                            <option value='status'>status</option>
                            <option value='priority'>priority</option>
                        </select>

                        <select
                            name="filterOrder"
                            id="filterOrder"
                            onChange={e => setFilterOrder(e.target.value as 'a' | 'd')}
                            className="py-2 px-3"
                        >
                            <option value="a">ascending</option>
                            <option value="d">descending</option>
                        </select>
                    </div>

                    <button
                        onClick={deleteSort}
                        className="opacity-80 px-2 py-1 border rounded-md bg-red-500 text-white"
                    >
                        Delete sort
                    </button>
                </div>
            </div>
        </>
    )
}

function TableFilter() {
    const [filterConstraint, setFilterConstraint] = useState('contains')
    const [filterValue, setFilterValue] = useState('')

    const { isFilterOpen, setIsFilterOpen } = useContext(UIContext)

    // Close on Escape Key
    useEffect(() => {
        if (!isFilterOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsFilterOpen(false)
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [isFilterOpen, setIsFilterOpen])

    const router = useRouter()

    useEffect(() => {
        const searchParams = new URLSearchParams(location.href.split('?')[1])

        searchParams.set('page', '1')
        searchParams.set('filter', filterValue)
        searchParams.set('filterConstraint', filterConstraint)
        router.push(`/tasks?${searchParams}`)

    }, [filterValue, filterConstraint])


    const deleteFilter = () => {
        const searchParams = new URLSearchParams(location.href.split('?')[1])

        searchParams.delete('filter')
        searchParams.delete('filterConstraint')
        router.push(`/tasks?${searchParams}`)
    }

    return (
        <>
            <ModalCloserBackground {...{ isOpen: isFilterOpen, setIsOpen: setIsFilterOpen }} />

            <div className="flex gap-2 items-center relative z-50">
                <button
                    onClick={() => setIsFilterOpen(prevState => !prevState)}
                    className="px-3 py-1 border rounded-md"
                >
                    Filter
                </button>

                <div className={clsx(
                    "py-3 px-4 bg-stone-50 shadow-lg border rounded-md absolute top-12 right-0",
                    {
                        "block": isFilterOpen,
                        "hidden": !isFilterOpen
                    }
                )}>
                    <div className="mb-4">
                        <select
                            name="filterBy"
                            id="filterBy"
                            className="py-2 px-3 mb-4"
                            onChange={e => {
                                setFilterConstraint(e.target.value)
                            }}
                        >
                            <option value='contains'>contains</option>
                            <option value='does not contain'>does not contain</option>
                            <option value='starts with'>starts with</option>
                            <option value='ends with'>ends with</option>
                        </select>

                        <input
                            type="text"
                            name="filter"
                            placeholder="Filter by title"
                            onChange={(e) => {
                                debounce(() => setFilterValue(e.target.value))
                            }}
                            className="py-2 px-3 max-w-[166px]"
                        />
                    </div>

                    <button
                        onClick={() => deleteFilter()}
                        className="opacity-80 px-2 py-1 border rounded-md bg-red-500 text-white"
                    >
                        Remove filter
                    </button>
                </div>
            </div>
        </>
    )
}

function SelectedCounter() {
    const { selectedTasks, columns } = useContext(TaskContext)

    console.log({ selectedTasks })
    return (
        <>
            {
                selectedTasks.length > 0 &&
                <div className="px-2 h-fit w-fit border grid place-content-center rounded-md text-nowrap">
                    {selectedTasks.length} Selected
                </div>
            }
        </>
    )
}

function BulkDeleteButton() {
    const { bulkDelete } = useContext(TaskContext)

    return (
        <button onClick={bulkDelete}>delete</button>
    )
}

function StatusSelectorBulkEdit() {
    const { bulkEdit } = useContext(TaskContext)

    const [isOpen, setIsOpen] = useState(false)

    // Close on Escape Key
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false)
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [isOpen])

    const handleSelect = (value: string) => {
        setIsOpen(false)
        bulkEdit('status', value)
    }

    return (
        <>
            <ModalCloserBackground {...{ isOpen, setIsOpen }} />

            <div className="w-fit">
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-2 w-full text-start"
                >status</button>

                {
                    isOpen &&
                    <div className="w-fit rounded-md bg-white absolute top-0 z-40 shadow-lg border ">
                        <p className="px-4 py-[11px] cursor-default ">status</p>

                        <div className="w-fit px-4 py-3 pr-24 border-t">
                            <button onClick={() => handleSelect('not_started')}>not_started</button>
                        </div>

                        <div className="w-fit px-4 py-3 pr-24 border-t">
                            <button onClick={() => handleSelect('in_progress')}>in_progress</button>
                        </div>

                        <div className="w-fit px-4 py-3 pr-24 border-t">
                            <button onClick={() => handleSelect('completed')}>completed</button>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

function PrioritySelectorBulkEdit() {
    const { bulkEdit } = useContext(TaskContext)

    const [isOpen, setIsOpen] = useState(false)

    // Close on Escape Key
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false)
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [isOpen])

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