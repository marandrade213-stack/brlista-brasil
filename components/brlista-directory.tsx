'use client'

import { useMemo, useState } from 'react'
import {
  ArrowDownUp,
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  CircleHelp,
  Clock3,
  LocateFixed,
  MapPin,
  Menu,
  MessageCircle,
  Navigation,
  Phone,
  Search,
  ShieldAlert,
  Sparkles,
  Star,
  Truck,
  Wrench,
  X,
} from 'lucide-react'

type Category = 'Guincho' | 'Borracharia' | 'Mecânica Pesada' | 'Lava Jato'

type Business = {
  name: string
  category: Category
  city: string
  state: string
  highway: string
  distance: string
  phone: string
  rating: string
  reviews: number
  open: boolean
  description: string
  badge?: string
}

const categories = ['Todas', 'Guincho', 'Borracharia', 'Mecânica Pesada', 'Lava Jato'] as const

const businesses: Business[] = [
  {
    name: 'Auto Socorro Ipanema',
    category: 'Guincho',
    city: 'Catalão',
    state: 'GO',
    highway: 'BR-050 · km 278',
    distance: '2,4 km',
    phone: '+55 64 3442-1919',
    rating: '4,9',
    reviews: 128,
    open: true,
    description: 'Atendimento 24 horas para carros e utilitários.',
    badge: 'Mais recomendado',
  },
  {
    name: 'Borracharia Dois Irmãos',
    category: 'Borracharia',
    city: 'Araguari',
    state: 'MG',
    highway: 'BR-050 · km 37',
    distance: '8,1 km',
    phone: '+55 34 3242-7070',
    rating: '4,8',
    reviews: 86,
    open: true,
    description: 'Conserto de pneus, troca e calibragem no local.',
  },
  {
    name: 'Diesel Forte Centro Automotivo',
    category: 'Mecânica Pesada',
    city: 'Uberlândia',
    state: 'MG',
    highway: 'BR-365 · km 612',
    distance: '12 km',
    phone: '+55 34 3211-8080',
    rating: '4,7',
    reviews: 54,
    open: true,
    description: 'Especialistas em caminhões e veículos a diesel.',
  },
  {
    name: 'Lava Jato Estradão',
    category: 'Lava Jato',
    city: 'Catalão',
    state: 'GO',
    highway: 'BR-050 · km 280',
    distance: '4,6 km',
    phone: '+55 64 3411-9090',
    rating: '4,6',
    reviews: 39,
    open: false,
    description: 'Lavagem completa para carros, ônibus e caminhões.',
  },
]

const categoryIcon: Record<Category, typeof Truck> = {
  Guincho: Truck,
  Borracharia: CircleHelp,
  'Mecânica Pesada': Wrench,
  'Lava Jato': Sparkles,
}

