import ch7 from './ch7.js'
import arith from './arith.js'
import ch8a from './ch8a.js'
import ch8b from './ch8b.js'
import ch5 from './ch5.js'
import ch4io from './ch4io.js'

// Teaching order: datapath before pipelining (pipeline control sequences assume it),
// pipelining before memory (cache answers hazards), I/O last (assumes buses + interrupts basics).
export const MODULES = [ch7, arith, ch8a, ch8b, ch5, ch4io]
