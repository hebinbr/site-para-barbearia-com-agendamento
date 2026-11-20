import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

/**
 * Photographic visual frames paired with obsidian scrims and resilient fallbacks
 * tailored to the #0A0A0A obsidian & #C8A97E champagne gold design system.
 */

export const HeroVisual: React.FC = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative w-full h-full min-h-[460px] bg-[#0D0C0A] overflow-hidden select-none">
      {!imgError ? (
        <img
          src="/images/barbershop/photo-1503951914875-452162b0f3_6a26d7b8dbf9.avif"
          alt="Mestre barbeiro aparando barba com tesoura de precisão sob iluminação quente"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover object-center scale-[1.02]"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 62% 38%, rgba(200, 169, 126, 0.22) 0%, rgba(168, 136, 94, 0.06) 45%, rgba(10, 10, 10, 0.96) 85%)',
          }}
        />
      )}

      {/* Subtle warm editorial tint */}
      <div className="absolute inset-0 bg-[#C8A97E]/[0.06] mix-blend-soft-light pointer-events-none" />

      {/* Directional obsidian scrim matching design system (.hero-image::after) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, #0A0A0A 0%, rgba(10, 10, 10, 0.45) 28%, transparent 55%), linear-gradient(to top, #0A0A0A 0%, transparent 32%)',
        }}
      />

      {/* Quiet architectural plate caption */}
      <div className="absolute bottom-8 right-8 text-right pointer-events-none">
        <p className="text-[11px] tracking-[0.28em] uppercase text-[#C8A97E]">
          Atelier Jardins · Est. 2014
        </p>
        <p className="text-xs text-[#E8E6E1]/80 mt-1 tabular-nums">
          Rua Haddock Lobo, 1420 · São Paulo
        </p>
      </div>
    </div>
  );
};

export const AboutPrimaryVisual: React.FC = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative w-full h-full bg-[#12110F] overflow-hidden border border-[#C8A97E]/15">
      {!imgError ? (
        <img
          src="/images/portfolio/pixabay-barber.jpg"
          alt="Barbeiro executando corte clássico na tesoura e pente no atelier Blade & Co."
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 35%, rgba(200, 169, 126, 0.16), rgba(10, 10, 10, 0.94) 75%)',
          }}
        />
      )}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(10, 10, 10, 0.85) 0%, rgba(10, 10, 10, 0.12) 45%, transparent 100%)',
        }}
      />
      <div className="absolute bottom-6 left-6">
        <span className="text-[11px] tracking-[0.25em] uppercase text-[#C8A97E]">
          Três estações privativas · Jardins
        </span>
      </div>
    </div>
  );
};

export const AboutSecondaryVisual: React.FC = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative w-full h-full bg-[#151412] overflow-hidden">
      {!imgError ? (
        <img
          src="/images/barbershop/photo-1621605815971-fbc98d6650_2ef33d15070f.avif"
          alt="Bancada com tesouras japonesas, máquinas de acabamento, pente e pomada artesanal"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 60% 45%, rgba(200, 169, 126, 0.18), rgba(10, 10, 10, 0.96) 78%)',
          }}
        />
      )}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(10, 10, 10, 0.82) 0%, transparent 55%)',
        }}
      />
      <div className="absolute bottom-4 right-5 text-right">
        <span className="text-[10px] tracking-[0.24em] uppercase text-[#E8E6E1]">
          Aço Damasco · Sândalo
        </span>
      </div>
    </div>
  );
};

export const BarberPortraitVisual: React.FC<{
  image: string;
  name: string;
  monogram: string;
  chairNumber: string;
  specialty: string;
}> = ({ image, name, monogram, chairNumber, specialty }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative w-full h-full bg-[#11100E] overflow-hidden">
      {!imgError ? (
        <img
          src={image}
          alt={`${name} — ${specialty}`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            background:
              'radial-gradient(circle at 50% 34%, rgba(200, 169, 126, 0.2), rgba(12, 12, 12, 0.96) 72%)',
          }}
        >
          <span className="font-display text-5xl tracking-[0.14em] text-[#C8A97E]">{monogram}</span>
        </div>
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(10, 10, 10, 0.88) 0%, rgba(10, 10, 10, 0.15) 45%, rgba(10, 10, 10, 0.35) 100%)',
        }}
      />

      <div className="absolute top-5 right-5 text-right">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#C8A97E] bg-[#0A0A0A]/75 px-2.5 py-1 border border-[#C8A97E]/25">
          {chairNumber}
        </span>
      </div>

      <div className="absolute bottom-5 inset-x-5">
        <span className="text-[11px] tracking-[0.18em] uppercase text-[#E8E6E1]/90">
          {specialty}
        </span>
      </div>
    </div>
  );
};

export const BookingVisual: React.FC = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative w-full h-full min-h-[340px] bg-[#12110F] overflow-hidden">
      {!imgError ? (
        <img
          src="/images/barbershop/photo-1622286342621-4bd786c244_49252f554553.avif"
          alt="Atendimento exclusivo e acabamento preciso na cadeira Blade & Co."
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 45% 40%, rgba(200, 169, 126, 0.2), rgba(10, 10, 10, 0.95) 75%)',
          }}
        />
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(10, 10, 10, 0.94) 0%, rgba(10, 10, 10, 0.55) 45%, rgba(10, 10, 10, 0.28) 100%)',
        }}
      />

      <div className="relative z-10 h-full min-h-[340px] flex flex-col justify-end p-8">
        <div className="border-t border-[#C8A97E]/30 pt-5">
          <div className="flex items-center gap-2 text-[#C8A97E] text-[11px] tracking-[0.25em] uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Horário de Funcionamento</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs text-[#E8E6E1] tabular-nums">
            <div>
              <p className="text-[#999999]">Segunda a Sexta</p>
              <p className="mt-0.5 font-medium">09:00 — 20:00</p>
            </div>
            <div>
              <p className="text-[#999999]">Sábado</p>
              <p className="mt-0.5 font-medium">09:00 — 18:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
