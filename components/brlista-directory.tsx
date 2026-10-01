'use client'

import { useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  MapPin,
  Search,
  ShieldAlert,
  ShieldCheck,
  Truck,
  Wrench,
  Navigation,
  Phone,
  MessageCircle,
  Clock3,
} from 'lucide-react'

type Listing = {
  name: string
  category: string
  city: string
  road: string
  phone: string
  whatsapp: string
  hours: string
  featured?: boolean
}

const categories = ['Todas', 'Guincho', 'Borracharia', 'Mecânica Pesada', 'Lava Jato']

const listings: Listing[] = [
  {
    name: 'Auto Socorro Ipanema',
    category: 'Guincho',
    city: 'Catalão, GO',
    road: 'BR-050 · km 280',
    phone: '(64) 99999-0001',
    whatsapp: '5564999990001',
    hours: 'Atendimento 24 horas',
    featured: true,
  },
  {
    name: 'Borracharia do Trevo',
    category: 'Borracharia',
    city: 'Uberlândia, MG',
    road: 'BR-365 · km 610',
    phone: '(34) 99999-0002',
    whatsapp: '5534999990002',
    hours: 'Aberto agora',
  },
  {
    name: 'Diesel Forte Caminhões',
    category: 'Mecânica Pesada',
    city: 'Ribeirão Preto, SP',
    road: 'BR-050 · km 82',
    phone: '(16) 99999-0003',
    whatsapp: '5516999990003',
    hours: 'Atendimento 24 horas',
  },
  {
    name: 'Lava Jato Estradão',
    category: 'Lava Jato',
    city: 'Anápolis, GO',
    road: 'BR-060 · km 95',
    phone: '(62) 99999-0004',
    whatsapp: '5562999990004',
    hours: 'Aberto agora',
  },
]

function CategoryIcon({ category }: { category: string }) {
  if (category === 'Guincho') return <Truck aria-hidden="true" />
  if (category === 'Borracharia' || category === 'Mecânica Pesada') return <Wrench aria-hidden="true" />
  return <MapPin aria-hidden="true" />
}

