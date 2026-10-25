'use client';

import React, { useRef, useState } from 'react';
import { SITE_NAME, whatsAppNumber } from '../../data/siteInfo';

/* =========================================
   CONSTANTS
========================================= */
const INPUT_CLASS =
  'w-full bg-surface border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand-primary';
const LABEL_CLASS = 'text-xs sm:text-sm font-medium text-text-primary';
// Same 30px row height as the unit-toggle rows, so every label/input gap matches
const LABEL_BLOCK = `${LABEL_CLASS} block leading-[30px]`;
const H3_CLASS =
  'font-display text-xl font-bold uppercase tracking-tight text-text-primary';

const TABS = [
  {
    id: 'bmi',
    label: 'BMI',
    title: 'Know Your Fitness Level',
    desc: 'Calculate Your Body Mass Index (BMI) To Monitor Your Fitness Progress And Health.',
    button: 'Calculate BMI',
  },
  {
    id: 'bmr',
    label: 'BMR',
    title: 'Know Your Resting Calories',
    desc: 'Find The Calories Your Body Burns At Complete Rest, Then See What You Need At Every Activity Level.',
    button: 'Calculate BMR',
  },
  {
    id: 'tdee',
    label: 'TDEE',
    title: 'Plan Your Daily Calories',
    desc: 'Pick Your Activity Level To Get Total Daily Energy Expenditure And Calorie Targets For Your Goal.',
    button: 'Calculate TDEE',
  },
  {
    id: 'bodyfat',
    label: 'Body Fat',
    title: 'Check Your Body Fat',
    desc: 'Estimate Your Body Fat Percentage From Simple Tape Measurements Using The U.S. Navy Method.',
    button: 'Calculate Body Fat',
  },
  {
    id: 'ideal',
    label: 'Ideal Weight',
    title: 'Find Your Ideal Weight',
    desc: 'See Your Ideal Weight In Kilograms And Pounds, Adjusted For Frame Size And Compared With Your Current Weight.',
    button: 'Calculate Ideal Weight',
  },
];

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary: little or no exercise', factor: 1.2 },
  { id: 'light', label: 'Exercise 1-3 times/week', factor: 1.375 },
  { id: 'moderate', label: 'Exercise 4-5 times/week', factor: 1.465 },
  { id: 'active', label: 'Daily exercise or intense exercise 3-4 times/week', factor: 1.55 },
  { id: 'intense', label: 'Intense exercise 6-7 times/week', factor: 1.725 },
  { id: 'very', label: 'Very intense exercise daily, or physical job', factor: 1.9 },
];

const EXERCISE_NOTES = [
  'Exercise: 15-30 minutes of elevated heart rate activity.',
  'Intense exercise: 45-120 minutes of elevated heart rate activity.',
  'Very intense exercise: 2+ hours of elevated heart rate activity.',
];

const FORMULAS = [
  { id: 'mifflin', label: 'Mifflin-St Jeor (recommended)', short: 'Mifflin-St Jeor' },
  { id: 'harris', label: 'Revised Harris-Benedict', short: 'Harris-Benedict' },
  { id: 'katch', label: 'Katch-McArdle (needs body fat %)', short: 'Katch-McArdle' },
];

const BMI_BANDS = [
  { label: 'Underweight', range: '< 18.5', from: 16, to: 18.5, color: '#eab308' },
  { label: 'Normal', range: '18.5 – 24.9', from: 18.5, to: 25, color: '#16a34a' },
  { label: 'Overweight', range: '25 – 29.9', from: 25, to: 30, color: '#facc15' },
  { label: 'Obesity', range: '≥ 30', from: 30, to: 40, color: '#dc2626' },
];

const BMI_TABLE = [
  { label: 'Severe thinness', range: '< 16', min: 0, max: 16 },
  { label: 'Moderate thinness', range: '16 – 16.9', min: 16, max: 17 },
  { label: 'Mild thinness', range: '17 – 18.4', min: 17, max: 18.5 },
  { label: 'Normal', range: '18.5 – 24.9', min: 18.5, max: 25 },
  { label: 'Overweight', range: '25 – 29.9', min: 25, max: 30 },
  { label: 'Obese Class I', range: '30 – 34.9', min: 30, max: 35 },
  { label: 'Obese Class II', range: '35 – 39.9', min: 35, max: 40 },
  { label: 'Obese Class III', range: '≥ 40', min: 40, max: Infinity },
];

const BODYFAT_BANDS = {
  male: [
    { label: 'Essential fat', range: '2 – 5%', from: 2, to: 6, color: '#f97316' },
    { label: 'Athletes', range: '6 – 13%', from: 6, to: 14, color: '#0ea5e9' },
    { label: 'Fitness', range: '14 – 17%', from: 14, to: 18, color: '#16a34a' },
    { label: 'Average', range: '18 – 24%', from: 18, to: 25, color: '#facc15' },
    { label: 'Obese', range: '25%+', from: 25, to: 40, color: '#dc2626' },
  ],
  female: [
    { label: 'Essential fat', range: '10 – 13%', from: 10, to: 14, color: '#f97316' },
    { label: 'Athletes', range: '14 – 20%', from: 14, to: 21, color: '#0ea5e9' },
    { label: 'Fitness', range: '21 – 24%', from: 21, to: 25, color: '#16a34a' },
    { label: 'Average', range: '25 – 31%', from: 25, to: 32, color: '#facc15' },
    { label: 'Obese', range: '32%+', from: 32, to: 45, color: '#dc2626' },
  ],
};

const FRAMES = [
  { id: 'small', label: 'Small frame (-10%)', factor: 0.9 },
  { id: 'medium', label: 'Medium frame', factor: 1 },
  { id: 'large', label: 'Large frame (+10%)', factor: 1.1 },
];

