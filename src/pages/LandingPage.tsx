
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CMSContent, AppFeatureItem } from '../types';
import CardGallery from '../components/CardGallery';
import { supabase } from '../supabaseClient';
import { useNotification } from '../components/ui/NotificationContext';

interface LandingPageProps {
    content: CMSContent;
    toggleTheme: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ content, toggleTheme }) => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [activeFeatureModal, setActiveFeatureModal] = useState<AppFeatureItem | null>(null);
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const { showToast } = useNotification();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        // SEO: Update Title & Meta
        document.title = content.hero.title ? `${content.hero.title} | Oremos Juntos` : 'Oremos Juntos';

        // Analytics: Inject GA4 if ID exists
        if (content.settings.googleAnalyticsId && !window.document.getElementById('ga-script')) {
            const script = document.createElement('script');
            script.id = 'ga-script';
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${content.settings.googleAnalyticsId}`;
            document.head.appendChild(script);

            const inlineScript = document.createElement('script');
            inlineScript.innerHTML = `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${content.settings.googleAnalyticsId}');
            `;
            document.head.appendChild(inlineScript);
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, [content]);

    // Google Analytics Injection - handled in Parent or here? Parent is better for once-per-load
    // But landing page specific? content.settings.googleAnalyticsId is global.

    const handleCMSClick = () => {
        // Navigate to Admin
        navigate('/admin');
    };

    const handleSupportRedirect = () => {
        window.open(content.settings.supportLink, '_blank', 'noopener,noreferrer');
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Registering:', formData);

        try {
            const { error } = await supabase.from('leads').insert([
                { name: formData.name, email: formData.email }
            ]);

            if (error) {
                console.error('Leads error:', error);
                showToast('Não foi possível registrar seu interesse. Verifique sua conexão.', 'error');
                return;
            }

            setRegistrationSuccess(true);
            setTimeout(() => {
                setIsRegistrationOpen(false);
                setRegistrationSuccess(false);
                setFormData({ name: '', email: '' });
            }, 3000);
        } catch (err) {
            console.error('Registration exception:', err);
            showToast('Ocorreu um erro inesperado. Tente novamente mais tarde.', 'error');
        }
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
                <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl p-10 shadow-2xl overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                        <button onClick={() => setActiveModal(null)} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                            <span className="material-icons-outlined">close</span>
                        </button>
                    </div>
                    <div className="space-y-8">
                        <h2 className="text-4xl font-display text-stone-900 dark:text-white italic">{title}</h2>
                        <div className="h-px w-20 bg-gold" />
                        <div className="text-lg text-stone-600 dark:text-stone-400 font-serif leading-relaxed italic prose dark:prose-invert">
                            {body}
                        </div>
                    </div>
                </div>
            </div>
        );
    }, [activeModal, content]);

    const FeatureModal = useMemo(() => {
        if (!activeFeatureModal) return null;

        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                <div className="absolute inset-0 bg-stone-900/90 backdrop-blur-xl" onClick={() => setActiveFeatureModal(null)} />
                <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl p-10 shadow-2xl overflow-hidden text-center">
                    <div className="absolute top-0 right-0 p-8">
                        <button onClick={() => setActiveFeatureModal(null)} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                            <span className="material-icons-outlined">close</span>
                        </button>
                    </div>
                    <div className="space-y-6 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                            <span className="material-icons-outlined text-4xl text-gold">
                                {activeFeatureModal.icon}
                            </span>
                        </div>
                        <h2 className="text-3xl font-display text-stone-900 dark:text-white italic">{activeFeatureModal.title}</h2>
                        <p className="text-lg text-stone-600 dark:text-stone-400 font-serif leading-relaxed italic">
                            {activeFeatureModal.description}
                        </p>
                        <div className="inline-block px-4 py-2 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-500 dark:text-stone-400">{activeFeatureModal.statusText}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }, [activeFeatureModal]);

    return (
        <div className="min-h-screen selection:bg-gold selection:text-white transition-colors duration-500 pb-20 sm:pb-0">
            <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl font-serif font-bold tracking-tight">Oremos Juntos<span className="text-gold">.</span></span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex items-center px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5">
                            <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-gold animate-pulse">{content.header.launchBadge}</span>
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
                {content.sectionOrder?.map((sectionKey) => {
                    switch (sectionKey) {
                        case 'hero':
                            if (!content.hero.visible) return null;
                            return (
                                <section key="hero" className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden pt-20">
                                    <div className="absolute inset-0 z-0">
                                        <img
                                            src={content.hero.backgroundImage}
                                            className="w-full h-full object-cover opacity-10 dark:opacity-5 scale-110"
                                            alt="Background"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-light/40 to-background-light dark:via-background-dark/40 dark:to-background-dark"></div>
                                    </div>

                                    <div className="relative z-10 max-w-5xl w-full text-center space-y-12 py-16">
                                        <div className="inline-flex items-center px-6 py-2 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-200 text-[10px] font-bold tracking-[0.4em] uppercase">
                                            {content.hero.badge}
                                        </div>
                                        <h1 className="text-5xl md:text-7xl font-display leading-[1.1] text-stone-900 dark:text-stone-50 animate-fade-in-up">
                                            {content.hero.title}
                                        </h1>
                                        <p className="text-xl md:text-2xl text-stone-600 dark:text-stone-400 font-serif italic max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-100">
                                            {content.hero.description}
                                        </p>
                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-6">
                                            <button
                                                onClick={() => setIsRegistrationOpen(true)}
                                                className="btn-primary w-full sm:w-auto px-16 py-6 text-sm animate-fade-in-up delay-200 shadow-2xl"
                                            >
                                                {content.hero.ctaPrimary}
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            );

                        case 'comingSoon':
                            if (!content.comingSoon.visible) return null;
                            return (
                                <section key="comingSoon" className="py-32 px-6 bg-stone-900 text-white relative overflow-hidden" id="explaining">
                                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gold/5 blur-[150px]"></div>
                                    <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
                                        <span className="material-icons-outlined text-gold text-6xl animate-bounce">church</span>
                                        <h2 className="text-5xl md:text-6xl font-display italic leading-tight">{content.comingSoon.title}</h2>
                                        <p className="text-xl md:text-2xl text-stone-400 font-serif leading-relaxed italic max-w-2xl mx-auto">
                                            {content.comingSoon.description}
                                        </p>
                                        <div className="pt-8">
                                            <div className="inline-block p-1 bg-gradient-to-r from-gold/40 via-gold to-gold/40 rounded-full">
                                                <div className="bg-stone-900 px-8 py-3 rounded-full">
                                                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">{content.comingSoon.launchDateText}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            );

                        case 'gallery':
                            if (!content.gallery.visible) return null;
                            return (
                                <CardGallery
                                    key="gallery"
                                    title={content.gallery.sectionTitle}
                                    description={content.gallery.sectionDesc}
                                    items={content.gallery.items}
                                />
                            );

                        case 'appShowcase':
                            if (!(content.appShowcase?.visible ?? true)) return null;
                            return (
                                <section key="appShowcase" className="hidden md:block py-32 px-6 bg-white dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800">
                                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                                        <div className="lg:w-1/2 space-y-8">
                                            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 mb-4">
                                                <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-gold">App Mobile & Web</span>
                                            </div>
                                            <h2 className="text-4xl md:text-5xl font-display italic text-stone-900 dark:text-white leading-tight">
                                                {content.appShowcase?.title || "O App que te conecta ao céu"}
                                            </h2>
                                            <p className="text-lg text-stone-600 dark:text-stone-400 font-serif leading-relaxed italic max-w-xl">
                                                {content.appShowcase?.description || "Cada detalhe da interface foi pensado para criar foco, tranquilidade e reverência."}
                                            </p>

                                            {/* App Features List (from Mobile Footer) rendered here on Desktop */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
                                                {content.appFeatures?.items?.map((feature) => (
                                                    <div key={feature.id} onClick={() => setActiveFeatureModal(feature)} className="cursor-pointer group flex items-start space-x-4 p-4 rounded-2xl hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                                                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold transition-colors">
                                                            <span className="material-icons-outlined text-gold text-xl group-hover:text-white transition-colors">{feature.icon}</span>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-display italic text-stone-900 dark:text-white mb-1">{feature.title}</h4>
                                                            <p className="text-sm text-stone-500 dark:text-stone-400 font-serif leading-snug line-clamp-2">{feature.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Visual Asset (Video or Image) */}
                                        <div className="lg:w-1/2 relative">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-gold/20 to-transparent rounded-3xl blur-2xl -z-10"></div>
                                            <div className="relative rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-700 shadow-2xl bg-white dark:bg-stone-800">
                                                {content.appShowcase?.videoUrl ? (
                                                    <div className="aspect-video w-full">
                                                        <iframe
                                                            src={content.appShowcase.videoUrl}
                                                            className="w-full h-full"
                                                            title="App Preview"
                                                            frameBorder="0"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        ></iframe>
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={content.appShowcase?.screenImage || "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000&auto=format&fit=crop"}
                                                        alt="App Interface"
                                                        className="w-full h-auto object-cover"
                                                    />
                                                )}

                                                {content.appShowcase?.badges && (
                                                    <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-4">
                                                        {/* Mock Badges */}
                                                        <div className="h-10 px-4 bg-black rounded-lg flex items-center border border-stone-800 shadow-lg">
                                                            <span className="material-icons text-white mr-2">apple</span>
                                                            <div className="text-left">
                                                                <div className="text-[8px] text-white leading-none">Download on the</div>
                                                                <div className="text-[12px] font-bold text-white leading-none">App Store</div>
                                                            </div>
                                                        </div>
                                                        <div className="h-10 px-4 bg-black rounded-lg flex items-center border border-stone-800 shadow-lg">
                                                            <span className="material-icons text-white mr-2">android</span>
                                                            <div className="text-left">
                                                                <div className="text-[8px] text-white leading-none">Get it on</div>
                                                                <div className="text-[12px] font-bold text-white leading-none">Google Play</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            );

                        case 'features':
                            if (!content.features.visible) return null;
                            return (
                                <section key="features" className="py-32 px-6 bg-stone-50 dark:bg-stone-900/50">
                                    <div className="max-w-7xl mx-auto space-y-16">
                                        <div className="text-center space-y-6">
                                            <div className="inline-flex items-center px-4 py-1 rounded-full border border-gold/30 bg-gold/5">
                                                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">{content.features.sectionBadge}</span>
                                            </div>
                                            <h2 className="text-5xl md:text-7xl font-display italic text-stone-900 dark:text-white">{content.features.sectionTitle}</h2>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {content.features.items?.map((feature) => (
                                                <div key={feature.id} className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold group-hover:text-white transition-colors duration-300">
                                                        <span className="material-icons-outlined text-gold group-hover:text-white transition-colors">{feature.icon}</span>
                                                    </div>
                                                    <h3 className="text-2xl font-display italic text-stone-900 dark:text-white mb-4">{feature.title}</h3>
                                                    <p className="text-stone-500 dark:text-stone-400 font-serif leading-relaxed">
                                                        {feature.desc}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            );

                        case 'manifesto':
                            if (!content.manifesto.visible) return null;
                            return (
                                <section key="manifesto" className="py-32 px-6" id="manifesto">
                                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                                        <div className="lg:w-1/2 space-y-10">
                                            <h2 className="text-5xl md:text-6xl font-display text-stone-900 dark:text-white italic leading-tight">
                                                {content.manifesto.title}
                                            </h2>
                                            <div className="space-y-6 text-lg md:text-xl text-stone-600 dark:text-stone-400 leading-relaxed font-serif italic">
                                                <p>{content.manifesto.paragraph1}</p>
                                                <p>{content.manifesto.paragraph2}</p>
                                            </div>
                                        </div>
                                        <div className="lg:w-1/2 relative group">
                                            <div className="absolute -inset-4 bg-gold/10 rounded-3xl group-hover:scale-105 transition-transform duration-700"></div>
                                            <img
                                                src={content.manifesto.image || "https://images.unsplash.com/photo-1510511459019-5dee9954889c?q=80&w=2000&auto=format&fit=crop"} // Replaced with a more reliable prayer/sacred image
                                                className="relative rounded-2xl w-full aspect-square object-cover shadow-2xl transition-all duration-700" // Removed grayscale as it was confusing "não aberta"
                                                alt="Vision"
                                            />
                                        </div>
                                    </div>
                                </section>
                            );

                        case 'testimonial':
                            if (!content.testimonial.visible) return null;
                            return (
                                <section key="testimonial" className="py-32 px-6 relative overflow-hidden">
                                    <div className="max-w-4xl mx-auto text-center relative z-10 space-y-12">
                                        <span className="material-icons-round text-6xl text-gold/20">format_quote</span>
                                        <h3 className="text-3xl md:text-5xl font-serif italic text-stone-800 dark:text-stone-200 leading-tight">
                                            "{content.testimonial.quote}"
                                        </h3>
                                        <div className="flex flex-col items-center space-y-4">
                                            <img
                                                src={content.testimonial.avatar}
                                                alt={content.testimonial.author}
                                                className="w-16 h-16 rounded-full object-cover border-2 border-gold p-1"
                                            />
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-900 dark:text-white">{content.testimonial.author}</p>
                                                <p className="text-xs font-serif italic text-stone-500">{content.testimonial.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            );

                        case 'support':
                            if (!content.support.visible) return null;
                            return (
                                <section key="support" className="relative py-32 px-6 overflow-hidden bg-stone-50 dark:bg-background-dark/30">
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

                                        <div className="relative p-12 md:p-16 bg-white dark:bg-stone-900 rounded-3xl shadow-xl border border-stone-100 dark:border-stone-800 space-y-8 group overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
                                            <div className="relative z-10 space-y-6">
                                                <h3 className="text-3xl md:text-4xl font-display italic text-stone-900 dark:text-white">{content.support.cardTitle}</h3>
                                                <p className="text-stone-500 dark:text-stone-400 text-lg font-serif italic leading-relaxed max-w-2xl mx-auto">
                                                    {content.support.cardDescription}
                                                </p>
                                                <button
                                                    onClick={handleSupportRedirect}
                                                    className="px-10 py-4 rounded-xl border-2 border-stone-100 dark:border-stone-800 text-stone-900 dark:text-white text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-stone-900 hover:text-white dark:hover:bg-white dark:hover:text-stone-900 transition-all">
                                                    {content.support.cardButton}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            );

                        case 'footerCta':
                            if (!content.footerCta.visible) return null;
                            return (
                                <section key="footerCta" className="py-32 px-6">
                                    <div className="max-w-6xl mx-auto bg-stone-950 rounded-3xl p-20 md:p-32 text-center text-white overflow-hidden relative group shadow-3xl">
                                        {content.footerCta.backgroundImage && (
                                            <div
                                                className="absolute inset-0 opacity-10 group-hover:scale-110 transition-transform duration-1000"
                                                style={{ backgroundImage: `url('${content.footerCta.backgroundImage}')` }}
                                            ></div>
                                        )}
                                        <div className="relative z-10 space-y-12">
                                            <h2 className="text-6xl md:text-8xl font-display leading-[1.1]">{content.footerCta.title}</h2>
                                            <p className="text-stone-400 text-xl md:text-2xl max-w-3xl mx-auto font-serif italic leading-relaxed">{content.footerCta.description}</p>
                                            <div className="space-y-8">
                                                <button
                                                    onClick={() => setIsRegistrationOpen(true)}
                                                    className="btn-primary w-full sm:w-auto px-12 py-5 text-xs shadow-2xl bg-white text-stone-900 hover:text-stone-950"
                                                >
                                                    {content.footerCta.button}
                                                </button>
                                                <p className="text-stone-500 text-[10px] font-bold tracking-[0.4em] uppercase">{content.footerCta.subtext}</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            );

                        default:
                            return null;
                    }
                })}
            </main>

            {content.footer.visible && (
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
            )}

            {PageModal}
            {FeatureModal}

            {/* Registration Modal */}
            {isRegistrationOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-stone-900/95 backdrop-blur-2xl" onClick={() => setIsRegistrationOpen(false)} />
                    <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl p-10 shadow-2xl text-center">
                        {registrationSuccess ? (
                            <div className="space-y-8 animate-in zoom-in duration-500">
                                <span className="material-icons-outlined text-8xl text-gold">check_circle</span>
                                <h2 className="text-4xl font-display italic dark:text-white">{content.registrationModal.successTitle}</h2>
                                <p className="text-stone-500 dark:text-stone-400 font-serif italic text-lg leading-relaxed">
                                    {content.registrationModal.successMessage}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <h2 className="text-5xl font-display italic text-stone-900 dark:text-white leading-tight">{content.registrationModal.title}</h2>
                                    <p className="text-stone-500 dark:text-stone-400 font-serif italic text-lg leading-relaxed">
                                        {content.registrationModal.description}
                                    </p>
                                </div>

                                <form onSubmit={handleRegister} className="space-y-6 text-left">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-stone-400 ml-4">{content.registrationModal.nameLabel}</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-8 py-5 rounded-full bg-stone-50 dark:bg-stone-800 border-none focus:ring-2 focus:ring-gold text-stone-900 dark:text-white transition-all"
                                            placeholder={content.registrationModal.namePlaceholder}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-stone-400 ml-4">{content.registrationModal.emailLabel}</label>
                                        <input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-8 py-5 rounded-full bg-stone-50 dark:bg-stone-800 border-none focus:ring-2 focus:ring-gold text-stone-900 dark:text-white transition-all"
                                            placeholder={content.registrationModal.emailPlaceholder}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-6 rounded-full bg-primary dark:bg-white dark:text-stone-900 text-white text-[11px] font-bold tracking-[0.4em] uppercase hover:bg-gold hover:text-white transition-all duration-500 shadow-xl"
                                    >
                                        {content.registrationModal.buttonText}
                                    </button>
                                </form>

                                <button
                                    onClick={() => setIsRegistrationOpen(false)}
                                    className="text-[10px] font-bold tracking-widest uppercase text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
                                >
                                    {content.registrationModal.closeText}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Bottom Nav Simulation - Now Dynamic & Conditional */}
            {content.appFeatures.visible && (
                <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-stone-950 border-t border-stone-100 dark:border-stone-900 z-[90] px-6 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:hidden">
                    <div className="flex items-center justify-between max-w-lg mx-auto">
                        {content.appFeatures?.items?.map((feature) => (
                            <NavItem
                                key={feature.id}
                                icon={feature.icon}
                                label={feature.title.substring(0, 10)}
                                onClick={() => setActiveFeatureModal(feature)}
                                active={activeFeatureModal?.id === feature.id}
                            />
                        ))}
                    </div>
                </nav>
            )}
        </div>
    );
};

const NavItem = ({ icon, label, active = false, onClick }: { icon: string; label: string; active?: boolean, onClick?: () => void, key?: React.Key }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center space-y-1 group transition-all ${active ? 'text-stone-900 dark:text-white' : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'}`}
    >
        <span className={`material-icons-outlined text-2xl ${active ? 'scale-110' : 'group-hover:scale-110 transition-transform'}`}>{icon}</span>
        <span className="text-[8px] font-bold tracking-widest uppercase">{label}</span>
        {active && <div className="w-1 h-1 rounded-full bg-gold"></div>}
    </button>
);

export default LandingPage;
