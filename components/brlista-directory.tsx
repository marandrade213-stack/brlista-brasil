'use client'

import React, { useState, useMemo, useRef } from 'react'
import { Search, MapPin, Phone, MessageCircle, Plus, Wrench, ChevronLeft, ChevronRight } from 'lucide-react'
import { places, categories } from '@/app/data'

export function BrlistaDirectory() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('Todas')
  const [currentPage, setCurrentPage] = useState(1)
  const searchInputRef = useRef<HTMLInputElement>(null)

  function formatPhoneForUrl(phone: any) {
    const digits = String(phone || '').replace(/\D/g, '')
    return digits.startsWith('55')? digits : `55${digits}`
  }
  function formatPhoneForDisplay(phone: any) {
    const str = String(phone || '')
    const d = str.replace(/\D/g, '').replace(/^55/, '')
    if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
    if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
    return str
  }

  const normalize = (t: any) => String(t || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
  const getUf = (city: any) => (String(city || '').match(/,\s*([A-Z]{2})$/i) || String(city || '').match(/-\s*([A-Z]{2})$/i) || [])[1]?.toUpperCase() || ""

  const mapaEstados: Record<string, string> = {
    'ac': 'AC', 'acre': 'AC',
    'al': 'AL', 'alagoas': 'AL',
    'ap': 'AP', 'amapa': 'AP',
    'am': 'AM', 'amazonas': 'AM',
    'ba': 'BA', 'bahia': 'BA',
    'ce': 'CE', 'ceara': 'CE', 'cear': 'CE',
    'df': 'DF', 'distrito federal': 'DF', 'brasilia': 'DF',
    'es': 'ES', 'espirito santo': 'ES',
    'go': 'GO', 'goias': 'GO',
    'ma': 'MA', 'maranhao': 'MA', 'maran': 'MA',
    'mt': 'MT', 'mato grosso': 'MT',
    'ms': 'MS', 'mato grosso do sul': 'MS',
    'mg': 'MG', 'minas gerais': 'MG',
    'pa': 'PA', 'para': 'PA',
    'pb': 'PB', 'paraiba': 'PB',
    'pr': 'PR', 'parana': 'PR',
    'pe': 'PE', 'pernambuco': 'PE',
    'pi': 'PI', 'piau': 'PI', 'piaui': 'PI',
    'rj': 'RJ', 'rio de janeiro': 'RJ',
    'rn': 'RN', 'rio grande do norte': 'RN',
    'rs': 'RS', 'rio grande do sul': 'RS',
    'ro': 'RO', 'rondonia': 'RO',
    'rr': 'RR', 'roraima': 'RR',
    'sc': 'SC', 'santa catarina': 'SC',
    'sp': 'SP', 'sao paulo': 'SP',
    'se': 'SE', 'sergipe': 'SE',
    'to': 'TO', 'tocantins': 'TO'
  }

  const filteredPlaces = useMemo(() => {
    const q = normalize(query.trim())
    const lista = (places as any[]) || []

    // ACHA A UF MESMO SE DIGITAR INCOMPLETO (piau, ceara, maran)
    let ufAlvo: string | null = mapaEstados[q] || null
    if (!ufAlvo && q.length >= 2) {
      const achado = Object.keys(mapaEstados).find(k => k.startsWith(q))
      if (achado) ufAlvo = mapaEstados[achado]
    }

    // DEDUPLICA CORRETO: telefone + categoria + CIDADE (pra não apagar Picos e Floriano com mesmo telefone)
    const unicos = new Map()
    lista.forEach(p => {
      const tel = String(p.telefone || p.phone || p.whatsapp || '').replace(/\D/g, '')
      const cat = normalize(p.categoria || p.category || '')
      const cidadeNorm = normalize(p.cidade || p.city || '')
      const chave = tel? `${tel}-${cat}-${cidadeNorm}` : `${p.nome}-${p.cidade}-${cat}-${Math.random()}`
      if (!unicos.has(chave)) unicos.set(chave, p)
    })
    const listaUnica = Array.from(unicos.values())

    return listaUnica.filter((p) => {
      const catText = normalize(p.categoria || p.category || '')
      const selectedCatNorm = normalize(category)
      let okCat = category === 'Todas'? true :
                  category === 'Lava Jato'? (catText.includes('lava') || catText.includes('jato')) :
                  catText.includes(selectedCatNorm)
      if (!okCat) return false
      if (!q) return true

      const cidadeText = p.cidade || p.city || ''
      const ufDoLocal = getUf(cidadeText)

      if (ufAlvo) {
        return ufDoLocal === ufAlvo
      }

      const nomeText = p.nome || p.name || ''
      const estradaText = p.rodovia || p.road || ''
      const servicoText = p.servico || p.service || ''
      const txt = normalize(`${nomeText} ${cidadeText} ${estradaText} ${servicoText} ${catText}`)
      return txt.includes(q)
    })
  }, [category, query])

  const itemsPerPage = 20
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
            onKeyDown={(e) => { if (e.key === 'Enter') searchInputRef.current?.blur() }}
            onChange={(e) => { setQuery(e.target.value); setCurrentPage(1) }}
            placeholder="Buscar: piauí, bom jesus, teresina, BR-135..."
            className="w-full rounded-full border border-white/10 bg-white/[0.06] py-4 pl-12 pr-4 text-sm outline-none focus:border-[#facc15]/40"
          />
        </div>

        <p className="mt-10 text-[10px] tracking-[0.35em] text-[#facc15]">
          DIRETÓRIO DE APOIO • {filteredPlaces.length} LOCAIS ÚNICOS
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {((categories as string[]) || ['Todas', 'Borracharia', 'Mecânica', 'Guincho', 'Auto Elétrica']).map((c) => (
            <button key={c} onClick={() => { setCategory(c); setCurrentPage(1) }}
              className={`rounded-full px-4 py-2 text-xs font-bold border ${category === c? 'bg-[#facc15] text-black border-[#facc15]' : 'bg-white/5 text-white/60 border-white/10'}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-3 pb-6">
          {paginatedPlaces.length > 0? (
            paginatedPlaces.map((p, i) => {
              const nome = p.nome || p.name || 'Serviço Rodoviário'
              const cidade = p.cidade || p.city || ''
              const rodovia = p.rodovia || p.road || ''
              const categoria = p.categoria || p.category || ''
              const servico = p.servico || p.service || ''
              const telefone = p.whatsapp || p.telefone || p.phone || ''
              return (
                <div key={i} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{nome}</h3>
                      <p className="flex items-center gap-1 text-sm opacity-70"><MapPin size={12} /> {cidade} {rodovia? `- ${rodovia}` : ''}</p>
                      <p className="mt-1 text-xs opacity-60">{categoria} {servico? `- ${servico}` : ''}</p>
                    </div>
                    {telefone && (
                      <a href={`https://wa.me/${formatPhoneForUrl(telefone)}`} target="_blank" className="rounded-full bg-green-500 p-2 text-black"><MessageCircle size={18} /></a>
                    )}
                  </div>
                  {telefone && (
                    <div className="mt-3 flex gap-2">
                      <a href={`tel:${formatPhoneForUrl(telefone)}`} className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm text-black">
                        <Phone size={14} /> {formatPhoneForDisplay(telefone)}
                      </a>
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="py-10 text-center text-sm text-white/40 border border-dashed border-white/10 rounded-xl">
              Nenhum local encontrado para a pesquisa.
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between pb-28 pt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm disabled:opacity-30"
            >
              <ChevronLeft size={16} /> Anterior
            </button>
            <span className="text-xs text-white/50">
              Página {currentPage} de {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="flex items-center gap-2 rounded-full bg-[#facc15] px-4 py-2 text-sm font-bold text-black disabled:opacity-30"
            >
              Próxima <ChevronRight size={16} />
            </button>
          </div>
        )}
        {totalPages <= 1 && <div className="pb-28" />}
      </div>
    </main>
  )
}
