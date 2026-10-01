'use client'

import { useMemo, useState } from 'react'
import {
  ArrowUpRight,
  Clock3,
  HeartPulse,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Search,
  ShieldCheck,
  Siren,
  Sparkles,
  Star,
  Truck,
  Wrench,
} from 'lucide-react'

type Category = 'Guincho' | 'Borracharia' | 'Mecânica Pesada' | 'Lava Jato'
type Place = {
  name: string
  category: Category
  city: string
  road: string
  phone: string
  whatsapp: string
  rating: string
  distance: string
  open: string
  icon: typeof Truck
  featured?: boolean
}

const places: Place[] = [
  {
    name: 'Auto Socorro Ipanema',
    category: 'Guincho',
    city: 'Catalão, GO',
    road: 'BR-050 · km 282',
    phone: '(64) 99999-0101',
    whatsapp: '5564999990101',
    rating: '4,9',
    distance: '2,4 km',
    open: '24 horas',
    icon: Truck,
    featured: true,
  },
  {
    name: 'Borracharia Dois Irmãos',
    category: 'Borracharia',
    city: 'Uberlândia, MG',
    road: 'BR-365 · km 612',
    phone: '(34) 99999-0102',
    whatsapp: '5534999990102',
    rating: '4,8',
    distance: '5,1 km',
    open: 'Aberto agora',
    icon: Wrench,
  },
  {
    name: 'Mecânica Estradão',
    category: 'Mecânica Pesada',
    city: 'Ribeirão Preto, SP',
    road: 'BR-050 · km 52',
    phone: '(16) 99999-0103',
    whatsapp: '5516999990103',
    rating: '4,7',
    distance: '8,6 km',
    open: 'Aberto agora',
    icon: Wrench,
  },
  {
    name: 'Lava Jato Ponto de Parada',
    category: 'Lava Jato',
    city: 'Cristalina, GO',
    road: 'BR-040 · km 95',
    phone: '(61) 99999-0104',
    whatsapp: '5561999990104',
    rating: '4,6',
    distance: '12 km',
    open: 'Até 20h',
    icon: Sparkles,
  },
  {
    name: 'Resgate 24h Triângulo',
    category: 'Guincho',
    city: 'Araguari, MG',
    road: 'BR-050 · km 36',
    phone: '(34) 99999-0105',
    whatsapp: '5534999990105',
    rating: '4,9',
    distance: '18 km',
    open: '24 horas',
    icon: Truck,
  },
  {
    name: 'Borracharia Rota 40',
    category: 'Borracharia',
    city: 'Luziânia, GO',
    road: 'BR-040 · km 24',
    phone: '(61) 99999-0106',
    whatsapp: '5561999990106',
    rating: '4,5',
    distance: '21 km',
    open: 'Aberto agora',
    icon: Wrench,
  },
]

const categories = ['Todas', 'Guincho', 'Borracharia', 'Mecânica Pesada', 'Lava Jato'] as const

type CategoryFilter = (typeof categories)[number]

