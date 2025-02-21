"use client"

import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react"

type UiState = {
    isCreateTaskModalOpen: boolean
    setIsCreateTaskModalOpen: Dispatch<SetStateAction<boolean>>
    isFilterOpen: boolean,
    setIsFilterOpen: Dispatch<SetStateAction<boolean>>
    isSortOpen: boolean,
    setIsSortOpen: Dispatch<SetStateAction<boolean>>
    isViewing: 'table' | 'board',
    setIsViewing: Dispatch<SetStateAction<'table' | 'board'>>
}

const initialState: UiState = {
    isCreateTaskModalOpen: false,
    isFilterOpen: false,
    setIsCreateTaskModalOpen: () => { },
    setIsFilterOpen: () => { },
    isSortOpen: false,
    setIsSortOpen: () => { },
    isViewing: 'table',
    setIsViewing: () => { },
}

const UIContext = createContext<UiState>(initialState)

export const UIContextProvider = ({ children }: { children: ReactNode }) => {
    const [isViewing, setIsViewing] = useState<'table' | 'board'>('table')
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)
    const [isSortOpen, setIsSortOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    return (
        <UIContext.Provider value={{
            isCreateTaskModalOpen,
            setIsCreateTaskModalOpen,
            isFilterOpen,
            setIsFilterOpen,
            isSortOpen,
            setIsSortOpen,
            isViewing,
            setIsViewing,
        }}>
            {children}
        </UIContext.Provider>
    )
}

export default UIContext