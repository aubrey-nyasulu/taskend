"use client"

import UIContext from '@/context/UIProvider'
import React, { useContext } from 'react'

export default function CreateTaskButton() {
    const { setIsCreateTaskModalOpen } = useContext(UIContext)

    return (
        <button
            onClick={() => setIsCreateTaskModalOpen(true)}
            className="w-16 h-16  bg-stone-800 text-white font-semibold rounded-full fixed bottom-4 right-8 z-30 group aspect-square "
        >
            <span className='text-4xl font-semibold '>+</span>
            {/* <span className='hidden group-hover:block'>Create Task</span> */}
        </button>
    )
}
