import { lazy, Suspense, useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Circuitry,
  Cpu,
  DesktopTower,
  DeviceMobileCamera,
  FacebookLogo,
  HardDrive,
  Headset,
  InstagramLogo,
  List,
  MapPin,
  Moon,
  Phone,
  ShieldCheck,
  Sun,
  WhatsappLogo,
  Wrench,
  X,
} from '@phosphor-icons/react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
const HeroFuturistic = lazy(() => import('./components/ui/hero-futuristic'));
const GamepadScrollFeature = lazy(() => import('./GamepadScrollFeature.jsx'));
const LaptopScrollFeature = lazy(() => import('./LaptopScrollFeature.jsx'));

const phone = '50257655899';

const services = [
  {
    icon: DesktopTower,
    title: 'Mantenimiento de computadoras',
    text: 'Limpieza, diagnostico y correccion preventiva para equipos lentos, ruidosos o inestables.',
  },
  {
    icon: Cpu,
    title: 'Ensambles de computadoras',
    text: 'Configuraciones equilibradas para estudio, trabajo, gaming ligero o estaciones de produccion.',
  },
  {
    icon: Headset,
    title: 'Soporte tecnico',
    text: 'Atencion clara para fallas de sistema, redes, perifericos, software y recuperacion operativa.',
  },
  {
    icon: BookOpen,
    title: 'Asesorias en computacion',
    text: 'Orientacion experta para optimizar tu flujo de trabajo, elegir el equipo correcto y sacarle el maximo a la tecnologia que ya tienes.',
  },
  {
    icon: ShieldCheck,
    title: 'Proteccion y seguridad digital',
    text: 'Revision de malware, habitos de respaldo y proteccion practica para datos personales y empresariales.',
  },
  {
    icon: HardDrive,
    title: 'Accesorios',
    text: 'Discos duros, memoria RAM, perifericos y componentes seleccionados para mejorar o extender la vida util de tu equipo.',
  },
];

const process = [
  'Diagnostico inicial por WhatsApp',
  'Visita o recepcion coordinada',
  'Revision tecnica y cotizacion clara',
  'Entrega con recomendaciones de cuidado',
];


function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return [isDark, () => setIsDark((d) => !d)];
}

function whatsappLink(message) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function MagneticButton({ href, children, variant = 'solid' }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 18 });
  const x = useTransform(springX, [-1, 1], [-8, 8]);
  const y = useTransform(springY, [-1, 1], [-5, 5]);

  function handleMove(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    mouseY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }

  function handleLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const classes =
    variant === 'solid'
      ? 'bg-care-600 text-white shadow-diffusion hover:bg-care-700'
      : 'border border-charcoal-800/15 dark:border-white/15 bg-white/70 dark:bg-charcoal-900/70 text-charcoal-950 dark:text-paper hover:bg-white dark:hover:bg-charcoal-900';

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileTap={{ scale: 0.98 }}
      className={`group inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors ${classes}`}
    >
      {children}
      <ArrowRight size={18} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
    </motion.a>
  );
}

function ServiceTile({ service, index }) {
  const Icon = service.icon;
  return (
    <article
      className="animate-reveal border-t border-charcoal-800/15 dark:border-white/10 py-7 md:py-8"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-care-50 dark:bg-care-700/20 text-care-700 dark:text-care-200 ring-1 ring-care-200/70 dark:ring-care-500/30">
        <Icon size={25} weight="duotone" />
      </div>
      <h3 className="text-xl font-semibold tracking-tight text-charcoal-950 dark:text-paper">{service.title}</h3>
      <p className="mt-3 max-w-[34ch] text-base leading-relaxed text-charcoal-800/72 dark:text-paper/60">{service.text}</p>
    </article>
  );
}

