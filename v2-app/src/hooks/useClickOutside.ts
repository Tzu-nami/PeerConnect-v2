import { useEffect, useRef } from "react"

export function useClickOutside(isOpen: boolean, onClose: () => void) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {

            if (ref.current && !ref.current.contains(e.target as Node)) {

                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen, onClose])

    return ref
}