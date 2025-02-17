"use client"

import UIContext from '@/context/UIProvider'
import { useContext } from 'react'

export default function ModalCloserBackground() {
    const { setAddNewFieldModalIsOpen, addNewFieldmodalIsOpen } = useContext(UIContext)

    return (
        <div className="absolute inset-0" onClick={() => setAddNewFieldModalIsOpen(false)}></div>
    )
}
