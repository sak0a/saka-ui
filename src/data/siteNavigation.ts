export interface NavItem {
  name: string
  href: string
  icon: string
  match?: string
}

export interface SearchEntry {
  id: string
  title: string
  href: string
  section: 'ui' | 'docs' | 'examples'
  category: string
  description: string
  keywords: string[]
}

export interface SearchResult extends SearchEntry {
  score: number
  reasons: string[]
}

export const githubRepoUrl = 'https://github.com/sak0a/saka-ui'

export const topics: NavItem[] = [
  { name: 'Components', href: '/ui', icon: 'puzzle', match: '/ui' },
  { name: 'Docs', href: '/docs', icon: 'book-open-variant', match: '/docs' },
  { name: 'Examples', href: '/examples/auth', icon: 'application-brackets', match: '/examples' },
]

export const uiNavigation: NavItem[] = [
  { name: 'Accordion', href: '/ui/accordion', icon: 'chevron-down-box-outline' },
  { name: 'Alerts', href: '/ui/alerts', icon: 'alert-circle-outline' },
  { name: 'Avatar', href: '/ui/avatar', icon: 'account-circle' },
  { name: 'Badges', href: '/ui/badges', icon: 'tag-multiple' },
  { name: 'Breadcrumb', href: '/ui/breadcrumb', icon: 'chevron-double-right' },
  { name: 'Buttons', href: '/ui/buttons', icon: 'button-cursor' },
  { name: 'Card', href: '/ui/card', icon: 'card-outline' },
  { name: 'Carousel', href: '/ui/carousel', icon: 'view-carousel' },
  { name: 'Checkbox', href: '/ui/checkbox', icon: 'checkbox-marked' },
  { name: 'Chips', href: '/ui/chips', icon: 'label' },
  { name: 'Color Picker', href: '/ui/color-picker', icon: 'palette' },
  { name: 'Date Picker', href: '/ui/date-picker', icon: 'calendar' },
  { name: 'Dialog', href: '/ui/dialog', icon: 'comment-question-outline' },
  { name: 'Drawer', href: '/ui/drawer', icon: 'dock-bottom' },
  { name: 'Dropdown', href: '/ui/dropdown', icon: 'menu-down' },
  { name: 'Glass Button', href: '/ui/glass-button', icon: 'blur' },
  { name: 'Glass Card', href: '/ui/glass-card', icon: 'blur' },
  { name: 'Icons', href: '/ui/icons', icon: 'emoticon' },
  { name: 'Input', href: '/ui/input', icon: 'form-textbox' },
  { name: 'Kbd', href: '/ui/kbd', icon: 'keyboard' },
  { name: 'Modal', href: '/ui/modal', icon: 'forum-outline' },
  { name: 'OTP', href: '/ui/otp', icon: 'form-textbox-password' },
  { name: 'Pagination', href: '/ui/pagination', icon: 'page-next' },
  { name: 'Popover', href: '/ui/popover', icon: 'card-text-outline' },
  { name: 'Progress', href: '/ui/progress', icon: 'progress-check' },
  { name: 'Morphing Card', href: '/ui/morphing-card', icon: 'card-outline' },
  { name: 'Morphing Modal', href: '/ui/morphing-modal', icon: 'transition' },
  { name: 'Radio', href: '/ui/radio', icon: 'radiobox-marked' },
  { name: 'Select', href: '/ui/select', icon: 'form-dropdown' },
  { name: 'Skeleton', href: '/ui/skeleton', icon: 'blur-linear' },
  { name: 'Stepper', href: '/ui/stepper', icon: 'step-forward' },
  { name: 'Switch', href: '/ui/switch', icon: 'toggle-switch' },
  { name: 'Table', href: '/ui/table', icon: 'table' },
  { name: 'Tabs', href: '/ui/tabs', icon: 'view-dashboard' },
  { name: 'Toast', href: '/ui/toast', icon: 'bell-outline' },
  { name: 'Tooltips', href: '/ui/tooltips', icon: 'tooltip-text' },
]

