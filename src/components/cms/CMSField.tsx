import React from 'react';

interface InputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    className?: string;
}

export const Input: React.FC<InputProps> = ({ label, value, onChange, type = "text", className = "" }) => (
    <div className={`flex flex-col space-y-1 ${className}`}>
        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 rounded-lg p-3 text-sm focus:ring-gold focus:border-gold dark:text-white transition-colors"
        />
    </div>
);

interface TextAreaProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    rows?: number;
    className?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, value, onChange, rows = 4, className = "" }) => (
    <div className={`flex flex-col space-y-1 ${className}`}>
        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{label}</label>
        <textarea
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 rounded-lg p-3 text-sm focus:ring-gold focus:border-gold dark:text-white transition-colors"
        />
    </div>
);

interface ToggleProps {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
    className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ label, value, onChange, className = "" }) => (
    <div className={`flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-800 ${className}`}>
        <label className="text-xs font-bold uppercase tracking-widest text-stone-500">{label}</label>
        <button
            onClick={() => onChange(!value)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 ${value ? 'bg-gold' : 'bg-stone-300 dark:bg-stone-700'}`}
        >
            <span
                className={`${value ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
        </button>
    </div>
);
