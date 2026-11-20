export type ServiceCategory = 'Todos' | 'Cabelo' | 'Barba' | 'Combos';

export interface ServiceItem {
  id: string;
  name: string;
  category: Exclude<ServiceCategory, 'Todos'>;
  description: string;
  price: number;
  priceFormatted: string;
  durationMinutes: number;
  durationLabel: string;
  includes: string[];
  icon: 'scissors' | 'flame' | 'crown' | 'sparkles';
}

export interface BarberItem {
  id: string;
  name: string;
  role: string;
  experience: string;
  specialty: string;
  bio: string;
  instagram: string;
  monogram: string;
  chairNumber: string;
  image: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  recommendedServiceId: string;
  variant: 'taper' | 'towel' | 'fade' | 'razor' | 'lounge';
}

export type PortfolioCategory = 'Todos' | 'Cortes de Cabelo' | 'Estilos de Barba';

export interface PortfolioItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  category: Exclude<PortfolioCategory, 'Todos'>;
  duration: string;
  barberName: string;
  description: string;
  recommendedServiceId: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  neighborhood: string;
  serviceName: string;
}

export interface Appointment {
  id: string;
  protocol: string;
  serviceId: string;
  serviceName: string;
  price: number;
  durationMinutes: number;
  barberId: string;
  barberName: string;
  dateISO: string;
  time: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes?: string;
  createdAt: string;
}

export const MARQUEE_ITEMS = [
  'Corte Clássico',
  'Navalha Japonesa',
  'Toalha Quente & Eucalipto',
  'Visagismo Masculino',
  'Jardins · São Paulo',
  'Desde 2014',
  'Espresso & Bourbon',
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'corte-assinatura',
    name: 'Corte Assinatura',
    category: 'Cabelo',
    description:
      'Consultoria de visagismo, corte preciso na tesoura e máquina, lavagem revitalizante com shampoo mentolado e finalização matte.',
    price: 95,
    priceFormatted: 'R$ 95',
    durationMinutes: 45,
    durationLabel: '45 min',
    includes: ['Diagnóstico de perfil facial', 'Lavagem e massagem capilar', 'Finalização com pomada matte'],
    icon: 'scissors',
  },
  {
    id: 'barba-navalha',
    name: 'Barba à Navalha',
    category: 'Barba',
    description:
      'Ritual tradicional com duas toalhas quentes aromáticas, espuma cremosa de sândalo, alinhamento à lâmina e bálsamo calmante.',
    price: 75,
    priceFormatted: 'R$ 75',
    durationMinutes: 35,
    durationLabel: '35 min',
    includes: ['Compressa quente com eucalipto', 'Espuma de barbear artesanal', 'Óleo hidratante e tônico facial'],
    icon: 'flame',
  },
  {
    id: 'combo-mestre',
    name: 'Combo Mestre',
    category: 'Combos',
    description:
      'Experiência completa unindo o Corte Assinatura e a Barba à Navalha, acompanhada de esfoliação facial com carvão ativado e dose cortesia.',
    price: 150,
    priceFormatted: 'R$ 150',
    durationMinutes: 80,
    durationLabel: '80 min',
    includes: ['Corte Assinatura + Barba completa', 'Esfoliação facial purificante', 'Espresso ou Bourbon cortesia'],
    icon: 'crown',
  },
  {
    id: 'acabamento-sobrancelha',
    name: 'Acabamento & Perfil',
    category: 'Cabelo',
    description:
      'Manutenção rápida entre cortes para manter contornos da nuca, costeletas, alinhamento do pezinho e desenho discreto de sobrancelha.',
    price: 45,
    priceFormatted: 'R$ 45',
    durationMinutes: 20,
    durationLabel: '20 min',
    includes: ['Contorno na navalha de precisão', 'Alinhamento de costeletas e nuca', 'Design natural de sobrancelha'],
    icon: 'sparkles',
  },
];

