import React from 'react';
import { LucideIcon } from 'lucide-react';
import { AnimatedNumber } from './MotionPrimitives';

interface StatCardProps {
  label: string;
  value: string | number;
  numericValue?: number;
  formatter?: (n: number) => string;
  suffix?: string;
  detail: string;
  progressPercent?: number;
  progressLabel?: string;
  icon: LucideIcon;
  tone?: 'navy' | 'blue' | 'teal' | 'amber' | 'rose';
  onClick?: () => void;
}

const TONE_CLASSES: Record<NonNullable<StatCardProps['tone']>, string> = {
  navy: 'bg-gradient-to-br from-slate-100 to-indigo-50 text-[#405276] dark:from-slate-800 dark:to-indigo-950/50 dark:text-slate-200',
  blue: 'bg-gradient-to-br from-indigo-50 to-sky-100 text-[#5269cb] dark:from-indigo-950/70 dark:to-sky-950/50 dark:text-indigo-300',
  teal: 'bg-gradient-to-br from-emerald-50 to-teal-100 text-[#168a79] dark:from-emerald-950/60 dark:to-teal-950/50 dark:text-emerald-300',
  amber: 'bg-gradient-to-br from-amber-50 to-orange-100 text-amber-700 dark:from-amber-950/60 dark:to-orange-950/50 dark:text-amber-300',
  rose: 'bg-gradient-to-br from-rose-50 to-pink-100 text-rose-700 dark:from-rose-950/60 dark:to-pink-950/50 dark:text-rose-300',
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  numericValue,
  formatter,
  suffix,
  detail,
  progressPercent,
  progressLabel = 'Progress',
  icon: Icon,
  tone = 'blue',
  onClick,
}) => {
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <div>
      <Wrapper
        type={onClick ? 'button' : undefined}
        onClick={onClick}
        className={`stat-card group relative w-full text-left rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 surface-hover ${
          onClick ? 'hover:border-[#2563EB]/50 dark:hover:border-[#2563EB]/60 cursor-pointer' : ''
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{label}</p>
            <p className="mt-2 font-display text-2xl font-bold tracking-tight text-[#142D4E] dark:text-white tabular-nums">
              {typeof numericValue === 'number' ? (
                <>
                  <AnimatedNumber value={numericValue} formatter={formatter} />
                  {suffix && <span className="text-base font-semibold text-slate-400">{suffix}</span>}
                </>
              ) : (
                value
              )}
            </p>
          </div>
          <div
            className={`stat-card-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${TONE_CLASSES[tone]}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 truncate">{detail}</p>
        {typeof progressPercent === 'number' && (
          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between text-[10px] font-semibold text-slate-400">
              <span>{progressLabel}</span><span className="font-mono-num">{Math.round(progressPercent)}%</span>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
              role="progressbar"
              aria-label={progressLabel}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(Math.max(0, Math.min(100, progressPercent)))}
            >
              <div className="h-full rounded-full bg-gradient-to-r from-[#52bda8] via-[#5c9edc] to-[#7483e5] transition-[width] duration-700 ease-out" style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%` }} />
            </div>
          </div>
        )}
      </Wrapper>
    </div>
  );
};
