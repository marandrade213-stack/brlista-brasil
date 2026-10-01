'use client'

import { useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import {
  ArrowUpRight,
  HeartPulse,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Search,
  ShieldCheck,
  Wrench,
} from 'lucide-react'

type Category = 'Borracharia' | 'Mecânica' | 'Auto Elétrica' | 'Mecânica Pesada'
type Place = {
  name: string
  category: Category
  city: string
  road?: string
  phone: string
  icon: typeof Wrench
}

const places: Place[] = [
  { name: 'Borracharia São João', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99627-2006', icon: Wrench },
  { name: 'Borracharia Móvel Pit Stop', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99934-9057', icon: Wrench },
  { name: 'Borracharia Araguaia', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99972-5734', icon: Wrench },
  { name: 'Borracharia Móvel 050', category: 'Borracharia', city: 'Catalão, GO', road: 'BR-050', phone: '(64) 99286-7163', icon: Wrench },
  { name: 'Borracharia do Juninho', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99225-3950', icon: Wrench },
  { name: 'Borracharia Móvel Odilon', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99607-4577', icon: Wrench },
  { name: 'Borracharia Móvel do Paulo 24 Horas', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 98114-0934', icon: Wrench },
  { name: 'Borracharia Skinão Loja 01', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 98409-7360', icon: Wrench },
  { name: 'Borracharia do Jairinho', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 98124-5270', icon: Wrench },
  { name: 'Borracharia do Elsinho', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99964-8809', icon: Wrench },
  { name: 'Borracharia J&S', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99986-8444', icon: Wrench },
  { name: 'Pit Stop Borrachas e Ferramentas', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99922-5835', icon: Wrench },
  { name: 'Borracharia e Soldas JK', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99695-1006', icon: Wrench },
  { name: 'Seu Borracha | Borracharia Móvel Uberlândia', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99646-8666', icon: Wrench },
  { name: 'Borracharia Móvel do Wesley (Veículos em geral)', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99791-3031', icon: Wrench },
  { name: 'Borracharia Móvel 24 Horas GM', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99245-8786', icon: Wrench },
  { name: 'Borracharia Móvel Martins 24 Hrs', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99140-8254', icon: Wrench },
  { name: 'Borracharia Móvel Rapidão (Unidade 1)', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99874-9766', icon: Wrench },
  { name: 'Borracharia Móvel 24h JR', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99885-1986', icon: Wrench },
  { name: 'Borracharia Móvel 24H Sammuel', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99724-1320', icon: Wrench },
  { name: 'Borracharia Móvel Magrão', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99637-1380', icon: Wrench },
  { name: 'Borracharia Móvel do RAFFA', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99316-4535', icon: Wrench },
  { name: 'Borracharia Kometa Móvel', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 98837-4438', icon: Wrench },
  { name: 'Euro Car Jardim Guanabara', category: 'Borracharia', city: 'Goiânia, GO', phone: '(62) 98635-9905', icon: Wrench },
  { name: 'Curinga dos Pneus', category: 'Borracharia', city: 'Goiânia, GO', phone: '(62) 3291-7090', icon: Wrench },
  { name: 'Borracharia do Boca 24 Horas', category: 'Borracharia', city: 'Goiânia, GO', phone: '(62) 3274-2323', icon: Wrench },
  { name: 'Borracharia 24 Horas Móvel Dia e Noite', category: 'Borracharia', city: 'Goiânia, GO', phone: '(62) 99331-1571', icon: Wrench },
  { name: 'Borracharia J.A. V', category: 'Borracharia', city: 'Goiânia, GO', phone: '(62) 98234-3162', icon: Wrench },
  { name: 'Borracharia Pitstop 24HR', category: 'Borracharia', city: 'Goiânia, GO', phone: '(62) 99294-5939', icon: Wrench },
  { name: 'Borracharia J.A. III', category: 'Borracharia', city: 'Goiânia, GO', phone: '(62) 98234-3162', icon: Wrench },
  { name: '2 Irmãos Auto Elétrica e Mecânica', category: 'Mecânica', city: 'Goiânia, GO', phone: '(62) 99820-8546', icon: Wrench },
  { name: 'Mecânica e Elétrica Índio (Socorro 24h Goiânia)', category: 'Mecânica', city: 'Goiânia, GO', phone: '(62) 99863-0815', icon: Wrench },
  { name: 'Gel Mecânico 24hs', category: 'Mecânica', city: 'Goiânia, GO', phone: '(62) 98141-4277', icon: Wrench },
  { name: 'Auto Mecânica 24 Horas Divair', category: 'Mecânica', city: 'Goiânia, GO', phone: '(62) 98574-2567', icon: Wrench },
  { name: 'Auto Elétrica Móvel 24hs (Carro e Caminhões)', category: 'Auto Elétrica', city: 'Goiânia, GO', phone: '(62) 99904-9641', icon: Wrench },
  { name: 'Mecânico de Caminhão 24 Horas', category: 'Mecânica Pesada', city: 'Goiânia, GO', phone: '(62) 99929-1447', icon: Wrench },
  { name: 'Socorro Mecânico de Embreagem de Caminhão 24 Horas', category: 'Mecânica Pesada', city: 'Goiânia, GO', phone: '(62) 99969-8702', icon: Wrench },
  { name: 'Mecânico de Automóveis e Caminhões (Assistência na Estrada 24h)', category: 'Mecânica Pesada', city: 'Goiânia, GO', phone: '(62) 99316-3637', icon: Wrench },
]

const categories = ['Todas', 'Borracharia', 'Mecânica', 'Auto Elétrica', 'Mecânica Pesada'] as const

type CategoryFilter = (typeof categories)[number]

export function BrlistaDirectory() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('Todas')
  const [showTravelTip, setShowTravelTip] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    searchInputRef.current?.blur()
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing || event.keyCode === 229) return
    event.preventDefault()
    searchInputRef.current?.blur()
  }

  const filteredPlaces = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR')
    return places.filter((place) => {
      const matchesCategory = category === 'Todas' || place.category === category
      const searchableText = `${place.name} ${place.category} ${place.city} ${place.road ?? ''}`.toLocaleLowerCase('pt-BR')
      return matchesCategory && searchableText.includes(normalizedQuery)
    })
  }, [category, query])

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
            Encontre borracharias, mecânicos, guinchos e socorro rodoviário 24h nas principais rodovias e cidades do Brasil.
          </p>

          <form onSubmit={handleSearchSubmit} className="mt-7 max-w-xl">
            <label className="flex min-h-14 items-center gap-3 rounded-2xl border border-white/10 bg-[#191a17] px-4 transition focus-within:border-[#ffd43b]/60">
              <Search className="size-5 shrink-0 text-[#ffd43b]" aria-hidden="true" />
              <span className="sr-only">Buscar por cidade, rodovia ou serviço</span>
              <input
                ref={searchInputRef}
                type="search"
                enterKeyHint="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Cidade, rodovia ou serviço..."
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              />
            </label>
          </form>

          <div className="mt-7 grid max-w-3xl grid-cols-2 gap-3">
            <a
              href="#estabelecimentos"
              className="group flex min-h-[76px] items-center gap-3 rounded-2xl border border-[#ffcc00]/20 bg-[#121212] px-4 text-left transition hover:border-[#ffcc00]/40 hover:bg-[#121212]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#ffcc00]/10 text-[#ffcc00]"><Wrench className="size-5" /></span>
              <span className="min-w-0"><span className="block text-xs font-black tracking-wide text-[#ffcc00] sm:text-sm">SERVIÇOS NA ESTRADA</span><span className="mt-1 block text-[10px] text-white/45 sm:text-xs">Catalão, Uberlândia e Goiânia</span></span>
              <ArrowUpRight className="ml-auto size-4 shrink-0 text-[#ffcc00]/55 transition group-hover:text-[#ffcc00]" />
            </a>
            <button
              type="button"
              onClick={() => setShowTravelTip((show) => !show)}
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
            <p className="mt-1.5 text-xs text-white/45">{filteredPlaces.length} {filteredPlaces.length === 1 ? 'estabelecimento encontrado' : 'estabelecimentos encontrados'}</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filtrar por categoria">
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${category === item ? 'border-[#ffd43b] bg-[#ffd43b] text-[#191a17]' : 'border-white/10 bg-transparent text-white/55 hover:border-white/25 hover:text-white'}`}
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
                      <h3 className="text-sm font-bold tracking-[-0.02em] text-white sm:text-base">{place.name}</h3>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#ffd43b]/80">{place.category}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/[0.07] pt-3 text-xs text-white/50">
                    <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5 text-white/35" />{place.city}</span>
                    {place.road && <span>{place.road}</span>}
                  </div>
                  <a href={`tel:+55${place.phone.replace(/\D/g, '')}`} className="mt-4 block rounded-xl bg-[#20211d] px-3 py-3 text-center text-lg font-black tracking-wide text-[#ffd43b] transition hover:bg-[#272821] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd43b]">{place.phone}</a>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <a href={`tel:+55${place.phone.replace(/\D/g, '')}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ffd43b] px-3 text-[10px] font-black tracking-[0.07em] text-[#191a17] transition hover:bg-[#ffe06a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><Phone className="size-4" /> LIGAR AGORA</a>
                    <a href={`https://wa.me/55${place.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#ffd43b]/35 bg-[#ffd43b]/[0.07] px-3 text-[10px] font-black tracking-[0.07em] text-[#ffd43b] transition hover:bg-[#ffd43b]/[0.14] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><MessageCircle className="size-4" /> WHATSAPP</a>
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
            <button type="button" onClick={() => { setQuery(''); setCategory('Todas') }} className="mt-4 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/70 hover:border-[#ffd43b]/50 hover:text-[#ffd43b]">Limpar filtros</button>
          </div>
        )}

        <p className="mt-6 flex items-start gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 text-[10px] leading-5 text-white/40 sm:text-xs">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" /> Confirme a disponibilidade do atendimento diretamente com o estabelecimento antes de se deslocar.
        </p>
      </section>

      <footer className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-[10px] text-white/35 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© 2026 BRLista Brasil <span className="px-1">·</span> Serviços rodoviários · Catalão/GO, Uberlândia/MG e Goiânia/GO</span>
          <a href="#inicio" className="inline-flex items-center gap-1 font-semibold text-white/50 hover:text-[#ffd43b]">Voltar ao topo <ArrowUpRight className="size-3" /></a>
        </div>
      </footer>
    </main>
  )
}

export default BrlistaDirectory

