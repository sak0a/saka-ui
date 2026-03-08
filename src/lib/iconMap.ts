import type { Component } from 'vue'
import type { IconProp } from './icon'
import {
  Pencil, Copy, Archive, Trash2, Mail, Link, Code, QrCode,
  Menu, List, LayoutGrid, Columns3, ArrowUpAZ, Calendar, BarChart3,
  FilePlus, FolderOpen, Upload, Download, Share2, Settings,
  Bold, Italic, Underline, Strikethrough,
  User, CreditCard, Users, BookOpen, ExternalLink, LifeBuoy, LogOut,
  FolderPlus, Circle, Flag,
  MousePointerClick, MousePointer, Mouse, Rocket, Globe, Type,
  SlidersHorizontal, FileText, ChevronRight, ChevronDown, Plus, Folder,
  EllipsisVertical, Sparkles, ArrowDown, Maximize2,
  CloudUpload, FileUp, FileSpreadsheet, Undo2, Redo2, Scissors,
  ClipboardPaste, CheckCheck, Link2,
  Home, ArrowRight, ArrowLeft, ArrowUp, Check, X, Heart, Bell, Star,
  RefreshCw, Search, Lock, CheckCircle, Send, CircleUser,
  Moon, Sun, ShoppingCart, HelpCircle, Phone, Building2,
  Zap, Atom, Lightbulb, Hand,
  ShieldCheck, Landmark, Wallet, SunMoon, TrendingUp, Leaf, CloudSun,
  Mountain, Minimize2, MoveHorizontal, Flashlight, RotateCw, Loader2,
  Hourglass, Ban
} from 'lucide-vue-next'

export interface IconMapEntry {
  lucide: Component
  lucideName: string
}

/**
 * Mapping from MDI icon names to Lucide equivalents.
 * Keys are MDI icon names (without 'mdi-' prefix).
 */
