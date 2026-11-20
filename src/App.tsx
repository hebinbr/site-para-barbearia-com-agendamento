import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Crown,
  Flame,
  Instagram,
  MapPin,
  Phone,
  Scissors,
  Search,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { BookingSection } from './components/BookingSection';
import { BarberCard } from './components/BarberCard';
import FlexCarousel from './components/FlexCarousel';
import {
  AboutPrimaryVisual,
  AboutSecondaryVisual,
  HeroVisual,
} from './components/EditorialArtwork';
import {
  Appointment,
  BARBERS,
  MARQUEE_ITEMS,
  PORTFOLIO_ITEMS,
  PortfolioCategory,
  SERVICES,
  STORAGE_KEY,
  ServiceCategory,
  TESTIMONIALS,
} from './data/barbershop';

const SERVICE_CATEGORIES: ServiceCategory[] = ['Todos', 'Cabelo', 'Barba', 'Combos'];
const PORTFOLIO_CATEGORIES: PortfolioCategory[] = ['Todos', 'Cortes de Cabelo', 'Estilos de Barba'];
const BARBER_SPECIALTIES = ['Todos', 'Cortes Clássicos', 'Skin Fade', 'Barboterapia'] as const;
type BarberSpecialtyFilter = (typeof BARBER_SPECIALTIES)[number];

