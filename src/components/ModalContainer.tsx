import { ReactNode, useEffect } from "react"

type ModalContainerPropTypes = { isOpen: boolean, onClose: () => void, children: ReactNode }

export default function ModalContainer({ isOpen, onClose, children }: ModalContainerPropTypes) {
    // Close on Escape Key
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, onClose])

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="absolute inset-0" onClick={onClose}></div>

            {children}
        </div>
    )
}