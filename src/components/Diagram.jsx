import * as C7 from './diagrams/Chapter7.jsx'
import * as C8 from './diagrams/Chapter8.jsx'
import * as C5 from './diagrams/Chapter5.jsx'
import * as C4 from './diagrams/Chapter4.jsx'
import * as AR from './diagrams/Arithmetic.jsx'
import { DIAGRAM_IDS } from './diagrams/registry.js'

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
  dmaModes: C4.DmaModes,
  busArbCentralized: C4.BusArbCentralized,
  distributedArb: C4.DistributedArb,
  syncBus: C4.SyncBus,
  asyncBus: C4.AsyncBus,
  scsiRead: C4.ScsiRead,
  seqMultiplier: AR.SeqMultiplier,
  divHardware: AR.DivHardware,
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
  if (!C) return <div className="text-ash text-[13px] my-4">missing diagram: {id}</div>
  return (
    <figure className="my-6 border border-line bg-paper p-4 overflow-x-auto">
      <C />
      {caption ? <figcaption className="text-[12px] text-ash mt-3 border-t border-line pt-2">{caption}</figcaption> : null}
    </figure>
  )
}