export const BARBERS: BarberItem[] = [
  {
    id: 'rafael-monteiro',
    name: 'Rafael Monteiro',
    role: 'Mestre Barbeiro · Fundador',
    experience: '12 anos de ofício',
    specialty: 'Cortes Clássicos & Visagismo',
    bio: 'Formado em barbearia clássica em Londres e Milão. Especialista em estrutura capilar e cortes executivos de longa duração.',
    instagram: '@rafael.bladeco',
    monogram: 'RM',
    chairNumber: 'Cadeira 01',
    image: '/images/portfolio/pixabay-barber.jpg',
  },
  {
    id: 'lucas-vasconcelos',
    name: 'Lucas Vasconcelos',
    role: 'Barbeiro Sênior',
    experience: '8 anos de ofício',
    specialty: 'Skin Fade & Tesoura Livre',
    bio: 'Referência em transições milimétricas, texturização para cabelos médios e acabamentos de alta precisão.',
    instagram: '@lucas.bladeco',
    monogram: 'LV',
    chairNumber: 'Cadeira 02',
    image: '/images/barbershop/photo-1605497788044-5a32c70784_bf2592badfe2.jpg',
  },
  {
    id: 'henrique-braga',
    name: 'Henrique Braga',
    role: 'Especialista em Barboterapia',
    experience: '7 anos de ofício',
    specialty: 'Navalha Japonesa & Toalha Quente',
    bio: 'Mestre em simetria facial e rituais térmicos para peles sensíveis, garantindo barbas alinhadas sem irritação.',
    instagram: '@henrique.bladeco',
    monogram: 'HB',
    chairNumber: 'Cadeira 03',
    image: '/images/barbershop/photo-1503951914875-452162b0f3_ad68379d68f9.jpg',
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Executive Taper & Nuca Limpa',
    category: 'Corte Clássico',
    duration: '45 min',
    description: 'Laterais graduadas na tesoura com volume natural no topo e acabamento limpo para crescimento uniforme por até quatro semanas.',
    recommendedServiceId: 'corte-assinatura',
    variant: 'taper',
  },
  {
    id: 'gal-2',
    title: 'Ritual Toalha Quente & Eucalipto',
    category: 'Barboterapia',
    duration: '35 min',
    description: 'Preparação térmica que abre os poros e amacia os fios antes da passagem da lâmina, finalizada com pedra-ume e compressa fria.',
    recommendedServiceId: 'barba-navalha',
    variant: 'towel',
  },
  {
    id: 'gal-3',
    title: 'Skin Fade de Precisão',
    category: 'Degradê Navalhado',
    duration: '45 min',
    description: 'Degradê limpo sem marcas aparentes, respeitando o formato craniano e a direção natural de nascimento dos fios.',
    recommendedServiceId: 'corte-assinatura',
    variant: 'fade',
  },
  {
    id: 'gal-4',
    title: 'Lâmina Japonesa & Simetria',
    category: 'Contorno de Barba',
    duration: '80 min',
    description: 'Alinhamento geométrico das bochechas e pescoço utilizando navalha de aço carbono e óleos botânicos de hidratação profunda.',
    recommendedServiceId: 'combo-mestre',
    variant: 'razor',
  },
  {
    id: 'gal-5',
    title: 'Lounge & Estação Privativa',
    category: 'Jardins · São Paulo',
    duration: 'Atendimento pontual',
    description: 'Ambiente silencioso com poltronas de couro, iluminação quente e bar de cortesias para desacelerar no meio do dia.',
    recommendedServiceId: 'combo-mestre',
    variant: 'lounge',
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'port-1',
    src: '/images/portfolio/pixabay-barber.jpg',
    alt: 'Corte de cabelo masculino Executive Taper executado na tesoura e pente',
    title: 'Executive Taper',
    subtitle: 'Corte de Cabelo · Tesoura & Pente',
    category: 'Cortes de Cabelo',
    duration: '45 min',
    barberName: 'Rafael Monteiro',
    description:
      'Laterais graduadas na tesoura com volume equilibrado no topo e nuca limpa para manter o caimento impecável por semanas.',
    recommendedServiceId: 'corte-assinatura',
  },
  {
    id: 'port-2',
    src: '/images/portfolio/haircut-fade.jpg',
    alt: 'Corte de cabelo Skin Fade navalhado com transição gradual sem marcas',
    title: 'Skin Fade Navalhado',
    subtitle: 'Corte de Cabelo · Degradê Zero',
    category: 'Cortes de Cabelo',
    duration: '45 min',
    barberName: 'Lucas Vasconcelos',
    description:
      'Transição milimétrica do zero navalhado ao topo texturizado, adaptada ao formato craniano e direção natural dos fios.',
    recommendedServiceId: 'corte-assinatura',
  },
  {
    id: 'port-3',
    src: '/images/barbershop/photo-1605497788044-5a32c70784_bf2592badfe2.jpg',
    alt: 'Corte de cabelo Pompadour Clássico com volume frontal estruturado',
    title: 'Pompadour Clássico',
    subtitle: 'Corte de Cabelo · Volume & Matte',
    category: 'Cortes de Cabelo',
    duration: '45 min',
    barberName: 'Rafael Monteiro',
    description:
      'Topete estruturado com secagem direcionada e finalização em pomada matte de fixação leve sem brilho artificial.',
    recommendedServiceId: 'corte-assinatura',
  },
  {
    id: 'port-4',
    src: '/images/barbershop/photo-1622286342621-4bd786c244_af49aaaf1826.jpg',
    alt: 'Corte de cabelo Slick Back texturizado com acabamento em lâmina',
    title: 'Textured Crop & Fade',
    subtitle: 'Corte de Cabelo · Textura & Precisão',
    category: 'Cortes de Cabelo',
    duration: '45 min',
    barberName: 'Lucas Vasconcelos',
    description:
      'Topo com textura natural e desbaste interno preciso contrastado com laterais graduadas e contorno limpo na nuca.',
    recommendedServiceId: 'corte-assinatura',
  },
  {
    id: 'port-5',
    src: '/images/portfolio/barber-grooming-beard.jpg',
    alt: 'Estilo de barba cheia esculpida com linhas geométricas e óleo de sândalo',
    title: 'Barba Cheia Esculpida',
    subtitle: 'Estilo de Barba · Volume & Simetria',
    category: 'Estilos de Barba',
    duration: '35 min',
    barberName: 'Henrique Braga',
    description:
      'Escultura de volume com ângulos definidos na mandíbula, alinhamento à navalha japonesa e hidratação com óleo de sândalo.',
    recommendedServiceId: 'barba-navalha',
  },
  {
    id: 'port-6',
    src: '/images/barbershop/photo-1599351431202-1e0f013789_12f22dc1e8ca.jpg',
    alt: 'Estilo de barba executiva com degradê suave na costeleta e desenho à navalha',
    title: 'Barba Executiva & Contorno',
    subtitle: 'Estilo de Barba · Degradê Lateral',
    category: 'Estilos de Barba',
    duration: '35 min',
    barberName: 'Henrique Braga',
    description:
      'Comprimento uniforme e discreto com transição suave nas costeletas e contorno limpo na linha das bochechas e pescoço.',
    recommendedServiceId: 'barba-navalha',
  },
  {
    id: 'port-7',
    src: '/images/portfolio/barber-haircut-beard.jpg',
    alt: 'Acabamento de barba e costeleta realizado com navalha tradicional',
    title: 'Alinhamento à Navalha',
    subtitle: 'Estilo de Barba · Lâmina Japonesa',
    category: 'Estilos de Barba',
    duration: '35 min',
    barberName: 'Rafael Monteiro',
    description:
      'Definição milimétrica de linhas faciais com navalha em aço carbono, bálsamo botânico e finalização calmante.',
    recommendedServiceId: 'barba-navalha',
  },
  {
    id: 'port-8',
    src: '/images/portfolio/man-in-barbershop.jpg',
    alt: 'Ritual de barboterapia com toalha quente aromática e navalha japonesa',
    title: 'Ritual Toalha Quente',
    subtitle: 'Estilo de Barba · Barboterapia',
    category: 'Estilos de Barba',
    duration: '80 min',
    barberName: 'Henrique Braga',
    description:
      'Duas compressas térmicas de eucalipto, espuma densa e lâmina japonesa de precisão acompanhadas de corte assinatura.',
    recommendedServiceId: 'combo-mestre',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    quote:
      'Frequento barbearias há quinze anos e nunca encontrei a consistência da Blade & Co. O corte do Rafael mantém o caimento impecável mesmo três semanas depois.',
    author: 'Eduardo Silveira',
    role: 'Diretor Criativo',
    neighborhood: 'Vila Madalena',
    serviceName: 'Combo Mestre',
  },
  {
    id: 't2',
    quote:
      'O ritual de toalha quente com o Henrique resolveu minha irritação de pele após barbear. Atendimento pontual, silencioso e sem pressa.',
    author: 'Marcelo Andrade',
    role: 'Arquiteto Sênior',
    neighborhood: 'Jardins',
    serviceName: 'Barba à Navalha',
  },
  {
    id: 't3',
    quote:
      'Agendo sempre pelo site entre reuniões na Paulista. Chego no horário exato, tomo um espresso e saio pronto em 45 minutos.',
    author: 'Thiago Nogueira',
    role: 'Sócio-Fundador',
    neighborhood: 'Itaim Bibi',
    serviceName: 'Corte Assinatura',
  },
];

