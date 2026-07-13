import { FaXmark } from "react-icons/fa6";
import ModalBase from "./ModalBase";

interface Props {
    open: boolean;
    title: React.ReactNode;
    subtitle?: string;
    onClose?: () => void;
    footer?: React.ReactNode;
    children: React.ReactNode;
    maxWidth?:  'max-w-4xl' | 'max-w-xl' | 'max-w-md'
}

export default function CrudModal({
    open,
    title,
    subtitle,
    onClose,
    footer,
    children,
    maxWidth,
}: Props) {
    return (
        <ModalBase
            isOpen={open}
            onClose={onClose || (() => {})}
            closeOnOutsideClick={!!onClose}
            maxWidth={maxWidth}
        >
            {/* Header */}
            <div className="flex-shrink-0 bg-white flex items-center justify-between px-6 py-4 border-b border-white-border">
                <div>
                    <h2 className="text-lg font-extrabold text-up-maroon">{title}</h2>
                    {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-red-700 text-xl font-bold transition cursor-pointer">
                    <FaXmark className="text-xl" />
                </button>
            </div>

            {/* Body */}
            <div className="px-8 py-6 space-y-5 overflow-y-auto bg-white">
                {children}
            </div>

            {/* Footer */}
            {footer && (
                <div className="px-6 py-4 bg-white border-white-border border-t flex-shrink-0 gap-3">
                    {footer}
                </div>
            )}
        </ModalBase>
    );
}
