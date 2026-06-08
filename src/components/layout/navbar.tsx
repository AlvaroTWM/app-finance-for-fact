import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

interface NavbarProps {
  isDark: boolean
  onLogout: () => void
  onToggleDark: () => void
  userName: string
  userRole: 'Alianzas'
}

export function Navbar({ isDark, onLogout, onToggleDark, userName, userRole }: NavbarProps) {
  return (
    <Disclosure as="nav" className="animate-fade-down border-b border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/60">
      <div className="mx-auto w-full max-w-[92vw] px-2">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-500 text-xs font-black text-white">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">Loyalty</span>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Gestor de Pagos</span>
            </div>
          </div>

          {/* Vista activa — centro */}
          <div className="hidden text-center sm:block">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Vista activa —{' '}
              <span className="text-slate-700 dark:text-slate-200">Monitoreo general y validación de pagos</span>
            </p>
          </div>

          {/* Usuario + Logout + Toggle */}
          <div className="hidden items-center gap-3 sm:flex">
            {/* Dark/Light toggle */}
            <button
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="grid size-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-100"
              onClick={onToggleDark}
              type="button"
            >
              {isDark ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
            </button>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{userRole}</span>
              {' · '}
              <span className="font-bold text-slate-800 dark:text-slate-100">{userName}</span>
            </p>
            <button
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-white"
              onClick={onLogout}
              type="button"
            >
              Cerrar sesión
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="grid size-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
              onClick={onToggleDark}
              type="button"
            >
              {isDark ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
            </button>
            <DisclosureButton className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
              <span className="sr-only">Abrir menu</span>
              <Bars3Icon aria-hidden="true" className="block size-5 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-5 group-data-open:block" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      <DisclosurePanel className="border-t border-slate-100 px-4 py-3 dark:border-slate-800 sm:hidden">
        <div className="space-y-2 text-sm">
          <p className="text-slate-500 dark:text-slate-400">Monitoreo general y validación de pagos</p>
          <p className="font-bold text-slate-800 dark:text-slate-100">{userRole} · {userName}</p>
          <button
            className="w-full rounded-lg border border-slate-200 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={onLogout}
            type="button"
          >
            Cerrar sesión
          </button>
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
