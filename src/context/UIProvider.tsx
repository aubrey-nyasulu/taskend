"use client"

import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react"

type UiState = {
    addNewFieldmodalIsOpen: boolean
    setAddNewFieldModalIsOpen: Dispatch<SetStateAction<boolean>>
    createTaskModalIsOpen: boolean
    setCreateTaskModalIsOpen: Dispatch<SetStateAction<boolean>>
}

const initialState: UiState = {
    addNewFieldmodalIsOpen: false,
    setAddNewFieldModalIsOpen: () => { },
    createTaskModalIsOpen: false,
    setCreateTaskModalIsOpen: () => { },
}

const UIContext = createContext<UiState>(initialState)

export const UIContextProvider = ({ children }: { children: ReactNode }) => {
    const [addNewFieldmodalIsOpen, setAddNewFieldModalIsOpen] = useState(false)
    const [createTaskModalIsOpen, setCreateTaskModalIsOpen] = useState(false)

    return (
        <UIContext.Provider value={{
            addNewFieldmodalIsOpen,
            setAddNewFieldModalIsOpen,
            createTaskModalIsOpen,
            setCreateTaskModalIsOpen,
        }}>
            {children}
        </UIContext.Provider>
    )
}

export default UIContext