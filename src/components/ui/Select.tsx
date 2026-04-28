import type { ReactNode, SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  hint?: string
  children: ReactNode
}

export function Select({
  children,
  className = '',
  hint,
  id,
  label,
  ...props
}: SelectProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700" htmlFor={id}>
      <span>{label}</span>
      <select
        id={id}
        className={`rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 ${className}`}
        {...props}
      >
        {children}
      </select>
      {hint ? <span className="text-xs font-normal text-slate-500">{hint}</span> : null}
    </label>
  )
}
