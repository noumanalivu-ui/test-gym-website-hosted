// src/components/contact/ContactForm.jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { SITE_NAME, whatsAppNumber } from '../../data/siteInfo';

/*
  Submissions go to Web3Forms (https://api.web3forms.com/submit).
  The access key is public by design and lives in .env as
  NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY. The email you registered the key with
  receives every submission.
*/
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const REQUEST_TIMEOUT_MS = 15000;

/* =========================================
   EDITABLE CONTENT
========================================= */
const TIME_SLOTS = [
  { id: 'morning', label: 'Morning', time: '6–10 AM', icon: '🌅' },
  { id: 'midday', label: 'Midday', time: '10 AM–2 PM', icon: '☀️' },
  { id: 'afternoon', label: 'Afternoon', time: '2–5 PM', icon: '🌤️' },
  { id: 'evening', label: 'Evening', time: '5–8 PM', icon: '🌆' },
  { id: 'late', label: 'Late Eve', time: '8–10 PM', icon: '🌙' },
];

const GOALS = [
  'Weight loss',
  'Muscle gain',
  'Strength & conditioning',
  'General fitness',
  'Flexibility & mobility',
  'Sports performance',
  'Not sure yet',
];

const FIELD_ORDER = ['name', 'phone', 'email', 'date', 'slot'];

const INITIAL = {
  name: '',
  phone: '',
  email: '',
  date: '',
  slot: '',
  goal: '',
  message: '',
  trap: '', // honeypot, must stay empty
};

/* =========================================
   STYLE TOKENS
========================================= */
const LABEL_CLASS =
  'block text-[11px] font-semibold uppercase tracking-widest text-text-secondary';
const INPUT_BASE =
  'w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand-primary';
const inputClass = (err) => `${INPUT_BASE} ${err ? 'border-danger' : 'border-border'}`;

const Field = ({ id, label, required, error, children }) => (
  <div className="space-y-2">
    <label htmlFor={id} className={LABEL_CLASS}>
      {label}
      {required && (
        <span className="text-danger" aria-hidden="true">
          {' '}*
        </span>
      )}
    </label>
    {children}
    {error && (
      <p id={`${id}-error`} className="text-xs text-danger">
        {error}
      </p>
    )}
  </div>
);

