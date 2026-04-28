import {
  ChartBarIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline'

interface LandingPageProps {
  onGetStarted: () => void
  onSignIn: () => void
}

const benefits = [
  {
    description: 'Procesos unificados para tus facturas.',
    icon: Cog6ToothIcon,
    title: 'Ahorra tiempo',
  },
  {
    description: 'Todas tus facturas y alianzas en un solo lugar.',
    icon: Squares2X2Icon,
    title: 'Monitoreo unificado',
  },
  {
    description: 'Informacion detallada para mejores decisiones.',
    icon: ChartBarIcon,
    title: 'Reportes claros',
  },
]

export function LandingPage({ onGetStarted, onSignIn }: LandingPageProps) {
  return (
    <main className="landing-shell relative flex min-h-screen flex-col overflow-hidden px-5 py-6 text-slate-950 sm:px-8">
      <header className="animate-fade-down relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between">
        <button
          type="button"
          onClick={onSignIn}
          className="interactive-lift flex items-center gap-3 text-emerald-950"
        >
          <span className="grid size-9 place-items-center rounded-lg border border-emerald-800/15 bg-white/65 text-sm font-black shadow-sm">
            L
          </span>
          <span className="text-sm font-black tracking-[0.24em]">LOYALTY</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onGetStarted}
            className="interactive-lift rounded-full px-5 py-3 text-sm font-bold text-slate-950 hover:bg-white/65"
          >
            Inicia Sesion
          </button>
        </div>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-10 py-10 text-center">
        <div className="landing-hero">
          <div className="landing-card-stage" aria-hidden="true">
            <img
              alt=""
              className="landing-card-image"
              src="/images/ueno-duo-card.png"
            />
          </div>

          <div className="landing-hero-copy animate-fade-up animate-delay-2 max-w-4xl">
            <h1 className="text-5xl font-black leading-[1.02] tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
              Loyalty HUB
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-600">
              Innovando en cada beneficio, centrados en tu experiencia como aliado ueno+.
            </p>
          </div>
        </div>

        <div className="animate-fade-up animate-delay-4 grid w-full max-w-5xl gap-6 border-y border-emerald-950/10 py-7 text-left md:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            const delayClass = ['animate-delay-4', 'animate-delay-5', 'animate-delay-6'][index]

            return (
              <article
                key={benefit.title}
                className={`animate-soft-pop ${delayClass} interactive-lift rounded-2xl p-3`}
              >
                <div className="flex gap-4">
                  <div className="grid size-10 shrink-0 place-items-center rounded-full bg-white/70 text-emerald-900 shadow-sm">
                    <Icon aria-hidden="true" className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-950">{benefit.title}</h2>
                    <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <footer className="animate-fade-up animate-delay-6 relative z-10 mx-auto flex w-full max-w-7xl flex-wrap items-center gap-4 text-sm font-medium text-slate-500 sm:gap-8">
        <button type="button" className="interactive-lift flex items-center gap-2 hover:text-slate-900">
          <span className="grid size-6 place-items-center rounded-full bg-red-500 text-[10px] font-black text-white">
            PY
          </span>
          <span>Español</span>
          <ChevronDownIcon aria-hidden="true" className="size-4" />
        </button>
        <button type="button" className="interactive-lift hover:text-slate-900">
          Politica de privacidad - Julian Arambulo
        </button>
      </footer>
    </main>
  )
}
