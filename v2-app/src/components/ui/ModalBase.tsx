'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalBaseProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    closeOnOutsideClick?: boolean; 
    closeOnEscape?: boolean;       
}

export default function ModalBase({ 
    isOpen, 
    onClose, 
    children,
    closeOnOutsideClick = true,
    closeOnEscape = true
}: ModalBaseProps) {

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // Lock scroll
    useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div
        className="modal-overlay"
        onClick={() => {
            if (closeOnOutsideClick) onClose();
        }} 
        >
            <div
                className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                style={{ maxHeight: '90vh' }}
                onClick={(e) => e.stopPropagation()} 
            >
                {children}
            </div>
        </div>,
        document.body
    );
}