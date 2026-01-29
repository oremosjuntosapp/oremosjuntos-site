
import React from 'react';
import { FaithCardExample } from '../types';

interface CardGalleryProps {
  title: string;
  description: string;
  items: FaithCardExample[];
}

const CardGallery: React.FC<CardGalleryProps> = ({ title, description, items }) => {
  return (
    <section className="py-48 px-6 bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto space-y-24">
        <div className="text-center space-y-6">
          <h2 className="text-6xl md:text-8xl font-display text-stone-900 dark:text-white">{title}</h2>
          <p className="text-stone-500 dark:text-stone-400 text-xl md:text-2xl font-serif italic max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div key={item.id} className="group relative aspect-square overflow-hidden rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-700 bg-stone-100 dark:bg-stone-800">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-0 left-0 p-8 w-full text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-gold mb-2">Exemplo</p>
                <h4 className="text-3xl font-display italic">{item.title}</h4>
                <div className="mt-6 flex flex-col items-start space-y-2 border-t border-white/20 pt-4 opacity-0 group-hover:opacity-100 transition-opacity delay-200">
                   <p className="text-[8px] font-bold tracking-[0.2em] uppercase">Oremos Juntos</p>
                   <p className="text-[6px] tracking-widest text-white/60">www.oremosjuntos.com.br</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-12">
           <div className="px-8 py-3 rounded-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center space-x-4">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
              <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">Mais modelos em desenvolvimento</span>
           </div>
        </div>
      </div>
    </section>
  );
};

export default CardGallery;
