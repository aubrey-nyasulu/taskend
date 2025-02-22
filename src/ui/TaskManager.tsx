"use client"

import CreateTaskModal from "@/ui/components/CreateTaskModal"
import Table from "@/ui/table/Table"
import TaskContext from "@/context/TaskProvider"
import UIContext from "@/context/UIProvider"
import clsx from "clsx"
import { useContext, useEffect } from "react"
import Pagenation from "./components/Pagenation"
import { TaskPageSearchParams } from "@/app/tasks/page"
import UndoRedo from "./components/UndoRedo"
import KanbanBoard from "./board/kanbanBoard"
import TableSorter from "./components/TableSorter"
import TableFilter from "./components/TableFilter"
import StatusSelectorBulkEdit from "./components/StatusSelectorBulkEdit"
import PrioritySelectorBulkEdit from "./components/PrioritySelectorBulkEdit"

export default function TaskManager({ searchParams }: TaskPageSearchParams) {
    const { setIsCreateTaskModalOpen, isCreateTaskModalOpen, isViewing } = useContext(UIContext)
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
                        <TableBoardToggle />

                        <div className="flex gap-4 items-center pb-1">
                            <UndoRedo />
                            <TableSorter />
                            <TableFilter />
                        </div>
                    </div>

                    {
                        selectedTasks.length > 0 &&
                        <div className="flex gap-4 items-center   py-3 px-4 relative ">
                            <BulkSelectionCounter />

                            <StatusSelectorBulkEdit />
                            <PrioritySelectorBulkEdit />
                            <BulkDeleteButton />
                        </div>
                    }
                </div>

                {
                    isViewing === 'table' &&
                    <div className="w-full h-full overflow-auto pb-4 px-[10%]">
                        <div className="w-fit min-w-full flex">
                            <Table />
                        </div>
                    </div>
                }

                {
                    isViewing === 'board' &&
                    <div className="w-full h-full overflow-auto pb-4 px-[10%]">
                        <KanbanBoard />
                    </div>
                }

                <Pagenation />
            </div>

            <CreateTaskModal
                {...{
                    isOpen: isCreateTaskModalOpen,
                    setIsOpen: setIsCreateTaskModalOpen
                }}
            />
        </section>
    )
}

function BulkDeleteButton() {
    const { bulkDelete } = useContext(TaskContext)

    return (
        <button onClick={bulkDelete}>delete</button>
    )
}

function BulkSelectionCounter() {
    const { selectedTasks } = useContext(TaskContext)

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

function TableBoardToggle() {
    const { setIsViewing } = useContext(UIContext)

    return (
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
    )
}
