import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = '', hint, id, label, ...props },
  ref,
) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700" htmlFor={id}>
      <span>{label}</span>
      <input
        ref={ref}
        id={id}
        className={`rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 ${className}`}
        {...props}
      />
      {hint ? <span className="text-xs font-normal text-slate-500">{hint}</span> : null}
    </label>
  )
})
