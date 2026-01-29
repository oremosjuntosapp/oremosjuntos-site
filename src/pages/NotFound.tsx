import React from 'react';
import { Link } from 'react-router-dom';


import { CMSContent } from '../types';

interface NotFoundProps {
    content?: CMSContent['notFound'];
}

const NotFound: React.FC<NotFoundProps> = ({ content }) => {
    // Fallback if content is not loaded yet
    const data = content || {
        title: "404",
        subtitle: "Página não encontrada",
        message: "Aparentemente você se perdeu no caminho. A página que você está procurando não existe ou foi movida.",
        buttonText: "Voltar para o Início",
        footerText: "Oremos Juntos"
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark text-primary dark:text-gray-100 p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-clay/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="text-center z-10 max-w-md mx-auto">
                <h1 className="font-display text-9xl font-bold text-gold mb-4 animate-pulse">
                    {data.title}
                </h1>

                <h2 className="font-display text-3xl md:text-4xl mb-6">
                    {data.subtitle}
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-8 font-light text-lg">
                    {data.message}
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-primary dark:bg-white text-white dark:text-primary px-8 py-3 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300 font-medium group"
                >
                    <span className="material-icons-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    {data.buttonText}
                </Link>
            </div>

            <div className="absolute bottom-8 text-sm text-gray-400 font-light">
                {data.footerText}
            </div>
        </div>
    );
};

export default NotFound;
