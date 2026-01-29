
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CMSContent } from './types';
import { INITIAL_CONTENT } from './constants';
import { supabase } from './supabaseClient';
import LandingPage from './pages/LandingPage';
import AdminPage from './pages/AdminPage';
import NotFound from './pages/NotFound';
import { NotificationProvider, useNotification } from './components/ui/NotificationContext';

const AppInner: React.FC = () => {
  const [content, setContent] = useState<CMSContent>(INITIAL_CONTENT);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { showToast } = useNotification();

  useEffect(() => {
    // Load content from Supabase
    const loadContent = async () => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('content')
          .eq('id', 'main_content')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching content:', error);
          return;
        }

        if (data && data.content) {
          // Merge with initial content to ensure structure validity
          const mergedContent = { ...INITIAL_CONTENT, ...data.content };

          // Ensure arrays exist if missing from DB (deep merge fallback)
          if (!mergedContent.appFeatures?.items) {
            mergedContent.appFeatures = {
              ...mergedContent.appFeatures,
              items: INITIAL_CONTENT.appFeatures.items
            };
          }
          if (!mergedContent.features?.items) {
            mergedContent.features = {
              ...mergedContent.features,
              items: INITIAL_CONTENT.features.items
            };
          }

          setContent(mergedContent);
        }
      } catch (err) {
        console.error('Unexpected error loading content:', err);
      }
    };

    loadContent();

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Google Analytics Injection
  useEffect(() => {
    if (content.settings.googleAnalyticsId) {
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${content.settings.googleAnalyticsId}`;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${content.settings.googleAnalyticsId}');
      `;
      document.head.appendChild(script2);
    }
  }, [content.settings.googleAnalyticsId]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  }, []);

  const saveContent = async (newContent: CMSContent) => {
    setContent(newContent);
    // Optimistic update locally

    try {
      // First attempt: Edge Function (Secure)
      console.log('Attempting to save via Edge Function...');
      const { data, error } = await supabase.functions.invoke('save-content', {
        body: {
          password: newContent.settings.cmsPassword,
          content: newContent
        }
      });

      if (error || (data && data.error)) {
        const msg = error?.message || data?.error || 'Erro desconhecido';
        console.warn('Edge Function save failed, attempting direct database update fallback:', msg);

        // Fallback: Direct Database Update (If RLS allows)
        // This is necessary if the Edge Function is not deployed or reachable.
        const { error: dbError } = await supabase
          .from('site_content')
          .upsert({
            id: 'main_content',
            content: newContent,
            updated_at: new Date().toISOString()
          });

        if (dbError) {
          console.error('Direct save error:', dbError.message);
          showToast(`Não foi possível salvar as alterações. Verifique sua conexão.`, 'error');
        } else {
          showToast('Conteúdo atualizado com sucesso.', 'success');
        }
      } else {
        showToast('Conteúdo atualizado com sucesso. Tudo pronto para inspirar!', 'success');
      }
    } catch (err) {
      console.error('Save exception:', err);
      // Try fallback on exception too
      try {
        const { error: dbError } = await supabase
          .from('site_content')
          .upsert({
            id: 'main_content',
            content: newContent,
            updated_at: new Date().toISOString()
          });
        if (dbError) throw dbError;
        showToast('Conteúdo atualizado com sucesso.', 'success');
      } catch (fallbackErr: any) {
        showToast(`Erro de conexão ao salvar. Verifique sua internet.`, 'error');
      }
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage content={content} toggleTheme={toggleTheme} />} />
        <Route path="/admin" element={<AdminPage content={content} onSave={saveContent} />} />
        {/* Fallback to home */}
        <Route path="*" element={<NotFound content={content.notFound} />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <AppInner />
    </NotificationProvider>
  );
};

export default App;
