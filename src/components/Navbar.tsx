import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavigateBooking: () => void;
}

const NAV_LINKS = [
  { href: '#historia', label: 'Nossa História' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#galeria', label: 'Galeria' },
  { href: '#barbeiros', label: 'Barbeiros' },
  { href: '#avaliacoes', label: 'Avaliações' },
];

export const Navbar: React.FC<NavbarProps> = ({ onNavigateBooking }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  const handleBookClick = () => {
    setMobileOpen(false);
    onNavigateBooking();
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#C8A97E]/15 py-3.5 px-6 lg:px-12'
            : 'bg-gradient-to-b from-[#0A0A0A]/90 to-transparent py-5 px-6 lg:px-12'
        }`}
      >
        <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#topo"
            className="font-display text-2xl lg:text-[1.8rem] tracking-[0.15em] text-[#FAFAF9] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8A97E]"
          >
            BLADE <span className="font-serif-editorial italic text-[#C8A97E] text-[0.82em]">&amp;</span> CO.
          </a>

          {/* Zone 2: 5 concise single-line text nav links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9" aria-label="Navegação principal">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative py-1 text-xs uppercase tracking-[0.18em] text-[#999999] hover:text-[#C8A97E] transition-colors duration-200 whitespace-nowrap shrink-0 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#C8A97E] hover:after:w-full after:transition-all after:duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8A97E]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: 1 primary action CTA (or mobile toggle on small viewports) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleBookClick}
              className="hidden md:inline-flex items-center justify-center min-h-[42px] px-6 py-2.5 border border-[#C8A97E] text-[#C8A97E] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#C8A97E] hover:text-[#0A0A0A] transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8A97E]"
            >
              Agendar Horário
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileOpen}
              className="md:hidden inline-flex items-center justify-center w-11 h-11 text-[#FAFAF9] hover:text-[#C8A97E] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C8A97E]"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Navigation Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0A0A0A]/98 backdrop-blur-lg flex flex-col items-center justify-center gap-7 px-6 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className="font-display text-3xl tracking-[0.15em] text-[#E8E6E1] hover:text-[#C8A97E] transition-colors min-h-[44px] flex items-center"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={handleBookClick}
            className="mt-4 min-h-[48px] px-8 py-3 bg-[#C8A97E] text-[#0A0A0A] text-xs font-semibold uppercase tracking-[0.22em] hover:bg-[#D4BC96] transition-colors whitespace-nowrap cursor-pointer"
          >
            Agendar Horário
          </button>
        </div>
      )}
    </>
  );
};