export const TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
];

export function getTimeSlotsForDate(dateISO: string): string[] {
  const [y, m, d] = dateISO.split('-').map(Number);
  const day = new Date(y, m - 1, d).getDay();
  if (day === 0) return [];
  if (day === 6) {
    // Sábado: 09:00 às 18:00 (último horário às 17:00)
    return TIME_SLOTS.filter((t) => Number(t.split(':')[0]) <= 17);
  }
  return TIME_SLOTS;
}

export const STORAGE_KEY = 'blade_co_appointments_v1';

export interface DateOption {
  iso: string;
  weekdayShort: string;
  dayNumber: string;
  monthShort: string;
  fullLabel: string;
  isClosed: boolean;
}

const WEEKDAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export function getUpcomingDates(days = 12): DateOption[] {
  const list: DateOption[] = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);

  for (let i = 0; i < days; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const iso = `${yyyy}-${mm}-${dd}`;
    const dayOfWeek = d.getDay();
    const weekdayShort = i === 0 ? 'Hoje' : WEEKDAYS_SHORT[dayOfWeek];
    const monthShort = MONTHS_SHORT[d.getMonth()];
    list.push({
      iso,
      weekdayShort,
      dayNumber: dd,
      monthShort,
      fullLabel: `${WEEKDAYS_SHORT[dayOfWeek]}, ${dd} de ${monthShort}`,
      isClosed: dayOfWeek === 0,
    });
  }
  return list;
}

/**
 * Deterministic baseline busy slots per date + time (strict 1 booking per time slot).
 */
export function isBaselineSlotOccupied(_barberId: string, dateISO: string, time: string): boolean {
  const seedStr = `${dateISO}|${time}`;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash * 31 + seedStr.charCodeAt(i)) >>> 0;
  }
  return hash % 6 === 0;
}

export function formatPhoneBR(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function buildICSContent(appt: Appointment): string {
  const [year, month, day] = appt.dateISO.split('-').map(Number);
  const [hour, minute] = appt.time.split(':').map(Number);
  const start = new Date(year, month - 1, day, hour, minute);
  const end = new Date(start.getTime() + appt.durationMinutes * 60000);

  const fmt = (d: Date) => {
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;
  };

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BLADE & CO.//Agendamento//PT-BR',
    'BEGIN:VEVENT',
    `UID:${appt.id}@bladeco.com.br`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:BLADE & CO. — ${appt.serviceName}`,
    `DESCRIPTION:Protocolo ${appt.protocol} · Barbeiro: ${appt.barberName} · Valor: R$ ${appt.price}`,
    'LOCATION:Rua Haddock Lobo, 1420 - Jardins, São Paulo',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
