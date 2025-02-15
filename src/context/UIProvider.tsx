"use client"

import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react"

type UiState = {
    addNewFieldmodalIsOpen: boolean
    setAddNewFieldModalIsOpen: Dispatch<SetStateAction<boolean>>
}

const initialState: UiState = {
    addNewFieldmodalIsOpen: false,
    setAddNewFieldModalIsOpen: () => { }
}

const UIContext = createContext<UiState>(initialState)

export const UIContextProvider = ({ children }: { children: ReactNode }) => {
    const [addNewFieldmodalIsOpen, setAddNewFieldModalIsOpen] = useState(false)

    return (
        <UIContext.Provider value={{ addNewFieldmodalIsOpen, setAddNewFieldModalIsOpen }}>
            {children}
        </UIContext.Provider>
    )
}

export default UIContext