export const docsNavigation: NavItem[] = [
  { name: 'Getting Started', href: '/docs/getting-started', icon: 'rocket-launch' },
  { name: 'CLI', href: '/docs/cli', icon: 'console' },
  { name: 'Styling Guide', href: '/docs/styling-guide', icon: 'palette-swatch-variant' },
  { name: 'Customization', href: '/docs/customization', icon: 'tune-variant' },
  { name: 'Icons Guide', href: '/docs/icons-guide', icon: 'emoticon-outline' },
  { name: 'Form Validation', href: '/docs/form-validation', icon: 'check-decagram' },
  { name: 'useTheme', href: '/docs/use-theme', icon: 'palette-swatch' },
  { name: 'useClipboard', href: '/docs/use-clipboard', icon: 'content-copy' },
  { name: 'useClickOutside', href: '/docs/use-click-outside', icon: 'cursor-default-click-outline' },
  { name: 'useMediaQuery', href: '/docs/use-media-query', icon: 'responsive' },
  { name: 'useDebounce', href: '/docs/use-debounce', icon: 'timer-sand' },
  { name: 'useLocalStorage', href: '/docs/use-local-storage', icon: 'database-outline' },
  { name: 'useAsync', href: '/docs/use-async', icon: 'loading' },
  { name: 'useHotkey', href: '/docs/use-hotkey', icon: 'keyboard' },
  { name: 'useIntersectionObserver', href: '/docs/use-intersection-observer', icon: 'eye-outline' },
]

export const examplesNavigation: NavItem[] = [
  { name: 'Auth Form', href: '/examples/auth', icon: 'login' },
  { name: 'Project Scaffold', href: '/examples/project', icon: 'rocket-launch' },
  { name: 'Form Field', href: '/examples/form-field', icon: 'form-select' },
  { name: 'Credit Card', href: '/examples/credit-card', icon: 'credit-card-outline' },
]

const uiKeywords: Record<string, string[]> = {
  '/ui': ['overview', 'landing page', 'component library', 'design system', 'vue'],
  '/ui/accordion': ['collapsible', 'disclosure', 'faq', 'expandable'],
  '/ui/alerts': ['feedback', 'status', 'success', 'warning', 'error'],
  '/ui/avatar': ['profile', 'image', 'fallback', 'user'],
  '/ui/badges': ['status', 'label', 'tag', 'pill'],
  '/ui/breadcrumb': ['navigation', 'trail', 'hierarchy'],
  '/ui/buttons': ['action', 'cta', 'variants', 'loading'],
  '/ui/card': ['surface', 'content block', 'layout'],
  '/ui/carousel': ['slider', 'gallery', 'slides'],
  '/ui/checkbox': ['selection', 'form control', 'multi select'],
  '/ui/chips': ['tokens', 'pills', 'tags'],
  '/ui/color-picker': ['hex', 'hsl', 'rgba', 'brand colors'],
  '/ui/date-picker': ['calendar', 'date input', 'booking'],
  '/ui/dialog': ['confirmation', 'overlay', 'prompt'],
  '/ui/drawer': ['side panel', 'sheet', 'offcanvas'],
  '/ui/dropdown': ['menu', 'context menu', 'actions'],
  '/ui/glass-button': ['glassmorphism', 'hero action', 'frosted'],
  '/ui/glass-card': ['glassmorphism', 'frosted card', 'surface'],
  '/ui/icons': ['iconography', 'mdi', 'lucide', 'icon pack'],
  '/ui/input': ['text field', 'search input', 'forms'],
  '/ui/kbd': ['shortcut', 'keyboard hint', 'command'],
  '/ui/modal': ['overlay', 'dialog window', 'focus trap'],
  '/ui/otp': ['verification code', 'pin input', 'auth'],
  '/ui/pagination': ['pages', 'table controls', 'navigation'],
  '/ui/popover': ['popover', 'floating panel', 'contextual', 'overlay', 'tooltip', 'click popup'],
  '/ui/progress': ['loader', 'meter', 'progress bar'],
  '/ui/morphing-card': ['expanding card', 'animation', 'transition'],
  '/ui/morphing-modal': ['animated modal', 'transition', 'overlay'],
  '/ui/radio': ['single select', 'options', 'choice'],
  '/ui/select': ['combobox', 'dropdown input', 'searchable'],
  '/ui/skeleton': ['loading state', 'placeholder', 'shimmer'],
  '/ui/stepper': ['wizard', 'multi-step form', 'progress steps'],
  '/ui/switch': ['toggle', 'boolean', 'settings'],
  '/ui/table': ['data grid', 'rows', 'sorting'],
  '/ui/tabs': ['tabbed interface', 'panes', 'navigation'],
  '/ui/toast': ['notifications', 'snackbar', 'alerts'],
  '/ui/tooltips': ['hover help', 'hint', 'popover'],
}