/* =========================================
   COMPONENT
========================================= */
const ContactForm = () => {
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [serverMessage, setServerMessage] = useState('');
  const [minDate, setMinDate] = useState('');
  const successRef = useRef(null);

  // Local "today" computed after mount to avoid server/client hydration mismatch
  useEffect(() => {
    const d = new Date();
    const pad = (x) => String(x).padStart(2, '0');
    setMinDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  }, []);

  useEffect(() => {
    if (status === 'success') successRef?.current?.focus?.();
  }, [status]);

  const setField = (key, val) => {
    setValues((v) => ({ ...v, [key]: val }));
    setErrors((e) => (e?.[key] ? { ...e, [key]: undefined } : e));
  };

  const validate = (v) => {
    const e = {};
    if ((v?.name ?? '').trim().length < 2) e.name = 'Please enter your full name';
    const digits = (v?.phone ?? '').replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) e.phone = 'Please enter a valid phone number';
    if (v?.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) {
      e.email = 'Please enter a valid email address';
    }
    if (!v?.date) e.date = 'Please choose a visit date';
    else if (minDate && v.date < minDate) e.date = 'Please choose today or a future date';
    if (!v?.slot) e.slot = 'Please pick a time slot';
    return e;
  };

  const slotLabel = (id) => {
    const s = TIME_SLOTS?.find((t) => t?.id === id);
    return s ? `${s.label} (${s.time})` : '';
  };

  const prettyDate = (d) => {
    if (!d) return '';
    const parsed = new Date(`${d}T00:00:00`);
    return Number.isNaN(parsed.getTime())
      ? d
      : parsed.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
  };

  const whatsAppHref = () => {
    const lines = [
      `Hello ${SITE_NAME},`,
      '',
      "I'd like to book a session.",
      '',
      `Name: ${values?.name?.trim()}`,
      `Phone: ${values?.phone?.trim()}`,
      values?.email?.trim() ? `Email: ${values.email.trim()}` : null,
      `Preferred date: ${prettyDate(values?.date)}`,
      `Preferred time: ${slotLabel(values?.slot)}`,
      values?.goal ? `Goal: ${values.goal}` : null,
      values?.message?.trim() ? `Note: ${values.message.trim()}` : null,
      '',
      'Thank you.',
    ].filter((l) => l !== null);
    return `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  const onSubmit = async (e) => {
    e?.preventDefault?.();
    if (status === 'sending') return;

    const found = validate(values);
    setErrors(found);
    const first = FIELD_ORDER.find((k) => found?.[k]);
    if (first) {
      const id = first === 'slot' ? `cf-slot-${TIME_SLOTS?.[0]?.id}` : `cf-${first}`;
      document?.getElementById?.(id)?.focus?.();
      return;
    }

    // Bots fill hidden fields; pretend success without sending
    if (values?.trap) {
      setStatus('success');
      return;
    }

    // Must be referenced literally so Next.js can inline it at build time
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      console.error('Missing NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY in .env (restart the dev server after adding it).');
      setServerMessage('');
      setStatus('error');
      return;
    }

    setStatus('sending');
    setServerMessage('');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const payload = {
        access_key: accessKey,
        subject: `New session booking | ${SITE_NAME}`,
        from_name: SITE_NAME,
        name: values.name.trim(),
        phone: values.phone.trim(),
        visit_date: prettyDate(values.date),
        time_slot: slotLabel(values.slot),
        goal: values.goal || 'Not specified',
        message: values.message.trim() || 'No additional note',
        source: 'contact-page',
      };
      // Optional field: only send a valid email so Web3Forms can set reply-to
      if (values.email.trim()) payload.email = values.email.trim();

      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const data = await res?.json?.().catch(() => null);
      if (!res?.ok || !data?.success) {
        setServerMessage(data?.message ?? '');
        throw new Error(data?.message || 'Request failed');
      }
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      clearTimeout(timer);
    }
  };

  const reset = () => {
    setValues(INITIAL);
    setErrors({});
    setServerMessage('');
    setStatus('idle');
  };

  /* ---------- Success state ---------- */
  if (status === 'success') {
    return (
      <div aria-live="polite" className="flex flex-col items-center gap-5 py-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface-hover">
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-success" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <div className="space-y-2">
          <h3
            ref={successRef}
            tabIndex={-1}
            className="font-display text-3xl font-bold uppercase tracking-tight text-text-primary focus:outline-none"
          >
            You&rsquo;re on the list
          </h3>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-text-secondary">
            Thanks {values?.name?.trim()?.split(' ')?.[0]}. We have your request for{' '}
            <strong className="font-semibold text-text-primary">{prettyDate(values?.date)}</strong>,{' '}
            {slotLabel(values?.slot)}. Our team will get in touch to confirm.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={whatsAppHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-brand-secondary px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            Confirm faster on WhatsApp
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md border border-border px-5 py-3 text-xs font-bold uppercase tracking-wider text-text-primary transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            Book another session
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Form ---------- */
  const errorCount = Object.values(errors ?? {}).filter(Boolean).length;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Book your session"
      aria-busy={status === 'sending'}
      className="relative space-y-5"
    >
      {errorCount > 0 && (
        <p role="alert" className="rounded-lg border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-sm text-text-primary">
          Please fix {errorCount} {errorCount === 1 ? 'field' : 'fields'} below to continue.
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id="cf-name" label="Full name" required error={errors?.name}>
          <input
            id="cf-name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            value={values.name}
            onChange={(e) => setField('name', e?.target?.value)}
            required
            aria-required="true"
            aria-invalid={errors?.name ? 'true' : undefined}
            aria-describedby={errors?.name ? 'cf-name-error' : undefined}
            className={inputClass(errors?.name)}
          />
        </Field>

        <Field id="cf-phone" label="Phone number" required error={errors?.phone}>
          <input
            id="cf-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Your phone number"
            value={values.phone}
            onChange={(e) => setField('phone', e?.target?.value)}
            required
            aria-required="true"
            aria-invalid={errors?.phone ? 'true' : undefined}
            aria-describedby={errors?.phone ? 'cf-phone-error' : undefined}
            className={inputClass(errors?.phone)}
          />
        </Field>
      </div>

      <Field id="cf-email" label="Email address" error={errors?.email}>
        <input
          id="cf-email"
          type="email"
          autoComplete="email"
          placeholder="your@email.com"
          value={values.email}
          onChange={(e) => setField('email', e?.target?.value)}
          aria-invalid={errors?.email ? 'true' : undefined}
          aria-describedby={errors?.email ? 'cf-email-error' : undefined}
          className={inputClass(errors?.email)}
        />
      </Field>

      <Field id="cf-date" label="Preferred visit date" required error={errors?.date}>
        <input
          id="cf-date"
          type="date"
          min={minDate || undefined}
          value={values.date}
          onChange={(e) => setField('date', e?.target?.value)}
          required
          aria-required="true"
          aria-invalid={errors?.date ? 'true' : undefined}
          aria-describedby={errors?.date ? 'cf-date-error' : undefined}
          style={{ colorScheme: 'light dark' }}
          className={inputClass(errors?.date)}
        />
      </Field>

      {/* Time slot chips (native radios, arrow-key friendly) */}
      <fieldset
        className="m-0 space-y-2 border-0 p-0"
        aria-describedby={errors?.slot ? 'cf-slot-error' : undefined}
      >
        <legend className={LABEL_CLASS}>
          Preferred time slot{' '}
          <span className="text-danger" aria-hidden="true">*</span>
        </legend>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {TIME_SLOTS?.map((s) => (
            <label
              key={s?.id}
              className="flex cursor-pointer flex-col items-center gap-0.5 rounded-lg border border-border bg-surface px-3 py-3 text-center transition-colors hover:bg-surface-hover has-checked:border-brand-primary has-checked:bg-surface-hover has-checked:ring-1 has-checked:ring-brand-primary has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-primary"
            >
              <input
                type="radio"
                name="timeSlot"
                id={`cf-slot-${s?.id}`}
                value={s?.id}
                checked={values?.slot === s?.id}
                onChange={() => setField('slot', s?.id)}
                aria-required="true"
                className="sr-only"
              />
              <span className="text-base leading-none" aria-hidden="true">{s?.icon}</span>
              <span className="mt-1 text-sm font-semibold text-text-primary">{s?.label}</span>
              <span className="font-mono text-[11px] text-text-secondary">{s?.time}</span>
            </label>
          ))}
        </div>
        {errors?.slot && (
          <p id="cf-slot-error" className="text-xs text-danger">
            {errors.slot}
          </p>
        )}
      </fieldset>

      <Field id="cf-goal" label="Fitness goal">
        <div className="relative">
          <select
            id="cf-goal"
            value={values.goal}
            onChange={(e) => setField('goal', e?.target?.value)}
            className={`${inputClass(false)} appearance-none pr-10`}
          >
            <option value="" className="bg-surface text-text-primary">Select your goal...</option>
            {GOALS?.map((g) => (
              <option key={g} value={g} className="bg-surface text-text-primary">
                {g}
              </option>
            ))}
          </select>
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </Field>

      <Field id="cf-message" label="Anything else we should know?">
        <textarea
          id="cf-message"
          rows={3}
          maxLength={500}
          placeholder="Injuries, questions, preferred trainer..."
          value={values.message}
          onChange={(e) => setField('message', e?.target?.value)}
          className={`${inputClass(false)} resize-y`}
        />
      </Field>

      {/* Honeypot: hidden from people and assistive tech */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="cf-trap">Leave this field empty</label>
        <input
          id="cf-trap"
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          value={values.trap}
          onChange={(e) => setField('trap', e?.target?.value)}
        />
      </div>

      {status === 'error' && (
        <div role="alert" className="space-y-2 rounded-lg border border-danger/40 bg-danger/10 px-3.5 py-3 text-sm text-text-primary">
          <p>
            We could not send your request right now
            {serverMessage ? ` (${serverMessage})` : ''}. Please try again, or send it on WhatsApp instead.
          </p>
          <a
            href={whatsAppHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-bold underline decoration-brand-primary decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            Send on WhatsApp
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        style={{ clipPath: 'polygon(4% 0%, 100% 0%, 96% 100%, 0% 100%)' }}
        className="flex w-full items-center justify-center bg-brand-secondary py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:opacity-90 focus-visible:bg-text-primary focus-visible:text-background focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-brand-secondary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending...' : 'Book my session'}
      </button>

      <p className="text-center text-xs text-text-secondary">
        We will get in touch to confirm your session. Your details are only used to contact you about your visit.
      </p>
    </form>
  );
};

export default ContactForm;