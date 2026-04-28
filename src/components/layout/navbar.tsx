import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

type AppView = 'aliado' | 'alianzas'

interface NavigationItem {
    description: string
    label: string
    view: AppView
}

interface NavbarProps {
  activeView: AppView
  onChangeView: (view: AppView) => void
  onLogout: () => void
  userName: string
  userRole: 'Aliado' | 'Alianzas'
}

const navigation: NavigationItem[] = [
    {
        description: 'Carga de evidencias y seguimiento de tus pagos',
        label: 'Portal Aliado',
        view: 'aliado',
    },
    {
        description: 'Monitoreo general, pagos y verificacion',
        label: 'Monitoreo Alianzas',
        view: 'alianzas',
    },
]

function classNames(...classes: Array<string | undefined | false>) {
    return classes.filter(Boolean).join(' ')
}

export function Navbar({ activeView, onChangeView, onLogout, userName, userRole }: NavbarProps) {
  const visibleNavigation =
    userRole === 'Aliado'
      ? navigation.filter((item) => item.view === 'aliado')
      : navigation.filter((item) => item.view === 'alianzas')

  return (
        <Disclosure
            as="nav"
            className="animate-fade-down rounded-[2rem] border border-emerald-950/10 bg-white/78 text-slate-950 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur"
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex min-h-20 items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-400 font-black text-emerald-950">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-700">Loyalty</p>
                            <p className="text-lg font-black">Gestor de Pagos</p>
                        </div>
                    </div>

                    <div className="hidden items-center gap-3 sm:flex">
                        {visibleNavigation.map((item) => {
                            const isActive = item.view === activeView

                            return (
                                <button
                                    key={item.view}
                                    type="button"
                                    onClick={() => onChangeView(item.view)}
                                    className={classNames(
                                        'interactive-lift rounded-2xl px-4 py-3 text-left',
                                        isActive
                                            ? 'bg-emerald-950 text-white shadow-lg shadow-emerald-950/10'
                                            : 'bg-emerald-50/70 text-slate-600 hover:bg-emerald-100/80 hover:text-slate-950',
                                    )}
                                >
                                    <span className="block text-sm font-semibold">{item.label}</span>
                                    <span className="mt-1 block text-xs leading-5 text-inherit/80">
                                        {item.description}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden items-center gap-3 sm:flex">
                            <div className="rounded-2xl border border-emerald-950/10 bg-white/70 px-4 py-2 text-right">
                                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{userRole}</p>
                                <p className="mt-1 text-sm font-black text-slate-950">{userName}</p>
                            </div>
                            <button
                                type="button"
                                onClick={onLogout}
                                className="interactive-lift rounded-2xl border border-emerald-950/10 bg-white/70 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-white hover:text-slate-950"
                            >
                                Cerrar sesion
                            </button>
                        </div>

                        <div className="sm:hidden">
                            <DisclosureButton className="interactive-lift group inline-flex items-center justify-center rounded-xl border border-emerald-950/10 bg-white/70 p-2 text-slate-700 hover:bg-white hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">
                                <span className="sr-only">Abrir menu</span>
                                <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                            </DisclosureButton>
                        </div>
                    </div>
                </div>
            </div>

            <DisclosurePanel className="border-t border-emerald-950/10 px-4 py-4 sm:hidden">
                <div className="space-y-2">
                    <div className="rounded-2xl border border-emerald-950/10 bg-white/70 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{userRole}</p>
                        <p className="mt-1 text-sm font-black text-slate-950">{userName}</p>
                    </div>
                    {visibleNavigation.map((item) => {
                        const isActive = item.view === activeView

                        return (
                            <DisclosureButton
                                key={item.view}
                                as="button"
                                type="button"
                                onClick={() => onChangeView(item.view)}
                                className={classNames(
                                    'interactive-lift block w-full rounded-2xl px-4 py-3 text-left',
                                    isActive
                                        ? 'bg-emerald-950 text-white'
                                        : 'bg-emerald-50/70 text-slate-600 hover:bg-emerald-100/80 hover:text-slate-950',
                                )}
                            >
                                <span className="block text-sm font-semibold">{item.label}</span>
                                <span className="mt-1 block text-xs leading-5 text-inherit/80">
                                    {item.description}
                                </span>
                            </DisclosureButton>
                        )
                    })}
                    <button
                        type="button"
                        onClick={onLogout}
                        className="interactive-lift block w-full rounded-2xl border border-emerald-950/10 bg-white/70 px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-white hover:text-slate-950"
                    >
                        Cerrar sesion
                    </button>
                </div>
            </DisclosurePanel>
        </Disclosure>
    )
}