const docsMetadata: Record<string, { description: string, keywords: string[] }> = {
  '/docs/getting-started': {
    description: 'Installation, package setup, CLI bootstrapping, and the fastest route into Saka UI.',
    keywords: ['install', 'setup', 'quick start', 'npm', 'bun', 'pnpm', 'package mode', 'open-code mode'],
  },
  '/docs/cli': {
    description: 'Initialize projects, copy components into your app, list components, and diff customizations.',
    keywords: ['command line', 'init', 'add', 'list', 'diff', 'registry'],
  },
  '/docs/styling-guide': {
    description: 'Theme tokens, CSS variables, Tailwind integration, and how to restyle the system safely.',
    keywords: ['theme', 'tokens', 'css variables', 'tailwind', 'branding'],
  },
  '/docs/customization': {
    description: 'When to use props, when to override tokens, and when to copy source for deeper changes.',
    keywords: ['customize', 'override', 'source editing', 'open code', 'strategy'],
  },
  '/docs/icons-guide': {
    description: 'Material Design Icons and Lucide usage patterns for components and custom icon rendering.',
    keywords: ['icons', 'mdi', 'lucide', 'icon components'],
  },
  '/docs/form-validation': {
    description: 'Validation helpers, form patterns, and composing rules for robust user input flows.',
    keywords: ['forms', 'validation', 'rules', 'errors', 'schema'],
  },
  '/docs/use-theme': {
    description: 'Theme switching, light and dark mode management, and token-aware UI updates.',
    keywords: ['theme', 'dark mode', 'light mode', 'appearance'],
  },
  '/docs/use-clipboard': {
    description: 'Clipboard reads and writes with feedback for copy-focused interfaces.',
    keywords: ['copy', 'paste', 'clipboard', 'share'],
  },
  '/docs/use-click-outside': {
    description: 'Close popovers, menus, and overlays when pointer events happen outside the target.',
    keywords: ['outside click', 'dismiss', 'popover', 'dropdown'],
  },
  '/docs/use-media-query': {
    description: 'Reactive breakpoint logic driven by browser media queries.',
    keywords: ['responsive', 'breakpoints', 'viewport', 'match media'],
  },
  '/docs/use-debounce': {
    description: 'Delay expensive updates like live search, API requests, and validation until input settles.',
    keywords: ['debounce', 'search', 'delay', 'typing', 'performance'],
  },
  '/docs/use-local-storage': {
    description: 'Persist state in localStorage with reactive Vue bindings.',
    keywords: ['persist', 'storage', 'save', 'browser'],
  },
  '/docs/use-async': {
    description: 'Track async state, loading transitions, and request lifecycle without boilerplate.',
    keywords: ['async', 'loading', 'promise', 'request'],
  },
  '/docs/use-hotkey': {
    description: 'Register keyboard shortcuts, command-style triggers, and scoped key handlers.',
    keywords: ['shortcut', 'keyboard', 'cmd+k', 'ctrl+k', 'hotkeys'],
  },
  '/docs/use-intersection-observer': {
    description: 'Detect viewport visibility for lazy loading, scroll-triggered effects, and analytics.',
    keywords: ['visibility', 'viewport', 'lazy loading', 'observer'],
  },
}

const exampleMetadata: Record<string, { description: string, keywords: string[] }> = {
  '/examples/auth': {
    description: 'Authentication form patterns with structured fields, validation, and polished actions.',
    keywords: ['login', 'signup', 'authentication', 'forms'],
  },
  '/examples/project': {
    description: 'Project creation scaffolds that show richer layout, inputs, and multi-field composition.',
    keywords: ['project form', 'scaffold', 'dashboard', 'workspace'],
  },
  '/examples/form-field': {
    description: 'Composed form field examples that demonstrate labels, hints, validation, and state.',
    keywords: ['field', 'validation', 'forms', 'input states'],
  },
  '/examples/credit-card': {
    description: 'Checkout-style credit card form UI for payment-oriented flows and masking patterns.',
    keywords: ['payment', 'checkout', 'credit card', 'billing'],
  },
}

