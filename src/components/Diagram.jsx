import { useEffect, useRef, useState } from 'react'
import * as C7 from './diagrams/Chapter7.jsx'
import * as C8 from './diagrams/Chapter8.jsx'
import * as C5 from './diagrams/Chapter5.jsx'
import * as C4 from './diagrams/Chapter4.jsx'
import * as AR from './diagrams/Arithmetic.jsx'
import { DIAGRAM_IDS } from './diagrams/registry.js'
import { LabelProvider } from './diagrams/base.jsx'

const MAP = {
  singleBus: C7.SingleBus,
  registerGating: C7.RegisterGating,
  registerBit: C7.RegisterBit,
  threeBus: C7.ThreeBus,
  hardwiredCU: C7.HardwiredCU,
  microCU: C7.MicroCU,
  microCUCond: C7.MicroCUCond,
  completeProcessor: C7.CompleteProcessor,
  controlSignalGates: C7.ControlSignalGates,
  pipe2: C8.Pipe2,
  pipe4Buffers: C8.Pipe4Buffers,
  forwarding: C8.Forwarding,
  superscalar: C8.Superscalar,
  memInterface: C5.MemInterface,
  ramChip: C5.RamChip,
  memoryHierarchy: C5.MemoryHierarchy,
  cacheBlock: C5.CacheBlock,
  directMap: C5.DirectMap,
  associativeMap: C5.AssociativeMap,
  setAssocMap: C5.SetAssocMap,
  virtualMemory: C5.VirtualMemory,
  ioBus: C4.IoBus,
  ioInterface: C4.IoInterface,
  isrFlow: C4.IsrFlow,
  priorityStructure: C4.PriorityStructure,
  daisyChain: C4.DaisyChain,
  prioritizedDaisyChain: C4.PrioritizedDaisyChain,
  dmaSystem: C4.DmaSystem,
  dmaRegisters: C4.DmaRegisters,
  dmaModes: C4.DmaModes,
  busArbCentralized: C4.BusArbCentralized,
  distributedArb: C4.DistributedArb,
  syncBus: C4.SyncBus,
  asyncBus: C4.AsyncBus,
  syncBusWrite: () => <C4.SyncBus write />,
  asyncBusWrite: () => <C4.AsyncBus write />,
  scsiRead: C4.ScsiRead,
  seqMultiplier: AR.SeqMultiplier,
  divHardware: AR.DivHardware,
  fpAdder: AR.FpAdder,
  fpAddFlow: AR.FpAddFlow,
}

// every registered id must have a component, and vice versa (guards registry drift)
for (const id of DIAGRAM_IDS) {
  if (!MAP[id]) throw new Error(`registry id without component: ${id}`)
}
for (const id of Object.keys(MAP)) {
  if (!DIAGRAM_IDS.includes(id)) throw new Error(`component missing from registry: ${id}`)
}

export const DIAGRAMS = MAP

export default function Diagram({ id, caption }) {
  const C = MAP[id]
  const [mounted, setMounted] = useState(false)
  const [shown, setShown] = useState(false)
  const trigger = useRef(null)
  const closer = useRef(null)

  // enter: mount, then flip to the open state on the next frame so the transition runs
  useEffect(() => {
    if (!mounted) return
    const raf = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(raf)
  }, [mounted])

  // exit: unmount once the close transition has run
  useEffect(() => {
    if (!mounted || shown) return
    const t = setTimeout(() => setMounted(false), 200)
    return () => clearTimeout(t)
  }, [mounted, shown])

  // Esc closes, body scroll stays locked while open, focus returns to the trigger
  useEffect(() => {
    if (!mounted) return
    const onKey = (e) => {
      if (e.key === 'Escape') setShown(false)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closer.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      trigger.current?.focus()
    }
  }, [mounted])

  if (!C) return <div className="text-ash text-[13px] my-4">missing diagram: {id}</div>

  const label = caption || id

  return (
    <figure className="my-6 border border-line bg-paper p-4">
      <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={label}>
        <div className="min-w-[460px]"><LabelProvider label={label}><C /></LabelProvider></div>
      </div>
      <figcaption className="text-[12px] text-ash mt-3 border-t border-line pt-2 flex items-start justify-between gap-4">
        <span>{caption}</span>
        <button
          ref={trigger}
          onClick={() => setMounted(true)}
          className="press shrink-0 underline underline-offset-4 hover:text-ink"
        >
          Expand
        </button>
      </figcaption>

      {mounted ? (
        <div
          className="zoom-overlay fixed inset-0 z-50 bg-paper/95 backdrop-blur overflow-y-auto h-dvh"
          data-open={shown ? 'true' : 'false'}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          onClick={() => setShown(false)}
        >
          <div className="min-h-dvh w-full max-w-[1180px] mx-auto p-4 md:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="text-[13px] text-ash leading-snug">{caption}</div>
              <button
                ref={closer}
                onClick={() => setShown(false)}
                className="press shrink-0 text-[12.5px] border border-line2 px-3 py-2 text-ash hover:text-ink"
              >
                Close (Esc)
              </button>
            </div>
            <div className="border border-line bg-paper p-3 md:p-5 overflow-x-auto [&_svg]:max-w-none!">
              <div className="min-w-[460px]"><LabelProvider label={label}><C /></LabelProvider></div>
            </div>
          </div>
        </div>
      ) : null}
    </figure>
  )
}
