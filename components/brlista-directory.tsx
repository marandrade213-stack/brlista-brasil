'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Download, MapPin, MessageCircle, Phone, Search, Wrench } from 'lucide-react'

const categories = ['Todas', 'Borracharia', 'Mecânica', 'Auto Elétrica', 'Mecânica Pesada', 'Guincho / Socorro', 'Lavador de Carreta'] as const
type CategoryFilter = typeof categories[number]
type Category = Exclude<CategoryFilter, 'Todas'> | 'Guincho' | 'Lava Jato'
type Place = { name: string; category: Category; city: string; road?: string; phone: string; service?: string }

const places: Place[] = [
  { name: 'GF Mecânica', category: 'Mecânica', city: 'Araguari', phone: '+55 34 99265-6094', service: 'Serviços mecânicos em geral' },
  { name: 'MR Auto Elétrica', category: 'Auto Elétrica', city: 'Araguari', phone: '+55 34 99796-9161', service: 'Socorro elétrico' },
  { name: 'Borracharia São João', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99627-2006' },
  { name: 'Borracharia Móvel Pit Stop', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99934-9057' },
  { name: 'Borracharia Araguaia', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99972-5734' },
  { name: 'Borracharia Móvel 050', category: 'Borracharia', city: 'Catalão, GO', road: 'BR-050', phone: '(64) 99286-7163' },
  { name: 'Seu Borracha | Borracharia Móvel Uberlândia', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99646-8666' },
  { name: 'Borracharia Móvel do Wesley', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99791-3031' },
  { name: 'Euro Car Jardim Guanabara', category: 'Borracharia', city: 'Goiânia, GO', phone: '(62) 98635-9905' },
  { name: 'Curinga dos Pneus', category: 'Borracharia', city: 'Goiânia, GO', phone: '(62) 3291-7090' },
  { name: 'Borracharia do Boca 24 Horas', category: 'Borracharia', city: 'Goiânia, GO', phone: '(62) 3274-2323' },
  { name: 'Auto Elétrica Porto de Santos', category: 'Auto Elétrica', city: 'Santos - SP', phone: '(13) 3221-1001' },
  { name: 'Borracharia Bahia', category: 'Borracharia', city: 'São Paulo, SP', phone: '(11) 96854-7941' },
  { name: 'Borracharia Negrão Azevedo', category: 'Borracharia', city: 'Ribeirão Preto, SP', phone: '(16) 99103-5393' },
  { name: 'JP Borracharia Móvel 24 Horas', category: 'Borracharia', city: 'Araxá, MG', phone: '(34) 99828-6914' },
  { name: 'BORRACHARIA MÓVEL EXPRESS', category: 'Borracharia', city: 'Araxá, MG', phone: '(34) 99812-1032' },
  { name: 'Borracharia Móvel e Fixa do Tiago', category: 'Borracharia', city: 'Araxá, MG', phone: '(34) 99817-3240' },
  { name: 'Mecânico Araxá MG', category: 'Mecânica', city: 'Araxá, MG', phone: '(34) 99254-1478' },
]

export function BrlistaDirectory() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('Todas')
  const [currentPage, setCurrentPage] = useState(1)
  const [isInstalled, setIsInstalled] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    // @ts-ignore
    const iosStandalone = window.navigator.standalone === true
    if (standalone || iosStandalone) setIsInstalled(true)
  }, [])

  function formatPhoneForUrl(phone: string) {
    const digits = phone.replace(/\D/g, '')
    return digits.startsWith('55')? digits : `55${digits}`
  }
  function formatPhoneForDisplay(phone: string) {
    const d = phone.replace(/\D/g, '').replace(/^55/, '')
    if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
    if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`
    return phone
  }

  const normalize = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

  const filteredPlaces = useMemo(() => {
    const q = normalize(query.trim())
    return places.filter((p) => {
      const ok = category === 'Todas' || p.category === category
      if (!q) return ok
      const txt = normalize(`${p.name} ${p.category} ${p.city} ${p.road?? ''} ${p.service?? ''}`)
      return ok && txt.includes(q)
    })
  }, [category, query])

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage)
  const paginatedPlaces = filteredPlaces.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <main className="min-h-screen bg-[#10110f] text-[#f6f4ed]">
      <header className="border-b border-white/[0.08]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4ff00] text-black"><Wrench size={20}/></div>
            <div>
              <h1 className="font-bold leading-none">BRLista Brasil</h1>
              <p className="text-xs opacity-60">{places.length} locais</p>
            </div>
          </div>
          {!isInstalled && (
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black">
              <Download size={16}/> App
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" size={18}/>
          <input
            ref={searchInputRef}
            value={query}
            onChange={e=>{setQuery(e.target.value); setCurrentPage(1)}}
            onKeyDown={e=>{ if(e.key==='Enter'){ searchInputRef.current?.blur() } }}
            placeholder="Buscar: catalao, araxa, goiania, sao paulo..."
            className="w-full rounded-xl bg-white/[0.08] py-3 pl-10 pr-4 outline-none"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map(c=>(
            <button key={c} onClick={()=>{setCategory(c); setCurrentPage(1)}} className={`rounded-full px-4 py-2 text-sm ${category===c?'bg-[#d4ff00] text-black':'bg-white/[0.08]'}`}>{c}</button>
          ))}
        </div>
        <div className="mt-6 grid gap-3">
          {paginatedPlaces.map((p,i)=>(
            <div key={i} className="rounded-xl border border-white/[0.08] p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="flex items-center gap-1 text-sm opacity-70"><MapPin size={12}/> {p.city} {p.road?`- ${p.road}`:''}</p>
                  <p className="mt-1 text-xs opacity-60">{p.category} {p.service?`- ${p.service}`:''}</p>
                </div>
                <a href={`https://wa.me/${formatPhoneForUrl(p.phone)}`} target="_blank" className="rounded-full bg-green-500 p-2"><MessageCircle size={18}/></a>
              </div>
              <div className="mt-3 flex gap-2">
                <a href={`tel:${formatPhoneForUrl(p.phone)}`} className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm text-black"><Phone size={14}/> {formatPhoneForDisplay(p.phone)}</a>
              </div>
            </div>
          ))}
          {filteredPlaces.length===0 && <p className="py-10 text-center opacity-60">Nada encontrado pra "{query}"</p>}
        </div>
        {totalPages>1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button disabled={currentPage===1} onClick={()=>setCurrentPage(c=>c-1)} className="rounded-full bg-white/[0.08] px-4 py-2 disabled:opacity-30">Anterior</button>
            <span className="text-sm opacity-60">{currentPage} / {totalPages}</span>
            <button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(c=>c+1)} className="rounded-full bg-white/[0.08] px-4 py-2 disabled:opacity-30">Próximo</button>
          </div>
        )}
      </div>
    </main>
  )
}