const iconMap: Record<string, IconMapEntry> = {
  // Actions
  'pencil': { lucide: Pencil, lucideName: 'Pencil' },
  'content-copy': { lucide: Copy, lucideName: 'Copy' },
  'archive': { lucide: Archive, lucideName: 'Archive' },
  'delete': { lucide: Trash2, lucideName: 'Trash2' },
  'plus': { lucide: Plus, lucideName: 'Plus' },

  // Communication
  'email': { lucide: Mail, lucideName: 'Mail' },
  'link-variant': { lucide: Link2, lucideName: 'Link2' },
  'link': { lucide: Link, lucideName: 'Link' },
  'code-tags': { lucide: Code, lucideName: 'Code' },
  'qrcode': { lucide: QrCode, lucideName: 'QrCode' },
  'share-variant': { lucide: Share2, lucideName: 'Share2' },

  // Views
  'view-list': { lucide: List, lucideName: 'List' },
  'view-grid': { lucide: LayoutGrid, lucideName: 'LayoutGrid' },
  'view-column': { lucide: Columns3, lucideName: 'Columns3' },

  // Sorting & filtering
  'sort-alphabetical-ascending': { lucide: ArrowUpAZ, lucideName: 'ArrowUpAZ' },
  'calendar': { lucide: Calendar, lucideName: 'Calendar' },
  'chart-bar': { lucide: BarChart3, lucideName: 'BarChart3' },

  // Files & folders
  'file-plus': { lucide: FilePlus, lucideName: 'FilePlus' },
  'file-document': { lucide: FileText, lucideName: 'FileText' },
  'folder-open': { lucide: FolderOpen, lucideName: 'FolderOpen' },
  'folder': { lucide: Folder, lucideName: 'Folder' },
  'folder-plus': { lucide: FolderPlus, lucideName: 'FolderPlus' },
  'file-pdf-box': { lucide: FileText, lucideName: 'FileText' },
  'file-word-box': { lucide: FileText, lucideName: 'FileText' },
  'file-excel-box': { lucide: FileSpreadsheet, lucideName: 'FileSpreadsheet' },
  'file-delimited': { lucide: FileText, lucideName: 'FileText' },
  'file-upload': { lucide: FileUp, lucideName: 'FileUp' },

  // Transfer
  'export': { lucide: Upload, lucideName: 'Upload' },
  'import': { lucide: Download, lucideName: 'Download' },
  'upload': { lucide: Upload, lucideName: 'Upload' },
  'download': { lucide: Download, lucideName: 'Download' },
  'cloud-upload': { lucide: CloudUpload, lucideName: 'CloudUpload' },

  // Settings
  'cog': { lucide: Settings, lucideName: 'Settings' },
  'tune': { lucide: SlidersHorizontal, lucideName: 'SlidersHorizontal' },

  // Formatting
  'format-bold': { lucide: Bold, lucideName: 'Bold' },
  'format-italic': { lucide: Italic, lucideName: 'Italic' },
  'format-underline': { lucide: Underline, lucideName: 'Underline' },
  'format-strikethrough': { lucide: Strikethrough, lucideName: 'Strikethrough' },
  'format-text': { lucide: Type, lucideName: 'Type' },

  // Users
  'account': { lucide: User, lucideName: 'User' },
  'account-group': { lucide: Users, lucideName: 'Users' },

  // Navigation & UI
  'menu': { lucide: Menu, lucideName: 'Menu' },
  'chevron-right': { lucide: ChevronRight, lucideName: 'ChevronRight' },
  'chevron-down': { lucide: ChevronDown, lucideName: 'ChevronDown' },
  'dots-vertical': { lucide: EllipsisVertical, lucideName: 'EllipsisVertical' },
  'open-in-new': { lucide: ExternalLink, lucideName: 'ExternalLink' },

  // Misc
  'credit-card': { lucide: CreditCard, lucideName: 'CreditCard' },
  'book-open-variant': { lucide: BookOpen, lucideName: 'BookOpen' },
  'lifebuoy': { lucide: LifeBuoy, lucideName: 'LifeBuoy' },
  'logout': { lucide: LogOut, lucideName: 'LogOut' },
  'circle': { lucide: Circle, lucideName: 'Circle' },
  'flag': { lucide: Flag, lucideName: 'Flag' },
  'earth': { lucide: Globe, lucideName: 'Globe' },

  // Cursors & pointers
  'cursor-default-click': { lucide: MousePointerClick, lucideName: 'MousePointerClick' },
  'cursor-default': { lucide: MousePointer, lucideName: 'MousePointer' },
  'mouse-right-click': { lucide: Mouse, lucideName: 'Mouse' },

  // Decorative / animation
  'rocket-launch': { lucide: Rocket, lucideName: 'Rocket' },
  'blur': { lucide: Sparkles, lucideName: 'Sparkles' },
  'blur-radial': { lucide: Sparkles, lucideName: 'Sparkles' },
  'arrow-expand-down': { lucide: ArrowDown, lucideName: 'ArrowDown' },
  'resize': { lucide: Maximize2, lucideName: 'Maximize2' },

  // Edit operations
  'undo': { lucide: Undo2, lucideName: 'Undo2' },
  'redo': { lucide: Redo2, lucideName: 'Redo2' },
  'content-cut': { lucide: Scissors, lucideName: 'Scissors' },
  'content-paste': { lucide: ClipboardPaste, lucideName: 'ClipboardPaste' },
  'select-all': { lucide: CheckCheck, lucideName: 'CheckCheck' },

  // Navigation
  'home': { lucide: Home, lucideName: 'Home' },
  'arrow-right': { lucide: ArrowRight, lucideName: 'ArrowRight' },
  'arrow-left': { lucide: ArrowLeft, lucideName: 'ArrowLeft' },
  'arrow-up': { lucide: ArrowUp, lucideName: 'ArrowUp' },

  // Status / checks
  'check': { lucide: Check, lucideName: 'Check' },
  'close': { lucide: X, lucideName: 'X' },
  'check-circle': { lucide: CheckCircle, lucideName: 'CheckCircle' },

  // Common UI
  'heart': { lucide: Heart, lucideName: 'Heart' },
  'bell': { lucide: Bell, lucideName: 'Bell' },
  'star': { lucide: Star, lucideName: 'Star' },
  'refresh': { lucide: RefreshCw, lucideName: 'RefreshCw' },
  'magnify': { lucide: Search, lucideName: 'Search' },
  'lock': { lucide: Lock, lucideName: 'Lock' },
  'trash-can': { lucide: Trash2, lucideName: 'Trash2' },

  // Communication extended
  'email-send': { lucide: Send, lucideName: 'Send' },
  'account-circle': { lucide: CircleUser, lucideName: 'CircleUser' },
  'phone': { lucide: Phone, lucideName: 'Phone' },

  // Weather / theme
  'weather-night': { lucide: Moon, lucideName: 'Moon' },
  'weather-sunny': { lucide: Sun, lucideName: 'Sun' },

  // Commerce / misc
  'cart': { lucide: ShoppingCart, lucideName: 'ShoppingCart' },
  'help-circle': { lucide: HelpCircle, lucideName: 'HelpCircle' },
  'domain': { lucide: Building2, lucideName: 'Building2' },
  'rocket': { lucide: Rocket, lucideName: 'Rocket' },

  // Energy / science
  'flash': { lucide: Zap, lucideName: 'Zap' },
  'lightning-bolt': { lucide: Zap, lucideName: 'Zap' },
  'atom': { lucide: Atom, lucideName: 'Atom' },

  // Gestures / visual
  'gesture-tap': { lucide: Hand, lucideName: 'Hand' },
  'spotlight-beam': { lucide: Lightbulb, lucideName: 'Lightbulb' },
  'folder-outline': { lucide: FolderOpen, lucideName: 'FolderOpen' },

  // Security
  'shield-lock': { lucide: ShieldCheck, lucideName: 'ShieldCheck' },
  'shield-check-outline': { lucide: ShieldCheck, lucideName: 'ShieldCheck' },

  // Finance
  'bank': { lucide: Landmark, lucideName: 'Landmark' },
  'wallet': { lucide: Wallet, lucideName: 'Wallet' },

  // Check variants
  'check-bold': { lucide: Check, lucideName: 'Check' },

  // Theme / weather extended
  'white-balance-sunny': { lucide: Sun, lucideName: 'Sun' },
  'moon-waning-crescent': { lucide: Moon, lucideName: 'Moon' },
  'theme-light-dark': { lucide: SunMoon, lucideName: 'SunMoon' },
  'weather-partly-cloudy': { lucide: CloudSun, lucideName: 'CloudSun' },

  // Charts
  'chart-line': { lucide: TrendingUp, lucideName: 'TrendingUp' },

  // Files extended
  'file-document-outline': { lucide: FileText, lucideName: 'FileText' },

  // Nature
  'leaf': { lucide: Leaf, lucideName: 'Leaf' },

  // Notifications extended
  'bell-outline': { lucide: Bell, lucideName: 'Bell' },

  // Settings extended
  'cog-outline': { lucide: Settings, lucideName: 'Settings' },

  // Landscape
  'image-filter-hdr': { lucide: Mountain, lucideName: 'Mountain' },

  // Size / expand
  'arrow-collapse': { lucide: Minimize2, lucideName: 'Minimize2' },
  'arrow-expand-horizontal': { lucide: MoveHorizontal, lucideName: 'MoveHorizontal' },
  'arrow-expand': { lucide: Maximize2, lucideName: 'Maximize2' },

  // Cursors extended
  'cursor-default-click-outline': { lucide: MousePointerClick, lucideName: 'MousePointerClick' },

  // Light / effects
  'flashlight': { lucide: Flashlight, lucideName: 'Flashlight' },
  'rotate-3d-variant': { lucide: RotateCw, lucideName: 'RotateCw' },

  // Loading / time
  'loading': { lucide: Loader2, lucideName: 'Loader2' },
  'timer-sand': { lucide: Hourglass, lucideName: 'Hourglass' },

  // Cancel
  'cancel': { lucide: Ban, lucideName: 'Ban' },
}

