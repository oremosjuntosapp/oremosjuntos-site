
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CMSContent } from './types';
import { INITIAL_CONTENT } from './constants';
import CMSAdmin from './components/CMSAdmin';
import CardGallery from './components/CardGallery';

const App: React.FC = () => {
  const [content, setContent] = useState<CMSContent>(INITIAL_CONTENT);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeFeatureModal, setActiveFeatureModal] = useState<keyof CMSContent['appFeatures'] | null>(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    const saved = localStorage.getItem('oremos-juntos-landing-content');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure new fields are merged if local storage has old structure
        setContent({ ...INITIAL_CONTENT, ...parsed });
      } catch (e) {
        console.error("Failed to load CMS content", e);
      }
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const saveContent = (newContent: CMSContent) => {
    setContent(newContent);
    localStorage.setItem('oremos-juntos-landing-content', JSON.stringify(newContent));
    setIsAdminOpen(false);
  };

  const handleCMSClick = () => {
    setIsLoginOpen(true);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPassword === content.settings.cmsPassword) {
      setIsLoginOpen(false);
      setIsAdminOpen(true);
      setLoginError(false);
      setLoginPassword('');
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const handleSupportRedirect = () => {
    window.open(content.settings.supportLink, '_blank', 'noopener,noreferrer');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registering:', formData);
    setRegistrationSuccess(true);
    setTimeout(() => {
      setIsRegistrationOpen(false);
      setRegistrationSuccess(false);
      setFormData({ name: '', email: '' });
    }, 3000);
  };

  const PageModal = useMemo(() => {
    if (!activeModal) return null;
    let title = "";
    let body = "";
    if (activeModal === 'privacy') { title = "Privacidade"; body = content.pages.privacy; }
    if (activeModal === 'terms') { title = "Termos"; body = content.pages.terms; }
    if (activeModal === 'contact') { title = "Contato"; body = content.pages.contact; }

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
        <div className="absolute inset-0 bg-stone-900/90 backdrop-blur-xl" onClick={() => setActiveModal(null)} />
        <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-[3rem] p-12 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
            <button onClick={() => setActiveModal(null)} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
              <span className="material-icons-outlined">close</span>
            </button>
          </div>
          <div className="space-y-8">
            <h2 className="text-5xl font-display text-stone-900 dark:text-white italic">{title}</h2>
            <div className="h-px w-20 bg-gold" />
            <div className="text-xl text-stone-600 dark:text-stone-400 font-serif leading-relaxed italic prose dark:prose-invert">
              {body}
            </div>
          </div>
        </div>
      </div>
    );
  }, [activeModal, content]);

  const FeatureModal = useMemo(() => {
    if (!activeFeatureModal) return null;
    const feature = content.appFeatures[activeFeatureModal];
    if (!feature) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
        <div className="absolute inset-0 bg-stone-900/90 backdrop-blur-xl" onClick={() => setActiveFeatureModal(null)} />
        <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-[3rem] p-12 shadow-2xl overflow-hidden text-center">
          <div className="absolute top-0 right-0 p-8">
            <button onClick={() => setActiveFeatureModal(null)} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
              <span className="material-icons-outlined">close</span>
            </button>
          </div>
          <div className="space-y-8 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4">
               <span className="material-icons-outlined text-4xl text-gold">
                  {activeFeatureModal === 'altar' ? 'church' : 
                   activeFeatureModal === 'groups' ? 'groups' :
                   activeFeatureModal === 'journey' ? 'auto_stories' : 'grade'}
               </span>
            </div>
            <h2 className="text-4xl font-display text-stone-900 dark:text-white italic">{feature.title}</h2>
            <p className="text-lg text-stone-600 dark:text-stone-400 font-serif leading-relaxed italic">
              {feature.description}
            </p>
            <div className="inline-block px-4 py-2 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
               <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-500 dark:text-stone-400">{feature.statusText}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }, [activeFeatureModal, content]);

  return (
    <div className="min-h-screen selection:bg-gold selection:text-white transition-colors duration-500 pb-20 sm:pb-0">
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-serif font-bold tracking-tight">Oremos Juntos<span className="text-gold">.</span></span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5">
               <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-gold animate-pulse">Lançamento em breve</span>
            </div>
            <button onClick={handleCMSClick} className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors" title="CMS">
              <span className="material-icons-outlined text-xl leading-none">edit_note</span>
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors">
              <span className="material-icons-outlined text-xl leading-none dark:hidden">dark_mode</span>
              <span className="material-icons-outlined text-xl leading-none hidden dark:block">light_mode</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Landing */}
        <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden pt-20">
          <div className="absolute inset-0 z-0">
            <img 
              src={content.hero.backgroundImage} 
              className="w-full h-full object-cover opacity-10 dark:opacity-5 scale-110" 
              alt="Background"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-light/40 to-background-light dark:via-background-dark/40 dark:to-background-dark"></div>
          </div>

          <div className="relative z-10 max-w-5xl w-full text-center space-y-16 py-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="inline-flex items-center px-6 py-2 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-200 text-[10px] font-bold tracking-[0.4em] uppercase">
              {content.hero.badge}
            </div>
            <h1 className="text-7xl md:text-9xl font-display leading-[0.85] text-stone-900 dark:text-stone-50">
              {content.hero.title}
            </h1>
            <p className="text-2xl md:text-4xl text-stone-600 dark:text-stone-400 font-serif italic max-w-3xl mx-auto leading-relaxed">
              {content.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-10">
              <button 
                onClick={() => setIsRegistrationOpen(true)}
                className="w-full sm:w-auto px-16 py-8 rounded-large bg-primary dark:bg-white dark:text-stone-900 text-white text-[11px] font-bold tracking-[0.4em] uppercase shadow-2xl hover:scale-105 transition-all duration-500"
              >
                {content.hero.ctaPrimary}
              </button>
            </div>
          </div>
        </section>

        {/* What is Oremos Juntos Section */}
        <section className="py-48 px-6 bg-stone-900 text-white relative overflow-hidden" id="explaining">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gold/5 blur-[150px]"></div>
          <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
            <span className="material-icons-outlined text-gold text-7xl animate-bounce">church</span>
            <h2 className="text-6xl md:text-8xl font-display italic leading-tight">{content.comingSoon.title}</h2>
            <p className="text-2xl md:text-3xl text-stone-400 font-serif leading-relaxed italic max-w-2xl mx-auto">
              {content.comingSoon.description}
            </p>
            <div className="pt-12">
               <div className="inline-block p-1 bg-gradient-to-r from-gold/40 via-gold to-gold/40 rounded-full">
                  <div className="bg-stone-900 px-8 py-3 rounded-full">
                     <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">{content.comingSoon.launchDateText}</p>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Card Gallery Section */}
        <CardGallery 
          title={content.gallery.sectionTitle} 
          description={content.gallery.sectionDesc} 
          items={content.gallery.items} 
        />

        {/* Manifesto Section */}
        <section className="py-48 px-6" id="manifesto">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-24">
            <div className="lg:w-1/2 space-y-12">
              <h2 className="text-6xl md:text-7xl font-display text-stone-900 dark:text-white italic leading-tight">
                {content.manifesto.title}
              </h2>
              <div className="space-y-8 text-xl md:text-2xl text-stone-600 dark:text-stone-400 leading-relaxed font-serif italic">
                <p>{content.manifesto.paragraph1}</p>
                <p>{content.manifesto.paragraph2}</p>
              </div>
            </div>
            <div className="lg:w-1/2 relative group">
              <div className="absolute -inset-4 bg-gold/10 rounded-[4rem] group-hover:scale-105 transition-transform duration-700"></div>
              <img 
                src={content.manifesto.image} 
                className="relative rounded-[3.5rem] w-full aspect-square object-cover shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" 
                alt="Vision"
              />
            </div>
          </div>
        </section>

        {/* Support Section with neutral background */}
        <section className="relative py-32 px-6 overflow-hidden bg-stone-50 dark:bg-background-dark/30">
          {content.support.backgroundImage && (
            <div className="absolute inset-0 z-0">
               <img src={content.support.backgroundImage} className="w-full h-full object-cover opacity-10" alt="Support Background" />
               <div className="absolute inset-0 bg-gradient-to-b from-stone-50/90 to-stone-50 dark:from-background-dark/90 dark:to-background-dark"></div>
            </div>
          )}
          <div className="relative z-10 max-w-4xl mx-auto space-y-24 text-center">
            <div className="flex flex-col items-center space-y-12">
               <button 
                onClick={handleSupportRedirect}
                className="px-16 py-6 rounded-full bg-stone-900 dark:bg-stone-50 dark:text-stone-900 text-white text-[10px] font-bold tracking-[0.4em] uppercase hover:scale-105 transition-transform shadow-lg">
                  {content.support.mainButton}
               </button>
               <div className="space-y-6">
                 <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-stone-400">{content.support.badge}</p>
                 <p className="text-xl md:text-2xl text-stone-600 dark:text-stone-400 font-serif italic leading-relaxed max-w-2xl mx-auto">
                   {content.support.description}
                 </p>
               </div>
            </div>

            <div className="relative p-16 md:p-24 bg-white dark:bg-stone-900 rounded-[3rem] shadow-xl border border-stone-100 dark:border-stone-800 space-y-10 group overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
               <div className="relative z-10 space-y-8">
                 <h3 className="text-4xl md:text-5xl font-display italic text-stone-900 dark:text-white">{content.support.cardTitle}</h3>
                 <p className="text-stone-500 dark:text-stone-400 text-lg md:text-xl font-serif italic leading-relaxed max-w-2xl mx-auto">
                   {content.support.cardDescription}
                 </p>
                 <button 
                  onClick={handleSupportRedirect}
                  className="px-12 py-5 rounded-xl border-2 border-stone-100 dark:border-stone-800 text-stone-900 dark:text-white text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-stone-900 hover:text-white dark:hover:bg-white dark:hover:text-stone-900 transition-all">
                   {content.support.cardButton}
                 </button>
               </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-48 px-6">
          <div className="max-w-6xl mx-auto bg-stone-950 rounded-[4rem] p-24 md:p-40 text-center text-white overflow-hidden relative group shadow-3xl">
            {content.footerCta.backgroundImage && (
              <div 
                className="absolute inset-0 opacity-10 group-hover:scale-110 transition-transform duration-1000"
                style={{ backgroundImage: `url('${content.footerCta.backgroundImage}')` }}
              ></div>
            )}
            <div className="relative z-10 space-y-16">
              <h2 className="text-7xl md:text-9xl font-display leading-[0.85]">{content.footerCta.title}</h2>
              <p className="text-stone-400 text-2xl md:text-3xl max-w-3xl mx-auto font-serif italic leading-relaxed">{content.footerCta.description}</p>
              <div className="space-y-8">
                <button 
                  onClick={() => setIsRegistrationOpen(true)}
                  className="px-20 py-10 rounded-large bg-white text-stone-900 text-[12px] font-bold tracking-[0.5em] uppercase hover:bg-gold hover:text-white hover:scale-105 transition-all duration-500 shadow-2xl"
                >
                  {content.footerCta.button}
                </button>
                <p className="text-stone-500 text-[10px] font-bold tracking-[0.4em] uppercase">{content.footerCta.subtext}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-32 px-6 border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto space-y-20 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-4xl font-serif font-bold group inline-block">
                Oremos Juntos<span className="text-gold group-hover:animate-ping inline-block">.</span>
              </div>
              <a href={content.footer?.websiteLink || "#"} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold tracking-[0.3em] uppercase text-stone-400 hover:text-gold transition-colors">
                {content.footer?.websiteLink || "www.oremosjuntos.com.br"}
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-16 text-[10px] font-bold tracking-[0.4em] uppercase text-stone-400">
              <button className="hover:text-primary dark:hover:text-white transition-colors" onClick={() => setActiveModal('privacy')}>Privacidade</button>
              <button className="hover:text-primary dark:hover:text-white transition-colors" onClick={() => setActiveModal('terms')}>Termos</button>
              <button className="hover:text-primary dark:hover:text-white transition-colors" onClick={() => setActiveModal('contact')}>Contato</button>
            </div>
            <p className="text-stone-300 dark:text-stone-600 text-[10px] font-bold tracking-[0.3em] uppercase pb-20 sm:pb-0">
              {content.footer?.copyrightText || "© 2026 Oremos Juntos. Projeto independente e contínuo."}
            </p>
        </div>
      </footer>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-stone-900/95 backdrop-blur-2xl" onClick={() => setIsLoginOpen(false)} />
          <div className="relative w-full max-sm bg-white dark:bg-stone-900 rounded-[2.5rem] p-12 shadow-2xl text-center space-y-8">
            <div className="space-y-4">
              <span className="material-icons-outlined text-4xl text-gold">lock</span>
              <h2 className="text-3xl font-display italic text-stone-900 dark:text-white">Acesso Restrito</h2>
              <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Digite a senha para gerenciar o conteúdo</p>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <input 
                autoFocus
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Senha de acesso"
                className={`w-full px-6 py-4 rounded-xl bg-stone-50 dark:bg-stone-800 border-none text-center focus:ring-2 focus:ring-gold dark:text-white ${loginError ? 'ring-2 ring-red-500 animate-shake' : ''}`}
              />
              <button type="submit" className="w-full py-4 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-gold hover:text-white transition-all shadow-lg">
                Entrar no Painel
              </button>
            </form>
          </div>
        </div>
      )}

      {isAdminOpen && <CMSAdmin content={content} onClose={() => setIsAdminOpen(false)} onSave={saveContent} />}
      {PageModal}
      {FeatureModal}

      {/* Registration Modal */}
      {isRegistrationOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-stone-900/95 backdrop-blur-2xl" onClick={() => setIsRegistrationOpen(false)} />
          <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-[3rem] p-12 shadow-2xl text-center">
            {registrationSuccess ? (
              <div className="space-y-8 animate-in zoom-in duration-500">
                <span className="material-icons-outlined text-8xl text-gold">check_circle</span>
                <h2 className="text-4xl font-display italic dark:text-white">Interesse registrado!</h2>
                <p className="text-stone-500 dark:text-stone-400 font-serif italic text-lg leading-relaxed">
                  Obrigado por querer fazer parte do Oremos Juntos. Enviaremos um e-mail assim que as portas do santuário digital se abrirem.
                </p>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="space-y-4">
                  <h2 className="text-5xl font-display italic text-stone-900 dark:text-white leading-tight">Mantenha-se Conectado</h2>
                  <p className="text-stone-500 dark:text-stone-400 font-serif italic text-lg leading-relaxed">
                    Deixe seu contato para ser um dos primeiros a conhecer o refúgio digital da fé cristã.
                  </p>
                </div>
                
                <form onSubmit={handleRegister} className="space-y-6 text-left">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-stone-400 ml-4">Seu Nome</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-8 py-5 rounded-full bg-stone-50 dark:bg-stone-800 border-none focus:ring-2 focus:ring-gold text-stone-900 dark:text-white transition-all"
                      placeholder="Como podemos te chamar?"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-stone-400 ml-4">Seu Melhor E-mail</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-8 py-5 rounded-full bg-stone-50 dark:bg-stone-800 border-none focus:ring-2 focus:ring-gold text-stone-900 dark:text-white transition-all"
                      placeholder="exemplo@email.com"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-6 rounded-full bg-primary dark:bg-white dark:text-stone-900 text-white text-[11px] font-bold tracking-[0.4em] uppercase hover:bg-gold hover:text-white transition-all duration-500 shadow-xl"
                  >
                    Confirmar Interesse
                  </button>
                </form>
                
                <button 
                  onClick={() => setIsRegistrationOpen(false)}
                  className="text-[10px] font-bold tracking-widest uppercase text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
                >
                  Talvez mais tarde
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Nav Simulation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-stone-950 border-t border-stone-100 dark:border-stone-900 z-[90] px-6 py-4 sm:hidden">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <NavItem icon="church" label="ALTAR" onClick={() => setActiveFeatureModal('altar')} />
          <NavItem icon="groups" label="GRUPOS" onClick={() => setActiveFeatureModal('groups')} />
          <NavItem icon="auto_stories" label="JORNADA" onClick={() => setActiveFeatureModal('journey')} />
          <NavItem icon="grade" label="GUARDIÃO" onClick={() => setActiveFeatureModal('guardian')} active={activeFeatureModal === 'guardian'} />
        </div>
      </nav>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }: { icon: string; label: string; active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center space-y-1 group transition-all ${active ? 'text-stone-900 dark:text-white' : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'}`}
  >
    <span className={`material-icons-outlined text-2xl ${active ? 'scale-110' : 'group-hover:scale-110 transition-transform'}`}>{icon}</span>
    <span className="text-[8px] font-bold tracking-widest uppercase">{label}</span>
    {active && <div className="w-1 h-1 rounded-full bg-gold"></div>}
  </button>
);

export default App;
