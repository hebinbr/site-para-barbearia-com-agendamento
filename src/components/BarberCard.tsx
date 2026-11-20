import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { BarberItem } from '../data/barbershop';
import { BarberPortraitVisual } from './EditorialArtwork';

interface BarberCardProps {
  barber: BarberItem;
  index: number;
  onBookBarber: (barberId: string) => void;
}

const STAGGER_DELAYS = ['delay-0', 'delay-100', 'delay-200'] as const;

export const BarberCard: React.FC<BarberCardProps> = ({ barber, index, onBookBarber }) => {
  const cardRef = useRef<HTMLElement | null>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    let rafId = 0;

    const triggerEnter = () => {
      rafId = requestAnimationFrame(() => {
        setEntered(true);
      });
    };

    if (typeof IntersectionObserver === 'undefined') {
      triggerEnter();
      return () => cancelAnimationFrame(rafId);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          triggerEnter();
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  const delayClass = STAGGER_DELAYS[index % STAGGER_DELAYS.length];

  return (
    <article
      ref={cardRef}
      className={`group flex flex-col transform transition-all duration-500 ease-out ${delayClass} motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 ${
        entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="aspect-[3/4] overflow-hidden border border-[#C8A97E]/15 mb-5">
        <BarberPortraitVisual
          image={barber.image}
          name={barber.name}
          monogram={barber.monogram}
          chairNumber={barber.chairNumber}
          specialty={barber.specialty}
        />
      </div>

      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <h3 className="font-display text-2xl tracking-[0.08em] text-[#FAFAF9]">{barber.name}</h3>
          <p className="text-xs uppercase tracking-[0.18em] text-[#C8A97E] mt-0.5">{barber.role}</p>
        </div>
        <span className="text-xs text-[#999999] shrink-0">{barber.experience}</span>
      </div>

      <p className="text-xs uppercase tracking-[0.14em] text-[#E8E6E1]/80 mb-3">
        {barber.specialty}
      </p>

      <p className="text-sm text-[#999999] leading-relaxed mb-5 flex-1">{barber.bio}</p>

      <button
        type="button"
        onClick={() => onBookBarber(barber.id)}
        className="inline-flex items-center justify-between min-h-[44px] px-4 py-2.5 border border-[#C8A97E]/30 text-xs uppercase tracking-[0.18em] text-[#E8E6E1] hover:bg-[#C8A97E] hover:text-[#0A0A0A] hover:border-[#C8A97E] transition-colors cursor-pointer"
      >
        <span>Agendar com {barber.name.split(' ')[0]}</span>
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </article>
  );
};
