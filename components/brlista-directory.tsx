'use client'

import React, { useState, useMemo, useRef } from 'react'
import { Search, MapPin, Phone, MessageCircle, Plus, Wrench } from 'lucide-react'

export type CategoryFilter = 'Todas' | 'Borracharia' | 'Mecânica' | 'Guincho' | 'Auto Elétrica' | 'Posto'

export interface Place {
  name: string
  category: string
  city: string
  phone: string
  road?: string
  service?: string
}

// Declaração dos arrays (ou importe-os do seu ficheiro de dados/API)
const categories: CategoryFilter[] = ['Todas', 'Borracharia', 'Mecânica', 'Guincho', 'Auto Elétrica', 'Posto']
const places: Place[] = []

export function BrlistaDirectory() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('Todas')
  const [currentPage, setCurrentPage] = useState(1)
  const searchInputRef = useRef<HTMLInputElement>(null)

  function formatPhoneForUrl(phone: string) {
    const digits = phone.replace(/\D/g, '')
    return digits.startsWith('55') ? digits : `55${digits}`
  }

  function formatPhoneForDisplay(phone: string) {
    const d = phone.replace(/\D/g, '').replace(/^55/, '')
    if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
    if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
    return phone
  }

  const normalize = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
  const getUf = (city: string) => (city.match(/,\s*([A-Z]{2})$/i) \vert{}\vert{} city.match(/-\s*([A-Z]{2})$/i) || [])[1]?.toUpperCase() || ""

  const mapaEstados: Record<string, string> = {
    'ac': 'AC', 'acre': 'AC',
    'ro': 'RO', 'rondonia': 'RO', 'rondônia': 'RO',
    'go': 'GO', 'goias': 'GO', 'goiás': 'GO',
    'mg': 'MG', 'mt': 'MT', 'sp': 'SP', 'ce': 'CE', 'ceara': 'CE', 'ceará': 'CE'
  }

  const filteredPlaces = useMemo(() => {
    const q = normalize(query.trim())
    if (!q) {
      return places.filter((p) => category === 'Todas' || p.category === category)
    }
    if (mapaEstados[q]) {
      const ufAlvo = mapaEstados[q]
      return places.filter((p) => {
        const okCat = category === 'Todas' || p.category === category
        if (!okCat) return false
        const uf = getUf(p.city)
        if (uf === ufAlvo) return true
        return normalize(p.city).includes(q) || normalize(p.city).toLowerCase().includes(ufAlvo.toLowerCase())
      })
    }
    return places.filter((p) => {
      const okCat = category === 'Todas' || p.category === category
      if (!okCat) return false
      const txt = normalize(`${p.name} ${p.category} ${p.city} ${p.road ?? ''} ${p.service ?? ''}`)
      return txt.includes(q)
    })
  }, [category, query])

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage) || 1
  const paginatedPlaces = filteredPlaces.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const whatsappCadastro = `https://wa.me/5534988171945?text=${encodeURIComponent('Olá, quero cadastrar minha empresa/serviço no BRLista Brasil')}`

  return (
    <main className="min-h-screen bg-[#11110f] text-[#f6f4ed]">
      <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#11110f]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#facc15] text-black">
              <Wrench size={22} />
            </div>
            <div className="leading-none">
              <p className="text-[18px] font-black leading-none">BRLISTA</p>
              <p className="text-[18px] font-black leading-none text-[#facc15]">BRASIL</p>
              <p className="mt-1 text-[9px] tracking-[0.2em] text-white/50">SEU APOIO NA ESTRADA</p>
            </div>
          </div>
          <a href={whatsappCadastro} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-full bg-[#facc15] px-5 py-3 text-[11px] font-black leading-none text-black">
            <Plus size={14} /> Cadastrar<br />Empresa
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#facc15]/30 px-4 py-1.5 text-[10px] tracking-[0.2em] text-[#facc15]">
          <span className="h-2 w-2 rounded-full bg-[#facc15]"></span> GUIA DE SERVIÇOS RODOVIÁRIOS
        </div>

        <h1 className="mt-6 text-[44px] font-black leading-[0.9]">
          A estrada não<br />espera.<br /><span className="text-[#facc15]">Encontre ajuda.</span>
        </h1>
        <p className="mt-4 max-w-[360px] text-[14px] leading-relaxed text-white/60">
          Encontre borracharias, mecânicos, guinchos e socorro rodoviário 24h nas principais rodovias e cidades do Brasil.
        </p>

        <div className="relative mt-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#facc15]" size={18} />
          <input
            ref={searchInputRef}
            value={query}
            enterKeyHint="search"
            onKeyDown={(e) => { if (e.key === 'Enter') { searchInputRef.current?.blur() } }}
            onChange={(e) => { setQuery(e.target.value); setCurrentPage(1) }}
            placeholder="Buscar: rondonia, porto velho, vilhena, ariquemes..."
            className="w-full rounded-full border border-white/10 bg-white/[0.06] py-4 pl-12 pr-4 text-sm outline-none focus:border-[#facc15]/40"
          />
        </div>

        <p className="mt-10 text-[10px] tracking-[0.35em] text-[#facc15]">
          DIRETÓRIO DE APOIO • {filteredPlaces.length} LOCAIS
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => { setCategory(c); setCurrentPage(1) }}
              className={`rounded-full px-4 py-2 text-xs font-bold border ${category === c ? 'bg-[#facc15] text-black border-[#facc15]' : 'bg-white/5 text-white/60 border-white/10'}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-3 pb-10">
          {paginatedPlaces.length > 0 ? (
            paginatedPlaces.map((p, i) => (
              <div key={i} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{p.name}</h3>
                    <p className="flex items-center gap-1 text-sm opacity-70">
                      <MapPin size={12} /> {p.city} {p.road ? `- ${p.road}` : ''}
                    </p>
                    <p className="mt-1 text-xs opacity-60">
                      {p.category} {p.service ? `- ${p.service}` : ''}
                    </p>
                  </div>
                  <a href={`https://wa.me/${formatPhoneForUrl(p.phone)}`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-green-500 p-2 text-black">
                    <MessageCircle size={18} />
                  </a>
                </div>
                <div className="mt-3 flex gap-2">
                  <a href={`tel:${formatPhoneForUrl(p.phone)}`} className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm text-black">
                    <Phone size={14} /> {formatPhoneForDisplay(p.phone)}
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-sm text-white/40 border border-dashed border-white/10 rounded-xl">
              Nenhum local encontrado para a pesquisa.
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2 pb-10">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((c) => c - 1)} className="rounded-full bg-white/[0.08] px-4 py-2 disabled:opacity-30">
              Anterior
            </button>
            <span className="text-sm opacity-60">{currentPage} / {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((c) => c + 1)} className="rounded-full bg-white/[0.08] px-4 py-2 disabled:opacity-30">
              Próximo
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
