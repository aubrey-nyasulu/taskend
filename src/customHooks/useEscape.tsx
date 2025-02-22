import { useEffect } from "react"

export function useEscape(callback: () => void, isActive: boolean) {
    useEffect(() => {
        if (!isActive) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") callback()
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [isActive, callback])
}
