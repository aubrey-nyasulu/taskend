import { useEscape } from "@/customHooks/useEscape"
import { ReactNode, useEffect } from "react"

type ModalContainerPropTypes = { isOpen: boolean, onClose: () => void, children: ReactNode }

export default function ModalContainer({ isOpen, onClose, children }: ModalContainerPropTypes) {
    useEscape(onClose, isOpen)

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="absolute inset-0" onClick={onClose}></div>

            {children}
        </div>
    )
}