"use client"

import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react"

type UiState = {
    isAddNewFieldModalOpen: boolean
    setIsAddNewFieldModalOpen: Dispatch<SetStateAction<boolean>>
    createTaskModalIsOpen: boolean
    setCreateTaskModalIsOpen: Dispatch<SetStateAction<boolean>>
}

const initialState: UiState = {
    isAddNewFieldModalOpen: false,
    setIsAddNewFieldModalOpen: () => { },
    createTaskModalIsOpen: false,
    setCreateTaskModalIsOpen: () => { },
}

const UIContext = createContext<UiState>(initialState)

export const UIContextProvider = ({ children }: { children: ReactNode }) => {
    const [isAddNewFieldModalOpen, setIsAddNewFieldModalOpen] = useState(false)
    const [createTaskModalIsOpen, setCreateTaskModalIsOpen] = useState(false)

    return (
        <UIContext.Provider value={{
            isAddNewFieldModalOpen,
            setIsAddNewFieldModalOpen,
            createTaskModalIsOpen,
            setCreateTaskModalIsOpen,
        }}>
            {children}
        </UIContext.Provider>
    )
}

export default UIContext