const searchEntries: SearchEntry[] = [
  {
    id: 'ui-home',
    title: 'Component Library Overview',
    href: '/ui',
    section: 'ui',
    category: 'Components',
    description: 'Browse the component catalog, interaction patterns, and visual primitives available in Saka UI.',
    keywords: uiKeywords['/ui'],
  },
  ...uiNavigation.map((item) => ({
    id: item.href,
    title: item.name,
    href: item.href,
    section: 'ui' as const,
    category: 'Component',
    description: `${item.name} component documentation with examples, API details, variants, and usage notes.`,
    keywords: uiKeywords[item.href] ?? ['component', 'api', 'examples', 'vue'],
  })),
  ...docsNavigation.map((item) => ({
    id: item.href,
    title: item.name,
    href: item.href,
    section: 'docs' as const,
    category: 'Guide',
    description: docsMetadata[item.href]?.description ?? `${item.name} guide and reference for Saka UI.`,
    keywords: docsMetadata[item.href]?.keywords ?? ['guide', 'docs', 'reference'],
  })),
  ...examplesNavigation.map((item) => ({
    id: item.href,
    title: item.name,
    href: item.href,
    section: 'examples' as const,
    category: 'Example',
    description: exampleMetadata[item.href]?.description ?? `${item.name} example built with Saka UI components.`,
    keywords: exampleMetadata[item.href]?.keywords ?? ['example', 'demo', 'ui pattern'],
  })),
]

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function tokenize(value: string): string[] {
  return normalize(value).split(/\s+/).filter(Boolean)
}

function isSubsequence(query: string, target: string): number {
  if (!query || !target) return 0

  let queryIndex = 0
  let firstMatch = -1
  let lastMatch = -1

  for (let i = 0; i < target.length && queryIndex < query.length; i += 1) {
    if (target[i] === query[queryIndex]) {
      if (firstMatch === -1) firstMatch = i
      lastMatch = i
      queryIndex += 1
    }
  }

  if (queryIndex !== query.length || firstMatch === -1 || lastMatch === -1) {
    return 0
  }

  const spread = lastMatch - firstMatch + 1
  return Math.max(8, 34 - spread)
}

function sectionForPath(path: string): SearchEntry['section'] {
  if (path.startsWith('/docs')) return 'docs'
  if (path.startsWith('/examples')) return 'examples'
  return 'ui'
}

export function searchSite(query: string, currentPath = '', limit = 10): SearchResult[] {
  const normalizedQuery = normalize(query)
  const queryTokens = tokenize(query)
  const currentSection = sectionForPath(currentPath)

  const ranked = searchEntries
    .map((entry) => {
      const title = normalize(entry.title)
      const description = normalize(entry.description)
      const keywords = entry.keywords.map(normalize)
      const haystack = [title, description, ...keywords].join(' ')
      const reasons: string[] = []
      let score = 0

      if (!normalizedQuery) {
        if (entry.section === currentSection) score += 32
        if (entry.href === currentPath) score -= 24
        if (entry.category === 'Guide') score += 6
        if (entry.category === 'Example' && currentSection === 'examples') score += 6
        return { ...entry, score, reasons: ['Suggested for this section'] }
      }

      if (title === normalizedQuery) {
        score += 150
        reasons.push('Exact title match')
      } else if (title.startsWith(normalizedQuery)) {
        score += 96
        reasons.push('Title starts with your query')
      } else if (title.includes(normalizedQuery)) {
        score += 72
        reasons.push('Title contains your query')
      }

      const fuzzyScore = isSubsequence(normalizedQuery.replace(/\s+/g, ''), title.replace(/\s+/g, ''))
      if (fuzzyScore > 0) {
        score += fuzzyScore
        reasons.push('Close fuzzy match')
      }

      for (const token of queryTokens) {
        if (!token) continue

        if (title.split(' ').some((word) => word.startsWith(token))) {
          score += 28
        } else if (title.includes(token)) {
          score += 18
        }

        if (keywords.some((word) => word.includes(token))) {
          score += 14
        }

        if (description.includes(token)) {
          score += 10
        }

        if (haystack.includes(token)) {
          score += 6
        }
      }

      if (entry.section === currentSection) {
        score += 12
      }

      if (entry.href === currentPath) {
        score -= 20
      }

      if (score > 0 && reasons.length === 0) {
        reasons.push('Relevant keywords and content')
      }

      return { ...entry, score, reasons }
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title))

  return ranked.slice(0, limit)
}
