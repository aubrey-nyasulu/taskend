"use client"

import CreateTaskModal from "@/components/CreateTaskModal"
import Table from "@/components/Table"
import TaskContext from "@/context/TaskProvider"
import UIContext from "@/context/UIProvider"
import clsx from "clsx"
import { useContext, useEffect } from "react"
import Pagenation from "./Pagenation"

export default function TaskManager({ searchParams }: { searchParams: { page?: string } }) {
    const { setIsAddNewFieldModalOpen, isAddNewFieldModalOpen } = useContext(UIContext)
    const { fetchTasks } = useContext(TaskContext)

    const page = Number(searchParams?.page) || 1

    useEffect(() => {
        fetchTasks(page)
    }, [page])

    return (
        <section className="relative w-full min-h-full ">
            <div className={clsx(
                "bg-white shadow-sm dark:bg-stone-900 w-full min-h-full rounded-t-[32px] pt-8 pb-20",
                {
                    "opacity-40 scale-95": isAddNewFieldModalOpen
                }
            )}>
                <div className="w-full mx-auto max-w-4xl flex gap-4 items-center justify-center ">
                    <button className="border-b-[3px] border-b-stone-700 h-fit pb-1 px-4 focus:ring-1 focus:ring-stone-700">Table</button>

                    <button className="focus:ring-1 focus:ring-stone-700 pb-1 px-4">Board</button>
                </div>

                <div className="w-full overflow-x-auto pb-4 px-[10%]">
                    <div className="w-fit min-w-full flex mb-8">
                        <Table />
                    </div>

                    <Pagenation />
                </div>
            </div>

            <CreateTaskModal {...{ isOpen: isAddNewFieldModalOpen, setIsOpen: setIsAddNewFieldModalOpen }} />
        </section>
    )
}