const GOALS = [
  { id: 'maintain', label: 'Maintain weight', delta: 0, paceKg: '', paceLbs: '' },
  { id: 'loss-mild', label: 'Mild weight loss', delta: -250, paceKg: '≈ 0.25 kg/week', paceLbs: '≈ 0.5 lb/week' },
  { id: 'loss', label: 'Weight loss', delta: -500, paceKg: '≈ 0.5 kg/week', paceLbs: '≈ 1 lb/week' },
  { id: 'gain-mild', label: 'Mild weight gain', delta: 250, paceKg: '≈ 0.25 kg/week', paceLbs: '≈ 0.5 lb/week' },
  { id: 'gain', label: 'Weight gain', delta: 500, paceKg: '≈ 0.5 kg/week', paceLbs: '≈ 1 lb/week' },
];

/* =========================================
   HELPERS
========================================= */
const num = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

const fmt = (n, d = 0) =>
  Number(n ?? 0).toLocaleString('en-US', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });

const kgToUnit = (kg, unit) => (unit === 'lbs' ? kg / 0.45359237 : kg);
const toLb = (kg) => kg / 0.45359237;

const pickBand = (bands, v) =>
  bands?.find((b) => v < b?.to) ?? bands?.[(bands?.length ?? 1) - 1];

const calcBmr = ({ formula, sex, kg, cm, age, bodyFat }) => {
  if (formula === 'katch') return 370 + 21.6 * kg * (1 - bodyFat / 100);
  if (formula === 'harris') {
    return sex === 'male'
      ? 88.362 + 13.397 * kg + 4.799 * cm - 5.677 * age
      : 447.593 + 9.247 * kg + 3.098 * cm - 4.33 * age;
  }
  return 10 * kg + 6.25 * cm - 5 * age + (sex === 'male' ? 5 : -161);
};

const buildWhatsAppLink = (intent, result) => {
  const text = `Hello ${SITE_NAME},

${intent}

My result: ${result?.summary ?? ''}
Profile: ${result?.profile ?? ''}

Please share the next steps.

Thank you.`;
  return `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(text)}`;
};

/* =========================================
   SMALL UI PIECES
========================================= */
const ToggleGroup = ({ label, value, onChange, options }) => (
  <div
    role="radiogroup"
    aria-label={label}
    className="inline-flex rounded-lg bg-surface p-0.5 text-xs border border-border"
  >
    {options?.map((opt) => (
      <button
        key={opt?.value}
        type="button"
        role="radio"
        aria-checked={value === opt?.value}
        onClick={() => onChange?.(opt?.value)}
        className={`px-2.5 py-1 rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-brand-primary ${value === opt?.value
            ? 'bg-brand-secondary text-white shadow-sm'
            : 'text-text-secondary hover:text-text-primary'
          }`}
      >
        {opt?.label}
      </button>
    ))}
  </div>
);

const NumberField = ({ id, label, required, ...inputProps }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className={LABEL_BLOCK}>
      {label}
      {required && (
        <span className="text-danger font-bold" aria-hidden="true">
          {' '}*
        </span>
      )}
    </label>
    <input
      id={id}
      type="number"
      inputMode="decimal"
      required={required}
      aria-required={required ? 'true' : undefined}
      className={INPUT_CLASS}
      {...inputProps}
    />
  </div>
);

const SelectField = ({ id, label, value, onChange, options }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className={LABEL_BLOCK}>
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange?.(e?.target?.value)}
      className={INPUT_CLASS}
    >
      {options?.map((o) => (
        <option key={o?.id} value={o?.id} className="bg-surface text-text-primary">
          {o?.label}
        </option>
      ))}
    </select>
  </div>
);

