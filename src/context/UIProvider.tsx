"use client"

import { RowType } from "@/types"
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react"

type UiState = {
    isCreateTaskModalOpen: boolean
    setIsCreateTaskModalOpen: Dispatch<SetStateAction<boolean>>
    isFilterOpen: boolean
    setIsFilterOpen: Dispatch<SetStateAction<boolean>>
    isSortOpen: boolean
    activeTask: RowType | undefined
    // setActiveTask: Dispatch<SetStateAction<RowType | undefined>>
    setIsSortOpen: Dispatch<SetStateAction<boolean>>
    isViewing: 'table' | 'board',
    setIsViewing: Dispatch<SetStateAction<'table' | 'board'>>
    openCreateTaskModal(task: RowType, isOpen: boolean): void
}

const initialState: UiState = {
    isCreateTaskModalOpen: false,
    isFilterOpen: false,
    setIsCreateTaskModalOpen: () => { },
    setIsFilterOpen: () => { },
    isSortOpen: false,
    setIsSortOpen: () => { },
    activeTask: undefined,
    // setActiveTask: () => { },
    isViewing: 'table',
    setIsViewing: () => { },
    openCreateTaskModal: () => { },
}

const UIContext = createContext<UiState>(initialState)

export const UIContextProvider = ({ children }: { children: ReactNode }) => {
    const [isViewing, setIsViewing] = useState<'table' | 'board'>('table')
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)
    const [activeTask, setActiveTask] = useState<RowType>()
    const [isSortOpen, setIsSortOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    function openCreateTaskModal(task: RowType, isOpen: boolean) {
        setIsCreateTaskModalOpen(true)
        setActiveTask(task)
    }

    return (
        <UIContext.Provider value={{
            isCreateTaskModalOpen,
            setIsCreateTaskModalOpen,
            isFilterOpen,
            setIsFilterOpen,
            isSortOpen,
            setIsSortOpen,
            activeTask,
            // setActiveTask,
            isViewing,
            setIsViewing,
            openCreateTaskModal,
        }}>
            {children}
        </UIContext.Provider>
    )
}

export default UIContext