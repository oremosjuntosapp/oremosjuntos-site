
import React, { useState } from 'react';
import { generateFaithCard } from '../services/geminiService';

const FaithCards: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState<string | null>(null);
  const [theme, setTheme] = useState('Paz');

  const themes = ['Paz', 'Gratidão', 'Força', 'Sabedoria', 'Esperança'];

  const handleGenerate = async (selectedTheme: string) => {
    setTheme(selectedTheme);
    setLoading(true);
    try {
      const result = await generateFaithCard(selectedTheme);
      setCard(result || 'Não foi possível gerar no momento.');
    } catch (error) {
      setCard('Erro ao conectar com o céu digital.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-stone-900 rounded-[2rem] text-white shadow-2xl border border-stone-800 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
        <span className="material-icons-outlined text-8xl">auto_awesome</span>
      </div>
      
      <div className="relative z-10 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center">
            <span className="material-icons-outlined text-gold">psychology_alt</span>
          </div>
          <h4 className="text-xl font-serif">Cards de Fé (IA)</h4>
        </div>

        <div className="flex flex-wrap gap-2">
          {themes.map(t => (
            <button 
              key={t}
              onClick={() => handleGenerate(t)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${theme === t ? 'bg-gold text-stone-900 shadow-lg' : 'bg-stone-800 text-stone-400 hover:text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="min-h-[160px] flex items-center justify-center p-6 bg-stone-950/50 rounded-2xl border border-stone-800/50 italic text-stone-300 font-serif text-lg leading-relaxed whitespace-pre-line">
          {loading ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-sans uppercase tracking-widest text-stone-500 animate-pulse">Meditando...</p>
            </div>
          ) : (
            card || "Selecione um tema para receber uma palavra personalizada para seu coração hoje."
          )}
        </div>

        <p className="text-[10px] text-stone-500 uppercase tracking-widest">
          Sugerido pela Inteligência Artificial do Oremos Juntos
        </p>
      </div>
    </div>
  );
};

export default FaithCards;
