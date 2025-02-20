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
    isBackgroundModalOpen: boolean,
    setIsBackgroundModalOpen: Dispatch<SetStateAction<boolean>>
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
    isBackgroundModalOpen: false,
    setIsBackgroundModalOpen: () => { },
}

const UIContext = createContext<UiState>(initialState)

export const UIContextProvider = ({ children }: { children: ReactNode }) => {
    const [isViewing, setIsViewing] = useState<'table' | 'board'>('table')
    const [isAddNewFieldModalOpen, setIsAddNewFieldModalOpen] = useState(false)
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)
    const [isSortOpen, setIsSortOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false)

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
            isBackgroundModalOpen,
            setIsBackgroundModalOpen,
        }}>
            {children}
        </UIContext.Provider>
    )
}

export default UIContext