/* Segmented spectrum graph with value marker and scale ticks */
const SpectrumBar = ({ bar, ariaLabel }) => {
  const bands = bar?.bands;
  const min = bands?.[0]?.from ?? 0;
  const max = bands?.[(bands?.length ?? 1) - 1]?.to ?? 1;
  const span = max - min || 1;
  const pct = (v) => Math.min(Math.max(((v ?? min) - min) / span, 0), 1) * 100;
  const pos = pct(bar?.value);
  const ticks = [min, ...(bands?.map((b) => b?.to) ?? [])];
  const tickShift = (p) =>
    p <= 0 ? '' : p >= 100 ? '-translate-x-full' : '-translate-x-1/2';

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between gap-3 text-[11px] text-text-secondary">
        <span>{bar?.title}</span>
        <span className="font-mono tabular-nums">{bar?.target}</span>
      </div>

      <div role="img" aria-label={ariaLabel}>
        <div className="relative pt-6">
          <span
            className="absolute top-0 flex flex-col items-center gap-0.5 transition-[left] duration-700 ease-out motion-reduce:transition-none"
            style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
          >
            <span className="font-mono text-[11px] font-bold leading-none text-text-primary tabular-nums">
              {fmt(bar?.value, 1)}
            </span>
            <svg viewBox="0 0 12 8" className="h-2 w-3 text-text-primary" aria-hidden="true">
              <polygon points="0,0 12,0 6,8" fill="currentColor" />
            </svg>
          </span>
          <div className="flex h-2.5 w-full overflow-hidden rounded-full">
            {bands?.map((b) => (
              <span
                key={b?.label}
                className="h-full"
                style={{
                  width: `${(((b?.to ?? 0) - (b?.from ?? 0)) / span) * 100}%`,
                  backgroundColor: b?.color,
                }}
              />
            ))}
          </div>
        </div>
        <div className="relative mt-1.5 h-4" aria-hidden="true">
          {ticks?.map((t) => (
            <span
              key={t}
              className={`absolute font-mono text-[10px] text-text-secondary tabular-nums ${tickShift(pct(t))}`}
              style={{ left: `${pct(t)}%` }}
            >
              {fmt(t, Number.isInteger(t) ? 0 : 1)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const BarChartIcon = () => (
  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface-hover">
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 text-text-secondary"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="13" width="4" height="7" rx="1" />
      <rect x="10" y="8" width="4" height="12" rx="1" />
      <rect x="16" y="4" width="4" height="16" rx="1" />
    </svg>
  </span>
);

/* Thin animated beam head that travels around the card border */
const BorderBeam = () => (
  <svg
    className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
    aria-hidden="true"
    focusable="false"
  >
    <rect
      className="anim-beam"
      x="0.5" y="0.5" rx="11.5"
      pathLength="100" fill="none"
      stroke="var(--border)" strokeWidth="1" strokeLinecap="round"
      style={{ width: "calc(100% - 1px)", height: "calc(100% - 1px)" }}
    />
  </svg>
);

const ResultCard = ({ result }) => (
  <div
    aria-live="polite"
    className="relative w-full bg-surface border border-border rounded-xl p-5 flex flex-col justify-center min-h-[220px]"
  >
    <BorderBeam />
    {!result ? (
      <div className="flex flex-col items-center gap-3 text-center">
        <BarChartIcon />
        <p className="text-base font-bold text-text-primary">Ready to Calculate</p>
        <p className="max-w-[16rem] text-sm leading-relaxed text-text-secondary">
          Click the Calculate button to generate your customized physiological metrics.
        </p>
      </div>
    ) : (
      <div className="w-full space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-3">
            <p className="text-[11px] font-semibold uppercase leading-snug tracking-widest text-text-secondary">
              {result?.label}
            </p>
            <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
              {(result?.values ?? [{ value: result?.value, unit: result?.unit }])?.map((v) => (
                <p
                  key={v?.unit}
                  className={`font-display font-bold leading-[1.2] tracking-tight text-text-primary tabular-nums ${result?.values ? 'text-4xl sm:text-5xl' : 'text-5xl sm:text-6xl'
                    }`}
                >
                  {v?.value}{' '}
                  <span className="font-sans text-sm sm:text-base font-semibold text-text-secondary">
                    {v?.unit}
                  </span>
                </p>
              ))}
            </div>
          </div>
          {result?.status && (
            <span
              className="shrink-0 rounded-md border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider"
              style={{
                color: result?.status?.color,
                borderColor: `${result?.status?.color}66`,
                backgroundColor: `${result?.status?.color}1a`,
              }}
            >
              {result?.status?.label}
            </span>
          )}
        </div>

        {result?.bar && (
          <SpectrumBar
            bar={result?.bar}
            ariaLabel={`${result?.label}: ${result?.value} ${result?.unit}, ${result?.status?.label ?? ''}`}
          />
        )}

        {result?.footers?.length > 0 && (
          <dl className="space-y-1.5 border-t border-border pt-3 text-xs">
            {result?.footers?.map((f) => (
              <div key={f?.label} className="flex items-start justify-between gap-4">
                <dt className="text-text-secondary">{f?.label}</dt>
                <dd className="text-right font-mono font-semibold text-text-primary tabular-nums">
                  {f?.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    )}
  </div>
);

const DataTable = ({ caption, heads, rows }) => (
  <div className="overflow-x-auto rounded-xl border border-border">
    <table className="w-full text-sm text-left">
      <caption className="sr-only">{caption}</caption>
      <thead className="bg-surface text-text-secondary">
        <tr>
          {heads?.map((h, i) => (
            <th
              key={h}
              scope="col"
              className={`px-4 py-2.5 font-medium ${i > 0 ? 'text-right' : ''}`}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows?.map((r) => (
          <tr
            key={r?.key}
            aria-current={r?.active ? 'true' : undefined}
            className={`border-t border-border ${r?.active ? 'bg-surface-hover font-semibold text-text-primary' : 'text-text-secondary'
              }`}
          >
            {r?.cells?.map((c, i) =>
              i === 0 ? (
                <th
                  key={`${r?.key}-${i}`}
                  scope="row"
                  className={`px-4 py-2.5 text-left font-[inherit] ${r?.active ? 'shadow-[inset_3px_0_0_0_var(--brand-primary)]' : ''
                    }`}
                >
                  {c}
                  {r?.active && <span className="sr-only"> (your result)</span>}
                </th>
              ) : (
                <td
                  key={`${r?.key}-${i}`}
                  className="px-4 py-2.5 text-right font-mono tabular-nums whitespace-nowrap"
                >
                  {c}
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const StatGrid = ({ items }) => (
  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {items
      ?.filter((s) => s?.value)
      ?.map((s) => (
        <div key={s?.label} className="bg-surface border border-border rounded-xl p-4">
          <dt className="text-xs text-text-secondary">{s?.label}</dt>
          <dd className="mt-1 font-mono text-lg font-bold text-text-primary tabular-nums">
            {s?.value}
          </dd>
        </div>
      ))}
  </dl>
);

/* =========================================
   RESULT DETAILS (below the result)
========================================= */
const BmiDetails = ({ data }) => (
  <section aria-labelledby="fc-bmi-details" className="space-y-4">
    <h3 id="fc-bmi-details" className={H3_CLASS}>
      Understand your BMI
    </h3>
    <StatGrid
      items={[
        { label: 'Healthy weight for your height', value: data?.healthyRange },
        { label: 'To reach a healthy BMI', value: data?.diffText },
        { label: 'BMI Prime', value: data?.prime },
        { label: 'Ponderal Index', value: data?.ponderal },
      ]}
    />
    <DataTable
      caption="BMI classification by WHO"
      heads={['Classification', 'BMI (kg/m²)']}
      rows={BMI_TABLE?.map((r) => ({
        key: r?.label,
        active: data?.bmi >= r?.min && data?.bmi < r?.max,
        cells: [r?.label, r?.range],
      }))}
    />
    <p className="text-xs text-text-secondary leading-relaxed">
      BMI does not measure body fat directly, so muscular people may read as overweight.
      {data?.isMinor && ' For anyone under 18, BMI is judged against age and sex percentiles, so ask a doctor to interpret this result.'}
    </p>
  </section>
);

const CalorieDetails = ({ data }) => (
  <div className="space-y-8">
    <section aria-labelledby="fc-calorie-heading" className="space-y-3">
      <h3 id="fc-calorie-heading" className={H3_CLASS}>
        Daily calorie needs based on activity level
      </h3>
      <DataTable
        caption="Daily calorie needs based on activity level"
        heads={['Activity Level', 'Calories']}
        rows={data?.levels?.map((l) => ({
          key: l?.id,
          active: l?.id === data?.activeId,
          cells: [l?.label, fmt(l?.kcal)],
        }))}
      />
      <ul className="space-y-1 text-xs text-text-secondary">
        {EXERCISE_NOTES?.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </section>

    {data?.goals && (
      <section aria-labelledby="fc-goals-heading" className="space-y-3">
        <h3 id="fc-goals-heading" className={H3_CLASS}>
          Calories for your goal
        </h3>
        <DataTable
          caption="Daily calories for weight maintenance, loss and gain"
          heads={['Goal', 'Calories/day']}
          rows={data?.goals?.map((g) => ({
            key: g?.id,
            active: g?.delta === 0,
            cells: [g?.pace ? `${g?.label} (${g?.pace})` : g?.label, fmt(g?.kcal)],
          }))}
        />
        {data?.goals?.some((g) => g?.belowBmr) && (
          <p className="text-xs text-text-secondary leading-relaxed">
            Eating below your BMR of {fmt(data?.bmr)} Calories/day should only be done with
            guidance from a doctor or dietitian.
          </p>
        )}
      </section>
    )}
  </div>
);

const BodyFatDetails = ({ data }) => (
  <section aria-labelledby="fc-bf-details" className="space-y-4">
    <h3 id="fc-bf-details" className={H3_CLASS}>
      Understand your body fat
    </h3>
    <StatGrid
      items={[
        { label: 'Fat mass', value: data?.fatMass },
        { label: 'Lean mass', value: data?.leanMass },
        { label: 'Category', value: data?.category },
      ]}
    />
    <DataTable
      caption="Body fat categories by the American Council on Exercise"
      heads={['Category', 'Body fat']}
      rows={data?.bands?.map((b) => ({
        key: b?.label,
        active: b?.label === data?.category,
        cells: [b?.label, b?.range],
      }))}
    />
    <p className="text-xs text-text-secondary leading-relaxed">
      The U.S. Navy method is an estimate and can be off by a few percentage points. Measure
      at the same spots each time to track real change.
    </p>
  </section>
);

const IdealDetails = ({ data }) => (
  <section aria-labelledby="fc-ideal-details" className="space-y-4">
    <h3 id="fc-ideal-details" className={H3_CLASS}>
      Ideal weight in kg and lb
    </h3>
    <StatGrid items={data?.stats} />
    <DataTable
      caption="Ideal weight by formula in kilograms and pounds"
      heads={['Formula', 'Kilograms', 'Pounds']}
      rows={data?.rows?.map((r) => ({
        key: r?.key,
        active: r?.active,
        cells: [r?.label, r?.kg, r?.lb],
      }))}
    />
    <p className="text-xs text-text-secondary leading-relaxed">
      These formulas were built for adults taller than 5 ft (152 cm) and ignore muscle mass and
      age. Frame size adjusts each result by 10%. Treat the numbers as a range, not a target.
    </p>
  </section>
);

const ResultDetails = ({ result }) => {
  switch (result?.tab) {
    case 'bmi':
      return <BmiDetails data={result?.data} />;
    case 'bmr':
    case 'tdee':
      return <CalorieDetails data={result?.data} />;
    case 'bodyfat':
      return <BodyFatDetails data={result?.data} />;
    case 'ideal':
      return <IdealDetails data={result?.data} />;
    default:
      return null;
  }
};

const CtaBlock = ({ result }) => (
  <aside
    aria-labelledby="fc-cta-heading"
    className="rounded-xl border border-border bg-surface p-5 sm:p-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
  >
    <div className="space-y-3 max-w-xl">
      <p className="text-[11px] font-bold uppercase tracking-widest text-brand-tertiary [[data-theme=light]_&]:text-brand-secondary">
        Next steps with our coaches
      </p>
      <h3
        id="fc-cta-heading"
        className="font-display text-2xl sm:text-3xl font-bold uppercase leading-tight tracking-tight text-text-primary"
      >
        Turn your numbers into real athletic progress
      </h3>
      <p className="text-sm text-text-secondary leading-relaxed">
        Ready to optimize your nutrition macros or verify your numbers with a certified coach?
        Connect instantly with our coaching team.
      </p>
    </div>
    <div className="flex flex-col sm:flex-row gap-3 lg:shrink-0">
      <a
        href={buildWhatsAppLink('I would like a personalized meal plan based on my result.', result)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary"
      >
        Get a personalized meal plan
        <span className="sr-only"> (opens WhatsApp in a new tab)</span>
      </a>
      <a
        href={buildWhatsAppLink('I would like to book a free fitness assessment.', result)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-secondary"
      >
        Book a free fitness assessment
        <span className="sr-only"> (opens WhatsApp in a new tab)</span>
      </a>
    </div>
  </aside>
);

/* =========================================
   MAIN COMPONENT
========================================= */
const FitnessCalculatorsClient = () => {
  const [activeTab, setActiveTab] = useState('bmi');
  const [heightUnit, setHeightUnit] = useState('ft-in'); // 'ft-in' | 'cm'
  const [weightUnit, setWeightUnit] = useState('kg'); // 'kg' | 'lbs'
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('male'); // 'male' | 'female'
  const [age, setAge] = useState('');
  const [formula, setFormula] = useState('mifflin');
  const [bodyFatInput, setBodyFatInput] = useState('');
  const [activity, setActivity] = useState('sedentary');
  const [frame, setFrame] = useState('medium');
  const [neck, setNeck] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [results, setResults] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const tabRefs = useRef([]);

  const currentTab = TABS?.find((t) => t?.id === activeTab) ?? TABS?.[0];
  const result = results?.[activeTab] ?? null;
  const isEnergyTab = activeTab === 'bmr' || activeTab === 'tdee';
  const isKatch = isEnergyTab && formula === 'katch';
  const showWeight = true;
  const weightRequired = activeTab !== 'bodyfat' && activeTab !== 'ideal';
  const ageRequired = isEnergyTab && !isKatch;
  const lengthUnitLabel = heightUnit === 'ft-in' ? 'in' : 'cm';

  const selectTab = (id) => {
    setActiveTab(id);
    setErrorMsg('');
  };

  const onTabKeyDown = (e, idx) => {
    const last = (TABS?.length ?? 1) - 1;
    let next = null;
    if (e?.key === 'ArrowRight') next = idx === last ? 0 : idx + 1;
    else if (e?.key === 'ArrowLeft') next = idx === 0 ? last : idx - 1;
    else if (e?.key === 'Home') next = 0;
    else if (e?.key === 'End') next = last;
    if (next === null) return;
    e?.preventDefault?.();
    selectTab(TABS?.[next]?.id);
    tabRefs?.current?.[next]?.focus?.();
  };

  const calculate = (e) => {
    e?.preventDefault?.();
    setErrorMsg('');

    const fail = (msg) => setErrorMsg(msg);
    const isFt = heightUnit === 'ft-in';
    const ft = num(heightFeet);
    const inch = num(heightInches);

    /* ---- Height ---- */
    const cm = isFt ? (ft * 12 + inch) * 2.54 : num(heightCm);
    if (cm <= 0) return fail(isFt ? 'Please enter valid height' : 'Please enter valid height in cm');
    if (cm < 50 || cm > 280) return fail('Please enter a realistic height');
    const hM = cm / 100;

    /* ---- Weight ---- */
    const w = num(weight);
    const kg = weightUnit === 'lbs' ? w * 0.45359237 : w;
    if (showWeight && (weightRequired || w > 0) && (kg < 10 || kg > 500)) {
      return fail('Please enter valid weight');
    }

    const ageN = num(age);
    const sex = gender;
    const wu = weightUnit;
    const dispW = (v) => `${fmt(kgToUnit(v, wu), 1)} ${wu}`;

    const profile = [
      sex === 'male' ? 'Male' : 'Female',
      ageN > 0 ? `${ageN} yrs` : null,
      showWeight && w > 0 ? `${w} ${wu}` : null,
      isFt ? `${ft} ft ${inch} in` : `${num(heightCm)} cm`,
    ]
      .filter(Boolean)
      .join(', ');

    let res = null;

    /* ---------- BMI ---------- */
    if (activeTab === 'bmi') {
      const bmi = parseFloat((kg / (hM * hM)).toFixed(1));
      const band = pickBand(BMI_BANDS, bmi);
      const minKg = 18.5 * hM * hM;
      const maxKg = 24.9 * hM * hM;
      let diffText = 'Already within the healthy range';
      if (bmi < 18.5) diffText = `Gain ${dispW(minKg - kg)}`;
      else if (bmi >= 25) diffText = `Lose ${dispW(kg - maxKg)}`;

      res = {
        tab: 'bmi',
        label: 'Body Mass Index',
        value: fmt(bmi, 1),
        unit: 'kg/m²',
        status: { label: band?.label, color: band?.color },
        bar: { bands: BMI_BANDS, value: bmi, title: 'Global Spectrum', target: 'Target: 18.5 – 24.9' },
        footers: [{ label: 'Healthy weight for your height', value: `${dispW(minKg)} – ${dispW(maxKg)}` }],
        summary: `BMI ${fmt(bmi, 1)} (${band?.label})`,
        profile,
        data: {
          bmi,
          healthyRange: `${dispW(minKg)} – ${dispW(maxKg)}`,
          diffText,
          prime: fmt(bmi / 25, 2),
          ponderal: `${fmt(kg / (hM * hM * hM), 1)} kg/m³`,
          isMinor: ageN > 0 && ageN < 18,
        },
      };
    }

    /* ---------- BMR / TDEE ---------- */
    if (isEnergyTab) {
      const bf = num(bodyFatInput);
      if (isKatch && (bf < 3 || bf > 60)) return fail('Please enter body fat between 3% and 60%');
      if (!isKatch && (ageN < 10 || ageN > 120)) return fail('Please enter valid age (10-120 years)');

      const bmr = calcBmr({ formula, sex, kg, cm, age: ageN, bodyFat: bf });
      if (!Number.isFinite(bmr) || bmr <= 0) return fail('Please provide valid measurements');

      const levels = ACTIVITY_LEVELS?.map((l) => ({ ...l, kcal: Math.round(bmr * l?.factor) }));
      const formulaShort = FORMULAS?.find((f) => f?.id === formula)?.short;

      if (activeTab === 'bmr') {
        res = {
          tab: 'bmr',
          label: 'Basal Metabolic Rate',
          value: fmt(bmr),
          unit: 'Calories/day',
          status: null,
          bar: null,
          footers: [{ label: 'Formula', value: formulaShort }],
          summary: `BMR ${fmt(bmr)} Calories/day`,
          profile,
          data: { levels, activeId: null, bmr },
        };
      } else {
        const level = levels?.find((l) => l?.id === activity) ?? levels?.[0];
        const goals = GOALS?.map((g) => {
          const kcal = Math.round((level?.kcal ?? 0) + g?.delta);
          return {
            ...g,
            kcal,
            pace: wu === 'lbs' ? g?.paceLbs : g?.paceKg,
            belowBmr: kcal < bmr,
          };
        });
        res = {
          tab: 'tdee',
          label: 'Total Daily Energy Expenditure',
          value: fmt(level?.kcal),
          unit: 'Calories/day',
          status: null,
          bar: null,
          footers: [
            { label: 'Activity level', value: level?.label },
            { label: 'BMR', value: `${fmt(bmr)} Calories/day` },
          ],
          summary: `TDEE ${fmt(level?.kcal)} Calories/day (${level?.label})`,
          profile,
          data: { levels, activeId: level?.id, bmr, goals },
        };
      }
    }

    /* ---------- Body Fat (U.S. Navy) ---------- */
    if (activeTab === 'bodyfat') {
      const toCm = (v) => (isFt ? v * 2.54 : v);
      const n = toCm(num(neck));
      const wa = toCm(num(waist));
      const hp = toCm(num(hip));
      if (n <= 0 || wa <= 0 || (sex === 'female' && hp <= 0)) {
        return fail(`Please enter neck, waist${sex === 'female' ? ' and hip' : ''} measurements`);
      }

      const girth = sex === 'male' ? wa - n : wa + hp - n;
      if (girth <= 0) return fail('Please check your measurements');

      const bf =
        sex === 'male'
          ? 495 / (1.0324 - 0.19077 * Math.log10(girth) + 0.15456 * Math.log10(cm)) - 450
          : 495 / (1.29579 - 0.35004 * Math.log10(girth) + 0.221 * Math.log10(cm)) - 450;
      if (!Number.isFinite(bf) || bf < 2 || bf > 60) return fail('Please check your measurements');

      const bands = BODYFAT_BANDS?.[sex] ?? BODYFAT_BANDS.male;
      const band = pickBand(bands, bf);
      const hasWeight = kg >= 10;

      res = {
        tab: 'bodyfat',
        label: 'Estimated body fat (U.S. Navy method)',
        value: fmt(bf, 1),
        unit: '%',
        status: { label: band?.label, color: band?.color },
        bar: {
          bands,
          value: bf,
          title: 'Body Fat Spectrum',
          target: `Target: ${bands?.find((b) => b?.label === 'Fitness')?.range ?? ''}`,
        },
        footers: hasWeight ? [{ label: 'Lean mass', value: dispW(kg * (1 - bf / 100)) }] : [],
        summary: `Body fat ${fmt(bf, 1)}% (${band?.label})`,
        profile,
        data: {
          bands,
          category: band?.label,
          fatMass: hasWeight ? dispW((kg * bf) / 100) : '',
          leanMass: hasWeight ? dispW(kg * (1 - bf / 100)) : '',
        },
      };
    }

    /* ---------- Ideal Weight ---------- */
    if (activeTab === 'ideal') {
      const over = Math.max(0, cm / 2.54 - 60);
      const isM = sex === 'male';
      const frameInfo = FRAMES?.find((f) => f?.id === frame) ?? FRAMES?.[1];
      const ff = frameInfo?.factor ?? 1;
      const list = [
        { label: 'Devine (1974)', val: ((isM ? 50 : 45.5) + 2.3 * over) * ff },
        { label: 'Robinson (1983)', val: ((isM ? 52 : 49) + (isM ? 1.9 : 1.7) * over) * ff },
        { label: 'Miller (1983)', val: ((isM ? 56.2 : 53.1) + (isM ? 1.41 : 1.36) * over) * ff },
        { label: 'Hamwi (1964)', val: ((isM ? 48 : 45.5) + (isM ? 2.7 : 2.2) * over) * ff },
      ];
      const vals = list.map((i) => i.val);
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      const lo = Math.min(...vals);
      const hi = Math.max(...vals);
      const minKg = 18.5 * hM * hM;
      const maxKg = 24.9 * hM * hM;
      const k = (v) => `${fmt(v, 1)} kg`;
      const l = (v) => `${fmt(toLb(v), 1)} lb`;
      const conv = (v) => kgToUnit(v, wu);
      const hasWeight = kg >= 10;

      let status = null;
      let bar = null;
      let diffText = '';
      if (hasWeight) {
        const below = kg < lo;
        const above = kg > hi;
        status = {
          label: below ? 'Below ideal range' : above ? 'Above ideal range' : 'Within ideal range',
          color: below ? '#eab308' : above ? '#f97316' : '#16a34a',
        };
        bar = {
          bands: [
            { label: 'Below ideal', from: conv(lo * 0.8), to: conv(lo), color: '#eab308' },
            { label: 'Within ideal', from: conv(lo), to: conv(hi), color: '#16a34a' },
            { label: 'Above ideal', from: conv(hi), to: conv(hi * 1.3), color: '#f97316' },
          ],
          value: conv(kg),
          title: 'Your weight vs ideal range',
          target: `Ideal: ${fmt(conv(lo), 1)} – ${fmt(conv(hi), 1)} ${wu}`,
        };
        const d = kg - avg;
        diffText =
          Math.abs(d) < 0.5
            ? 'Right at your ideal weight'
            : `${d > 0 ? 'Lose' : 'Gain'} ${k(Math.abs(d))} (${l(Math.abs(d))})`;
      }

      const kgVal = { value: fmt(avg, 1), unit: 'kg' };
      const lbVal = { value: fmt(toLb(avg), 1), unit: 'lb' };

      res = {
        tab: 'ideal',
        label: 'Ideal body weight (average of 4 formulas)',
        value: kgVal.value,
        unit: 'kg',
        values: wu === 'lbs' ? [lbVal, kgVal] : [kgVal, lbVal],
        status,
        bar,
        footers: [
          { label: 'Ideal range (kg)', value: `${fmt(lo, 1)} – ${fmt(hi, 1)} kg` },
          { label: 'Ideal range (lb)', value: `${fmt(toLb(lo), 1)} – ${fmt(toLb(hi), 1)} lb` },
          { label: 'Body frame', value: frameInfo?.label },
        ],
        summary: `Ideal weight ${k(avg)} / ${l(avg)}${hasWeight ? `, current ${k(kg)} (${status?.label})` : ''}`,
        profile,
        data: {
          stats: [
            { label: 'Your current weight', value: hasWeight ? `${k(kg)} · ${l(kg)}` : '' },
            { label: 'To reach ideal average', value: diffText },
            { label: 'Healthy BMI range (kg)', value: `${fmt(minKg, 1)} – ${fmt(maxKg, 1)} kg` },
            { label: 'Healthy BMI range (lb)', value: `${fmt(toLb(minKg), 1)} – ${fmt(toLb(maxKg), 1)} lb` },
          ],
          rows: [
            ...list.map((i) => ({ key: i.label, label: i.label, kg: k(i.val), lb: l(i.val) })),
            { key: 'avg', label: 'Average (your ideal weight)', kg: k(avg), lb: l(avg), active: true },
            {
              key: 'bmi',
              label: 'Healthy BMI range (18.5 – 24.9)',
              kg: `${fmt(minKg, 1)} – ${fmt(maxKg, 1)}`,
              lb: `${fmt(toLb(minKg), 1)} – ${fmt(toLb(maxKg), 1)}`,
            },
          ],
        },
      };
    }

    if (res) setResults((prev) => ({ ...prev, [activeTab]: res }));
  };

  return (
    <div className="section-bg w-full max-w-5xl mx-auto p-6 sm:p-8 rounded-2xl shadow-2xl transition-colors duration-200">
      {/* Tabs (top-left) */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="max-w-full overflow-x-auto">
          <div
            role="tablist"
            aria-label="Fitness calculators"
            className="inline-flex rounded-lg bg-surface p-0.5 border border-border"
          >
            {TABS?.map((t, i) => (
              <button
                key={t?.id}
                ref={(el) => {
                  if (tabRefs?.current) tabRefs.current[i] = el;
                }}
                id={`fc-tab-${t?.id}`}
                type="button"
                role="tab"
                aria-selected={activeTab === t?.id}
                aria-controls="fc-panel"
                tabIndex={activeTab === t?.id ? 0 : -1}
                onClick={() => selectTab(t?.id)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
                className={`whitespace-nowrap cursor-pointer px-3.5 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-text-primary ${activeTab === t?.id
                    ? 'bg-brand-secondary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                  }`}
              >
                {t?.label}
              </button>
            ))}
          </div>
        </div>
        <p className="inline-flex items-center gap-2 text-xs font-medium text-text-secondary">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" aria-hidden="true" />
          Mifflin-St Jeor &amp; WHO Standards
        </p>
      </div>

      <div id="fc-panel" role="tabpanel" aria-labelledby={`fc-tab-${activeTab}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side Content & Result */}
          <div className="flex flex-col justify-center space-y-5">
            <header className="space-y-2">
              <h2
                id="fitness-calculators-heading"
                className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-text-primary"
              >
                {currentTab?.title}
              </h2>
              <p className="text-sm text-text-secondary max-w-md leading-relaxed">
                {currentTab?.desc}
              </p>
            </header>

            <ResultCard result={result} />
          </div>

          {/* Right Side Input Form */}
          <form
            onSubmit={calculate}
            noValidate
            aria-label={`${currentTab?.label} calculator`}
            className="space-y-4 bg-transparent"
          >
            {/* Height */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={heightUnit === 'ft-in' ? 'height-feet' : 'height-cm'}
                  className={LABEL_CLASS}
                >
                  Height <span className="text-danger font-bold" aria-hidden="true">*</span>
                </label>
                <ToggleGroup
                  label="Height Unit"
                  value={heightUnit}
                  onChange={setHeightUnit}
                  options={[
                    { value: 'ft-in', label: 'ft & in' },
                    { value: 'cm', label: 'cm' },
                  ]}
                />
              </div>

              {heightUnit === 'ft-in' ? (
                <div className="grid grid-cols-2 gap-3">
                  <input
                    id="height-feet"
                    type="number"
                    inputMode="decimal"
                    min="1"
                    max="8"
                    step="1"
                    placeholder="Feet (ft)"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(e?.target?.value)}
                    required
                    aria-required="true"
                    aria-label="Height in feet"
                    className={INPUT_CLASS}
                  />
                  <input
                    id="height-inches"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max="11"
                    step="1"
                    placeholder="Inches (in)"
                    value={heightInches}
                    onChange={(e) => setHeightInches(e?.target?.value)}
                    required
                    aria-required="true"
                    aria-label="Height in inches"
                    className={INPUT_CLASS}
                  />
                </div>
              ) : (
                <input
                  id="height-cm"
                  type="number"
                  inputMode="decimal"
                  min="50"
                  max="280"
                  step="0.5"
                  placeholder="Enter Height (cm)"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e?.target?.value)}
                  required
                  aria-required="true"
                  aria-label="Height in centimeters"
                  className={INPUT_CLASS}
                />
              )}
            </div>

            {/* Weight */}
            {showWeight && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="weight-input" className={LABEL_CLASS}>
                    Weight{' '}
                    {weightRequired ? (
                      <span className="text-danger font-bold" aria-hidden="true">*</span>
                    ) : (
                      <span className="text-text-secondary font-normal">(optional)</span>
                    )}
                  </label>
                  <ToggleGroup
                    label="Weight Unit"
                    value={weightUnit}
                    onChange={setWeightUnit}
                    options={[
                      { value: 'kg', label: 'kg' },
                      { value: 'lbs', label: 'lbs' },
                    ]}
                  />
                </div>
                <input
                  id="weight-input"
                  type="number"
                  inputMode="decimal"
                  min="20"
                  max="350"
                  step="0.1"
                  placeholder={weightUnit === 'kg' ? 'Enter Weight (Kg)' : 'Enter Weight (Lbs)'}
                  value={weight}
                  onChange={(e) => setWeight(e?.target?.value)}
                  required={weightRequired}
                  aria-required={weightRequired ? 'true' : undefined}
                  className={INPUT_CLASS}
                />
              </div>
            )}

            {/* Biological Sex */}
            <fieldset className="space-y-1.5 border-0 p-0 m-0">
              <legend className={LABEL_BLOCK}>Biological Sex</legend>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-brand-primary ${gender === 'male'
                      ? 'bg-surface-hover border-brand-primary text-text-primary'
                      : 'bg-surface border-border text-text-secondary hover:border-border/80'
                    }`}
                >
                  <input
                    type="radio"
                    name="biological-sex"
                    value="male"
                    checked={gender === 'male'}
                    onChange={() => setGender('male')}
                    className="sr-only"
                  />
                  <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="10" cy="14" r="5" />
                    <path d="M19 5l-5.4 5.4M19 5h-5M19 5v5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-xs sm:text-sm font-medium">Male</span>
                </label>

                <label
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-brand-primary ${gender === 'female'
                      ? 'bg-surface-hover border-brand-primary text-text-primary'
                      : 'bg-surface border-border text-text-secondary hover:border-border/80'
                    }`}
                >
                  <input
                    type="radio"
                    name="biological-sex"
                    value="female"
                    checked={gender === 'female'}
                    onChange={() => setGender('female')}
                    className="sr-only"
                  />
                  <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="9" r="5" />
                    <path d="M12 14v7M9 18h6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-xs sm:text-sm font-medium">Female</span>
                </label>
              </div>
            </fieldset>

            {/* Age */}
            <NumberField
              id="age-input"
              label="Age"
              required={ageRequired}
              min="10"
              max="120"
              placeholder="Enter Age (Years)"
              value={age}
              onChange={(e) => setAge(e?.target?.value)}
            />

            {activeTab === 'ideal' && (
              <SelectField
                id="frame-select"
                label="Body Frame"
                value={frame}
                onChange={setFrame}
                options={FRAMES}
              />
            )}

            {/* BMR / TDEE extras */}
            {isEnergyTab && (
              <SelectField
                id="formula-select"
                label="BMR Formula"
                value={formula}
                onChange={setFormula}
                options={FORMULAS}
              />
            )}

            {isKatch && (
              <NumberField
                id="bodyfat-input"
                label="Body Fat (%)"
                required
                min="3"
                max="60"
                step="0.1"
                placeholder="Enter Body Fat (%)"
                value={bodyFatInput}
                onChange={(e) => setBodyFatInput(e?.target?.value)}
              />
            )}

            {activeTab === 'tdee' && (
              <SelectField
                id="activity-select"
                label="Activity Level"
                value={activity}
                onChange={setActivity}
                options={ACTIVITY_LEVELS}
              />
            )}

            {/* Body fat measurements */}
            {activeTab === 'bodyfat' && (
              <div className={`grid gap-3 ${gender === 'female' ? 'grid-cols-3' : 'grid-cols-2'}`}>
                <NumberField
                  id="neck-input"
                  label={`Neck (${lengthUnitLabel})`}
                  required
                  min="0"
                  step="0.1"
                  placeholder="Neck"
                  value={neck}
                  onChange={(e) => setNeck(e?.target?.value)}
                />
                <NumberField
                  id="waist-input"
                  label={`Waist (${lengthUnitLabel})`}
                  required
                  min="0"
                  step="0.1"
                  placeholder="Waist"
                  value={waist}
                  onChange={(e) => setWaist(e?.target?.value)}
                />
                {gender === 'female' && (
                  <NumberField
                    id="hip-input"
                    label={`Hip (${lengthUnitLabel})`}
                    required
                    min="0"
                    step="0.1"
                    placeholder="Hip"
                    value={hip}
                    onChange={(e) => setHip(e?.target?.value)}
                  />
                )}
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <p role="alert" className="text-xs text-danger">
                {errorMsg}
              </p>
            )}

            {/* Calculate Button - Slanted Parallelogram Design */}
            <div className="pt-2 flex justify-end">
              <button type="submit" className="btn btn-dark">
                {currentTab?.button}
              </button>
            </div>
          </form>
        </div>

        {/* Below result: details + call to action */}
        {result && (
          <div className="mt-8 pt-8 border-t border-border space-y-8">
            <ResultDetails result={result} />
            <CtaBlock result={result} />
            <p className="text-xs text-text-secondary leading-relaxed">
              These calculators give general estimates and are not medical advice. Speak to a
              doctor or dietitian before making big changes to your diet or training.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FitnessCalculatorsClient;