export function BrlistaDirectory() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('Todas')
  const [nearbyMessage, setNearbyMessage] = useState('')
  const [showTravelTip, setShowTravelTip] = useState(false)
  const [sosActive, setSosActive] = useState(false)

  const filteredPlaces = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR')
    return places.filter((place) => {
      const matchesCategory = category === 'Todas' || place.category === category
      const matchesSos = !sosActive || place.category === 'Guincho'
      const searchableText = `${place.name} ${place.category} ${place.city} ${place.road}`.toLocaleLowerCase('pt-BR')
      return matchesCategory && matchesSos && searchableText.includes(normalizedQuery)
    })
  }, [category, query, sosActive])

  function requestLocation() {
    if (!navigator.geolocation) {
      setNearbyMessage('A localização não está disponível neste navegador.')
      return
    }
    setNearbyMessage('Solicitando acesso à sua localização…')
    navigator.geolocation.getCurrentPosition(
      () => setNearbyMessage('Localização autorizada. Os resultados de demonstração não usam distância real.'),
      () => setNearbyMessage('Não foi possível acessar a localização. Você pode buscar por cidade ou rodovia.'),
      { timeout: 8000 },
    )
  }

  function selectSos() {
    setSosActive((active) => !active)
    setCategory('Todas')
    setShowTravelTip(false)
  }

  return (
    <main className="min-h-screen bg-[#10110f] text-[#f6f4ed]">
      <header className="border-b border-white/[0.08]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="#inicio" className="flex items-center gap-3" aria-label="BRLista Brasil, início">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#ffd43b] text-[#171711]">
              <Navigation className="size-5" strokeWidth={2.7} />
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-black tracking-[-0.06em]">BRLISTA <span className="text-[#ffd43b]">BRASIL</span></span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">Seu apoio na estrada</span>
            </span>
          </a>
          <a href="#estabelecimentos" className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/75 transition hover:border-[#ffd43b]/50 hover:text-[#ffd43b] sm:flex">
            Explorar serviços <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </header>

      <section id="inicio" className="relative overflow-hidden border-b border-white/[0.07]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full bg-[#ffd43b]/[0.07] blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 pb-9 pt-11 sm:px-8 sm:pb-12 sm:pt-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#ffd43b]/20 bg-[#ffd43b]/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.17em] text-[#ffd43b]">
            <span className="size-1.5 rounded-full bg-[#ffd43b]" /> Guia de serviços rodoviários
          </div>
          <h1 className="max-w-2xl text-[2.5rem] font-black leading-[0.98] tracking-[-0.065em] sm:text-6xl">
            A estrada não espera.<br /> <span className="text-[#ffd43b]">Encontre ajuda.</span>
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-white/55 sm:text-base">
            Serviços e pontos de apoio para seguir viagem com mais tranquilidade pelas rodovias do Brasil.
          </p>

          <div className="mt-7 flex max-w-3xl flex-col gap-3 sm:flex-row">
            <label className="flex min-h-14 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-[#191a17] px-4 transition focus-within:border-[#ffd43b]/60">
              <Search className="size-5 shrink-0 text-[#ffd43b]" aria-hidden="true" />
              <span className="sr-only">Buscar por cidade, rodovia ou serviço</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cidade, rodovia ou serviço..."
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              />
              <kbd className="hidden rounded-md border border-white/10 px-2 py-1 text-[10px] text-white/30 sm:inline">BUSCAR</kbd>
            </label>
            <button
              type="button"
              onClick={requestLocation}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#3578f6] px-5 text-sm font-bold text-white transition hover:bg-[#4b87fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd43b]"
            >
              <MapPin className="size-4" /> Perto de mim
            </button>
          </div>
          {nearbyMessage && <p role="status" className="mt-2 text-xs text-white/55">{nearbyMessage}</p>}

          <div className="mt-7 grid max-w-3xl grid-cols-2 gap-3">
            <button
              type="button"
              onClick={selectSos}
              aria-pressed={sosActive}
              className={`group flex min-h-[76px] items-center gap-3 rounded-2xl border px-4 text-left transition ${sosActive ? 'border-[#ff704f]/60 bg-[#ff704f]/15' : 'border-[#ff704f]/25 bg-[#ff704f]/[0.07] hover:bg-[#ff704f]/[0.13]'}`}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#ff704f]/15 text-[#ff8064]"><Siren className="size-5" /></span>
              <span className="min-w-0"><span className="block text-xs font-black tracking-wide text-[#ff8064] sm:text-sm">SOS ESTRADA</span><span className="mt-1 block text-[10px] text-white/45 sm:text-xs">Guinchos e resgate 24h</span></span>
              <ArrowUpRight className="ml-auto size-4 shrink-0 text-white/35 transition group-hover:text-[#ff8064]" />
            </button>
            <button
              type="button"
              onClick={() => { setShowTravelTip((show) => !show); setSosActive(false) }}
              aria-expanded={showTravelTip}
              className={`group flex min-h-[76px] items-center gap-3 rounded-2xl border px-4 text-left transition ${showTravelTip ? 'border-[#ffd43b]/50 bg-[#ffd43b]/[0.12]' : 'border-[#ffd43b]/20 bg-[#ffd43b]/[0.05] hover:bg-[#ffd43b]/[0.1]'}`}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#ffd43b]/10 text-[#ffd43b]"><HeartPulse className="size-5" /></span>
              <span className="min-w-0"><span className="block text-xs font-black tracking-wide text-[#ffd43b] sm:text-sm">VIDA NA BR</span><span className="mt-1 block text-[10px] text-white/45 sm:text-xs">Dicas para uma viagem segura</span></span>
              <ArrowUpRight className="ml-auto size-4 shrink-0 text-white/35 transition group-hover:text-[#ffd43b]" />
            </button>
          </div>
          {showTravelTip && (
            <aside className="mt-3 flex max-w-3xl gap-3 rounded-2xl border border-[#ffd43b]/15 bg-[#ffd43b]/[0.06] p-4 text-sm leading-6 text-white/70" aria-live="polite">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#ffd43b]" />
              <p><strong className="text-white">Antes de pegar a estrada:</strong> confira pneus, combustível e documentação; programe pausas e compartilhe seu trajeto com alguém de confiança.</p>
            </aside>
          )}
        </div>
      </section>

      <section id="estabelecimentos" className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffd43b]/75">Diretório de apoio</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.045em] sm:text-3xl">Encontre o que precisa</h2>
            <p className="mt-1.5 text-xs text-white/45">{filteredPlaces.length} {filteredPlaces.length === 1 ? 'local encontrado' : 'locais encontrados'} <span className="px-1">·</span> dados ilustrativos</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filtrar por categoria">
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => { setCategory(item); setSosActive(false) }}
                aria-pressed={category === item && !sosActive}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${category === item && !sosActive ? 'border-[#ffd43b] bg-[#ffd43b] text-[#191a17]' : 'border-white/10 bg-transparent text-white/55 hover:border-white/25 hover:text-white'}`}
              >{item}</button>
            ))}
          </div>
        </div>

        {filteredPlaces.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {filteredPlaces.map((place) => {
              const Icon = place.icon
              return (
                <article key={place.name} className="rounded-[20px] border border-white/[0.09] bg-[#171815] p-4 transition hover:border-white/[0.16] sm:p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-[#ffd43b]/15 bg-[#ffd43b]/[0.07] text-[#ffd43b]"><Icon className="size-5" /></span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold tracking-[-0.02em] text-white sm:text-base">{place.name}</h3>
                        {place.featured && <span className="rounded-full bg-[#ffd43b]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#ffd43b]">Destaque</span>}
                      </div>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#ffd43b]/80">{place.category}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 pt-0.5 text-xs font-semibold text-white/75"><Star className="size-3.5 fill-[#ffd43b] text-[#ffd43b]" />{place.rating}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/[0.07] pt-3 text-xs text-white/50">
                    <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5 text-white/35" />{place.city}</span>
                    <span>{place.road}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-white/45"><Clock3 className="size-3.5" />{place.open}</span>
                    <span className="text-[11px] font-semibold text-[#86c99a]">{place.distance} <span className="font-normal text-white/35">(exemplo)</span></span>
                  </div>
                  <a href={`tel:${place.phone.replace(/[^\d+]/g, '')}`} className="mt-4 block rounded-xl bg-[#20211d] px-3 py-3 text-center text-lg font-black tracking-wide text-[#ffd43b] transition hover:bg-[#272821] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd43b]">{place.phone}</a>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <a href={`tel:${place.phone.replace(/[^\d+]/g, '')}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ffd43b] px-3 text-[10px] font-black tracking-[0.07em] text-[#191a17] transition hover:bg-[#ffe06a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><Phone className="size-4" /> LIGAR AGORA</a>
                    <a href={`https://wa.me/${place.whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#ffd43b]/35 bg-[#ffd43b]/[0.07] px-3 text-[10px] font-black tracking-[0.07em] text-[#ffd43b] transition hover:bg-[#ffd43b]/[0.14] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><MessageCircle className="size-4" /> WHATSAPP</a>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-[20px] border border-dashed border-white/15 px-5 py-12 text-center">
            <Search className="mx-auto size-7 text-white/25" />
            <h3 className="mt-3 font-bold">Nenhum serviço encontrado</h3>
            <p className="mt-1 text-sm text-white/45">Tente outro termo ou escolha uma categoria diferente.</p>
            <button type="button" onClick={() => { setQuery(''); setCategory('Todas'); setSosActive(false) }} className="mt-4 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/70 hover:border-[#ffd43b]/50 hover:text-[#ffd43b]">Limpar filtros</button>
          </div>
        )}

        <p className="mt-6 flex items-start gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 text-[10px] leading-5 text-white/40 sm:text-xs">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" /> Protótipo demonstrativo: estabelecimentos, telefones, avaliações e distâncias são fictícios e não representam serviços reais.
        </p>
      </section>

      <footer className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-[10px] text-white/35 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© 2026 BRLista Brasil <span className="px-1">·</span> Guia demonstrativo de apoio rodoviário</span>
          <a href="#inicio" className="inline-flex items-center gap-1 font-semibold text-white/50 hover:text-[#ffd43b]">Voltar ao topo <ArrowUpRight className="size-3" /></a>
        </div>
      </footer>
    </main>
  )
}

export default BrlistaDirectory

