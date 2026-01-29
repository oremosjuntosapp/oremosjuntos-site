
import React, { useState } from 'react';
import { CMSContent, FaithCardExample } from '../types';

interface CMSAdminProps {
  content: CMSContent;
  onSave: (newContent: CMSContent) => void;
  onClose: () => void;
}

const CMSAdmin: React.FC<CMSAdminProps> = ({ content, onSave, onClose }) => {
  const [editedContent, setEditedContent] = useState<CMSContent>(content);

  const handleChange = (section: keyof CMSContent, field: string, value: any) => {
    setEditedContent(prev => {
      const updatedSection = { ...(prev[section] as any) };
      
      if (field.includes('.')) {
        const [objKey, subField] = field.split('.');
        // Check if nested object exists before spreading, initializes if undefined (safety check)
        updatedSection[objKey] = updatedSection[objKey] ? { ...updatedSection[objKey], [subField]: value } : { [subField]: value };
      } else {
        updatedSection[field] = value;
      }

      return { ...prev, [section]: updatedSection };
    });
  };

  const handleGalleryItemChange = (id: string, field: keyof FaithCardExample, value: string) => {
    setEditedContent(prev => {
      const newItems = prev.gallery.items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      );
      return { ...prev, gallery: { ...prev.gallery, items: newItems } };
    });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl h-full bg-white dark:bg-stone-900 shadow-2xl overflow-y-auto p-8 animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center mb-8 pb-4 border-b dark:border-stone-800">
          <div className="flex items-center space-x-2">
            <span className="material-icons-outlined text-gold">settings</span>
            <h2 className="text-2xl font-serif dark:text-white">Gerenciador de Conteúdo</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
            <span className="material-icons-outlined">close</span>
          </button>
        </div>

        <div className="space-y-12 pb-32 no-scrollbar">
          {/* 0. Configurações Técnicas */}
          <section className="space-y-4">
            <SectionHeader title="0. Configurações & Integrações" />
            <div className="grid grid-cols-1 gap-4 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20">
              <Input label="Nova Senha do CMS" value={editedContent.settings.cmsPassword} onChange={(v) => handleChange('settings', 'cmsPassword', v)} />
              <Input label="Google Analytics ID" value={editedContent.settings.googleAnalyticsId} onChange={(v) => handleChange('settings', 'googleAnalyticsId', v)} />
              
              <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-800/30 space-y-4">
                <p className="text-[10px] font-bold text-amber-800 dark:text-amber-200 uppercase tracking-widest">CTA Apoio</p>
                <Input label="Link de Destino (Botão Apoiar)" value={editedContent.settings.supportLink} onChange={(v) => handleChange('settings', 'supportLink', v)} />
              </div>
            </div>
          </section>

          {/* 1. Hero */}
          <section className="space-y-4">
            <SectionHeader title="1. Landing Hero (Topo)" />
            <div className="grid grid-cols-1 gap-4">
              <Input label="Badge" value={editedContent.hero.badge} onChange={(v) => handleChange('hero', 'badge', v)} />
              <Input label="Título Principal" value={editedContent.hero.title} onChange={(v) => handleChange('hero', 'title', v)} />
              <TextArea label="Descrição" value={editedContent.hero.description} onChange={(v) => handleChange('hero', 'description', v)} />
              <Input label="Texto do Botão CTA" value={editedContent.hero.ctaPrimary} onChange={(v) => handleChange('hero', 'ctaPrimary', v)} />
              <Input label="Link da Imagem de Fundo (URL)" value={editedContent.hero.backgroundImage} onChange={(v) => handleChange('hero', 'backgroundImage', v)} />
            </div>
          </section>

          {/* 2. Coming Soon */}
          <section className="space-y-4">
            <SectionHeader title="2. Seção 'Em Breve'" />
            <div className="grid grid-cols-1 gap-4">
              <Input label="Título da Seção" value={editedContent.comingSoon.title} onChange={(v) => handleChange('comingSoon', 'title', v)} />
              <TextArea label="Descrição" value={editedContent.comingSoon.description} onChange={(v) => handleChange('comingSoon', 'description', v)} />
              <Input label="Texto da Data de Lançamento" value={editedContent.comingSoon.launchDateText} onChange={(v) => handleChange('comingSoon', 'launchDateText', v)} />
            </div>
          </section>

          {/* 3. Gallery */}
          <section className="space-y-4">
            <SectionHeader title="3. Galeria de Cards" />
            <div className="grid grid-cols-1 gap-4">
              <Input label="Título da Seção" value={editedContent.gallery.sectionTitle} onChange={(v) => handleChange('gallery', 'sectionTitle', v)} />
              <TextArea label="Descrição" value={editedContent.gallery.sectionDesc} onChange={(v) => handleChange('gallery', 'sectionDesc', v)} />
              
              <div className="space-y-4 mt-4">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Editar Cards Individuais</label>
                 {editedContent.gallery.items.map((item, index) => (
                    <div key={item.id} className="p-4 border border-stone-200 dark:border-stone-700 rounded-xl space-y-3">
                       <p className="text-xs font-bold text-stone-500">Card {index + 1}</p>
                       <Input label="Título do Card" value={item.title} onChange={(v) => handleGalleryItemChange(item.id, 'title', v)} />
                       <Input label="Link da Imagem (URL)" value={item.imageUrl} onChange={(v) => handleGalleryItemChange(item.id, 'imageUrl', v)} />
                    </div>
                 ))}
              </div>
            </div>
          </section>

          {/* 4. Manifesto */}
          <section className="space-y-4">
            <SectionHeader title="4. Manifesto (Sobre)" />
            <div className="grid grid-cols-1 gap-4">
              <Input label="Título" value={editedContent.manifesto.title} onChange={(v) => handleChange('manifesto', 'title', v)} />
              <TextArea label="Parágrafo 1" value={editedContent.manifesto.paragraph1} onChange={(v) => handleChange('manifesto', 'paragraph1', v)} />
              <TextArea label="Parágrafo 2" value={editedContent.manifesto.paragraph2} onChange={(v) => handleChange('manifesto', 'paragraph2', v)} />
              <Input label="Link da Imagem Lateral (URL)" value={editedContent.manifesto.image} onChange={(v) => handleChange('manifesto', 'image', v)} />
            </div>
          </section>

          {/* 5. Support Section */}
          <section className="space-y-4">
            <SectionHeader title="5. Apoio Voluntário" />
            <div className="grid grid-cols-1 gap-4">
              <Input label="Botão Principal (Flutuante)" value={editedContent.support.mainButton} onChange={(v) => handleChange('support', 'mainButton', v)} />
              <Input label="Badge" value={editedContent.support.badge} onChange={(v) => handleChange('support', 'badge', v)} />
              <TextArea label="Descrição da Seção" value={editedContent.support.description} onChange={(v) => handleChange('support', 'description', v)} />
              <div className="p-4 border border-stone-200 dark:border-stone-700 rounded-xl space-y-3 bg-stone-50 dark:bg-stone-800/50">
                <p className="text-xs font-bold text-stone-500">Card de Destaque</p>
                <Input label="Título do Card" value={editedContent.support.cardTitle} onChange={(v) => handleChange('support', 'cardTitle', v)} />
                <TextArea label="Texto do Card" value={editedContent.support.cardDescription} onChange={(v) => handleChange('support', 'cardDescription', v)} />
                <Input label="Botão do Card" value={editedContent.support.cardButton} onChange={(v) => handleChange('support', 'cardButton', v)} />
              </div>
              <Input label="Link da Imagem de Fundo (URL)" value={editedContent.support.backgroundImage} onChange={(v) => handleChange('support', 'backgroundImage', v)} />
            </div>
          </section>
          
          {/* 6. Footer CTA */}
          <section className="space-y-4">
            <SectionHeader title="6. Chamada Final (Rodapé)" />
            <div className="grid grid-cols-1 gap-4">
              <Input label="Título Grande" value={editedContent.footerCta.title} onChange={(v) => handleChange('footerCta', 'title', v)} />
              <TextArea label="Descrição" value={editedContent.footerCta.description} onChange={(v) => handleChange('footerCta', 'description', v)} />
              <Input label="Texto do Botão" value={editedContent.footerCta.button} onChange={(v) => handleChange('footerCta', 'button', v)} />
              <Input label="Subtexto" value={editedContent.footerCta.subtext} onChange={(v) => handleChange('footerCta', 'subtext', v)} />
              <Input label="Link Textura de Fundo (URL)" value={editedContent.footerCta.backgroundImage} onChange={(v) => handleChange('footerCta', 'backgroundImage', v)} />
            </div>
          </section>

          {/* 7. Footer & Pages */}
          <section className="space-y-4">
            <SectionHeader title="7. Rodapé e Páginas Legais" />
            <div className="grid grid-cols-1 gap-4">
               <Input label="Link Exibido do Site" value={editedContent.footer.websiteLink} onChange={(v) => handleChange('footer', 'websiteLink', v)} />
               <Input label="Texto de Copyright" value={editedContent.footer.copyrightText} onChange={(v) => handleChange('footer', 'copyrightText', v)} />
               <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 space-y-4">
                  <p className="text-xs font-bold text-stone-500">Conteúdo dos Modais</p>
                  <TextArea label="Texto Privacidade" value={editedContent.pages.privacy} onChange={(v) => handleChange('pages', 'privacy', v)} />
                  <TextArea label="Texto Termos de Uso" value={editedContent.pages.terms} onChange={(v) => handleChange('pages', 'terms', v)} />
                  <TextArea label="Texto Contato" value={editedContent.pages.contact} onChange={(v) => handleChange('pages', 'contact', v)} />
               </div>
            </div>
          </section>

          {/* 9. App Features (Bottom Nav Modals) */}
          <section className="space-y-4">
            <SectionHeader title="8. Funcionalidades do App (Modais)" />
            <div className="grid grid-cols-1 gap-6">
               <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl space-y-3">
                 <p className="text-xs font-bold text-stone-500 uppercase">Item: Altar</p>
                 <Input label="Título" value={editedContent.appFeatures.altar.title} onChange={(v) => handleChange('appFeatures', 'altar.title', v)} />
                 <TextArea label="Descrição" value={editedContent.appFeatures.altar.description} onChange={(v) => handleChange('appFeatures', 'altar.description', v)} />
                 <Input label="Texto de Status" value={editedContent.appFeatures.altar.statusText} onChange={(v) => handleChange('appFeatures', 'altar.statusText', v)} />
               </div>

               <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl space-y-3">
                 <p className="text-xs font-bold text-stone-500 uppercase">Item: Grupos</p>
                 <Input label="Título" value={editedContent.appFeatures.groups.title} onChange={(v) => handleChange('appFeatures', 'groups.title', v)} />
                 <TextArea label="Descrição" value={editedContent.appFeatures.groups.description} onChange={(v) => handleChange('appFeatures', 'groups.description', v)} />
                 <Input label="Texto de Status" value={editedContent.appFeatures.groups.statusText} onChange={(v) => handleChange('appFeatures', 'groups.statusText', v)} />
               </div>

               <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl space-y-3">
                 <p className="text-xs font-bold text-stone-500 uppercase">Item: Jornada</p>
                 <Input label="Título" value={editedContent.appFeatures.journey.title} onChange={(v) => handleChange('appFeatures', 'journey.title', v)} />
                 <TextArea label="Descrição" value={editedContent.appFeatures.journey.description} onChange={(v) => handleChange('appFeatures', 'journey.description', v)} />
                 <Input label="Texto de Status" value={editedContent.appFeatures.journey.statusText} onChange={(v) => handleChange('appFeatures', 'journey.statusText', v)} />
               </div>

               <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl space-y-3">
                 <p className="text-xs font-bold text-stone-500 uppercase">Item: Guardião</p>
                 <Input label="Título" value={editedContent.appFeatures.guardian.title} onChange={(v) => handleChange('appFeatures', 'guardian.title', v)} />
                 <TextArea label="Descrição" value={editedContent.appFeatures.guardian.description} onChange={(v) => handleChange('appFeatures', 'guardian.description', v)} />
                 <Input label="Texto de Status" value={editedContent.appFeatures.guardian.statusText} onChange={(v) => handleChange('appFeatures', 'guardian.statusText', v)} />
               </div>
            </div>
          </section>
        </div>

        <div className="fixed bottom-0 right-0 w-full max-w-2xl p-6 bg-white dark:bg-stone-900 border-t dark:border-stone-800 flex justify-end space-x-4 z-10 shadow-2xl">
          <button onClick={onClose} className="px-6 py-2 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors">Cancelar</button>
          <button onClick={() => onSave(editedContent)} className="px-8 py-2 bg-primary text-white rounded-full font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity shadow-lg">Publicar Alterações</button>
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ title }: { title: string }) => (
  <h3 className="font-bold uppercase tracking-widest text-gold text-xs border-b border-stone-100 dark:border-stone-800 pb-2 mb-4 mt-8">{title}</h3>
);

const Input = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="flex flex-col space-y-1">
    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{label}</label>
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 rounded-lg p-2 text-sm focus:ring-gold focus:border-gold dark:text-white transition-colors" />
  </div>
);

const TextArea = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="flex flex-col space-y-1">
    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{label}</label>
    <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 rounded-lg p-2 text-sm focus:ring-gold focus:border-gold dark:text-white transition-colors" />
  </div>
);

export default CMSAdmin;
