"use client"

import UIContext from '@/context/UIProvider'
import React, { useContext } from 'react'

export default function CreateTaskButton() {
    const { setIsCreateTaskModalOpen } = useContext(UIContext)

    return (
        <button
            onClick={() => setIsCreateTaskModalOpen(true)}
            className="py-4 px-8 bg-stone-800 text-white font-semibold rounded-full fixed bottom-4 right-8 z-30 "
        >
            Create Task
        </button>
    )
}
