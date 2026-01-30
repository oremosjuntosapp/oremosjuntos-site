
import React, { useState, useEffect } from 'react';
import { CMSContent, Lead } from '../types';
import { supabase } from '../supabaseClient';
import { Input, TextArea, Toggle } from './cms/CMSField';
import { CMSSection } from './cms/CMSSection';
import { useNotification } from './ui/NotificationContext';

interface CMSAdminProps {
  content: CMSContent;
  onSave: (newContent: CMSContent) => void;
  onClose: () => void;
}

const CMSAdmin: React.FC<CMSAdminProps> = ({ content, onSave, onClose }) => {
  const [editedContent, setEditedContent] = useState<CMSContent>(content);
  const [activeTab, setActiveTab] = useState<keyof CMSContent | 'config' | 'leads'>('hero');
  const [leads, setLeads] = useState<Lead[]>([]);
  const { showToast } = useNotification();

  useEffect(() => {
    if (activeTab === 'leads') {
      fetchLeads();
    }
  }, [activeTab]);

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      showToast('Erro ao carregar lista de interesse.', 'error');
      console.error('Fetch Leads Error:', error);
    } else {
      setLeads(data || []);
    }
  };

  const handleToggleLeadContacted = async (leadId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('leads')
      .update({ contacted: !currentStatus })
      .eq('id', leadId);

    if (error) {
      showToast('Erro ao atualizar status.', 'error');
    } else {
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, contacted: !currentStatus } : l));
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Tem certeza que deseja excluir este contato?')) return;

    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', leadId);

    if (error) {
      showToast('Erro ao excluir contato.', 'error');
    } else {
      setLeads(prev => prev.filter(l => l.id !== leadId));
    }
  };

  const handleChange = (section: keyof CMSContent, field: string, value: any) => {
    setEditedContent(prev => {
      const updatedSection = { ...(prev[section] as any) };

      if (field.includes('.')) {
        const [objKey, subField] = field.split('.');
        updatedSection[objKey] = updatedSection[objKey] ? { ...updatedSection[objKey], [subField]: value } : { [subField]: value };
      } else {
        updatedSection[field] = value;
      }

      return { ...prev, [section]: updatedSection };
    });
  };

  // --- Generic List Handlers ---

  const handleListItemChange = (section: keyof CMSContent, listKey: string, itemId: string, field: string, value: any) => {
    setEditedContent(prev => {
      // @ts-ignore
      const oldList = prev[section][listKey] as any[] || [];
      const newList = oldList.map(item => item.id === itemId ? { ...item, [field]: value } : item);
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [listKey]: newList
        }
      };
    });
  };

  const handleAddListItem = (section: keyof CMSContent, listKey: string, initialItem: any) => {
    setEditedContent(prev => {
      // @ts-ignore
      const oldList = prev[section][listKey] as any[] || [];
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [listKey]: [...oldList, { ...initialItem, id: Date.now().toString() }]
        }
      };
    });
  };

  const handleRemoveListItem = (section: keyof CMSContent, listKey: string, itemId: string) => {
    setEditedContent(prev => {
      // @ts-ignore
      const oldList = prev[section][listKey] as any[] || [];
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [listKey]: oldList.filter(item => item.id !== itemId)
        }
      };
    });
  };

  const handleMoveListItem = (section: keyof CMSContent, listKey: string, itemId: string, direction: 'up' | 'down') => {
    setEditedContent(prev => {
      // @ts-ignore
      const oldList = [...(prev[section][listKey] as any[] || [])];
      const index = oldList.findIndex(item => item.id === itemId);
      if (index === -1) return prev;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= oldList.length) return prev;

      [oldList[index], oldList[newIndex]] = [oldList[newIndex], oldList[index]];

      return {
        ...prev,
        [section]: {
          ...prev[section],
          [listKey]: oldList
        }
      };
    });
  };

  const handleMoveSection = (direction: 'up' | 'down', index: number) => {
    setEditedContent(prev => {
      const newOrder = [...prev.sectionOrder];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newOrder.length) return prev;

      [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
      return { ...prev, sectionOrder: newOrder };
    });
  };

  // --- Generic Upload Handlers ---

  const uploadFileToSupabase = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      return data?.publicUrl || null;
    } catch (error) {
      showToast('Ocorreu um problema ao enviar a imagem. Tente novamente.', 'error');
      console.error('Upload Error:', error);
      return null;
    }
  };

  const handleSingleFieldUpload = async (section: keyof CMSContent, field: string, file: File) => {
    const publicUrl = await uploadFileToSupabase(file);
    if (publicUrl) {
      handleChange(section, field, publicUrl);
    }
  };

  const handleImageUpload = async (id: string, file: File) => {
    const publicUrl = await uploadFileToSupabase(file);
    if (publicUrl) {
      handleListItemChange('gallery', 'items', id, 'imageUrl', publicUrl);
      handleListItemChange('gallery', 'items', id, 'title', file.name.split('.')[0]);
    }
  };


  const tabs = [
    { id: 'leads', label: 'Lista de Interesse', icon: 'people' },
    { id: 'config', label: 'Configurações', icon: 'settings' },
    { id: 'layout', label: 'Ordem das Seções', icon: 'reorder' }, // New Hierarchy Tab
    { id: 'hero', label: 'Hero (Topo)', icon: 'home' },
    { id: 'comingSoon', label: 'Em Breve', icon: 'schedule' },
    { id: 'gallery', label: 'Galeria', icon: 'collections' },
    { id: 'manifesto', label: 'Manifesto', icon: 'article' },
    { id: 'features', label: 'Recursos', icon: 'star' },
    { id: 'appFeatures', label: 'App Features', icon: 'smartphone' }, // New tab
    { id: 'testimonial', label: 'Depoimento', icon: 'format_quote' },
    { id: 'support', label: 'Apoio', icon: 'volunteer_activism' },
    { id: 'footerCta', label: 'CTA Final', icon: 'call_to_action' },
    { id: 'pages', label: 'Páginas/Footer', icon: 'layers' },
    { id: 'notFound', label: 'Página 404', icon: 'error_outline' },
  ];

  const renderImageField = (label: string, value: string, section: keyof CMSContent, field: string) => (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{label} (Upload ou URL)</label>
      <div className="flex flex-col gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleSingleFieldUpload(section, field, e.target.files[0])}
          className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-gold hover:file:bg-amber-100 dark:file:bg-amber-900/40 dark:file:text-gold cursor-pointer"
        />
        <Input label="Ou cole a URL direta" value={value} onChange={(v) => handleChange(section, field, v)} />
      </div>
      {value && <div className="mt-2 h-32 w-full bg-stone-100 dark:bg-stone-800 rounded-lg overflow-hidden relative border border-stone-200 dark:border-stone-700">
        <img src={value} alt="Preview" className="w-full h-full object-cover" />
      </div>}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'config':
        return (
          <CMSSection title="Configurações & Integrações">
            <div className="grid grid-cols-1 gap-4 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20">
              <Input label="Nova Senha do CMS" value={editedContent.settings.cmsPassword} onChange={(v) => handleChange('settings', 'cmsPassword', v)} />
              <Input label="Google Analytics ID" value={editedContent.settings.googleAnalyticsId} onChange={(v) => handleChange('settings', 'googleAnalyticsId', v)} />
              <Input label="Link de Destino (Botão Apoiar)" value={editedContent.settings.supportLink} onChange={(v) => handleChange('settings', 'supportLink', v)} />
            </div>
          </CMSSection>
        );
      case 'layout':
        return (
          <CMSSection title="Hierarquia do Site (Drag & Drop em breve)">
            <p className="text-xs text-stone-500 mb-6 px-4">Defina aqui a ordem em que as seções aparecem na Landing Page.</p>
            <div className="space-y-2">
              {editedContent.sectionOrder.map((sectionKey, index) => (
                <div key={sectionKey} className="flex items-center justify-between p-4 bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-stone-300 w-4">#{index + 1}</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                      {tabs.find(t => t.id === sectionKey)?.label || sectionKey}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleMoveSection('up', index)}
                      disabled={index === 0}
                      className="p-1 hover:bg-stone-100 dark:hover:bg-stone-700 rounded disabled:opacity-20 translate-y-[1px]"
                    >
                      <span className="material-icons-outlined text-sm">expand_less</span>
                    </button>
                    <button
                      onClick={() => handleMoveSection('down', index)}
                      disabled={index === editedContent.sectionOrder.length - 1}
                      className="p-1 hover:bg-stone-100 dark:hover:bg-stone-700 rounded disabled:opacity-20 translate-y-[1px]"
                    >
                      <span className="material-icons-outlined text-sm">expand_more</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CMSSection>
        );
      case 'hero':
        return (
          <CMSSection title="Landing Hero (Topo)">
            <Toggle label="Seção Visível" value={editedContent.hero.visible} onChange={(v) => handleChange('hero', 'visible', v)} />
            <Input label="Badge" value={editedContent.hero.badge} onChange={(v) => handleChange('hero', 'badge', v)} />
            <Input label="Título Principal" value={editedContent.hero.title} onChange={(v) => handleChange('hero', 'title', v)} />
            <TextArea label="Descrição" value={editedContent.hero.description} onChange={(v) => handleChange('hero', 'description', v)} />
            <Input label="Texto do Botão CTA" value={editedContent.hero.ctaPrimary} onChange={(v) => handleChange('hero', 'ctaPrimary', v)} />
            {renderImageField("Imagem de Fundo", editedContent.hero.backgroundImage, 'hero', 'backgroundImage')}
          </CMSSection>
        );

      case 'comingSoon':
        return (
          <CMSSection title="Seção 'Em Breve'">
            <Toggle label="Seção Visível" value={editedContent.comingSoon.visible} onChange={(v) => handleChange('comingSoon', 'visible', v)} />
            <Input label="Título da Seção" value={editedContent.comingSoon.title} onChange={(v) => handleChange('comingSoon', 'title', v)} />
            <TextArea label="Descrição" value={editedContent.comingSoon.description} onChange={(v) => handleChange('comingSoon', 'description', v)} />
            <Input label="Texto da Data de Lançamento" value={editedContent.comingSoon.launchDateText} onChange={(v) => handleChange('comingSoon', 'launchDateText', v)} />
          </CMSSection>
        );

      case 'gallery':
        return (
          <CMSSection title="Galeria de Cards">
            <Toggle label="Seção Visível" value={editedContent.gallery.visible} onChange={(v) => handleChange('gallery', 'visible', v)} />
            <Input label="Título da Seção" value={editedContent.gallery.sectionTitle} onChange={(v) => handleChange('gallery', 'sectionTitle', v)} />
            <TextArea label="Descrição" value={editedContent.gallery.sectionDesc} onChange={(v) => handleChange('gallery', 'sectionDesc', v)} />

            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase text-stone-500">Cards ({editedContent.gallery?.items?.length || 0})</h4>
                <button onClick={() => handleAddListItem('gallery', 'items', { title: "Novo Card", imageUrl: "" })} className="text-xs font-bold text-gold hover:underline uppercase">+ Adicionar Card</button>
              </div>

              {editedContent.gallery?.items?.map((item, index) => (
                <div key={item.id} className="p-4 border border-stone-200 dark:border-stone-700 rounded-xl space-y-3 relative group bg-white dark:bg-stone-800">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-stone-300">#{index + 1}</span>
                      <button onClick={() => handleMoveListItem('gallery', 'items', item.id, 'up')} disabled={index === 0} className="p-1 hover:bg-stone-100 dark:hover:bg-stone-700 rounded disabled:opacity-20"><span className="material-icons-outlined text-xs">expand_less</span></button>
                      <button onClick={() => handleMoveListItem('gallery', 'items', item.id, 'down')} disabled={index === (editedContent.gallery?.items?.length || 0) - 1} className="p-1 hover:bg-stone-100 dark:hover:bg-stone-700 rounded disabled:opacity-20"><span className="material-icons-outlined text-xs">expand_more</span></button>
                    </div>
                    <button onClick={() => handleRemoveListItem('gallery', 'items', item.id)} className="text-red-400 hover:text-red-600 p-1"><span className="material-icons-outlined text-sm">delete</span></button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Imagem</label>
                    <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(item.id, e.target.files[0])} className="text-xs" />
                    <Input label="URL da Imagem" value={item.imageUrl} onChange={(v) => handleListItemChange('gallery', 'items', item.id, 'imageUrl', v)} />
                  </div>
                  <Input label="Título" value={item.title} onChange={(v) => handleListItemChange('gallery', 'items', item.id, 'title', v)} />
                  <TextArea label="Legenda" value={item.footerText || ''} onChange={(v) => handleListItemChange('gallery', 'items', item.id, 'footerText', v)} />
                </div>
              ))}
            </div>
          </CMSSection>
        );

      case 'manifesto':
        return (
          <CMSSection title="Manifesto (Sobre)">
            <Toggle label="Seção Visível" value={editedContent.manifesto.visible} onChange={(v) => handleChange('manifesto', 'visible', v)} />
            <Input label="Título" value={editedContent.manifesto.title} onChange={(v) => handleChange('manifesto', 'title', v)} />
            <TextArea label="Parágrafo 1" value={editedContent.manifesto.paragraph1} onChange={(v) => handleChange('manifesto', 'paragraph1', v)} />
            <TextArea label="Parágrafo 2" value={editedContent.manifesto.paragraph2} onChange={(v) => handleChange('manifesto', 'paragraph2', v)} />
            {renderImageField("Imagem Lateral", editedContent.manifesto.image, 'manifesto', 'image')}
          </CMSSection>
        );

      case 'features':
        return (
          <CMSSection title="Recursos (Lista Dinâmica)">
            <Toggle label="Seção Visível" value={editedContent.features.visible} onChange={(v) => handleChange('features', 'visible', v)} />
            <Input label="Título da Seção" value={editedContent.features.sectionTitle} onChange={(v) => handleChange('features', 'sectionTitle', v)} />
            <Input label="Badge da Seção" value={editedContent.features.sectionBadge} onChange={(v) => handleChange('features', 'sectionBadge', v)} />

            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase text-stone-500">Itens ({editedContent.features?.items?.length || 0})</h4>
                <button onClick={() => handleAddListItem('features', 'items', { title: "Novo Recurso", desc: "Descrição", icon: "star" })} className="text-xs font-bold text-gold hover:underline uppercase">+ Adicionar Recurso</button>
              </div>
              {editedContent.features?.items?.map((item, index) => (
                <div key={item.id} className="p-4 border border-stone-200 dark:border-stone-700 rounded-xl space-y-3 bg-stone-50 dark:bg-stone-800/30">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-stone-300">#{index + 1}</span>
                      <button onClick={() => handleMoveListItem('features', 'items', item.id, 'up')} disabled={index === 0} className="p-1 hover:bg-stone-100 dark:hover:bg-stone-700 rounded disabled:opacity-20"><span className="material-icons-outlined text-xs">expand_less</span></button>
                      <button onClick={() => handleMoveListItem('features', 'items', item.id, 'down')} disabled={index === (editedContent.features?.items?.length || 0) - 1} className="p-1 hover:bg-stone-100 dark:hover:bg-stone-700 rounded disabled:opacity-20"><span className="material-icons-outlined text-xs">expand_more</span></button>
                    </div>
                    <button onClick={() => handleRemoveListItem('features', 'items', item.id)} className="text-red-400 hover:text-red-600 p-1"><span className="material-icons-outlined text-sm">delete</span></button>
                  </div>
                  <Input label="Título" value={item.title} onChange={(v) => handleListItemChange('features', 'items', item.id, 'title', v)} />
                  <TextArea label="Descrição" value={item.desc} onChange={(v) => handleListItemChange('features', 'items', item.id, 'desc', v)} />
                  <Input label="Ícone (Material Icons)" value={item.icon} onChange={(v) => handleListItemChange('features', 'items', item.id, 'icon', v)} />
                </div>
              ))}
            </div>
          </CMSSection>
        );

      case 'appFeatures':
        return (
          <CMSSection title="Funcionalidades do App (Modais Dinâmicos)">
            <Toggle label="App Features Visível (Navegação Mobile)" value={editedContent.appFeatures.visible} onChange={(v) => handleChange('appFeatures', 'visible', v)} className="mb-6" />
            <div className="p-6 bg-stone-50 dark:bg-stone-800/30 rounded-xl mb-8 space-y-4 border border-stone-100 dark:border-stone-800">
              <h3 className="text-sm font-bold uppercase text-stone-500">Showcase (Desktop)</h3>
              <Toggle label="Showcase Visível" value={editedContent.appShowcase.visible} onChange={(v) => handleChange('appShowcase', 'visible', v)} />
              <Input label="Título da Seção de App" value={editedContent.appShowcase?.title || ''} onChange={(v) => handleChange('appShowcase', 'title', v)} />
              <TextArea label="Descrição do App" value={editedContent.appShowcase?.description || ''} onChange={(v) => handleChange('appShowcase', 'description', v)} />
              <Input label="URL do Vídeo (Opcional)" value={editedContent.appShowcase?.videoUrl || ''} onChange={(v) => handleChange('appShowcase', 'videoUrl', v)} />
              {renderImageField("Imagem/Screenshot", editedContent.appShowcase?.screenImage || '', 'appShowcase', 'screenImage')}
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase text-stone-500">Funcionalidades ({editedContent.appFeatures?.items?.length || 0})</h4>
                <button onClick={() => handleAddListItem('appFeatures', 'items', { title: "Nova Funcionalidade", description: "Descrição...", statusText: "Em Breve", icon: "extension", key: "new" })} className="text-xs font-bold text-gold hover:underline uppercase">+ Adicionar</button>
              </div>
              {editedContent.appFeatures?.items?.map((item, index) => (
                <div key={item.id} className="p-4 border border-stone-200 dark:border-stone-700 rounded-xl space-y-3 bg-stone-50 dark:bg-stone-800/30">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-stone-300">#{index + 1}</span>
                      <button onClick={() => handleMoveListItem('appFeatures', 'items', item.id, 'up')} disabled={index === 0} className="p-1 hover:bg-stone-100 dark:hover:bg-stone-700 rounded disabled:opacity-20"><span className="material-icons-outlined text-xs">expand_less</span></button>
                      <button onClick={() => handleMoveListItem('appFeatures', 'items', item.id, 'down')} disabled={index === (editedContent.appFeatures?.items?.length || 0) - 1} className="p-1 hover:bg-stone-100 dark:hover:bg-stone-700 rounded disabled:opacity-20"><span className="material-icons-outlined text-xs">expand_more</span></button>
                    </div>
                    <button onClick={() => handleRemoveListItem('appFeatures', 'items', item.id)} className="text-red-400 hover:text-red-600 p-1"><span className="material-icons-outlined text-sm">delete</span></button>
                  </div>
                  <Input label="Título" value={item.title} onChange={(v) => handleListItemChange('appFeatures', 'items', item.id, 'title', v)} />
                  <TextArea label="Descrição" value={item.description} onChange={(v) => handleListItemChange('appFeatures', 'items', item.id, 'description', v)} />
                  <Input label="Texto de Status" value={item.statusText} onChange={(v) => handleListItemChange('appFeatures', 'items', item.id, 'statusText', v)} />
                  <Input label="Ícone" value={item.icon} onChange={(v) => handleListItemChange('appFeatures', 'items', item.id, 'icon', v)} />
                </div>
              ))}
            </div>
          </CMSSection>
        );

      case 'testimonial':
        return (
          <CMSSection title="Depoimento (Testimonial)">
            <Toggle label="Seção Visível" value={editedContent.testimonial.visible} onChange={(v) => handleChange('testimonial', 'visible', v)} />
            <TextArea label="Frase do Depoimento" value={editedContent.testimonial.quote} onChange={(v) => handleChange('testimonial', 'quote', v)} />
            <Input label="Autor" value={editedContent.testimonial.author} onChange={(v) => handleChange('testimonial', 'author', v)} />
            <Input label="Cargo/Role" value={editedContent.testimonial.role} onChange={(v) => handleChange('testimonial', 'role', v)} />
            {renderImageField("Foto do Autor", editedContent.testimonial.avatar, 'testimonial', 'avatar')}
          </CMSSection>
        );

      case 'support':
        return (
          <CMSSection title="Apoio Voluntário">
            <Toggle label="Seção Visível" value={editedContent.support.visible} onChange={(v) => handleChange('support', 'visible', v)} />
            <Input label="Botão Principal" value={editedContent.support.mainButton} onChange={(v) => handleChange('support', 'mainButton', v)} />
            <Input label="Badge" value={editedContent.support.badge} onChange={(v) => handleChange('support', 'badge', v)} />
            <TextArea label="Descrição" value={editedContent.support.description} onChange={(v) => handleChange('support', 'description', v)} />

            <div className="p-4 border border-stone-200 dark:border-stone-700 rounded-xl space-y-3 mt-4">
              <p className="text-xs font-bold text-stone-500">Card de Destaque</p>
              <Input label="Título" value={editedContent.support.cardTitle} onChange={(v) => handleChange('support', 'cardTitle', v)} />
              <TextArea label="Texto" value={editedContent.support.cardDescription} onChange={(v) => handleChange('support', 'cardDescription', v)} />
              <Input label="Botão" value={editedContent.support.cardButton} onChange={(v) => handleChange('support', 'cardButton', v)} />
            </div>
            {renderImageField("Imagem de Fundo", editedContent.support.backgroundImage, 'support', 'backgroundImage')}
          </CMSSection>
        );

      case 'footerCta':
        return (
          <CMSSection title="Chamada Final (Rodapé)">
            <Toggle label="Seção Visível" value={editedContent.footerCta.visible} onChange={(v) => handleChange('footerCta', 'visible', v)} />
            <Input label="Título Grande" value={editedContent.footerCta.title} onChange={(v) => handleChange('footerCta', 'title', v)} />
            <TextArea label="Descrição" value={editedContent.footerCta.description} onChange={(v) => handleChange('footerCta', 'description', v)} />
            <Input label="Texto do Botão" value={editedContent.footerCta.button} onChange={(v) => handleChange('footerCta', 'button', v)} />
            <Input label="Subtexto" value={editedContent.footerCta.subtext} onChange={(v) => handleChange('footerCta', 'subtext', v)} />
            {renderImageField("Textura de Fundo", editedContent.footerCta.backgroundImage, 'footerCta', 'backgroundImage')}
          </CMSSection>
        );

      case 'pages':
        return (
          <CMSSection title="Rodapé e Páginas Legais">
            <Toggle label="Footer Visível" value={editedContent.footer.visible} onChange={(v) => handleChange('footer', 'visible', v)} />
            <Input label="Link Exibido do Site" value={editedContent.footer.websiteLink} onChange={(v) => handleChange('footer', 'websiteLink', v)} />
            <Input label="Texto de Copyright" value={editedContent.footer.copyrightText} onChange={(v) => handleChange('footer', 'copyrightText', v)} />

            <div className="mt-8 space-y-6">
              <h4 className="text-xs font-bold uppercase text-stone-500 border-b border-stone-100 pb-2">Conteúdo dos Modais</h4>
              <TextArea label="Texto Privacidade" value={editedContent.pages.privacy} onChange={(v) => handleChange('pages', 'privacy', v)} />
              <TextArea label="Texto Termos de Uso" value={editedContent.pages.terms} onChange={(v) => handleChange('pages', 'terms', v)} />
              <TextArea label="Texto Contato" value={editedContent.pages.contact} onChange={(v) => handleChange('pages', 'contact', v)} />
            </div>
          </CMSSection>
        );

      case 'notFound':
        return (
          <CMSSection title="Página 404 (Não Encontrada)">
            <Input label="Título Grande (ex: 404)" value={editedContent.notFound.title} onChange={(v) => handleChange('notFound', 'title', v)} />
            <Input label="Subtítulo" value={editedContent.notFound.subtitle} onChange={(v) => handleChange('notFound', 'subtitle', v)} />
            <TextArea label="Mensagem Principal" value={editedContent.notFound.message} onChange={(v) => handleChange('notFound', 'message', v)} />
            <Input label="Texto do Botão" value={editedContent.notFound.buttonText} onChange={(v) => handleChange('notFound', 'buttonText', v)} />
            <Input label="Texto do Rodapé" value={editedContent.notFound.footerText} onChange={(v) => handleChange('notFound', 'footerText', v)} />
          </CMSSection>
        );

      case 'leads':
        return (
          <CMSSection title="Lista de Interessados (Leads)">
            <p className="text-xs text-stone-500 mb-6 px-4">Esta lista contém as pessoas que preencheram o formulário de lançamento.</p>
            <div className="space-y-3">
              {leads.length === 0 ? (
                <div className="p-8 text-center text-stone-400 italic text-sm">Nenhum interessado registrado ainda.</div>
              ) : (
                leads.map((lead) => (
                  <div key={lead.id} className={`p-5 bg-white dark:bg-stone-800 border rounded-2xl flex items-center justify-between transition-all ${lead.contacted ? 'border-stone-100 dark:border-stone-800 opacity-60' : 'border-amber-100 dark:border-amber-900/30 border-l-4 border-l-gold shadow-sm'}`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-stone-900 dark:text-stone-100">{lead.name}</span>
                        {lead.contacted && (
                          <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-700 text-[8px] font-bold uppercase tracking-widest text-stone-500">Contactado</span>
                        )}
                      </div>
                      <div className="flex flex-col text-xs text-stone-400">
                        <span className="flex items-center gap-1"><span className="material-icons-outlined text-xs">email</span> {lead.email}</span>
                        <span className="flex items-center gap-1 mt-1"><span className="material-icons-outlined text-xs">calendar_today</span> {new Date(lead.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleLeadContacted(lead.id, lead.contacted)}
                        className={`p-2 rounded-full transition-colors ${lead.contacted ? 'bg-stone-100 text-stone-400 hover:bg-amber-50 hover:text-gold' : 'bg-amber-50 text-gold hover:bg-gold hover:text-white'}`}
                        title={lead.contacted ? "Marcar como não contactado" : "Marcar como contactado"}
                      >
                        <span className="material-icons-outlined text-sm">{lead.contacted ? 'undo' : 'check'}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="p-2 rounded-full bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                        title="Excluir Lead"
                      >
                        <span className="material-icons-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CMSSection>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-stone-100 dark:bg-background-dark overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 max-h-[35vh] md:max-h-full bg-white dark:bg-background-surface border-r border-stone-200 dark:border-stone-800 overflow-y-auto shrink-0">
        <div className="p-6 md:p-8 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center justify-center -ml-2">
            <img src="/brand/logo.png" alt="Oremos Juntos" className="h-16 w-auto object-contain dark:brightness-0 dark:invert" />
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === tab.id
                ? 'bg-amber-50 dark:bg-amber-900/20 text-gold'
                : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
            >
              <span className="material-icons-outlined text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}

          <div className="pt-8 mt-8 border-t border-stone-100 dark:border-stone-800 p-2">
            <button onClick={onClose} className="w-full text-left px-4 py-2 text-stone-400 text-xs font-bold uppercase hover:text-stone-600 dark:hover:text-stone-200">
              ← Voltar ao Site
            </button>
          </div>
        </nav>
      </div>

      {/* Content Editor Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="px-8 py-6 bg-white/80 dark:bg-background-surface/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 flex justify-between items-center z-10">
          <h1 className="text-2xl font-display italic text-stone-900 dark:text-white">
            {tabs.find(t => t.id === activeTab)?.label}
          </h1>
          <button
            onClick={() => onSave(editedContent)}
            className="px-8 py-3 bg-primary text-white rounded-full font-bold text-xs tracking-[0.2em] uppercase hover:bg-gold transition-colors shadow-lg flex items-center gap-2"
          >
            <span className="material-icons-outlined text-sm">save</span>
            Salvar
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-12 pb-32">
          <div className="max-w-3xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSAdmin;