export function BrlistaDirectory() {
  const [activeCategory, setActiveCategory] = useState('Todas')
  const [query, setQuery] = useState('')
  const [locationMessage, setLocationMessage] = useState('')
  const [safetyOpen, setSafetyOpen] = useState(false)

  const filteredListings = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR')
    return listings.filter((listing) => {
      const matchesCategory = activeCategory === 'Todas' || listing.category === activeCategory
      const searchableText = `${listing.name} ${listing.category} ${listing.city} ${listing.road}`.toLocaleLowerCase('pt-BR')
      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery))
    })
  }, [activeCategory, query])

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocationMessage('Seu navegador não oferece acesso à localização.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      () => setLocationMessage('Localização recebida. A lista abaixo ainda contém dados de demonstração.'),
      () => setLocationMessage('Não foi possível acessar sua localização. Confira a permissão do navegador.'),
      { timeout: 10000, maximumAge: 60000 },
    )
  }

  return (
    <main className="min-h-screen bg-[#101110] text-[#f5f4ef]">
      <header className="border-b border-white/[0.08]">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="#inicio" aria-label="BRLista Brasil, início" className="flex shrink-0 items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#ffd43b] text-[#171717]">
              <Navigation className="size-5" strokeWidth={2.5} aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block text-[17px] font-black tracking-[-0.05em]">BRLISTA <span className="text-[#ffd43b]">BRASIL</span></span>
              <span className="block pt-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/45">Seu caminho, mais seguro</span>
            </span>
          </a>
          <a href="#servicos" className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/65 transition hover:border-white/25 hover:text-white sm:flex">
            Para quem está na estrada <ArrowRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </header>

      <section id="inicio" className="mx-auto grid max-w-[1180px] gap-10 px-5 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-16 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:gap-16">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ffd43b]/20 bg-[#ffd43b]/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#ffd43b]">
            <span className="size-1.5 rounded-full bg-[#ffd43b]" /> Apoio para a sua viagem
          </div>
          <h1 className="max-w-[640px] text-[clamp(2.8rem,7vw,5.7rem)] font-black leading-[0.94] tracking-[-0.075em]">
            A estrada fica <span className="text-[#ffd43b]">mais leve</span> com ajuda por perto.
          </h1>
          <p className="mt-5 max-w-[480px] text-sm leading-6 text-white/55 sm:text-base sm:leading-7">
            Encontre serviços de confiança nas rodovias do Brasil. Pesquise por cidade, estrada ou pelo que você precisa.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <label className="flex min-h-14 flex-1 items-center gap-3 rounded-xl border border-white/[0.12] bg-[#191a18] px-4 transition focus-within:border-[#ffd43b]/70">
              <Search className="size-4 shrink-0 text-[#ffd43b]" aria-hidden="true" />
              <span className="sr-only">Buscar por cidade, rodovia ou serviço</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cidade, rodovia ou serviço..."
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              />
              <kbd className="hidden rounded border border-white/10 px-1.5 py-1 text-[10px] text-white/30 sm:block">⌕</kbd>
            </label>
            <button onClick={requestLocation} className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#2766f5] px-5 text-sm font-bold text-white transition hover:bg-[#3975ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd43b]">
              <MapPin className="size-4" aria-hidden="true" /> Perto de mim
            </button>
          </div>
          {locationMessage && <p role="status" className="mt-3 text-xs leading-5 text-white/55">{locationMessage}</p>}
          <div className="mt-5 flex items-center gap-2 text-[11px] text-white/35">
            <ShieldCheck className="size-3.5 text-[#ffd43b]" aria-hidden="true" /> Busca simples. Ajuda que faz diferença.
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#181a17] p-6 sm:p-8">
          <div className="absolute -right-16 -top-20 size-64 rounded-full bg-[#ffd43b]/[0.07] blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Conexão na estrada</p>
              <p className="mt-2 text-2xl font-black tracking-tight">Siga com confiança.</p>
            </div>
            <span className="flex size-12 items-center justify-center rounded-2xl border border-[#ffd43b]/20 bg-[#ffd43b]/10 text-[#ffd43b]"><ArrowUpRight className="size-5" aria-hidden="true" /></span>
          </div>
          <div className="relative my-7 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" /><span className="rounded-full border border-[#ffd43b]/30 bg-[#ffd43b]/10 px-3 py-1 text-[10px] font-black tracking-[0.18em] text-[#ffd43b]">BRASIL</span><span className="h-px flex-1 bg-white/10" />
          </div>
          <div className="relative grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">Encontre</span>
              <p className="mt-2 text-sm font-bold">Quem pode ajudar</p>
            </div>
            <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">Conecte</span>
              <p className="mt-2 text-sm font-bold">Direto pelo telefone</p>
            </div>
          </div>
          <div className="relative mt-5 flex items-center justify-between border-t border-white/[0.08] pt-4 text-xs text-white/45">
            <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#ffd43b]" /> Guias para sua rota</span>
            <span className="font-semibold text-white/70">BR 01 — 999</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 pb-12 sm:px-8 sm:pb-16">
        <div className="grid gap-3 sm:grid-cols-2">
          <a href="#servicos" onClick={() => setActiveCategory('Guincho')} className="group flex min-h-[104px] items-center justify-between rounded-2xl border border-[#ffd43b]/25 bg-[#ffd43b] px-5 py-5 text-[#181811] transition hover:-translate-y-0.5 hover:bg-[#ffe06c] sm:px-7">
            <span className="flex items-center gap-4"><span className="flex size-12 items-center justify-center rounded-xl bg-black/10"><ShieldAlert className="size-6" aria-hidden="true" /></span><span><span className="block text-[10px] font-extrabold uppercase tracking-[0.16em] text-black/55">Precisa de ajuda agora?</span><span className="mt-1 block text-xl font-black tracking-tight">SOS ESTRADA</span></span></span>
            <ArrowDownRight className="size-5 transition group-hover:translate-x-1 group-hover:translate-y-1" aria-hidden="true" />
          </a>
          <button onClick={() => setSafetyOpen((open) => !open)} aria-expanded={safetyOpen} className="group flex min-h-[104px] items-center justify-between rounded-2xl border border-white/[0.1] bg-[#191a18] px-5 py-5 text-left transition hover:border-white/20 hover:bg-[#1e201d] sm:px-7">
            <span className="flex items-center gap-4"><span className="flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#ffd43b]"><ShieldCheck className="size-6" aria-hidden="true" /></span><span><span className="block text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/40">Dicas e cuidado</span><span className="mt-1 block text-xl font-black tracking-tight">VIDA NA BR</span></span></span>
            <ArrowRight className="size-5 text-[#ffd43b] transition group-hover:translate-x-1" aria-hidden="true" />
          </button>
        </div>
        {safetyOpen && (
          <div className="mt-3 flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-[#191a18] p-5 text-sm leading-6 text-white/65">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#ffd43b]" aria-hidden="true" />
            <p><strong className="text-white">Antes de seguir viagem:</strong> faça uma pausa se estiver cansado, confira as condições do veículo e mantenha os contatos de emergência à mão. Em risco imediato, ligue para os serviços oficiais de emergência.</p>
          </div>
        )}
      </section>

      <section id="servicos" className="border-t border-white/[0.07] bg-[#141513]">
        <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 sm:py-16">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffd43b]">Diretório de serviços</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] sm:text-4xl">Ajuda no caminho.</h2>
              <p className="mt-2 text-sm text-white/45">Serviços para você e para quem vai com você.</p>
            </div>
            <span className="text-xs font-medium text-white/40">{filteredListings.length} {filteredListings.length === 1 ? 'resultado' : 'resultados'}</span>
          </div>

          <div className="mt-7 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filtrar por categoria">
            {categories.map((category) => (
              <button key={category} onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category} className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd43b] ${activeCategory === category ? 'border-[#ffd43b] bg-[#ffd43b] text-[#171717]' : 'border-white/10 bg-transparent text-white/55 hover:border-white/25 hover:text-white'}`}>
                {category}
              </button>
            ))}
          </div>

          {filteredListings.length > 0 ? (
            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {filteredListings.map((listing) => (
                <article key={listing.name} className="rounded-2xl border border-white/[0.09] bg-[#191a18] p-5 transition hover:border-white/[0.17] sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-[#ffd43b]"><CategoryIcon category={listing.category} /></span>
                      <div>
                        <h3 className="font-bold tracking-tight">{listing.name}</h3>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-white/45"><MapPin className="size-3" aria-hidden="true" /> {listing.city} <span className="text-white/20">·</span> {listing.road}</p>
                      </div>
                    </div>
                    {listing.featured && <span className="flex shrink-0 items-center gap-1 rounded-full border border-[#ffd43b]/20 bg-[#ffd43b]/[0.08] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#ffd43b]"><BadgeCheck className="size-3" aria-hidden="true" /> Destaque</span>}
                  </div>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
                    <div>
                      <span className="rounded-md bg-white/[0.06] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/55">{listing.category}</span>
                      <p className="mt-2 text-xl font-black tracking-tight text-[#ffd43b]">{listing.phone}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-[10px] text-white/40"><Clock3 className="size-3" aria-hidden="true" /> {listing.hours}</p>
                    </div>
                    <div className="flex gap-2">
                      <a href={`tel:${listing.phone.replace(/[^\d+]/g, '')}`} aria-label={`Ligar para ${listing.name}`} className="flex h-10 items-center gap-2 rounded-lg bg-[#ffd43b] px-3 text-xs font-extrabold text-[#171717] transition hover:bg-[#ffe06c]"><Phone className="size-3.5" aria-hidden="true" /> Ligar</a>
                      <a href={`https://api.whatsapp.com/send?phone=${listing.whatsapp}`} target="_blank" rel="noreferrer" aria-label={`Abrir WhatsApp de ${listing.name}`} className="flex h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-bold text-white/75 transition hover:border-white/25 hover:text-white"><MessageCircle className="size-3.5" aria-hidden="true" /> WhatsApp</a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center">
              <Search className="mx-auto size-6 text-white/30" aria-hidden="true" />
              <p className="mt-3 font-semibold">Nenhum serviço encontrado</p>
              <p className="mt-1 text-sm text-white/45">Tente outro termo ou escolha uma categoria diferente.</p>
              <button onClick={() => { setQuery(''); setActiveCategory('Todas') }} className="mt-4 text-xs font-bold text-[#ffd43b] underline underline-offset-4">Limpar filtros</button>
            </div>
          )}

          <p className="mt-5 text-[11px] leading-5 text-white/30">Demonstração: estabelecimentos e contatos ilustrativos, não verificados. Confirme as informações antes de contratar.</p>
        </div>
      </section>

      <footer className="border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-3 px-5 py-6 text-[11px] text-white/35 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© 2026 BRLista Brasil · Conectando você ao caminho.</span>
          <a href="#inicio" className="flex items-center gap-1.5 font-semibold text-white/50 transition hover:text-[#ffd43b]">Voltar ao topo <ArrowUpRight className="size-3" aria-hidden="true" /></a>
        </div>
      </footer>
    </main>
  )
}

export default BrlistaDirectory
