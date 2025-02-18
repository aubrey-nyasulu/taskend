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

export default function TaskManager({ searchParams }: TaskPageSearchParams) {
    const { setIsCreateTaskModalOpen, isCreateTaskModalOpen } = useContext(UIContext)
    const { fetchTasks } = useContext(TaskContext)

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
            <ModalCloserBackground />

            <div className={clsx(
                "bg-white shadow-sm dark:bg-stone-900 w-full h-full rounded-t-[32px] pt-8 pb-20",
                {
                    "opacity-40 scale-95": isCreateTaskModalOpen
                }
            )}>
                <div className="w-full max-w-4xl flex gap-4 items-center justify-between mb-4">
                    <div className="w-full flex gap-4 items-center justify-center ">
                        <button className="border-b-[3px] border-b-stone-700 h-fit pb-1 px-4 focus:ring-1 focus:ring-stone-700">Table</button>

                        <button className="focus:ring-1 focus:ring-stone-700 pb-1 px-4">Board</button>
                    </div>

                    <div className="flex gap-4 items-center">
                        <TableSort />
                        <TableFilter />
                    </div>
                </div>

                <div className="w-full h-full overflow-auto pb-4 px-[10%]">
                    <div className="w-fit min-w-full flex mb-8">
                        <Table />
                    </div>

                    <Pagenation />
                </div>
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

        setFilterBy('status')
        setFilterOrder('a')
    }

    return (
        <div className="flex gap-2 items-center relative z-50">
            <button
                onClick={() => setIsSortOpen(prevState => !prevState)}
                className="px-4 py-2 border rounded-md"
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
                        name="filterBy"
                        id="filterBy"
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

        searchParams.set('filter', filterValue)
        searchParams.set('filterConstraint', filterConstraint)
        router.push(`/tasks?${searchParams}`)

    }, [filterValue, filterConstraint])


    // const filter = (filterValue: string) => {
    //     setFilterValue(filterValue)
    // }

    return (
        <div className="flex gap-2 items-center relative z-50">
            <button
                onClick={() => setIsFilterOpen(prevState => !prevState)}
                className="px-4 py-2 border rounded-md"
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

                <button className="opacity-80 px-2 py-1 border rounded-md bg-red-500 text-white">Remove filter</button>
            </div>
        </div>
    )
}