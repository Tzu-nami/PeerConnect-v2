'use client';

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
    isOpen: boolean;
    title: string;
    message: React.ReactNode;
    confirmLabel?: string;
    confirmClassName?: string;
    icon?: React.ReactNode;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    confirmClassName = 'bg-btn-gray hover:bg-btn-gray-hover',
    icon,
    loading = false,
    onConfirm,
    onCancel,
}: Props) {
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

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape' && !loading) onCancel()
        }
        if (isOpen) document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, loading, onCancel])

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="modal-overlay"
            onClick={() => !loading && onCancel()}
        >
            <div className="modal-box-crud max-w-sm p-8 text-center m-4"
                onClick={(e) => e.stopPropagation()}
            >
                {icon && (
                    <div className="flex items-center justify-center mx-auto mb-5">{icon}</div>
                )}
                <h3 className="text-xl font-black text-slate-800">{title}</h3>
                <div className="text-sm text-gray-500 mt-2 mb-8">{message}</div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-white-border rounded-lg hover:bg-white-dark cursor-pointer">
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition ${confirmClassName}`}>
                        {loading ? <>Processing...</> : confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}