export type IconPack = 'mdi' | 'lucide'

/**
 * Resolve an MDI icon name to the appropriate IconProp based on the selected pack.
 */
export function resolveIcon(mdiName: string, pack: IconPack): IconProp {
  if (pack === 'mdi') return mdiName
  const entry = iconMap[mdiName]
  return entry ? entry.lucide : mdiName // fallback to MDI string if no mapping
}

/**
 * Get the Lucide import name for code generation.
 * Returns null if no mapping exists.
 */
export function getLucideImportName(mdiName: string): string | null {
  return iconMap[mdiName]?.lucideName ?? null
}

/**
 * Collect all unique Lucide import names from a list of MDI icon names.
 * Useful for generating import statements in code snippets.
 */
export function collectLucideImports(mdiNames: string[]): string[] {
  const imports = new Set<string>()
  for (const name of mdiNames) {
    const lucideName = getLucideImportName(name)
    if (lucideName) imports.add(lucideName)
  }
  return Array.from(imports).sort()
}

/**
 * Generate a Lucide import statement for code snippets.
 */
export function lucideImportStatement(mdiNames: string[]): string {
  const imports = collectLucideImports(mdiNames)
  if (imports.length === 0) return ''
  return `import { ${imports.join(', ')} } from 'lucide-vue-next'`
}

/**
 * Convert an MDI icon name to its code representation based on the selected pack.
 * MDI: returns the quoted string, e.g. 'pencil'
 * Lucide: returns the variable name, e.g. Pencil
 */
export function iconToCode(mdiName: string, pack: IconPack): string {
  if (pack === 'mdi') return `'${mdiName}'`
  const entry = iconMap[mdiName]
  return entry ? entry.lucideName : `'${mdiName}'`
}
