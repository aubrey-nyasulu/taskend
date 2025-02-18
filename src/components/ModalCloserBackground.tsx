"use client"

import UIContext from '@/context/UIProvider'
import { useContext } from 'react'

export default function ModalCloserBackground() {
    const { isCreateTaskModalOpen, isFilterOpen, isSortOpen, setIsSortOpen, setIsCreateTaskModalOpen, setIsFilterOpen } = useContext(UIContext)

    return (
        <>
            {
                (
                    isCreateTaskModalOpen ||
                    isFilterOpen ||
                    isSortOpen
                ) &&
                < div
                    className="absolute inset-0 z-40"
                    onClick={() => {
                        setIsCreateTaskModalOpen(false)
                        setIsFilterOpen(false)
                        setIsSortOpen(false)
                    }}
                ></div >
            }
        </>
    )
}
