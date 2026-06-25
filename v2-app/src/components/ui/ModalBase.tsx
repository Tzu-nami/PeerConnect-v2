'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface ModalBaseProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    closeOnOutsideClick?: boolean
    closeOnEscape?: boolean
}

export default function ModalBase({
    isOpen,
    onClose,
    children,
    closeOnOutsideClick = true,
    closeOnEscape = true
}: ModalBaseProps) {

    const mountedRef = useRef(false)
    useEffect(() => { mountedRef.current = true }, [])

    // Lock scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    // Escape key
    useEffect(() => {
        if (!closeOnEscape) return
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, closeOnEscape, onClose])

    if (!isOpen) return null

    return createPortal(
        <div
            className="modal-overlay"
            onClick={() => { if (closeOnOutsideClick) onClose() }}
        >
            <div
                className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                style={{ maxHeight: '90vh' }}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body
    )
}