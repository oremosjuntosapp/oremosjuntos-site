
import React from 'react';
import { FaithCardExample } from '../types';

interface CardGalleryProps {
  title: string;
  description: string;
  items: FaithCardExample[];
}

const CardGallery: React.FC<CardGalleryProps> = ({ title, description, items }) => {
  const [shareFallbackItem, setShareFallbackItem] = React.useState<FaithCardExample | null>(null);

  const handleShare = async (item: FaithCardExample) => {
    if (navigator.share) {
      try {
        // Try to fetch image to share as file
        const response = await fetch(item.imageUrl);
        const blob = await response.blob();
        const file = new File([blob], "oremos-juntos-card.jpg", { type: "image/jpeg" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: item.title,
            text: item.footerText || "Oremos Juntos",
          });
          return;
        }
      } catch (e) {
        console.warn("Failed to share file, falling back to URL/text", e);
      }

      // Fallback to sharing URL/Text if file sharing fails or not supported
      try {
        await navigator.share({
          title: item.title,
          text: `${item.title} - ${item.footerText || "Oremos Juntos"}`,
          url: item.imageUrl
        });
      } catch (e) {
        console.warn("Share failed or canceled", e);
      }
    } else {
      // Fallback for desktop/unsupported browsers
      setShareFallbackItem(item);
    }
  };

  const copyToClipboard = () => {
    if (shareFallbackItem) {
      navigator.clipboard.writeText(shareFallbackItem.imageUrl).then(() => {
        alert("Link copiado para a área de transferência!");
        setShareFallbackItem(null);
      });
    }
  };

  const shareToWhatsApp = () => {
    if (shareFallbackItem) {
      const text = encodeURIComponent(`${shareFallbackItem.title} - ${shareFallbackItem.footerText || "Oremos Juntos"}`);
      const url = encodeURIComponent(shareFallbackItem.imageUrl);
      window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
      setShareFallbackItem(null);
    }
  };

  return (
    <section className="py-32 px-6 bg-background-light dark:bg-background-dark relative">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-6">
          <h2 className="text-4xl md:text-6xl font-display text-stone-900 dark:text-white">{title}</h2>
          <p className="text-stone-500 dark:text-stone-400 text-lg md:text-xl font-serif italic max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col space-y-4">
              <div className="group relative p-[1px] rounded-3xl bg-gradient-to-b from-stone-200 via-stone-100 to-transparent dark:from-stone-800 dark:via-stone-900 overflow-hidden hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-all duration-500">
                <div className="relative aspect-square overflow-hidden rounded-[calc(1.5rem-1px)] bg-stone-100 dark:bg-stone-900">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="absolute top-0 right-0 p-6 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
                    <button
                      onClick={() => handleShare(item)}
                      className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-[#D4AF37] hover:text-stone-950 transition-all border border-white/10 flex items-center gap-2"
                      title="Compartilhar"
                    >
                      <span className="material-icons-outlined text-lg">share</span>
                      <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline-block">Compartilhar</span>
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-stone-400 font-serif italic opacity-60">{item.footerText || "Oremos Juntos"}</p>
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

      {shareFallbackItem && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-stone-900/90 backdrop-blur-md" onClick={() => setShareFallbackItem(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-stone-900 rounded-[2rem] p-8 shadow-2xl overflow-hidden text-center space-y-6">
            <h3 className="text-2xl font-display italic text-stone-900 dark:text-white">Compartilhar</h3>
            <div className="flex flex-col gap-4">
              <button onClick={shareToWhatsApp} className="w-full py-4 rounded-xl bg-[#25D366] text-white font-bold tracking-widest uppercase text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <span>WhatsApp</span>
              </button>
              <button onClick={copyToClipboard} className="w-full py-4 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white font-bold tracking-widest uppercase text-xs hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors flex items-center justify-center gap-2">
                <span>Copiar Link</span>
              </button>
            </div>
            <button onClick={() => setShareFallbackItem(null)} className="text-xs font-bold tracking-widest uppercase text-stone-400 hover:text-stone-600 dark:hover:text-stone-200">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default CardGallery;
