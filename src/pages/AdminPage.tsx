
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CMSContent } from '../types';
import CMSAdmin from '../components/CMSAdmin';

interface AdminPageProps {
    content: CMSContent;
    onSave: (newContent: CMSContent) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ content, onSave }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === content.settings.cmsPassword) {
            setIsAuthenticated(true);
            setError(false);
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-stone-100 dark:bg-stone-950">
                <div className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-[2.5rem] p-12 shadow-2xl text-center space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="space-y-4">
                        <span className="material-icons-outlined text-4xl text-gold">lock</span>
                        <h2 className="text-3xl font-display italic text-stone-900 dark:text-white">Acesso Restrito</h2>
                        <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Digite a senha para gerenciar o conteúdo</p>
                    </div>
                    <form onSubmit={handleLoginSubmit} className="space-y-6">
                        <input
                            autoFocus
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Senha de acesso"
                            className={`w-full px-6 py-4 rounded-xl bg-stone-50 dark:bg-stone-800 border-none text-center focus:ring-2 focus:ring-gold dark:text-white ${error ? 'ring-2 ring-red-500 animate-shake' : ''}`}
                        />
                        <button type="submit" className="w-full py-4 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-gold hover:text-white transition-all shadow-lg">
                            Entrar no Painel
                        </button>
                    </form>
                    <button onClick={() => navigate('/')} className="text-[10px] font-bold tracking-widest uppercase text-stone-400 hover:text-stone-600 dark:hover:text-stone-200">
                        Voltar ao Site
                    </button>
                </div>
            </div>
        );
    }

    return (
        <CMSAdmin
            content={content}
            onSave={onSave}
            onClose={() => navigate('/')}
        />
    );
};

export default AdminPage;
