"use client"

import { Dispatch, SetStateAction, useContext } from 'react'

export default function ModalCloserBackground({ isOpen, setIsOpen }:
    { isOpen: boolean, setIsOpen: (arg: boolean) => void }
) {
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
