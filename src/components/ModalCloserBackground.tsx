"use client"

import UIContext from '@/context/UIProvider'
import { Dispatch, SetStateAction, useContext } from 'react'

export default function ModalCloserBackground({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>> }) {
    return (
        <>
            {
                (
                    isOpen
                ) &&
                < div
                    className="fixed inset-0 z-40 bg-black/10"
                    onClick={() => setIsOpen(false)}
                ></div >
            }
        </>
    )
}