function BrandMark() {
  return (
    <a href="#inicio" className="flex shrink-0 items-center gap-2.5" aria-label="BRLista Brasil, início">
      <span className="flex size-10 items-center justify-center rounded-xl bg-[#ffcc00] text-[#151515]">
        <Navigation className="size-[21px] fill-current" strokeWidth={2.4} />
      </span>
      <span className="leading-none">
        <span className="block text-[17px] font-black tracking-[-0.06em] text-white">BR<span className="text-[#ffcc00]">LISTA</span></span>
        <span className="mt-1 block text-[9px] font-bold tracking-[0.24em] text-[#858585]">BRASIL</span>
      </span>
    </a>
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="relative z-10 border-b border-white/[0.07] bg-[#111111]">
      <div className="mx-auto flex h-[76px] max-w-[1160px] items-center justify-between px-5 sm:px-8">
        <BrandMark />
        <nav className="hidden items-center gap-8 text-[13px] font-medium text-[#a2a2a2] md:flex" aria-label="Navegação principal">
          <a className="transition hover:text-white" href="#servicos">Encontrar serviços</a>
          <a className="transition hover:text-white" href="#como-funciona">Como funciona</a>
          <a className="transition hover:text-white" href="#cadastro">Cadastrar negócio</a>
        </nav>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex size-10 items-center justify-center rounded-xl border border-white/10 text-white md:hidden"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <a href="#cadastro" className="hidden rounded-lg bg-[#ffcc00] px-4 py-2.5 text-[12px] font-extrabold text-[#171717] transition hover:bg-[#ffda37] md:inline-flex">
          Anuncie grátis <ArrowRight className="ml-2 size-4" />
        </a>
      </div>
      {menuOpen && (
        <nav className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-white/10 bg-[#151515] px-5 py-3 shadow-xl md:hidden" aria-label="Navegação móvel">
          <a onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-3 text-sm text-white" href="#servicos">Encontrar serviços</a>
          <a onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-3 text-sm text-white" href="#como-funciona">Como funciona</a>
          <a onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-3 text-sm text-white" href="#cadastro">Cadastrar negócio</a>
        </nav>
      )}
    </header>
  )
}

function SearchPanel({ onSearch, onNearMe }: { onSearch: (value: string) => void; onNearMe: () => void }) {
  const [query, setQuery] = useState('')

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSearch(query)
    document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <form onSubmit={submitSearch} className="rounded-2xl border border-white/[0.09] bg-[#181818] p-2 shadow-[0_18px_65px_rgba(0,0,0,.25)] sm:flex sm:items-center">
      <label className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 sm:px-4">
        <Search className="size-[19px] shrink-0 text-[#ffcc00]" />
        <span className="sr-only">Buscar por cidade ou rodovia</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cidade, estado ou rodovia"
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#777]"
        />
        <span className="hidden items-center gap-1.5 border-l border-white/10 pl-4 text-xs text-[#777] sm:flex"><MapPin className="size-3.5" /> Brasil</span>
      </label>
      <div className="grid grid-cols-[1fr_auto] gap-2 border-t border-white/[0.07] pt-2 sm:flex sm:border-0 sm:pt-0">
        <button type="submit" className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ffcc00] px-5 text-[13px] font-extrabold text-[#191919] transition hover:bg-[#ffdc42]">
          Buscar <ArrowRight className="size-4" />
        </button>
        <button type="button" onClick={onNearMe} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-[12px] font-semibold text-white transition hover:border-[#ffcc00]/50 hover:bg-white/[0.04]">
          <LocateFixed className="size-4 text-[#ffcc00]" /><span className="hidden sm:inline">Perto de mim</span><span className="sm:hidden">Perto</span>
        </button>
      </div>
    </form>
  )
}

function QuickAction({ title, description, icon: Icon, onClick, variant }: {
  title: string
  description: string
  icon: typeof ShieldAlert
  onClick: () => void
  variant: 'sos' | 'life'
}) {
  return (
    <button type="button" onClick={onClick} className={`group flex min-h-[88px] flex-1 items-center gap-4 rounded-2xl border p-4 text-left transition sm:px-5 ${variant === 'sos' ? 'border-[#ffcc00]/20 bg-[#ffcc00]/[0.07] hover:border-[#ffcc00]/50 hover:bg-[#ffcc00]/[0.11]' : 'border-white/[0.09] bg-[#171717] hover:border-white/20 hover:bg-[#1c1c1c]'}`}>
      <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${variant === 'sos' ? 'bg-[#ffcc00] text-[#171717]' : 'bg-white/[0.08] text-[#ffcc00]'}`}><Icon className="size-5" /></span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-extrabold tracking-wide text-white">{title}</span>
        <span className="mt-1 block text-[11px] leading-4 text-[#929292]">{description}</span>
      </span>
      <ArrowRight className="size-4 shrink-0 text-[#777] transition group-hover:translate-x-0.5 group-hover:text-[#ffcc00]" />
    </button>
  )
}

function BusinessCard({ business }: { business: Business }) {
  const CategoryIcon = categoryIcon[business.category]
  const whatsappNumber = business.phone.replace(/\D/g, '')

  return (
    <article className="rounded-2xl border border-white/[0.09] bg-[#171717] p-4 transition hover:border-white/[0.16] sm:p-5">
      <div className="flex items-start gap-3.5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-[#202020] text-[#ffcc00]"><CategoryIcon className="size-[21px]" /></div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[15px] font-bold tracking-[-0.02em] text-white">{business.name}</h3>
            {business.badge && <span className="rounded-full bg-[#ffcc00]/10 px-2 py-1 text-[9px] font-bold text-[#ffcc00]">{business.badge}</span>}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#919191]">
            <span className="font-semibold uppercase tracking-[0.08em] text-[#c5c5c5]">{business.category}</span>
            <span className="text-[#555]">·</span><span>{business.city}, {business.state}</span>
          </div>
        </div>
        <span className="hidden items-center gap-1 text-xs font-semibold text-white sm:flex"><Star className="size-3.5 fill-[#ffcc00] text-[#ffcc00]" />{business.rating}<span className="font-normal text-[#777]">({business.reviews})</span></span>
      </div>
      <p className="mt-4 text-[12px] leading-5 text-[#999]">{business.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#828282]">
        <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5 text-[#ffcc00]" />{business.highway}</span>
        <span className="inline-flex items-center gap-1.5"><Navigation className="size-3.5 text-[#777]" />{business.distance}</span>
        <span className={`inline-flex items-center gap-1.5 ${business.open ? 'text-[#8fce9c]' : 'text-[#999]'}`}><Clock3 className="size-3.5" />{business.open ? 'Aberto agora' : 'Fechado'}</span>
      </div>
      <div className="mt-4 flex flex-col gap-2 border-t border-white/[0.07] pt-4 min-[400px]:flex-row min-[400px]:items-center">
        <a href={`tel:${business.phone.replace(/[^+\d]/g, '')}`} className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#ffcc00] px-4 text-[11px] font-black tracking-[0.04em] text-[#181818] transition hover:bg-[#ffdc42]">
          <Phone className="size-4" /> LIGAR AGORA <span className="hidden text-[10px] font-semibold opacity-75 sm:inline">{business.phone}</span>
        </a>
        <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-[11px] font-bold tracking-[0.04em] text-white transition hover:border-[#44c767]/50 hover:bg-[#44c767]/[0.08]">
          <MessageCircle className="size-4 text-[#54d477]" /> WHATSAPP
        </a>
      </div>
    </article>
  )
}

export default function BrlistaDirectory() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('Todas')
  const [searchTerm, setSearchTerm] = useState('')
  const [locationNotice, setLocationNotice] = useState('')
  const [sortNearest, setSortNearest] = useState(false)

  const filteredBusinesses = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase('pt-BR')
    const matches = businesses.filter((business) => {
      const matchesCategory = activeCategory === 'Todas' || business.category === activeCategory
      const searchable = `${business.name} ${business.category} ${business.city} ${business.state} ${business.highway}`.toLocaleLowerCase('pt-BR')
      return matchesCategory && (!normalizedSearch || searchable.includes(normalizedSearch))
    })
    return sortNearest ? [...matches].sort((a, b) => Number.parseFloat(a.distance) - Number.parseFloat(b.distance)) : matches
  }, [activeCategory, searchTerm, sortNearest])

  function findNearby() {
    if (!navigator.geolocation) {
      setLocationNotice('Seu navegador não oferece suporte à localização. Pesquise sua cidade ou rodovia.')
      return
    }
    setLocationNotice('')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setSortNearest(true)
        setLocationNotice(`Localização encontrada. Exibindo opções próximas de você.`)
        setSearchTerm('')
        setActiveCategory('Todas')
        void coords
      },
      () => setLocationNotice('Não foi possível acessar sua localização. Permita o acesso ou pesquise sua cidade.'),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    )
  }

  function showCategory(category: (typeof categories)[number]) {
    setActiveCategory(category)
    setSearchTerm('')
    document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main id="inicio" className="min-h-screen bg-[#111111] text-white">
      <Header />
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.16]" style={{ backgroundImage: 'radial-gradient(ellipse at 50% 15%, rgba(255,204,0,.18), transparent 46%)' }} />
        <div className="relative mx-auto max-w-[860px] px-5 pb-8 pt-12 text-center sm:px-8 sm:pb-10 sm:pt-[68px]">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#ffcc00]/20 bg-[#ffcc00]/[0.06] px-3 py-1.5 text-[10px] font-bold tracking-[0.13em] text-[#ffcc00]">
            <span className="size-1.5 rounded-full bg-[#ffcc00]" /> GUIA DE SERVIÇOS NAS RODOVIAS
          </div>
          <h1 className="mx-auto mt-5 max-w-[720px] text-[34px] font-black leading-[1.06] tracking-[-0.055em] text-white sm:text-[54px]">Na estrada, conte com quem está <span className="text-[#ffcc00]">por perto.</span></h1>
          <p className="mx-auto mt-4 max-w-[530px] text-[13px] leading-6 text-[#999] sm:text-[15px]">Encontre guincho, borracharia e assistência em qualquer trecho do Brasil.</p>
          <div className="mx-auto mt-7 max-w-[700px] text-left sm:mt-8"><SearchPanel onSearch={(value) => { setSearchTerm(value); setSortNearest(false) }} onNearMe={findNearby} /></div>
          <div className="mx-auto mt-3 flex max-w-[700px] items-center justify-center gap-2 text-[10px] text-[#777]">
            <MapPin className="size-3 text-[#ffcc00]" /><span>Experimente: Catalão, GO</span><span className="text-[#444]">·</span><span>BR-050</span><ChevronDown className="ml-auto hidden size-4 text-[#555] sm:block" />
          </div>
          {locationNotice && <p role="status" className="mx-auto mt-4 max-w-[700px] rounded-xl border border-[#ffcc00]/15 bg-[#ffcc00]/[0.06] px-4 py-3 text-left text-xs text-[#e4ce7a]">{locationNotice}</p>}
          <div className="mx-auto mt-8 grid max-w-[700px] grid-cols-1 gap-3 text-left sm:grid-cols-2">
            <QuickAction title="SOS ESTRADA" description="Precisa de ajuda urgente? Encontre apoio agora." icon={ShieldAlert} variant="sos" onClick={() => showCategory('Guincho')} />
            <QuickAction title="VIDA NA BR" description="Serviços e pontos de apoio para sua viagem." icon={BadgeCheck} variant="life" onClick={() => showCategory('Todas')} />
          </div>
        </div>
      </section>

      <section id="servicos" className="mx-auto max-w-[1000px] scroll-mt-6 px-5 py-9 sm:px-8 sm:py-12">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] text-[#ffcc00]">DIRETÓRIO BRLISTA</p>
            <h2 className="mt-2 text-[23px] font-extrabold tracking-[-0.04em] text-white sm:text-[28px]">Serviços perto de você</h2>
            <p className="mt-1.5 text-[12px] text-[#858585]">Encontre ajuda confiável para seguir viagem.</p>
          </div>
          <button type="button" onClick={() => setSortNearest((value) => !value)} aria-pressed={sortNearest} className={`inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-lg border px-3 text-[11px] font-semibold transition sm:self-auto ${sortNearest ? 'border-[#ffcc00]/40 bg-[#ffcc00]/[0.08] text-[#ffcc00]' : 'border-white/10 text-[#b0b0b0] hover:border-white/20 hover:text-white'}`}>
            <ArrowDownUp className="size-3.5" /> {sortNearest ? 'Mais próximos' : 'Ordenar por distância'}
          </button>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label="Filtrar por categoria">
          {categories.map((category) => (
            <button key={category} type="button" onClick={() => showCategory(category)} aria-pressed={activeCategory === category} className={`shrink-0 rounded-full border px-4 py-2.5 text-[11px] font-semibold transition ${activeCategory === category ? 'border-[#ffcc00] bg-[#ffcc00] text-[#171717]' : 'border-white/10 bg-[#171717] text-[#aaa] hover:border-white/25 hover:text-white'}`}>
              {category}
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-b border-white/[0.07] pb-3 text-[11px] text-[#777]">
          <span><span className="font-semibold text-white">{filteredBusinesses.length} resultados</span>{searchTerm && <span> para "{searchTerm}"</span>}</span>
          <span className="hidden items-center gap-1.5 sm:inline-flex"><span className="size-1.5 rounded-full bg-[#69c982]" /> Atendimento atualizado</span>
        </div>

        <div className="mt-4 grid gap-3.5">
          {filteredBusinesses.length ? filteredBusinesses.map((business) => <BusinessCard key={business.name} business={business} />) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-[#151515] px-5 py-12 text-center">
              <Search className="mx-auto size-6 text-[#777]" />
              <h3 className="mt-3 text-sm font-bold text-white">Nenhum serviço encontrado</h3>
              <p className="mt-1 text-xs text-[#888]">Tente outra cidade, rodovia ou categoria.</p>
              <button type="button" onClick={() => { setSearchTerm(''); setActiveCategory('Todas') }} className="mt-4 text-xs font-bold text-[#ffcc00] hover:underline">Limpar filtros</button>
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-[10px] leading-5 text-[#666]">Os estabelecimentos e contatos nesta versão são demonstrativos. Confirme as informações antes de iniciar uma viagem.</p>
      </section>

      <section id="como-funciona" className="border-y border-white/[0.06] bg-[#151515]">
        <div className="mx-auto flex max-w-[1000px] flex-col items-start gap-5 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-start gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-[#ffcc00]"><MapPin className="size-4" /></span><div><h2 className="text-sm font-bold text-white">Seu negócio atende nas BRs?</h2><p className="mt-1 text-xs text-[#898989]">Faça parte do guia e seja encontrado por quem precisa.</p></div></div>
          <a id="cadastro" href="mailto:contato@brlista.com.br?subject=Cadastro%20de%20estabelecimento" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#ffcc00]/30 px-4 text-[11px] font-bold text-[#ffcc00] transition hover:bg-[#ffcc00]/[0.08]">Cadastre seu negócio <ArrowRight className="size-3.5" /></a>
        </div>
      </section>
      <footer className="mx-auto flex max-w-[1000px] flex-col gap-3 px-5 py-6 text-[10px] text-[#666] sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <BrandMark />
        <span>© 2026 BRLista Brasil · Informação para seguir viagem.</span>
        <a href="mailto:contato@brlista.com.br" className="inline-flex items-center gap-1.5 hover:text-white"><MessageCircle className="size-3.5" /> Fale com a gente</a>
      </footer>
    </main>
  )
}