const normalizeSearchText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('Todos');
  const [portfolioCategory, setPortfolioCategory] = useState<PortfolioCategory>('Todos');
  const [activePortfolioIndex, setActivePortfolioIndex] = useState<number>(0);
  const [barberQuery, setBarberQuery] = useState<string>('');
  const [selectedBarberSpecialty, setSelectedBarberSpecialty] =
    useState<BarberSpecialtyFilter>('Todos');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(SERVICES[0].id);
  const [selectedBarberId, setSelectedBarberId] = useState<string>('any');
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState<number>(0);

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Appointment[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    } catch {
      // Ignore storage quota errors
    }
  }, [appointments]);

  const filteredServices = useMemo(() => {
    if (selectedCategory === 'Todos') return SERVICES;
    return SERVICES.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  const filteredPortfolio = useMemo(() => {
    if (portfolioCategory === 'Todos') return PORTFOLIO_ITEMS;
    return PORTFOLIO_ITEMS.filter((item) => item.category === portfolioCategory);
  }, [portfolioCategory]);

  const activePortfolioItem =
    filteredPortfolio[activePortfolioIndex] ?? filteredPortfolio[0] ?? PORTFOLIO_ITEMS[0];

  const filteredBarbers = useMemo(() => {
    const normalizedQuery = normalizeSearchText(barberQuery);
    return BARBERS.filter((barber) => {
      const searchable = normalizeSearchText(
        `${barber.name} ${barber.specialty} ${barber.role} ${barber.bio}`,
      );
      const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
      const matchesSpecialty =
        selectedBarberSpecialty === 'Todos' ||
        searchable.includes(normalizeSearchText(selectedBarberSpecialty));
      return matchesQuery && matchesSpecialty;
    });
  }, [barberQuery, selectedBarberSpecialty]);

  const scrollToBooking = () => {
    const el = document.getElementById('agendamento');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBookService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    scrollToBooking();
  };

  const handleBookBarber = (barberId: string) => {
    setSelectedBarberId(barberId);
    scrollToBooking();
  };

  const handleCreateAppointment = (appt: Appointment) => {
    setAppointments((prev) => {
      const conflict = prev.some(
        (existing) => existing.dateISO === appt.dateISO && existing.time === appt.time,
      );
      if (conflict) return prev;
      return [appt, ...prev];
    });
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const renderServiceIcon = (icon: 'scissors' | 'flame' | 'crown' | 'sparkles') => {
    const cls = 'w-7 h-7 text-[#C8A97E] transition-transform duration-300 group-hover:scale-110';
    switch (icon) {
      case 'scissors':
        return <Scissors className={cls} aria-hidden="true" />;
      case 'flame':
        return <Flame className={cls} aria-hidden="true" />;
      case 'crown':
        return <Crown className={cls} aria-hidden="true" />;
      case 'sparkles':
        return <Sparkles className={cls} aria-hidden="true" />;
    }
  };

  const activeTestimonial = TESTIMONIALS[activeTestimonialIdx];

  return (
    <div id="topo" className="min-h-screen bg-[#0A0A0A] text-[#FAFAF9]">
      <Navbar onNavigateBooking={scrollToBooking} />

      <main>
        {/* ========== HERO SECTION ========== */}
        <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[760px] lg:min-h-[860px] relative overflow-hidden">
          <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-20 pt-32 pb-14 lg:py-24 relative z-10">
            <div className="inline-flex items-center gap-3 mb-7">
              <span className="w-10 h-px bg-[#C8A97E]" aria-hidden="true" />
              <span className="text-[11px] uppercase tracking-[0.34em] text-[#C8A97E]">
                Jardins · São Paulo
              </span>
            </div>

            <h1 className="font-display text-6xl sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] leading-[0.94] tracking-[0.04em] text-[#FAFAF9] mb-7 text-balance">
              <span className="block">CORTE CLÁSSICO</span>
              <span className="block title-stroke">NAVALHA</span>
              <span className="block font-serif-editorial italic font-normal text-[#C8A97E] text-[0.68em] mt-1">
                &amp; Tradição
              </span>
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-[#999999] max-w-md mb-10">
              Barbearia clássica contemporânea dedicada ao visagismo masculino, cortes na tesoura e
              rituais térmicos à navalha japonesa. Atendimento exclusivo com horário marcado.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={scrollToBooking}
                className="group relative inline-flex items-center justify-center gap-3 min-h-[48px] px-8 py-3.5 bg-[#C8A97E] text-[#0A0A0A] text-xs font-semibold uppercase tracking-[0.22em] hover:bg-[#D4BC96] transition-colors duration-200 cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8A97E]"
              >
                <span>Agendar Horário</span>
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>

              <a
                href="#servicos"
                className="group inline-flex items-center gap-2.5 min-h-[44px] text-xs uppercase tracking-[0.18em] text-[#E8E6E1] hover:text-[#C8A97E] transition-colors whitespace-nowrap"
              >
                <span>Explorar Serviços</span>
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>

          <div className="relative min-h-[440px] lg:min-h-full">
            <HeroVisual />
          </div>
        </section>

        {/* ========== MARQUEE TICKER ========== */}
        <div className="py-6 border-y border-[#C8A97E]/15 overflow-hidden bg-[#0A0A0A]" aria-hidden="true">
          <div className="animate-marquee">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, index) => (
              <div key={`${item}-${index}`} className="flex items-center gap-8 px-6 whitespace-nowrap">
                <span className="font-display text-lg sm:text-xl tracking-[0.2em] text-[#999999] uppercase">
                  {item}
                </span>
                <span className="text-[#C8A97E] text-xs">/</span>
              </div>
            ))}
          </div>
        </div>

        {/* ========== NOSSA HISTÓRIA (ABOUT) ========== */}
        <section id="historia" className="py-24 lg:py-32 px-6 lg:px-16">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Overlapping Editorial Visuals */}
            <div className="lg:col-span-6 relative h-[460px] sm:h-[540px]">
              <div className="w-[74%] h-[86%] relative z-10">
                <AboutPrimaryVisual />
              </div>
              <div className="absolute right-0 bottom-0 w-[54%] h-[52%] z-20 border-[5px] border-[#0A0A0A]">
                <AboutSecondaryVisual />
              </div>
            </div>

            {/* Editorial Story & Quantitative Proof */}
            <div className="lg:col-span-6 lg:pl-6">
              <div className="inline-flex items-center gap-3 mb-5">
                <span className="w-8 h-px bg-[#C8A97E]" aria-hidden="true" />
                <span className="text-[11px] uppercase tracking-[0.32em] text-[#C8A97E]">
                  Nossa História
                </span>
              </div>

              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.04] tracking-[0.04em] text-[#FAFAF9] text-balance mb-7">
                DOZE ANOS DE{' '}
                <span className="font-serif-editorial italic font-normal text-[#C8A97E]">
                  Precisão
                </span>{' '}
                E OFÍCIO
              </h2>

              <p className="text-sm sm:text-base leading-relaxed text-[#999999] mb-5">
                Fundada em 2014 no coração dos Jardins, a Blade &amp; Co. nasceu com o propósito de
                resgatar o ritmo sereno da barbearia clássica europeia sem abrir mão das técnicas
                contemporâneas de visagismo.
              </p>

              <p className="text-sm sm:text-base leading-relaxed text-[#999999] mb-10">
                Cada cadeira opera por agendamento individual, com lâminas japonesas esterilizadas,
                toalhas a vapor com óleos botânicos e tempo dedicado para entender a estrutura real
                do seu cabelo e barba.
              </p>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#C8A97E]/15 tabular-nums">
                <div>
                  <p className="font-display text-3xl sm:text-4xl text-[#C8A97E]">12+</p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#999999] mt-1">
                    Anos de Ofício
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl sm:text-4xl text-[#C8A97E]">18.500+</p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#999999] mt-1">
                    Cortes Realizados
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl sm:text-4xl text-[#C8A97E]">4.9</p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#999999] mt-1">
                    Avaliação Média
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== SERVIÇOS ========== */}
        <section id="servicos" className="py-24 lg:py-28 px-6 lg:px-16 border-t border-[#C8A97E]/10">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
              <div>
                <div className="inline-flex items-center gap-3 mb-4">
                  <span className="w-8 h-px bg-[#C8A97E]" aria-hidden="true" />
                  <span className="text-[11px] uppercase tracking-[0.32em] text-[#C8A97E]">
                    Menu de Rituais
                  </span>
                </div>
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-[0.04em] text-[#FAFAF9]">
                  SERVIÇOS DE{' '}
                  <span className="font-serif-editorial italic font-normal text-[#C8A97E]">
                    Assinatura
                  </span>
                </h2>
              </div>

              {/* Interactive Category Filter */}
              <div
                className="inline-flex items-center gap-1 p-1 bg-[#141414] border border-[#C8A97E]/15 self-start lg:self-auto"
                role="tablist"
                aria-label="Filtrar serviços por categoria"
              >
                {SERVICE_CATEGORIES.map((category) => {
                  const active = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedCategory(category)}
                      className={`min-h-[38px] px-4 py-1.5 text-xs uppercase tracking-[0.16em] transition-colors whitespace-nowrap cursor-pointer ${
                        active
                          ? 'bg-[#C8A97E] text-[#0A0A0A] font-semibold'
                          : 'text-[#999999] hover:text-[#FAFAF9]'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hairline Grid matching .services-grid */}
            <div
              className={`grid grid-cols-1 md:grid-cols-2 ${
                filteredServices.length >= 4 ? 'xl:grid-cols-4' : 'xl:grid-cols-3'
              } gap-px bg-[#C8A97E]/15 border border-[#C8A97E]/15`}
            >
              {filteredServices.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => handleBookService(service.id)}
                  className="group relative bg-[#0A0A0A] p-8 sm:p-9 text-left flex flex-col justify-between transition-colors duration-300 hover:bg-[#141414] cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#C8A97E]"
                >
                  <div>
                    <div className="flex items-start justify-between mb-7">
                      {renderServiceIcon(service.icon)}
                      <ArrowUpRight
                        className="w-5 h-5 text-[#C8A97E] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="font-display text-2xl tracking-[0.08em] text-[#FAFAF9] mb-3">
                      {service.name}
                    </h3>

                    <p className="text-sm leading-relaxed text-[#999999] mb-5">
                      {service.description}
                    </p>

                    <p className="text-xs text-[#E8E6E1]/80 leading-relaxed mb-7">
                      {service.includes.join(' · ')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-[#C8A97E]/15 tabular-nums">
                    <span className="font-display text-3xl text-[#C8A97E]">
                      {service.priceFormatted}
                    </span>
                    <span className="text-xs uppercase tracking-[0.18em] text-[#999999]">
                      {service.durationLabel} · Agendar
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ========== GALERIA DE FOTOS / PORTFÓLIO (FLEXCAROUSEL) ========== */}
        <section id="galeria" className="py-24 lg:py-28 px-6 lg:px-16 overflow-hidden">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
              <div>
                <div className="inline-flex items-center gap-3 mb-4">
                  <span className="w-8 h-px bg-[#C8A97E]" aria-hidden="true" />
                  <span className="text-[11px] uppercase tracking-[0.32em] text-[#C8A97E]">
                    Portfólio de Cortes &amp; Barbas
                  </span>
                </div>
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-[0.04em] text-[#FAFAF9]">
                  GALERIA DE{' '}
                  <span className="font-serif-editorial italic font-normal text-[#C8A97E]">
                    Estilos
                  </span>
                </h2>
              </div>

              {/* Portfolio Category Filter */}
              <div
                className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#141414] border border-[#C8A97E]/15 self-start lg:self-auto"
                role="tablist"
                aria-label="Filtrar portfólio por tipo de estilo"
              >
                {PORTFOLIO_CATEGORIES.map((category) => {
                  const active = portfolioCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => {
                        setPortfolioCategory(category);
                        setActivePortfolioIndex(0);
                      }}
                      className={`min-h-[38px] px-4 py-1.5 text-xs uppercase tracking-[0.16em] transition-colors whitespace-nowrap cursor-pointer ${
                        active
                          ? 'bg-[#C8A97E] text-[#0A0A0A] font-semibold'
                          : 'text-[#999999] hover:text-[#FAFAF9]'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FlexCarousel WebGL Liquid Lens Showcase */}
            <div className="relative w-full h-[440px] sm:h-[540px] border-y border-[#C8A97E]/15 bg-[#0A0A0A]">
              <FlexCarousel
                items={filteredPortfolio}
                preset="liquid"
                intro="bloom"
                fit="portrait"
                cardHeight={0.58}
                gap={18}
                squeeze={0.2}
                focusOnClick
                captions
                selectedIndex={activePortfolioIndex}
                onChange={(index) => setActivePortfolioIndex(index)}
              />

              {filteredPortfolio.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Foto anterior da galeria"
                    onClick={() =>
                      setActivePortfolioIndex(
                        (prev) => (prev - 1 + filteredPortfolio.length) % filteredPortfolio.length,
                      )
                    }
                    className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-[#0A0A0A]/80 backdrop-blur-sm border border-[#C8A97E]/35 flex items-center justify-center text-[#FAFAF9] hover:bg-[#C8A97E] hover:text-[#0A0A0A] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Próxima foto da galeria"
                    onClick={() =>
                      setActivePortfolioIndex((prev) => (prev + 1) % filteredPortfolio.length)
                    }
                    className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-[#0A0A0A]/80 backdrop-blur-sm border border-[#C8A97E]/35 flex items-center justify-center text-[#FAFAF9] hover:bg-[#C8A97E] hover:text-[#0A0A0A] transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>

            {/* Clickable Photo Filmstrip */}
            <div
              className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 mt-4"
              role="list"
              aria-label="Miniaturas do portfólio"
            >
              {filteredPortfolio.map((item, idx) => {
                const isSelected = idx === activePortfolioIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="listitem"
                    aria-label={`Visualizar ${item.title}`}
                    aria-current={isSelected ? 'true' : undefined}
                    onClick={() => setActivePortfolioIndex(idx)}
                    className={`group relative aspect-[3/4] overflow-hidden border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#C8A97E] ring-1 ring-[#C8A97E]'
                        : 'border-[#C8A97E]/15 opacity-65 hover:opacity-100 hover:border-[#C8A97E]/45'
                    }`}
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/50 to-transparent text-left">
                      <p className="text-[10px] leading-tight text-[#FAFAF9] truncate">
                        {item.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Centered Style Info & Direct Booking Bar */}
            {activePortfolioItem && (
              <div className="mt-6 p-6 sm:p-8 bg-[#141414] border border-[#C8A97E]/15 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C8A97E] tabular-nums">
                    <span>{activePortfolioItem.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activePortfolioItem.duration}</span>
                    <span aria-hidden="true">·</span>
                    <span>Por {activePortfolioItem.barberName}</span>
                  </div>
                  <h3 className="font-display text-3xl tracking-[0.06em] text-[#FAFAF9]">
                    {activePortfolioItem.title}
                  </h3>
                  <p className="text-sm text-[#999999] leading-relaxed">
                    {activePortfolioItem.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleBookService(activePortfolioItem.recommendedServiceId)}
                    className="inline-flex items-center justify-center gap-3 min-h-[46px] px-7 py-3 bg-[#C8A97E] text-[#0A0A0A] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#D4BC96] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <span>Agendar Este Estilo</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <p className="text-[11px] text-[#999999] tracking-[0.12em]">
                    Arraste, use as setas ou clique na foto para ampliar
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ========== BARBEIROS (LIFTED #141414 SURFACE) ========== */}
        <section id="barbeiros" className="py-24 lg:py-28 px-6 lg:px-16 bg-[#141414]">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div>
                <div className="inline-flex items-center gap-3 mb-4">
                  <span className="w-8 h-px bg-[#C8A97E]" aria-hidden="true" />
                  <span className="text-[11px] uppercase tracking-[0.32em] text-[#C8A97E]">
                    Mestres da Casa
                  </span>
                </div>
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-[0.04em] text-[#FAFAF9]">
                  NOSSA{' '}
                  <span className="font-serif-editorial italic font-normal text-[#C8A97E]">
                    Equipe
                  </span>
                </h2>
              </div>
              <p className="text-sm text-[#999999] max-w-sm leading-relaxed">
                Profissionais com formação internacional e atendimento individualizado em estações
                privativas.
              </p>
            </div>

            {/* Search & Specialty Filter Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-8 mb-10 border-b border-[#C8A97E]/15">
              <div className="relative flex-1 max-w-md">
                <label htmlFor="barber-search" className="sr-only">
                  Buscar barbeiro por nome ou especialidade
                </label>
                <Search
                  className="w-4 h-4 text-[#C8A97E] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="barber-search"
                  type="text"
                  value={barberQuery}
                  onChange={(e) => setBarberQuery(e.target.value)}
                  placeholder="Buscar por nome ou especialidade (ex.: Rafael, Navalha, Fade)..."
                  className="w-full min-h-[44px] pl-11 pr-10 py-2.5 bg-[#0A0A0A] border border-[#C8A97E]/25 text-sm text-[#FAFAF9] placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#C8A97E] transition-colors"
                />
                {barberQuery && (
                  <button
                    type="button"
                    aria-label="Limpar busca de barbeiros"
                    onClick={() => setBarberQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#999999] hover:text-[#FAFAF9] cursor-pointer"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div
                  className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#0A0A0A] border border-[#C8A97E]/15"
                  role="tablist"
                  aria-label="Filtrar barbeiros por especialidade"
                >
                  {BARBER_SPECIALTIES.map((specialty) => {
                    const active = selectedBarberSpecialty === specialty;
                    return (
                      <button
                        key={specialty}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setSelectedBarberSpecialty(specialty)}
                        className={`min-h-[38px] px-3.5 py-1.5 text-xs uppercase tracking-[0.14em] transition-colors whitespace-nowrap cursor-pointer ${
                          active
                            ? 'bg-[#C8A97E] text-[#0A0A0A] font-semibold'
                            : 'text-[#999999] hover:text-[#FAFAF9]'
                        }`}
                      >
                        {specialty}
                      </button>
                    );
                  })}
                </div>

                {(barberQuery || selectedBarberSpecialty !== 'Todos') && (
                  <span className="text-xs text-[#999999] tabular-nums whitespace-nowrap">
                    {filteredBarbers.length} de {BARBERS.length}
                  </span>
                )}
              </div>
            </div>

            {filteredBarbers.length === 0 ? (
              <div className="py-16 px-6 text-center bg-[#0A0A0A] border border-dashed border-[#C8A97E]/25">
                <p className="font-display text-2xl tracking-[0.08em] text-[#FAFAF9] mb-2">
                  NENHUM PROFISSIONAL ENCONTRADO
                </p>
                <p className="text-sm text-[#999999] mb-6 max-w-md mx-auto">
                  Não encontramos barbeiros correspondentes aos critérios atuais. Tente buscar por
                  outro nome ou limpar os filtros.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setBarberQuery('');
                    setSelectedBarberSpecialty('Todos');
                  }}
                  className="min-h-[44px] px-6 py-2.5 bg-[#C8A97E] text-[#0A0A0A] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#D4BC96] transition-colors cursor-pointer"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredBarbers.map((barber, index) => (
                  <BarberCard
                    key={`${barber.id}-${selectedBarberSpecialty}`}
                    barber={barber}
                    index={index}
                    onBookBarber={handleBookBarber}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ========== AVALIAÇÕES (TESTIMONIALS) ========== */}
        <section id="avaliacoes" className="py-24 lg:py-32 px-6 lg:px-16 bg-[#0A0A0A]">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-[#C8A97E]" aria-hidden="true" />
              <span className="text-[11px] uppercase tracking-[0.32em] text-[#C8A97E]">
                Relatos de Clientes
              </span>
              <span className="w-8 h-px bg-[#C8A97E]" aria-hidden="true" />
            </div>

            <div className="flex justify-center gap-1.5 mb-7" aria-label="Avaliação 5 de 5 estrelas">
              {[0, 1, 2, 3, 4].map((star) => (
                <Star
                  key={star}
                  className="w-4 h-4 text-[#C8A97E] fill-[#C8A97E]"
                  aria-hidden="true"
                />
              ))}
            </div>

            <blockquote className="font-serif-editorial italic text-xl sm:text-2xl lg:text-[1.65rem] leading-relaxed text-[#E8E6E1] mb-8 min-h-[120px] flex items-center justify-center">
              “{activeTestimonial.quote}”
            </blockquote>

            <div className="mb-8">
              <p className="font-display text-xl tracking-[0.14em] text-[#FAFAF9]">
                {activeTestimonial.author}
              </p>
              <p className="text-xs uppercase tracking-[0.18em] text-[#C8A97E] mt-1">
                {activeTestimonial.role} · {activeTestimonial.neighborhood} ·{' '}
                {activeTestimonial.serviceName}
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                aria-label="Avaliação anterior"
                onClick={() =>
                  setActiveTestimonialIdx(
                    (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length,
                  )
                }
                className="w-10 h-10 border border-[#C8A97E]/30 flex items-center justify-center text-[#E8E6E1] hover:border-[#C8A97E] hover:text-[#C8A97E] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>

              <div className="flex items-center gap-2.5">
                {TESTIMONIALS.map((t, idx) => (
                  <button
                    key={t.id}
                    type="button"
                    aria-label={`Ver relato de ${t.author}`}
                    aria-current={idx === activeTestimonialIdx ? 'true' : undefined}
                    onClick={() => setActiveTestimonialIdx(idx)}
                    className={`w-2.5 h-2.5 rounded-full border border-[#C8A97E] transition-all cursor-pointer ${
                      idx === activeTestimonialIdx ? 'bg-[#C8A97E] scale-110' : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                aria-label="Próxima avaliação"
                onClick={() =>
                  setActiveTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length)
                }
                className="w-10 h-10 border border-[#C8A97E]/30 flex items-center justify-center text-[#E8E6E1] hover:border-[#C8A97E] hover:text-[#C8A97E] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        {/* ========== AGENDAMENTO (INTERACTIVE BOOKING ENGINE) ========== */}
        <BookingSection
          selectedServiceId={selectedServiceId}
          onSelectServiceId={setSelectedServiceId}
          selectedBarberId={selectedBarberId}
          onSelectBarberId={setSelectedBarberId}
          appointments={appointments}
          onCreateAppointment={handleCreateAppointment}
          onCancelAppointment={handleCancelAppointment}
        />
      </main>

      {/* ========== QUIET FOOTER ========== */}
      <footer className="border-t border-[#C8A97E]/15 pt-16 pb-10 px-6 lg:px-16 bg-[#0A0A0A]">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#C8A97E]/10">
            <div>
              <p className="font-display text-3xl tracking-[0.12em] text-[#FAFAF9] mb-4">
                BLADE <span className="font-serif-editorial italic text-[#C8A97E]">&amp;</span> CO.
              </p>
              <p className="text-sm text-[#999999] leading-relaxed max-w-xs mb-6">
                Barbearia clássica de alta precisão nos Jardins. Cortes estruturados, navalha
                japonesa e hospitalidade silenciosa.
              </p>
              <a
                href="#agendamento"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C8A97E] hover:text-[#D4BC96] transition-colors"
              >
                <Instagram className="w-4 h-4" aria-hidden="true" />
                <span>@bladeco.jardins</span>
              </a>
            </div>

            <div>
              <h3 className="font-display text-lg tracking-[0.14em] text-[#FAFAF9] mb-4">
                NAVEGAÇÃO
              </h3>
              <ul className="space-y-2.5 text-sm text-[#999999]">
                <li>
                  <a href="#historia" className="hover:text-[#C8A97E] transition-colors">
                    Nossa História
                  </a>
                </li>
                <li>
                  <a href="#servicos" className="hover:text-[#C8A97E] transition-colors">
                    Serviços &amp; Valores
                  </a>
                </li>
                <li>
                  <a href="#galeria" className="hover:text-[#C8A97E] transition-colors">
                    Arquivo de Estilo
                  </a>
                </li>
                <li>
                  <a href="#barbeiros" className="hover:text-[#C8A97E] transition-colors">
                    Mestres Barbeiros
                  </a>
                </li>
                <li>
                  <a href="#agendamento" className="hover:text-[#C8A97E] transition-colors">
                    Agendamento Online
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-lg tracking-[0.14em] text-[#FAFAF9] mb-4">
                HORÁRIOS
              </h3>
              <ul className="space-y-2.5 text-sm text-[#999999] tabular-nums">
                <li className="flex justify-between gap-4 max-w-[220px]">
                  <span>Segunda a Sexta</span>
                  <span className="text-[#E8E6E1]">09:00 – 20:00</span>
                </li>
                <li className="flex justify-between gap-4 max-w-[220px]">
                  <span>Sábado</span>
                  <span className="text-[#E8E6E1]">09:00 – 18:00</span>
                </li>
                <li className="flex justify-between gap-4 max-w-[220px]">
                  <span>Domingo</span>
                  <span>Fechado</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-lg tracking-[0.14em] text-[#FAFAF9] mb-4">
                ENDEREÇO
              </h3>
              <div className="space-y-3 text-sm text-[#999999]">
                <p className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C8A97E] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Rua Haddock Lobo, 1420 · Jardins, São Paulo – SP</span>
                </p>
                <p className="flex items-center gap-2.5 tabular-nums">
                  <Phone className="w-4 h-4 text-[#C8A97E] shrink-0" aria-hidden="true" />
                  <span>(11) 3062-8410</span>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#999999] tracking-[0.1em]">
            <p>© {new Date().getFullYear()} BLADE &amp; CO. BARBEARIA. TODOS OS DIREITOS RESERVADOS.</p>
            <p>ESTACIONAMENTO COM MANOBRISTA NO LOCAL</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
