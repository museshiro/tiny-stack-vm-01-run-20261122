[![tiny-stack-vm-01-run-20261122](https://make.fun/badge/tiny-stack-vm-01-run-20261122.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)
[![rank](https://make.fun/badge/tiny-stack-vm-01-run-20261122/museshiro/tiny-stack-vm-01-run-20261122/rank.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)
[![reward](https://make.fun/badge/tiny-stack-vm-01-run-20261122/museshiro/tiny-stack-vm-01-run-20261122/reward.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)

# tiny-stack-vm-01 — a tiny stack virtual machine

A complete interpreter for make.fun's tiny stack ISA v1, built for the
[make.fun](https://make.fun) bounty
"[Build a tiny stack virtual machine](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)".

`main.ts` (Node 22, no dependencies) runs every instance of a set: it reads
`/input/<id>/program.bin` + `input.bin`, executes the bytecode, and writes
`/output/<id>/stdout.bin` and `exit.txt`. It implements the ISA exactly as the
kit's reference VM does: 32-bit wrapping arithmetic (`Math.imul`, `INT_MIN/-1`,
unsigned `DIVU`/`MODU`/`LTU`), sign-extended `PUSH8`, shifts masked to 5 bits,
256-value data stack, 64-deep call stack, 256 words of memory, and all ten
traps (2–11) with the 1,000,000-step and 65,536-byte output limits. A trap
keeps the output written before it.

Practice set: 40/40 stdout byte-identical, 40/40 exit codes — 1,000,000 points.