function DiagnosticsPanel() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-charcoal-900 p-5 text-paper shadow-insetline md:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-care-200/70 to-transparent" />
      <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-care-200">Mesa tecnica</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">Revision en curso</h3>
        </div>
        <div className="flex h-11 w-11 animate-float items-center justify-center rounded-full bg-care-500/15 text-care-200 ring-1 ring-care-200/20">
          <Circuitry size={24} weight="duotone" />
        </div>
      </div>
      <div className="space-y-4">
        {[
          ['Temperatura CPU', '47.2 C', '72%'],
          ['Salud SSD', '91%', '91%'],
          ['Arranque sistema', '18.6 s', '64%'],
        ].map(([label, value, width]) => (
          <div key={label}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-paper/68">{label}</span>
              <span className="font-mono text-care-200">{value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="relative h-full rounded-full bg-care-500" style={{ width }}>
                <span className="absolute inset-y-0 w-1/2 animate-scan bg-white/25" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-7 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-paper/55">Tiempo estimado</p>
          <p className="mt-1 font-mono text-lg text-paper">36 min</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-paper/55">Alertas criticas</p>
          <p className="mt-1 font-mono text-lg text-care-200">02</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isDark, toggleDark] = useDarkMode();
  const [contentReady, setContentReady] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (contentReady) return undefined;

    const revealContent = () => setContentReady(true);
    const revealOnKey = (event) => {
      if (['ArrowDown', 'PageDown', ' ', 'Home', 'End'].includes(event.key)) {
        revealContent();
      }
    };

    window.addEventListener('wheel', revealContent, { passive: true, once: true });
    window.addEventListener('touchmove', revealContent, { passive: true, once: true });
    window.addEventListener('keydown', revealOnKey);

    return () => {
      window.removeEventListener('wheel', revealContent);
      window.removeEventListener('touchmove', revealContent);
      window.removeEventListener('keydown', revealOnKey);
    };
  }, [contentReady]);

  return (
    <div className="min-h-screen bg-paper dark:bg-charcoal-950 font-sans text-charcoal-950 dark:text-paper transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,#111312_1px,transparent_0)] dark:[background-image:radial-gradient(circle_at_1px_1px,#f7f6f1_1px,transparent_0)] [background-size:22px_22px]" />

      <Suspense fallback={<div className="min-h-[100dvh] bg-charcoal-950" />}>
        <HeroFuturistic
          isDark={isDark}
          eyebrow="Escaneo Digital Care"
          title="Detectamos antes de reemplazar."
          description="Una visual futurista para reforzar el mensaje central del servicio: revisar, diagnosticar y explicar antes de recomendar cambios de hardware o software."
        />
      </Suspense>

      {!contentReady && (
        <div className="sr-only" aria-live="polite">
          Desplazate para cargar el resto del sitio.
        </div>
      )}

      {contentReady && (
        <>
      <header className="sticky top-0 z-20 border-b border-charcoal-800/10 dark:border-white/10 bg-paper/86 dark:bg-charcoal-950/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-2.5 text-base font-black tracking-tight">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center">
              <img src="/logo.jpg" alt="" aria-hidden="true" className="h-full w-full object-contain mix-blend-multiply" />
            </span>
            Digital Care
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-7 text-sm font-semibold text-charcoal-800/72 dark:text-paper/60 md:flex">
            <a className="transition-colors hover:text-charcoal-950 dark:hover:text-paper" href="#servicios">Servicios</a>
            <a className="transition-colors hover:text-charcoal-950 dark:hover:text-paper" href="#proceso">Proceso</a>
            <a className="transition-colors hover:text-charcoal-950 dark:hover:text-paper" href="#contacto">Contacto</a>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDark}
              aria-label="Cambiar tema"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal-800/15 dark:border-white/15 text-charcoal-800/70 dark:text-paper/70 transition hover:bg-charcoal-800/8 dark:hover:bg-white/10 active:scale-95"
            >
              {isDark ? <Sun size={17} weight="duotone" /> : <Moon size={17} weight="duotone" />}
            </button>

            {/* WhatsApp — desktop only */}
            <a
              href={whatsappLink('Hola, quiero coordinar un diagnostico con Digital Care.')}
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex rounded-full border border-charcoal-800/15 dark:border-white/15 px-4 py-2 text-sm font-semibold transition active:scale-[0.98] dark:text-paper hover:bg-charcoal-50 dark:hover:bg-charcoal-900"
            >
              WhatsApp
            </a>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileMenuOpen(o => !o)}
              aria-label={mobileMenuOpen ? 'Cerrar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal-800/15 dark:border-white/15 text-charcoal-800/70 dark:text-paper/70 transition hover:bg-charcoal-800/8 dark:hover:bg-white/10 active:scale-95 md:hidden"
            >
              {mobileMenuOpen ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-charcoal-800/10 dark:border-white/10 bg-paper/95 dark:bg-charcoal-950/95 backdrop-blur-xl">
            <div className="flex flex-col px-4 py-3 gap-1">
              {[
                { href: '#servicios', label: 'Servicios' },
                { href: '#proceso',   label: 'Proceso'   },
                { href: '#contacto',  label: 'Contacto'  },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-charcoal-800/80 dark:text-paper/70 transition hover:bg-charcoal-800/6 dark:hover:bg-white/8 active:scale-[0.98]"
                >
                  {label}
                </a>
              ))}
              <a
                href={whatsappLink('Hola, quiero coordinar un diagnostico con Digital Care.')}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-charcoal-800/15 dark:border-white/15 px-4 py-3 text-sm font-semibold text-charcoal-950 dark:text-paper transition hover:bg-charcoal-50 dark:hover:bg-charcoal-900 active:scale-[0.98]"
              >
                <WhatsappLogo size={16} weight="fill" />
                WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>

      <main>
        <section id="inicio" className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 sm:gap-8 md:px-8 xl:min-h-[100dvh] xl:grid-cols-[1.1fr_0.9fr] xl:gap-10 xl:py-16">
          <div className="flex flex-col justify-center">
            <p className="mb-6 w-fit rounded-full border border-care-200 dark:border-care-500/40 bg-care-50 dark:bg-care-700/20 px-4 py-2 text-sm font-semibold text-care-700 dark:text-care-200">
              Soporte tecnico a domicilio en Chiquimula
            </p>
            <h1 className="max-w-[14ch] text-4xl font-black leading-none tracking-tighter text-charcoal-950 dark:text-paper sm:text-5xl xl:text-6xl">
              Tu equipo vuelve a trabajar fino.
            </h1>
            <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-charcoal-800/72 dark:text-paper/65 md:text-lg xl:mt-7">
              Mantenimiento, ensamble, soporte tecnico, asesorias, seguridad digital y accesorios — soluciones tecnologicas rapidas y eficientes con trato directo desde el primer mensaje.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row xl:mt-9">
              <MagneticButton href={whatsappLink('Hola, quiero cotizar un servicio tecnico con Digital Care.')}>
                Cotizar servicio
              </MagneticButton>
              <MagneticButton href={whatsappLink('Hola, necesito soporte para mi computadora.')} variant="outline">
                Pedir diagnostico
              </MagneticButton>
            </div>
          </div>

          <div className="flex items-center xl:justify-end">
            <div className="grid w-full gap-3 sm:grid-cols-[1fr_1.5fr] sm:gap-4 xl:grid-cols-[1fr_1.5fr]">
              <div className="order-2 grid grid-cols-2 items-start gap-3 sm:order-1 sm:grid-cols-1 sm:gap-4 sm:self-center">
                <div className="rounded-[1.8rem] border border-charcoal-800/10 dark:border-white/10 bg-white/72 dark:bg-charcoal-900/60 p-4 shadow-diffusion sm:p-5">
                  <Wrench className="mb-5 text-care-700 dark:text-care-200 sm:mb-7" size={26} weight="duotone" />
                  <p className="text-xs leading-relaxed text-charcoal-800/68 dark:text-paper/60 sm:text-sm">
                    Servicio preventivo, instalacion limpia y asesorias sin rodeos tecnicos.
                  </p>
                </div>
                <div className="rounded-[1.8rem] bg-charcoal-950 dark:bg-charcoal-900 p-4 text-paper sm:p-5">
                  <p className="font-mono text-2xl tracking-tight sm:text-3xl">4.7h</p>
                  <p className="mt-2 text-xs text-paper/62 sm:text-sm">promedio para volver a operar despues de diagnostico coordinado</p>
                </div>
              </div>
              <div className="order-1 sm:order-2">
                <Suspense fallback={<div className="min-h-[240px] sm:min-h-[360px] md:min-h-[440px] xl:min-h-[560px]" />}>
                  <GamepadScrollFeature isDark={isDark} />
                </Suspense>
              </div>
            </div>
          </div>
        </section>

        <section id="servicios" className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
            <div className="flex flex-col">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-care-700 dark:text-care-200">Servicios</p>
              <h2 className="mt-4 max-w-[12ch] text-4xl font-black leading-none tracking-tighter dark:text-paper md:text-5xl">
                Cuidado tecnico sin ruido.
              </h2>
              <Suspense fallback={<div className="mt-6 h-64 md:h-80" />}>
                <LaptopScrollFeature className="mt-6 flex-1" />
              </Suspense>
            </div>
            <div className="grid gap-x-10 md:grid-cols-2">
              {services.map((service, index) => (
                <ServiceTile key={service.title} service={service} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section id="proceso" className="bg-charcoal-950 py-20 text-paper">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-[1fr_1.15fr] md:px-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-care-200">Proceso</p>
              <h2 className="mt-4 text-4xl font-black leading-none tracking-tighter md:text-5xl">
                Claro desde el primer mensaje.
              </h2>
              <p className="mt-6 max-w-[55ch] text-base leading-relaxed text-paper/68">
                La idea es reducir incertidumbre: que sepas que se revisara, cuanto puede tardar y que conviene hacer antes de gastar en repuestos.
              </p>
            </div>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {process.map((item, index) => (
                <div key={item} className="grid grid-cols-[auto_1fr] gap-5 py-6">
                  <span className="font-mono text-sm text-care-200">{String(index + 1).padStart(2, '0')}</span>
                  <div className="flex items-center gap-3">
                    <CheckCircle size={22} weight="duotone" className="text-care-200" />
                    <p className="text-lg font-semibold">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contacto" className="mx-auto grid max-w-7xl gap-8 px-4 py-20 md:grid-cols-[1.2fr_0.8fr] md:px-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-care-700 dark:text-care-200">Contacto</p>
            <h2 className="mt-4 text-4xl font-black leading-none tracking-tighter dark:text-paper md:text-5xl">
              Cuentanos que esta fallando.
            </h2>
            <p className="mt-6 max-w-[60ch] text-base leading-relaxed text-charcoal-800/72 dark:text-paper/65">
              Comparte modelo del equipo, sintomas, tiempo de uso y si necesitas visita a domicilio. Con eso podemos orientar el siguiente paso.
            </p>
          </div>
          <div className="rounded-[2rem] border border-charcoal-800/10 dark:border-white/10 bg-white dark:bg-charcoal-900 p-6 shadow-diffusion">
            <div className="flex items-center gap-4 border-b border-charcoal-800/10 dark:border-white/10 pb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-care-50 dark:bg-care-700/20 text-care-700 dark:text-care-200">
                <DeviceMobileCamera size={25} weight="duotone" />
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-tight dark:text-paper">Atencion directa</h3>
                <p className="text-sm text-charcoal-800/62 dark:text-paper/50">WhatsApp, Instagram y Facebook</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {[
                { label: 'WhatsApp', href: whatsappLink('Hola, quiero informacion sobre Digital Care.') },
                { label: 'Instagram', href: 'https://www.instagram.com/digicare2024' },
                { label: 'Facebook', href: 'https://www.facebook.com/share/18w73kktmN/' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  className="rounded-2xl border border-charcoal-800/10 dark:border-white/10 px-4 py-3 font-semibold transition hover:bg-care-50 dark:hover:bg-charcoal-800 dark:text-paper active:scale-[0.98]"
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-charcoal-950 text-paper">
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-6 md:px-8">

          {/* ── Main columns ─────────────────────────────────────── */}
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">

            {/* Company */}
            <div>
              <a href="#inicio" className="flex items-center gap-2.5 text-base font-black tracking-tight">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center">
                  <img src="/logo.jpg" alt="" aria-hidden="true" className="h-full w-full object-contain mix-blend-multiply" />
                </span>
                Digital Care
              </a>
              <p className="mt-5 max-w-[30ch] text-sm leading-relaxed text-paper/55">
                Soporte tecnico profesional en Chiquimula. Mantenimiento, ensambles y diagnostico para que tu equipo siempre funcione.
              </p>
              <ul className="mt-8 flex gap-5">
                <li>
                  <a href="https://www.instagram.com/digicare2024" target="_blank" rel="noreferrer"
                     className="text-paper/45 transition hover:text-care-200">
                    <span className="sr-only">Instagram</span>
                    <InstagramLogo size={20} />
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/share/18w73kktmN/" target="_blank" rel="noreferrer"
                     className="text-paper/45 transition hover:text-care-200">
                    <span className="sr-only">Facebook</span>
                    <FacebookLogo size={20} />
                  </a>
                </li>
                <li>
                  <a href={whatsappLink('Hola, quiero informacion sobre Digital Care.')} target="_blank" rel="noreferrer"
                     className="text-paper/45 transition hover:text-care-200">
                    <span className="sr-only">WhatsApp</span>
                    <WhatsappLogo size={20} />
                  </a>
                </li>
              </ul>
            </div>

            {/* Servicios */}
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-care-200">Servicios</p>
              <ul className="mt-6 space-y-3 text-sm">
                {services.map((s) => (
                  <li key={s.title}>
                    <a href="#servicios" className="text-paper/55 transition hover:text-paper">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-care-200">Contacto</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a href={whatsappLink('Hola, quiero informacion sobre Digital Care.')}
                     target="_blank" rel="noreferrer"
                     className="flex items-center gap-2.5 text-paper/55 transition hover:text-paper">
                    <Phone size={15} className="shrink-0 text-care-200" />
                    +502 5765 5899
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/digicare2024" target="_blank" rel="noreferrer"
                     className="flex items-center gap-2.5 text-paper/55 transition hover:text-paper">
                    <InstagramLogo size={15} className="shrink-0 text-care-200" />
                    @digicare2024
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/share/18w73kktmN/" target="_blank" rel="noreferrer"
                     className="flex items-center gap-2.5 text-paper/55 transition hover:text-paper">
                    <FacebookLogo size={15} className="shrink-0 text-care-200" />
                    Digital Care GT
                  </a>
                </li>
                <li>
                  <span className="flex items-start gap-2.5 text-paper/55">
                    <MapPin size={15} className="mt-0.5 shrink-0 text-care-200" />
                    <address className="not-italic">Chiquimula, Guatemala</address>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* ── Bottom bar ───────────────────────────────────────── */}
          <div className="mt-14 border-t border-white/10 pt-6">
            <div className="flex flex-col gap-3 text-sm text-paper/35 sm:flex-row sm:items-center sm:justify-between">
              <p>© Digital Care 2024 · Tu equipo, nuestra prioridad</p>
              <div className="flex gap-5">
                <a href="/aviso-legal.html" className="transition hover:text-paper">Aviso Legal</a>
                <a href="/terminos-de-servicio.html" className="transition hover:text-paper">Terminos de Servicio</a>
              </div>
            </div>
          </div>

        </div>
      </footer>
        </>
      )}
    </div>
  );
}

export default App;
