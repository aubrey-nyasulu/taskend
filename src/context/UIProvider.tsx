"use client"

import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react"

type UiState = {
    isCreateTaskModalOpen: boolean
    setIsCreateTaskModalOpen: Dispatch<SetStateAction<boolean>>
    isFilterOpen: boolean,
    setIsFilterOpen: Dispatch<SetStateAction<boolean>>
    isSortOpen: boolean,
    setIsSortOpen: Dispatch<SetStateAction<boolean>>
}

const initialState: UiState = {
    isCreateTaskModalOpen: false,
    isFilterOpen: false,
    setIsCreateTaskModalOpen: () => { },
    setIsFilterOpen: () => { },
    isSortOpen: false,
    setIsSortOpen: () => { }
}

const UIContext = createContext<UiState>(initialState)

export const UIContextProvider = ({ children }: { children: ReactNode }) => {
    const [isAddNewFieldModalOpen, setIsAddNewFieldModalOpen] = useState(false)
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
            setIsSortOpen
        }}>
            {children}
        </UIContext.Provider>
    )
}

export default UIContext