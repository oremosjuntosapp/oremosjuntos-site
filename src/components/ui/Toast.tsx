
import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 5000 }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const typeConfig = {
        success: {
            icon: 'check_circle',
            bg: 'bg-white/80 dark:bg-stone-900/80',
            border: 'border-gold/50',
            iconColor: 'text-gold',
        },
        error: {
            icon: 'error_outline',
            bg: 'bg-white/80 dark:bg-stone-900/80',
            border: 'border-red-500/50',
            iconColor: 'text-red-500',
        },
        info: {
            icon: 'info',
            bg: 'bg-white/80 dark:bg-stone-900/80',
            border: 'border-stone-400/50',
            iconColor: 'text-stone-400',
        }
    };

    const config = typeConfig[type];

    return (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4 px-6 py-4 rounded-2xl ${config.bg} ${config.border} border backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <span className={`material-icons-outlined ${config.iconColor}`}>{config.icon}</span>
            <p className="text-sm font-serif italic text-stone-900 dark:text-stone-100">{message}</p>
            <button onClick={onClose} className="ml-2 p-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
                <span className="material-icons-outlined text-sm text-stone-400">close</span>
            </button>
        </div>
    );
};
