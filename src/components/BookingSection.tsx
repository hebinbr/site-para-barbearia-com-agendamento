import React, { useMemo, useState } from 'react';
import { Calendar, Check, Clock, Download, Trash2, User } from 'lucide-react';
import {
  Appointment,
  BARBERS,
  SERVICES,
  buildICSContent,
  formatPhoneBR,
  getTimeSlotsForDate,
  getUpcomingDates,
  isBaselineSlotOccupied,
} from '../data/barbershop';
import { BookingVisual } from './EditorialArtwork';

interface BookingSectionProps {
  selectedServiceId: string;
  onSelectServiceId: (id: string) => void;
  selectedBarberId: string;
  onSelectBarberId: (id: string) => void;
  appointments: Appointment[];
  onCreateAppointment: (appointment: Appointment) => void;
  onCancelAppointment: (id: string) => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  selectedServiceId,
  onSelectServiceId,
  selectedBarberId,
  onSelectBarberId,
  appointments,
  onCreateAppointment,
  onCancelAppointment,
}) => {
  const dates = useMemo(() => getUpcomingDates(12), []);
  const firstOpenDate = useMemo(
    () => dates.find((d) => !d.isClosed)?.iso ?? dates[0].iso,
    [dates],
  );

  const [activeTab, setActiveTab] = useState<'new' | 'list'>('new');
  const [selectedDateISO, setSelectedDateISO] = useState<string>(firstOpenDate);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  const activeService = useMemo(
    () => SERVICES.find((s) => s.id === selectedServiceId) ?? SERVICES[0],
    [selectedServiceId],
  );

  const activeDateObj = useMemo(
    () => dates.find((d) => d.iso === selectedDateISO) ?? dates[0],
    [dates, selectedDateISO],
  );

  const dayTimeSlots = useMemo(
    () => getTimeSlotsForDate(selectedDateISO),
    [selectedDateISO],
  );

  const getSlotAvailability = (
    time: string,
  ): { occupied: boolean; availableSpots: number; assignedBarberId: string } => {
    const userBookedSameTime = appointments.some(
      (a) => a.dateISO === selectedDateISO && a.time === time,
    );
    const baselineBusy = isBaselineSlotOccupied('studio', selectedDateISO, time);
    const isOccupied = userBookedSameTime || baselineBusy;

    const assignedBarberId =
      selectedBarberId === 'any' ? BARBERS[0].id : selectedBarberId;

    return {
      occupied: isOccupied,
      availableSpots: isOccupied ? 0 : 1,
      assignedBarberId,
    };
  };

  const totalDaySpots = useMemo(() => {
    if (activeDateObj.isClosed) return 0;
    return dayTimeSlots.reduce((acc, slot) => {
      const userBookedSameTime = appointments.some(
        (a) => a.dateISO === selectedDateISO && a.time === slot,
      );
      const baselineBusy = isBaselineSlotOccupied('studio', selectedDateISO, slot);
      return acc + (userBookedSameTime || baselineBusy ? 0 : 1);
    }, 0);
  }, [activeDateObj.isClosed, appointments, dayTimeSlots, selectedDateISO]);

  const handleDateChange = (iso: string) => {
    setSelectedDateISO(iso);
    setSelectedTime('');
    setFormErrors((prev) => ({ ...prev, time: '' }));
  };

  const handleBarberChange = (id: string) => {
    onSelectBarberId(id);
    setSelectedTime('');
    setFormErrors((prev) => ({ ...prev, time: '' }));
  };

  const handleDownloadICS = (appt: Appointment) => {
    const content = buildICSContent(appt);
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agendamento-${appt.protocol.toLowerCase()}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!selectedTime) {
      errors.time = 'Selecione um horário disponível.';
    } else if (
      appointments.some((a) => a.dateISO === selectedDateISO && a.time === selectedTime) ||
      getSlotAvailability(selectedTime).occupied
    ) {
      errors.time = 'Já existe um agendamento neste horário. Escolha outro.';
    }

    if (clientName.trim().length < 3) {
      errors.name = 'Informe seu nome completo.';
    }

    const digits = clientPhone.replace(/\D/g, '');
    if (digits.length < 10) {
      errors.phone = 'Informe um WhatsApp válido com DDD.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail.trim())) {
      errors.email = 'Informe um e-mail válido para confirmação.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const slotCheck = getSlotAvailability(selectedTime);
    const resolvedBarber =
      BARBERS.find((b) => b.id === slotCheck.assignedBarberId) ?? BARBERS[0];

    const newAppt: Appointment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      protocol: `BLD-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceId: activeService.id,
      serviceName: activeService.name,
      price: activeService.price,
      durationMinutes: activeService.durationMinutes,
      barberId: resolvedBarber.id,
      barberName: resolvedBarber.name,
      dateISO: selectedDateISO,
      time: selectedTime,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim(),
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    onCreateAppointment(newAppt);
    setConfirmedAppointment(newAppt);
    setSelectedTime('');
    setNotes('');
    setFormErrors({});
  };

  const formatDisplayDate = (iso: string) => {
    const found = dates.find((d) => d.iso === iso);
    if (found) return found.fullLabel;
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <section
      id="agendamento"
      className="py-24 lg:py-32 px-6 lg:px-16 border-t border-[#C8A97E]/15 bg-[#0A0A0A]"
    >
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Editorial Column (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="w-8 h-px bg-[#C8A97E]" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-[#C8A97E]">
              Reserva Online
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-[0.04em] text-[#FAFAF9] text-balance mb-6">
            RESERVE SUA{' '}
            <span className="font-serif-editorial italic font-normal text-[#C8A97E]">
              Cadeira
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#999999] leading-relaxed mb-10 max-w-md">
            Escolha o ritual, o mestre barbeiro e o horário exato de sua preferência. Atendimento
            pontual sem espera no lounge.
          </p>

          {/* Offset framed artwork matching .booking-image::after */}
          <div className="relative h-[380px] sm:h-[440px]">
            <div className="relative z-10 w-full h-full border border-[#C8A97E]/20">
              <BookingVisual />
            </div>
            <div
              className="hidden sm:block absolute inset-0 border border-[#C8A97E]/50 translate-x-4 translate-y-4 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Right Interactive Booking Engine (7 cols) */}
        <div className="lg:col-span-7 bg-[#141414] border border-[#C8A97E]/15 p-6 sm:p-10">
          {/* Segmented Tab Bar */}
          <div className="flex items-center justify-between gap-4 pb-6 mb-8 border-b border-[#C8A97E]/15">
            <div className="flex items-center gap-2 bg-[#0A0A0A] p-1 border border-[#C8A97E]/15">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('new');
                  setConfirmedAppointment(null);
                }}
                className={`min-h-[40px] px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'new'
                    ? 'bg-[#C8A97E] text-[#0A0A0A]'
                    : 'text-[#999999] hover:text-[#FAFAF9]'
                }`}
              >
                Novo Agendamento
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className={`min-h-[40px] px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] transition-colors whitespace-nowrap cursor-pointer tabular-nums ${
                  activeTab === 'list'
                    ? 'bg-[#C8A97E] text-[#0A0A0A]'
                    : 'text-[#999999] hover:text-[#FAFAF9]'
                }`}
              >
                Meus Agendamentos ({appointments.length})
              </button>
            </div>
          </div>

          {activeTab === 'list' ? (
            /* Saved Appointments Manager */
            <div className="space-y-4">
              {appointments.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-[#C8A97E]/20 px-6">
                  <Calendar className="w-8 h-8 text-[#C8A97E]/60 mx-auto mb-3" aria-hidden="true" />
                  <p className="font-display text-2xl tracking-[0.08em] text-[#FAFAF9] mb-2">
                    NENHUM HORÁRIO RESERVADO
                  </p>
                  <p className="text-sm text-[#999999] mb-6 max-w-sm mx-auto">
                    Seus agendamentos confirmados aparecerão aqui com opção de exportar para o
                    calendário ou reagendar.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('new')}
                    className="min-h-[44px] px-6 py-2.5 bg-[#C8A97E] text-[#0A0A0A] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#D4BC96] transition-colors cursor-pointer"
                  >
                    Fazer Primeiro Agendamento
                  </button>
                </div>
              ) : (
                appointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-5 bg-[#0A0A0A] border border-[#C8A97E]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-[#C8A97E] tabular-nums">
                        <span className="font-semibold tracking-[0.12em]">{appt.protocol}</span>
                        <span aria-hidden="true">·</span>
                        <span>Confirmado</span>
                      </div>
                      <h3 className="font-display text-2xl tracking-[0.06em] text-[#FAFAF9]">
                        {appt.serviceName}
                      </h3>
                      <p className="text-xs text-[#E8E6E1] tabular-nums">
                        {formatDisplayDate(appt.dateISO)} às {appt.time} ({appt.durationMinutes} min)
                      </p>
                      <p className="text-xs text-[#999999]">
                        Barbeiro: {appt.barberName} · Valor: R$ {appt.price}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleDownloadICS(appt)}
                        className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 border border-[#C8A97E]/35 text-xs uppercase tracking-[0.14em] text-[#E8E6E1] hover:border-[#C8A97E] hover:text-[#C8A97E] transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <Download className="w-3.5 h-3.5" aria-hidden="true" />
                        Calendário
                      </button>

                      {confirmCancelId === appt.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onCancelAppointment(appt.id);
                              setConfirmCancelId(null);
                            }}
                            className="min-h-[40px] px-3 py-2 bg-red-900/60 border border-red-400/50 text-red-100 text-xs uppercase tracking-[0.12em] hover:bg-red-800 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Confirmar Cancelamento
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmCancelId(null)}
                            className="min-h-[40px] px-3 py-2 text-xs text-[#999999] hover:text-[#FAFAF9] cursor-pointer"
                          >
                            Manter
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmCancelId(appt.id)}
                          aria-label={`Cancelar agendamento ${appt.protocol}`}
                          className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-2 border border-white/10 text-xs uppercase tracking-[0.14em] text-[#999999] hover:border-red-400/50 hover:text-red-300 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : confirmedAppointment ? (
            /* Confirmation Pass */
            <div className="bg-[#0A0A0A] border border-[#C8A97E]/40 p-6 sm:p-8 space-y-6">
              <div className="flex items-start justify-between gap-4 border-b border-[#C8A97E]/15 pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#C8A97E] mb-2">
                    <Check className="w-4 h-4" aria-hidden="true" />
                    <span>Horário Confirmado</span>
                  </div>
                  <h3 className="font-display text-3xl sm:text-4xl tracking-[0.06em] text-[#FAFAF9]">
                    RESERVA {confirmedAppointment.protocol}
                  </h3>
                </div>
                <div className="text-right tabular-nums">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#999999]">Total</p>
                  <p className="font-display text-3xl text-[#C8A97E]">
                    R$ {confirmedAppointment.price}
                  </p>
                </div>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-[#999999]">Serviço</dt>
                  <dd className="mt-1 text-[#FAFAF9] font-medium">
                    {confirmedAppointment.serviceName} ({confirmedAppointment.durationMinutes} min)
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-[#999999]">Barbeiro</dt>
                  <dd className="mt-1 text-[#FAFAF9] font-medium">
                    {confirmedAppointment.barberName}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-[#999999]">
                    Data e Horário
                  </dt>
                  <dd className="mt-1 text-[#FAFAF9] font-medium tabular-nums">
                    {formatDisplayDate(confirmedAppointment.dateISO)} às {confirmedAppointment.time}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-[#999999]">Cliente</dt>
                  <dd className="mt-1 text-[#FAFAF9] font-medium">
                    {confirmedAppointment.clientName} · {confirmedAppointment.clientPhone}
                  </dd>
                </div>
              </dl>

              <p className="text-xs text-[#999999] border-t border-[#C8A97E]/15 pt-4">
                Local: Rua Haddock Lobo, 1420 · Jardins, São Paulo. Chegue 10 minutos antes para
                aproveitar nosso espresso de cortesia.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleDownloadICS(confirmedAppointment)}
                  className="flex-1 inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-3 bg-[#C8A97E] text-[#0A0A0A] text-xs font-semibold uppercase tracking-[0.18em] hover:bg-[#D4BC96] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  Adicionar ao Calendário (.ics)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="min-h-[46px] px-5 py-3 border border-[#C8A97E]/40 text-[#FAFAF9] text-xs uppercase tracking-[0.18em] hover:border-[#C8A97E] hover:text-[#C8A97E] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Meus Agendamentos
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmedAppointment(null)}
                  className="min-h-[46px] px-5 py-3 text-xs uppercase tracking-[0.18em] text-[#999999] hover:text-[#FAFAF9] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Nova Reserva
                </button>
              </div>
            </div>
          ) : (
            /* Main Booking Form */
            <form onSubmit={validateAndSubmit} noValidate className="space-y-8">
              {/* Step 01: Service Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] uppercase tracking-[0.24em] text-[#C8A97E] font-medium">
                    01. Escolha o Serviço
                  </span>
                  <span className="text-xs text-[#999999] tabular-nums">
                    {activeService.durationLabel}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SERVICES.map((srv) => {
                    const selected = srv.id === activeService.id;
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => onSelectServiceId(srv.id)}
                        aria-pressed={selected}
                        className={`text-left p-4 border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                          selected
                            ? 'bg-[#0A0A0A] border-[#C8A97E] text-[#FAFAF9]'
                            : 'bg-[#0A0A0A]/50 border-[#C8A97E]/15 text-[#999999] hover:border-[#C8A97E]/45 hover:text-[#FAFAF9]'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#FAFAF9] truncate">{srv.name}</p>
                          <p className="text-xs text-[#999999] mt-0.5 tabular-nums">
                            {srv.durationLabel}
                          </p>
                        </div>
                        <span className="font-display text-xl text-[#C8A97E] shrink-0 tabular-nums">
                          {srv.priceFormatted}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 02: Barber Selection */}
              <div>
                <span className="block text-[11px] uppercase tracking-[0.24em] text-[#C8A97E] font-medium mb-3">
                  02. Mestre Barbeiro
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleBarberChange('any')}
                    aria-pressed={selectedBarberId === 'any'}
                    className={`min-h-[56px] p-3 border text-left transition-colors cursor-pointer ${
                      selectedBarberId === 'any'
                        ? 'bg-[#0A0A0A] border-[#C8A97E] text-[#FAFAF9]'
                        : 'bg-[#0A0A0A]/50 border-[#C8A97E]/15 text-[#999999] hover:border-[#C8A97E]/45 hover:text-[#FAFAF9]'
                    }`}
                  >
                    <p className="text-xs font-medium text-[#FAFAF9]">Sem preferência</p>
                    <p className="text-[11px] text-[#999999] mt-0.5">Mais horários</p>
                  </button>
                  {BARBERS.map((barber) => {
                    const selected = selectedBarberId === barber.id;
                    return (
                      <button
                        key={barber.id}
                        type="button"
                        onClick={() => handleBarberChange(barber.id)}
                        aria-pressed={selected}
                        className={`min-h-[56px] p-3 border text-left transition-colors cursor-pointer ${
                          selected
                            ? 'bg-[#0A0A0A] border-[#C8A97E] text-[#FAFAF9]'
                            : 'bg-[#0A0A0A]/50 border-[#C8A97E]/15 text-[#999999] hover:border-[#C8A97E]/45 hover:text-[#FAFAF9]'
                        }`}
                      >
                        <p className="text-xs font-medium text-[#FAFAF9] truncate">
                          {barber.name.split(' ')[0]} {barber.name.split(' ')[1]?.[0]}.
                        </p>
                        <p className="text-[11px] text-[#999999] mt-0.5 truncate">
                          {barber.chairNumber}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 03: Date & Real-Time Time Slot Grid */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] uppercase tracking-[0.24em] text-[#C8A97E] font-medium">
                    03. Data &amp; Horário
                  </span>
                  <span className="text-xs text-[#999999] tabular-nums">
                    {activeDateObj.fullLabel} ·{' '}
                    <span className="text-[#C8A97E]">
                      {totalDaySpots === 1 ? '1 vaga restante' : `${totalDaySpots} vagas disponíveis`}
                    </span>
                  </span>
                </div>

                {/* Date Horizontal Selector */}
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-4">
                  {dates.slice(0, 6).map((d) => {
                    const isSelected = d.iso === selectedDateISO;
                    return (
                      <button
                        key={d.iso}
                        type="button"
                        disabled={d.isClosed}
                        onClick={() => handleDateChange(d.iso)}
                        className={`min-h-[58px] py-2 px-2 border text-center transition-colors tabular-nums ${
                          d.isClosed
                            ? 'bg-[#0A0A0A]/30 border-white/5 text-[#6B6B6B] cursor-not-allowed'
                            : isSelected
                              ? 'bg-[#C8A97E] border-[#C8A97E] text-[#0A0A0A] cursor-pointer'
                              : 'bg-[#0A0A0A]/50 border-[#C8A97E]/15 text-[#E8E6E1] hover:border-[#C8A97E] cursor-pointer'
                        }`}
                      >
                        <span className="block text-[10px] uppercase tracking-[0.14em]">
                          {d.weekdayShort}
                        </span>
                        <span className="block font-display text-xl leading-tight mt-0.5">
                          {d.dayNumber}
                        </span>
                        <span className="block text-[10px] opacity-80">
                          {d.isClosed ? 'Fechado' : d.monthShort}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Time Slots Grid with Available Spots Counter (1h intervals, max 1 booking per slot) */}
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2.5"
                  role="group"
                  aria-label="Horários disponíveis com intervalo de 1 hora"
                >
                  {dayTimeSlots.map((slot) => {
                    const { occupied, availableSpots } = getSlotAvailability(slot);
                    const isSelected = selectedTime === slot;
                    const spotsLabel = occupied ? 'Esgotado' : `${availableSpots} vaga`;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={occupied}
                        onClick={() => {
                          setSelectedTime(slot);
                          setFormErrors((prev) => ({ ...prev, time: '' }));
                        }}
                        aria-pressed={isSelected}
                        aria-label={`${slot} — ${spotsLabel}`}
                        className={`min-h-[44px] px-3.5 py-2 border flex items-center justify-between gap-2 text-xs tabular-nums transition-colors ${
                          occupied
                            ? 'bg-[#0A0A0A]/25 border-white/5 text-[#6B6B6B] cursor-not-allowed'
                            : isSelected
                              ? 'bg-[#C8A97E] border-[#C8A97E] text-[#0A0A0A] font-semibold cursor-pointer'
                              : 'bg-[#0A0A0A] border-[#C8A97E]/20 text-[#FAFAF9] hover:border-[#C8A97E] cursor-pointer'
                        }`}
                      >
                        <span className={occupied ? 'line-through font-medium' : 'font-medium'}>
                          {slot}
                        </span>
                        <span
                          className={`text-[11px] whitespace-nowrap ${
                            occupied
                              ? 'text-[#6B6B6B]'
                              : isSelected
                                ? 'text-[#0A0A0A]/85 font-semibold'
                                : 'text-[#C8A97E] font-medium'
                          }`}
                        >
                          {spotsLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 mt-2.5 text-[11px] text-[#999999]">
                  <span>Intervalo de 1h · 1 atendimento exclusivo por horário</span>
                  {formErrors.time && (
                    <span className="text-red-400 font-medium" role="alert">
                      {formErrors.time}
                    </span>
                  )}
                </div>
              </div>

              {/* Step 04: Client Details (Underline Inputs matching design system) */}
              <div className="space-y-5 pt-2">
                <span className="block text-[11px] uppercase tracking-[0.24em] text-[#C8A97E] font-medium">
                  04. Seus Dados
                </span>

                <div>
                  <label
                    htmlFor="booking-name"
                    className="block text-[11px] uppercase tracking-[0.22em] text-[#999999] mb-1"
                  >
                    Nome Completo
                  </label>
                  <input
                    id="booking-name"
                    type="text"
                    value={clientName}
                    onChange={(e) => {
                      setClientName(e.target.value);
                      if (formErrors.name) setFormErrors((p) => ({ ...p, name: '' }));
                    }}
                    placeholder="Ex.: Ricardo Almeida"
                    className="w-full py-3 bg-transparent border-b border-[#C8A97E]/25 text-[#FAFAF9] text-sm placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#C8A97E] transition-colors"
                  />
                  {formErrors.name && (
                    <p className="text-xs text-red-400 mt-1" role="alert">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="booking-phone"
                      className="block text-[11px] uppercase tracking-[0.22em] text-[#999999] mb-1"
                    >
                      WhatsApp
                    </label>
                    <input
                      id="booking-phone"
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => {
                        setClientPhone(formatPhoneBR(e.target.value));
                        if (formErrors.phone) setFormErrors((p) => ({ ...p, phone: '' }));
                      }}
                      placeholder="(11) 99999-9999"
                      className="w-full py-3 bg-transparent border-b border-[#C8A97E]/25 text-[#FAFAF9] text-sm placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#C8A97E] transition-colors tabular-nums"
                    />
                    {formErrors.phone && (
                      <p className="text-xs text-red-400 mt-1" role="alert">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="booking-email"
                      className="block text-[11px] uppercase tracking-[0.22em] text-[#999999] mb-1"
                    >
                      E-mail
                    </label>
                    <input
                      id="booking-email"
                      type="email"
                      value={clientEmail}
                      onChange={(e) => {
                        setClientEmail(e.target.value);
                        if (formErrors.email) setFormErrors((p) => ({ ...p, email: '' }));
                      }}
                      placeholder="ricardo@empresa.com.br"
                      className="w-full py-3 bg-transparent border-b border-[#C8A97E]/25 text-[#FAFAF9] text-sm placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#C8A97E] transition-colors"
                    />
                    {formErrors.email && (
                      <p className="text-xs text-red-400 mt-1" role="alert">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="booking-notes"
                    className="block text-[11px] uppercase tracking-[0.22em] text-[#999999] mb-1"
                  >
                    Observações (opcional)
                  </label>
                  <input
                    id="booking-notes"
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Preferência de bebida, pele sensível ou estilo de corte"
                    className="w-full py-3 bg-transparent border-b border-[#C8A97E]/25 text-[#FAFAF9] text-sm placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#C8A97E] transition-colors"
                  />
                </div>
              </div>

              {/* Summary & Primary Submit CTA */}
              <div className="pt-4 border-t border-[#C8A97E]/15 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#E8E6E1] tabular-nums">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#C8A97E]" aria-hidden="true" />
                      {selectedBarberId === 'any'
                        ? 'Próximo Barbeiro Livre'
                        : BARBERS.find((b) => b.id === selectedBarberId)?.name}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#C8A97E]" aria-hidden="true" />
                      {selectedTime ? `${activeDateObj.fullLabel} · ${selectedTime}` : 'Escolha um horário'}
                    </span>
                  </div>
                  <span className="font-display text-2xl text-[#C8A97E]">
                    {activeService.priceFormatted}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[52px] py-4 px-6 bg-[#C8A97E] text-[#0A0A0A] text-xs font-semibold uppercase tracking-[0.24em] hover:bg-[#D4BC96] transition-colors duration-200 flex items-center justify-center gap-3 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A97E]"
                >
                  <span>Confirmar Agendamento</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
