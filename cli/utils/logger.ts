const RESET = '\x1b[0m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const RED = '\x1b[31m'
const CYAN = '\x1b[36m'
const DIM = '\x1b[2m'
const BOLD = '\x1b[1m'

export const log = {
  info: (msg: string) => console.log(`${CYAN}ℹ${RESET} ${msg}`),
  success: (msg: string) => console.log(`${GREEN}✓${RESET} ${msg}`),
  warn: (msg: string) => console.log(`${YELLOW}⚠${RESET} ${msg}`),
  error: (msg: string) => console.error(`${RED}✗${RESET} ${msg}`),
  dim: (msg: string) => console.log(`${DIM}${msg}${RESET}`),
  bold: (msg: string) => console.log(`${BOLD}${msg}${RESET}`),
  blank: () => console.log(),
}
