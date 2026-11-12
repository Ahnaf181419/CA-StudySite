// Chapter 4 — Input/Output Organization. From slides 9_(chapter4) and class notes pp. 41–49.
export default {
  id: 'ch4io',
  chapter: 'Chapter 4 · Slides 9',
  title: 'Input/output organization',
  blurb: 'How the processor reaches devices: buses and interfaces, memory-mapped vs isolated I/O, program-controlled I/O, interrupts end to end (latency, acknowledgement, priorities, daisy chains), DMA and bus arbitration.',
  tags: ['bus', 'memory-mapped I/O', 'interrupts', 'ISR', 'daisy chain', 'DMA', 'bus arbitration'],
  prereq: [
    'A bus = address + data + control lines shared by all units (e.g. 32 address, 32 data, 20 control lines).',
    'Registers and flags: PC, general registers, condition-code flags — all of which an interrupt may have to save.',
    'Chapter 5 idea of hit/miss timing is not needed here, but “memory is slow compared to the processor” explains why synchronization mechanisms exist at all.',
  ],
  sections: [
    {
      heading: 'Accessing I/O devices: the bus and the interface circuit',
      blocks: [
        { type: 'diagram', id: 'ioBus', caption: 'Multiple I/O devices connect to processor and memory over one bus carrying address, data and control signals.' },
        { type: 'list', items: [
          'Each I/O device is assigned a **unique address**; to access a device, the processor places that address on the address lines and the device recognizes it and responds to the control signals.',
          'A device connects to the bus through an **I/O interface circuit**: an **address decoder**, **control circuits**, and **data and status registers** (both with unique addresses, connected to the data lines).',
          'The **data register** holds the data being transferred; the **status register** holds information necessary for the device’s operation; the address decoder lets the device recognize its own address.',
        ] },
        { type: 'diagram', id: 'ioInterface', caption: 'I/O interface circuit for an input device.' },
        { type: 'h', text: 'Memory-mapped vs isolated (I/O-mapped) I/O' },
        { type: 'table', head: ['', 'Memory-mapped I/O', 'Isolated / I/O-mapped I/O'], rows: [
          ['Address space', 'devices and memory **share** the same address space', 'devices have a **separate** address space'],
          ['Instructions', 'any memory-access instruction works (`MOVE DATAIN, R0`)', 'special instructions (`IN`, `OUT`)'],
          ['Software', 'simpler', 'slightly more complex'],
          ['Address lines', 'full memory address width needed', 'fewer lines may suffice; lines may be shared with memory, with a control signal saying which space is meant'],
          ['Why choose it', 'uniform, simpler software', 'I/O devices are slow — treating them specially is natural'],
        ] },
        { type: 'think', text: [
          'The class notes frame it as: memory-mapped uses (some of) the memory address bits for devices and ordinary instructions; isolated assigns device addresses **outside** the memory map, so the control signals must distinguish memory vs I/O cycles. Fall 2022 Q5(a) asks to “contrast” the two — the table above is the answer.',
        ] },
        { type: 'h', text: 'Three paradigms for synchronizing with slow devices' },
        { type: 'list', ordered: true, items: [
          '**Program-controlled I/O** — the processor repeatedly monitors a status flag (polls the device).',
          '**Interrupts** — the device alerts the processor when ready.',
          '**Direct Memory Access (DMA)** — a controller moves whole blocks without the processor.',
        ] },
      ],
    },
    {
      heading: 'Program-controlled I/O',
      blocks: [
        { type: 'p', text: 'The processor polls a status flag until the device is ready, then transfers the data. Example (the slides’/book’s keyboard-and-display arrangement): the program waits for the SIN flag of the keyboard interface, reads a character, then waits for the SOUT flag of the display and writes it.' },
        { type: 'pre', text: 'READ   Wait for  SIN        ; poll keyboard status register\n       Load    DATAIN     ; character available\nWAIT   Wait for  SOUT       ; poll display status register\n       Store   RDATA → DATAOUT\n       Branch  READ', caption: 'Read a line and echo it, program-controlled. SIN/SOUT are the “device ready” bits of the status registers.' },
        { type: 'list', items: [
          'Advantage: simple hardware, simple program.',
          'Disadvantage (the one every question wants): the processor **spends all its time polling** and does no useful work — wasteful because devices are much slower than the CPU.',
          'The solution to that problem is the interrupt: let the **device** announce readiness.',
        ] },
        { type: 'exam', text: ['Spring 2024 Q3(d) asks for exactly this program with side notes plus the disadvantage and a fix.'] },
        { type: 'p', text: 'To test a single ready flag, AND the status with 1 shifted left by the bit index, then branch back on zero. For a line echo, check both input-ready and output-ready for each character, and stop on the stated end-of-line character.' },
        { type: 'practice', prompt: 'Input-ready is bit 2 with bit 0 least significant. Status reads are 0x08, then 0x0C. On which read should you fetch DATAIN?', blocks: [
          { type: 'answer', text: 'Mask 1 << 2 = 0x04. 0x08 AND 0x04 = 0, so wait. 0x0C AND 0x04 = 0x04, so read DATAIN after the second status read.' },
        ] },
      ],
    },
    {
      heading: 'Interrupts and the interrupt-service routine',
      blocks: [
        { type: 'p', text: 'In program-controlled I/O the processor monitors continuously and does nothing useful. The alternative: the device signals an **interrupt request (IRQ)**. The simple bus diagrams use a dedicated control line. The processor can do other useful work while waiting.' },
        { type: 'list', items: [
          'The routine executed in response is the **interrupt-service routine (ISR)**, written by the OS or the device manufacturer.',
          'If the processor is executing the instruction at address i when the interrupt arrives, control must transfer to the ISR, but the PC (holding i+1) must first be **saved in a known location** (the processor stack) so the return-from-interrupt can resume at i+1.',
        ] },
        { type: 'diagram', id: 'isrFlow', caption: 'Program 1 interrupted at i; the ISR runs and returns to i+1.' },
        { type: 'h', text: 'ISR vs subroutine — the differences that force extra saving' },
        { type: 'list', items: [
          'A subroutine performs a task **the calling program** wants; the ISR may have **nothing in common** with the interrupted program (they may belong to different users).',
          'Therefore, before branching, save not only the PC but also the **condition-code flags** and the **processor registers** used by either side (the class notes list: PC, general-purpose registers, condition-code flags, processor status register).',
        ] },
        { type: 'h', text: 'Interrupt latency' },
        { type: 'p', text: 'Saving/restoring involves memory transfers: they increase execution time and increase the delay between receiving the request and starting the ISR — the **interrupt latency**. To reduce it, most processors save only the **minimum**: the PC and the processor status register; anything else must be saved **explicitly by the ISR’s first instructions**.' },
        { type: 'h', text: 'Interrupt acknowledgement — two ways' },
        { type: 'list', ordered: true, items: [
          'An explicit **interrupt-acknowledge control signal** on a special bus line (ACK / IACK).',
          'Implicitly — the **data transfer itself**: an ISR instruction that reads the device’s status or data register tells the device its request was recognized.',
        ] },
        { type: 'exam', text: ['Fall 2024 Q1(a) asks for the three “repeated interrupt” approaches below with examples — the most recent paper’s opening question.'] },
      ],
    },
    {
      heading: 'Preventing repeated interrupts: IE / ID and the three approaches',
      blocks: [
        { type: 'p', text: 'A device holds its IRQ active **until it learns the request was accepted**. That active level could cause repeated interruptions — an infinite loop the system cannot recover from. Three mechanisms (slides + notes):' },
        { type: 'table', head: ['Approach', 'Mechanism'], rows: [
          ['1. Ignore until the ISR’s first instruction completes', 'Processor hardware ignores IRQ until the first ISR instruction has executed; the programmer makes that first instruction **Interrupt-disable**, so nothing further interrupts until an Interrupt-enable runs as the **last instruction before return-from-interrupt** (which itself must complete before any new interrupt).'],
          ['2. Interrupt-enable bit in the status register', 'One PS-register bit, IE. A request is accepted only while IE = 1. On acceptance, the processor saves PC and PS on the stack, **clears IE**, and starts the ISR; return-from-interrupt restores PS, setting IE back to 1 automatically.'],
          ['3. Edge-triggered request line', 'The circuit responds only to the **leading edge** of the signal, so however long the line stays high, the processor receives exactly one request — no need to disable anything.'],
        ], caption: 'Class-note check line: with IE = 1 an IRQ is accepted (✓); with the interrupts disabled, IRQ is ignored (✗) — the ISR runs only in the first case.' },
        { type: 'think', text: [
          'All three answer the same fear — “the still-active IRQ re-triggers immediately”. Approach 1 polices it in software ordering, approach 2 in a saved-and-cleared status bit, approach 3 in the line’s physics. A fourth “summary” fact worth one line in any answer: the full sequence is device raises IRQ → processor interrupts the program → interrupts disabled → device informed (it drops IRQ) → ISR performs the task → interrupts re-enabled → program resumes.',
        ] },
        { type: 'practice', prompt: 'An active-high, level-triggered device keeps IRQ high after the ISR returns and IE becomes 1 again. What happens and what should the ISR do before returning?', blocks: [
          { type: 'answer', text: 'The same pending request may be accepted again. Acknowledge or clear its device source according to the device protocol before restoring interrupt enable. Masking during the ISR prevents nested acceptance but does not clear the level.' },
        ] },
      ],
    },
    {
      heading: 'Which device interrupted? Polling and vectored interrupts',
      blocks: [
        { type: 'list', items: [
          'Multiple devices may raise requests with no definite ordering — the processor must find out **which device**, hence **which ISR**.',
          '**Polling by ISR**: every device’s status register has an **IRQ bit** it sets when requesting; the ISR polls all devices in turn and services the first one found with IRQ = 1. Easy, but time-consuming to query every device.',
          '**Self-identification (vectored interrupt)**: the requesting device sends its own **unique ID (4–8 bits)** over the data bus. The code may be part of the ISR’s **starting address**; the rest of the address comes from other information (the address range where ISRs live). Usually the pointed-to location stores the **starting address — the interrupt vector** — which is loaded into the PC; it may also include a new processor-status value.',
        ] },
      ],
    },
    {
      heading: 'Priorities and simultaneous requests',
      blocks: [
        { type: 'list', items: [
          'Normally, while one ISR runs, **no other device may interrupt** — acceptable because ISRs are short. For devices where that delay is unacceptable, a **priority structure** is used.',
          'A **priority level is assigned to the processor** (changeable under program control — it is the priority of the currently running program). When the processor starts an ISR, **its priority rises to that of the device**; a new request is accepted only if it has **higher** priority than the processor.',
          'The processor’s priority lives in a few bits of the **PS register**, changed by **privileged instructions** executable only in supervisor mode — preventing user programs from changing it. Attempting one in user mode raises a special interrupt: a **privilege exception**.',
        ] },
        { type: 'diagram', id: 'priorityStructure', caption: 'Priority-structured scheme: separate IRQ/INTA lines, each with its own priority level, into a priority arbitration circuit in the processor.' },
        { type: 'h', text: 'Shared IRQ lines — three techniques' },
        { type: 'table', head: ['Technique', 'How priority is decided'], rows: [
          ['Polling', 'the **order in which devices are polled** — the first device found with its status bit set wins'],
          ['Daisy chain', 'devices share the IRQ line; the INTA line is daisy-chained through them — priority = **electronic proximity to the processor** (closest = highest); a device that needs no service passes the acknowledge along'],
          ['Prioritized daisy chain', 'combination: devices grouped, each group one priority level (INTR1…INTRp into a priority arbitration circuit); **within** a group, daisy-chain proximity decides'],
        ] },
        { type: 'diagram', id: 'daisyChain', caption: 'Daisy chain: shared INTR, chained INTA.' },
        { type: 'diagram', id: 'prioritizedDaisyChain', caption: 'Prioritized daisy chain: groups with different levels, chains inside groups.' },
        { type: 'think', text: [
          'For “who is serviced first” questions, first ask **which scheme** the question fixed: shared line → one of the three techniques; separate lines → priority arbitration comparing device priority with the processor’s current priority. Spring 2024 Q3(b) mixes both: D0–D5 in two priority groups — D0, D1, D2 at level 2 and D3, D4, D5 at level 1 — then asks which device wins for three simultaneous-request scenarios. Inside a level: proximity; across levels: the higher group always wins.',
        ] },
        { type: 'practice', prompt: 'D1 and D2 are in level 3, D0 in level 1. All request and the CPU runs at level 0. The level-3 chain sees D2 before D1. Who wins? Can D1 preempt D2’s ISR under a strictly-higher-priority rule?', blocks: [
          { type: 'answer', text: 'D2 wins: level 3 outranks level 1 and D2 captures the group’s acknowledge first. D1 has equal priority and waits.' },
        ] },
      ],
    },
    {
      heading: 'Direct Memory Access (DMA)',
      blocks: [
        { type: 'p', text: 'With programmed or interrupt-driven I/O, CPU instructions move each word between device registers and memory, often through a CPU register. A special control unit — the **DMA controller**, part of the device’s interface — transfers a block **directly between an I/O device and main memory without continuous processor intervention**:' },
        { type: 'diagram', id: 'dmaSystem', caption: 'DMA controllers on the system bus: a disk controller with two DMA channels, a network DMA controller; the keyboard stays program-controlled.' },
        { type: 'list', items: [
          'The controller does what the processor would have done: for **each word** it supplies the memory address and the control signals; for a block it **increments the address and counts the transfers**.',
          'The processor still **initiates** the transfer, informing the controller of: the **starting address**, the **number of words**, and the **direction** (I/O → memory or memory → I/O). After initiating, the processor suspends that program (it enters the **blocked state**) and runs something else.',
          'When the block is done, the controller informs the processor by **raising an interrupt**.',
          'A disk controller can provide **two DMA channels** — two independent sets of the three registers — as if each disk had its own controller.',
          'The DMA interface registers include a **Done flag** (set when the block is finished and the controller is ready for a new command), an **Interrupt-enable bit** (makes the controller raise the interrupt on completion), and the **IRQ bit** (set when the controller has requested an interrupt).',
        ] },
        { type: 'h', text: 'Two ways to share the bus' },
        { type: 'diagram', id: 'dmaModes', caption: 'Cycle stealing vs block/burst mode.' },
        { type: 'list', items: [
          '**Cycle stealing**: the processor starts most memory cycles; the DMA controller “steals” cycles from the bus in the interwoven gaps. DMA devices get **higher priority** than the processor; among DMA devices, high-speed peripherals (disk, graphics display) get priority.',
          '**Block / burst mode**: the DMA controller gets **exclusive** use of the bus (and memory) for the whole block — the controller, not the processor, is the **bus master** during the transfer.',
        ] },
        { type: 'think', text: [
          'Choose by block size and urgency: many short transfers → cycle stealing (processor keeps running, slightly slower); one big contiguous block → burst (amortizes arbitration overhead). The bus is unavailable to CPU requests during the burst; the CPU can still do work that needs no bus access. Distinguish the program waiting for DMA completion from the CPU waiting to acquire the bus.',
        ] },
        { type: 'practice', prompt: 'Program DMA to copy 128 words of four bytes from a device to a byte-addressed buffer at 0x2000. Give the direction, last word start address and event that tells the CPU it is done.', blocks: [
          { type: 'answer', text: 'Set start 0x2000, count 128 words, direction device→memory. Addresses advance by 4; last word starts at 0x21FC. The controller sets Done and can raise a completion interrupt when enabled.' },
        ] },
      ],
    },
    {
      heading: 'Bus arbitration',
      blocks: [
        { type: 'list', items: [
          'Processor **and** DMA controllers both need to initiate transfers and access memory. Whoever may initiate transfers at a given time is the **bus master**; selecting the next master is **bus arbitration**.',
          '**Centralized**: a single bus arbiter performs the arbitration (may be the processor or a separate unit).',
          '**Distributed**: all devices participate in choosing the next master — more reliable, no central point of failure.',
        ] },
        { type: 'diagram', id: 'busArbCentralized', caption: 'Centralized arbitration: BBSY (bus busy), BR (bus request) shared lines; BG1 daisy-chained to BG2.' },
        { type: 'steps', items: [
          'Normally the processor is the bus master unless it grants mastership to a DMA controller.',
          'A DMA controller requests the bus by asserting **BR** (bus request).',
          'The processor activates **BG1** — “you may use the bus when free”.',
          'BG1 is connected daisy-chain fashion, so it reaches the requesting controller as **BG2** (any controller closer to the processor that does not need the bus passes it on).',
          'When **BBSY** indicates the bus is free, the controller that asserted BR acquires control and becomes bus master.',
        ] },
        { type: 'h', text: 'Distributed arbitration — the worked algorithm' },
        { type: 'list', items: [
          'Every device that wants the bus shares the arbitration work. Each device has a **4-bit unique ID**; devices are connected by **5 lines**: 4 arbitration lines carrying the IDs + 1 Start-Arbitration line.',
          'To request, a device asserts Start-Arbitration and **places its 4-bit ID** on the arbitration lines; the pattern appearing on the lines is the **logical OR of all competing IDs**.',
          'Each device compares the line pattern with its own ID **starting from the MSB**; where it detects a difference, it **transmits 0s on that and all lower bit positions**.',
        ] },
        { type: 'diagram', id: 'distributedArb', caption: 'Two devices OR-tied onto the arbitration lines; the highest ID wins bit by bit.' },
        { type: 'p', text: 'Slide example — device A (ID = 5 = 0101) and device B (ID = 6 = 0110) both request: 0101 OR 0110 = **0111** on the lines. A compares 0101 with 0111, sees a difference at bit position 2, and drops to 0100. Lines now carry 0100 OR 0110 = **0110** — exactly B’s ID → **B wins** and becomes bus master.' },
        { type: 'think', text: [
          'Simulation recipe (Fall 2024 Q3(a) asks it for IDs 5, 12, 9): (1) OR **all** competing IDs onto the lines; (2) scan bit positions from MSB to LSB. At each position, a contender driving 0 loses if the line is 1. It stops contributing lower bits before those bits are evaluated. (3) Recompute the OR after each elimination; (4) the one surviving contender takes mastership when the bus is free. The highest ID wins; repeated higher-ID requests can starve a lower-ID device.',
        ] },
        { type: 'exam', text: ['Distributed arbitration with specific IDs: Fall 2024 Q3(a) (5, 12, 9). Centralized: Spring 2024 Q1(f).'] },
        { type: 'practice', prompt: 'Devices 3, 10 and 12 request the bus. Write the initial 4-bit wired OR, the eliminations from MSB to LSB, and the winner.', blocks: [
          { type: 'answer', text: '0011 OR 1010 OR 1100 = 1111 initially. At bit 3, device 3 loses; at bit 2, device 10 loses. With only 1100 remaining, device 12 wins. Compare only surviving contenders at each step.' },
        ] },
      ],
    },
    {
      heading: 'Bus timing: synchronous and asynchronous (book 4.5)',
      blocks: [
        { type: 'diagram', id: 'syncBus', caption: 'Synchronous bus: all timing derived from a common clock; a bus cycle spans a fixed number of clock cycles (t0 → t2).' },
        { type: 'list', items: [
          'Address/command become valid at t0; the slave places data and the transfer completes within the cycle (t1–t2).',
          '**Limitation**: the clock must be slowed to the **slowest device** on the bus, and long buses make skew worse — fast devices cannot use their speed.',
        ] },
        { type: 'diagram', id: 'asyncBus', caption: 'Asynchronous bus: full handshake with Master-ready and Slave-ready.' },
        { type: 'list', items: [
          'The master asserts address/command **and Master-ready** (t0). The slave returns data and asserts **Slave-ready** (t1).',
          'Seeing Slave-ready, the master drops Master-ready (t2); the slave then drops Slave-ready (t3) — each transition triggers the next, a **full handshake**.',
          '**Advantage**: the transfer adapts to each device’s response time; handshake lines and propagation delays add overhead. Synchronous buses with wait states are another way to support slower devices.',
        ] },
        { type: 'think', text: [
          'Timing-diagram questions (Fall 2024 Q1(c), Spring 2023 Q3(g)) want the **four events in order** for the handshake and the phrase “the clock is set for the slowest device” as the synchronous limitation. If asked to “overcome the limitation”, the answer is the asynchronous handshake — or intermediate designs — but name the handshake explicitly.',
        ] },
        { type: 'practice', prompt: 'In an asynchronous write, who drives data? Give the order of Master-ready and Slave-ready transitions, and say what the slave’s assertion means.', blocks: [
          { type: 'answer', text: 'Master drives address, write command and data, then asserts Master-ready. Slave accepts the data and asserts Slave-ready. Master drops Master-ready, then slave drops Slave-ready. The slave’s assertion acknowledges acceptance.' },
        ] },
      ],
    },
    {
      heading: 'SCSI: reading scattered disk sectors (applied question)',
      blocks: [
        { type: 'diagram', id: 'scsiRead', caption: 'Processor (initiator) — SCSI bus — controller (target) — disk.' },
        { type: 'list', items: [
          'The processor acts as **initiator**; it sends a command to the SCSI **target controller** identifying the data it wants by logical block numbers.',
          'The target translates each logical block into physical (cylinder, surface, sector) coordinates and reads them — **even when the sectors are not contiguous** on the disk.',
          'Each sector read travels target → initiator over the SCSI bus and then into memory (by the DMA capability of the controller).',
          'Spring 2024’s version adds: the target must first **win the bus** — apply distributed arbitration to that step.',
        ] },
        { type: 'think', text: [
          'Structure the answer as the four handoffs: command (processor → controller), seek/read per sector (controller ↔ disk), data return (controller → memory), and — if asked — bus acquisition before the transfer. Say “non-contiguous sectors are handled one at a time because each logical block maps to its own physical coordinates”.',
        ] },
        { type: 'exam', text: ['Fall 2023 Q1(c) and Spring 2024 Q3(a).'] },
      ],
    },
  ],
}
