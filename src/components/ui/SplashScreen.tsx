import React from 'react';

const SplashScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background-light dark:bg-background-dark transition-colors duration-500">
            <div className="relative flex flex-col items-center space-y-8 animate-in fade-in zoom-in duration-1000">
                {/* Heartbeat/Pulse Animation Background */}
                <div className="absolute inset-0 bg-gold/10 blur-3xl rounded-full scale-150 animate-pulse"></div>

                <div className="relative">
                    <img
                        src="/brand/logo.png"
                        alt="Oremos Juntos"
                        className="h-24 w-auto object-contain dark:brightness-0 dark:invert animate-pulse duration-[2000ms]"
                    />
                </div>

                <div className="flex flex-col items-center space-y-2">
                    <div className="h-0.5 w-12 bg-gold/30 rounded-full overflow-hidden">
                        <div className="h-full bg-gold w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}} />
        </div>
    );
};

export default SplashScreen;
