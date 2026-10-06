'use client'

import { useMemo, useRef, useState } from 'react'
import { MapPin, MessageCircle, Phone, Search, Wrench, Plus } from 'lucide-react'
import { places } from '../app/data'

const categories = ['Todas', 'Borracharia', 'Mecânica', 'Auto Elétrica', 'Mecânica Pesada', 'Guincho / Socorro', 'Lavador de Carreta','Chaveiro'] as const
type CategoryFilter = typeof categories[number]

export function BrlistaDirectory() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('Todas')
  const [currentPage, setCurrentPage] = useState(1)

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

  const normalize = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
  const getUf = (city: string) => (city.match(/,\s*([A-Z]{2})$/i) || city.match(/-\s*([A-Z]{2})$/i) || [])[1]?.toUpperCase() || ""
  const mapaEstados: Record<string, string> = { 'ac':'AC','al':'AL','ap':'AP','am':'AM','ba':'BA','ce':'CE','df':'DF','es':'ES','go':'GO','ma':'MA','mt':'MT','ms':'MS','mg':'MG','pa':'PA','pb':'PB','pr':'PR','pe':'PE','pi':'PI','rj':'RJ','rn':'RN','rs':'RS','ro':'RO','rr':'RR','sc':'SC','sp':'SP','se':'SE','to':'TO' }

  const filteredPlaces = useMemo(() => {
    const q = normalize(query.trim())
    return places.filter((p) => {
      const ok = category === 'Todas' || p.category === category
      if (!q) return ok
      if (mapaEstados[q]) return ok && getUf(p.city) === mapaEstados[q]
      const txt = normalize(`${p.name} ${p.category} ${p.city} ${p.road?? ''} ${p.service?? ''}`)
      return ok && txt.includes(q)
    })
  }, [category, query])

  const itemsPerPage = 10
  const totalPages = Math.max(1, Math.ceil(filteredPlaces.length / itemsPerPage))
  const paginatedPlaces = filteredPlaces.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const whatsappCadastro = `https://wa.me/5534988171945?text=${encodeURIComponent('Olá, quero cadastrar minha empresa no BRLista')}`

  return (
    <main className="min-h-screen bg-[#11110f] text-[#f6f4ed]">
      <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#11110f]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#facc15] text-black"><Wrench size={22}/></div>
            <div><p className="font-black leading-none">BRLISTA</p><p className="font-black leading-none text-[#facc15]">BRASIL</p></div>
          </div>
          <a href={whatsappCadastro} className="rounded-full bg-[#facc15] px-4 py-2 text-sm font-bold text-black flex items-center gap-2"><Plus size={14}/>Cadastrar</a>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => { setCategory(cat); setCurrentPage(1)}} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${category===cat? 'bg-[#facc15] text-black font-bold' : 'bg-white/10'}`}>{cat}</button>
          ))}
        </div>

        <div className="mt-4 relative">
          <Search className="absolute left-3 top-3.5 text-white/40" size={18}/>
          <input value={query} onChange={e=>{setQuery(e.target.value); setCurrentPage(1)}} onKeyDown={e=>{ if(e.key==='Enter'){ (e.target as HTMLInputElement).blur(); } }} placeholder="Buscar cidade, BR, serviço..." className="w-full rounded-xl bg-white/10 pl-10 pr-4 py-3 outline-none" />
        </div>

        <p className="mt-4 text-sm text-white/60">{filteredPlaces.length} resultados</p>

        <div className="mt-4 grid gap-3">
          {paginatedPlaces.map((p, i) => (
            <div key={i} className="rounded-xl border border-white/10 p-4">
              <p className="font-bold">{p.name}</p>
              <p className="text-sm text-white/60 flex items-center gap-1"><MapPin size={12}/>{p.city} {p.road? `- ${p.road}`:''} • {p.category}</p>
              <div className="mt-3 flex gap-2">
                <a href={`https://wa.me/${formatPhoneForUrl(p.phone)}`} target="_blank" className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-bold text-white flex items-center gap-2"><MessageCircle size={14}/>WhatsApp</a>
                <a href={`tel:${formatPhoneForUrl(p.phone)}`} className="rounded-full bg-white/10 px-4 py-2 text-sm flex items-center gap-2"><Phone size={14}/>{formatPhoneForDisplay(p.phone)}</a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-2">
          <button disabled={currentPage===1} onClick={()=>setCurrentPage(c=>c-1)} className="rounded-full bg-white/10 px-4 py-2 disabled:opacity-30">Anterior</button>
          <span className="px-4 py-2 text-sm">{currentPage} / {totalPages}</span>
          <button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(c=>c+1)} className="rounded-full bg-white/10 px-4 py-2 disabled:opacity-30">Próxima</button>
        </div>
      </div>
    </main>
  )
}
