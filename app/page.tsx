'use client'
import dynamic from 'next/dynamic'

const BrlistaDirectory = dynamic(
  () => import('@/components/brlista-directory').then((m) => m.BrlistaDirectory),
  { ssr: false }
)

export default function Page() {
  return <BrlistaDirectory />
}
