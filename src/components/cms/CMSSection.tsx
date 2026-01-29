import React from 'react';

interface CMSSectionProps {
    title: string;
    children: React.ReactNode;
}

export const CMSSection: React.FC<CMSSectionProps> = ({ title, children }) => (
    <div className="space-y-4 animate-in fade-in">
        <h3 className="font-bold uppercase tracking-widest text-gold text-xs border-b border-stone-100 dark:border-stone-800 pb-2 mb-6">
            {title}
        </h3>
        {children}
    </div>
);
