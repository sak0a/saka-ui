<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  SCard, SCardHeader, SCardContent, SCardFooter, SCardMedia, SCardActions,
  SButton, SBadge, SChip, SApiSection, SApiTable
} from '../../index'
import type { ApiProp, ApiEvent, ApiSlot } from '../../index'
import DemoSection from '../../components/DemoSection.vue'
import { useCustomizer } from '../../composables/useCustomizer'
import { iconToCode, getLucideImportName, lucideImportStatement } from '../../lib/iconMap'

const { ri, iconPack } = useCustomizer()

const cv = (mdiName: string) => iconToCode(mdiName, iconPack.value)
const cp = (mdiName: string, attr = 'icon') => {
  if (iconPack.value === 'mdi') return `${attr}="${mdiName}"`
  const name = getLucideImportName(mdiName)
  return name ? `:${attr}="${name}"` : `${attr}="${mdiName}"`
}
const li = (...mdiNames: string[]) => {
  if (iconPack.value === 'mdi') return ''
  return '\n' + lucideImportStatement(mdiNames)
}

// Demo state
const isLoading = ref(false)
const toggleLoading = () => {
  isLoading.value = true
  setTimeout(() => isLoading.value = false, 2000)
}

const likedCards = ref<number[]>([])
const toggleLike = (id: number) => {
  if (likedCards.value.includes(id)) {
    likedCards.value = likedCards.value.filter(i => i !== id)
  } else {
    likedCards.value.push(id)
  }
}

// Sample data
const teamMembers = [
  { name: 'Alex Chen', role: 'Lead Designer', avatar: 'https://i.pravatar.cc/150?img=1' },
  { name: 'Sam Wilson', role: 'Developer', avatar: 'https://i.pravatar.cc/150?img=2' },
  { name: 'Jordan Lee', role: 'Product Manager', avatar: 'https://i.pravatar.cc/150?img=3' }
]

const products = [
  { id: 1, name: 'Wireless Headphones', price: '$299', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', rating: 4.8 },
  { id: 2, name: 'Smart Watch', price: '$449', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop', rating: 4.9 },
  { id: 3, name: 'Camera Lens', price: '$899', image: 'https://images.unsplash.com/photo-1606986628253-e0e8e9a88300?w=400&h=300&fit=crop', rating: 4.7 }
]

// Code snippets
const basicCode = computed(() => `<SCard>
  <SCardHeader
    title="Project Overview"
    subtitle="Updated 2 hours ago"
    ${cp('folder-outline')}
  />
  <SCardContent>
    This is the card content area. Cards are surfaces that display content
    and actions on a single topic, making it easy to scan for relevant information.
  </SCardContent>
  <SCardFooter divider justify="end">
    <SButton variant="ghost" size="small">Cancel</SButton>
    <SButton size="small">Save</SButton>
  </SCardFooter>
</SCard>`)

const variantsCode = `<!-- Elevated (default) -->
<SCard variant="elevated">
  <SCardContent>Elevated card with shadow</SCardContent>
</SCard>

<!-- Outlined -->
<SCard variant="outlined">
  <SCardContent>Outlined card with border</SCardContent>
</SCard>

<!-- Filled -->
<SCard variant="filled">
  <SCardContent>Filled background card</SCardContent>
</SCard>

<!-- Ghost -->
<SCard variant="ghost">
  <SCardContent>Ghost card (transparent)</SCardContent>
</SCard>

<!-- Glass -->
<SCard variant="glass">
  <SCardContent>Glassmorphism effect</SCardContent>
</SCard>`

const interactiveCode = computed(() => `<!-- Hoverable -->
<SCard hoverable>
  <SCardHeader title="Hoverable" ${cp('arrow-up')} icon-color="#3b82f6" />
  <SCardContent>
    Hover me for a lift effect with enhanced shadow!
  </SCardContent>
</SCard>

<!-- Pressable -->
<SCard pressable clickable>
  <SCardHeader title="Pressable" ${cp('gesture-tap')} icon-color="#ef4444" />
  <SCardContent>
    Click me! I have a satisfying press effect.
  </SCardContent>
</SCard>

<!-- With spotlight glow -->
<SCard spotlight spotlight-color="#8b5cf6" variant="outlined">
  <SCardHeader title="Spotlight" ${cp('spotlight-beam')} icon-color="#8b5cf6" />
  <SCardContent>
    Move your mouse around for a glow effect!
  </SCardContent>
</SCard>

<!-- 3D Tilt effect -->
<SCard tilt hoverable>
  <SCardHeader title="3D Tilt" icon="rotate-3d-variant" icon-color="#10b981" />
  <SCardContent>
    Perspective-based 3D rotation on hover.
  </SCardContent>
</SCard>`)

const mediaCode = `<SCard hoverable>
  <SCardMedia
    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
    ratio="16/9"
    zoom
  >
    <template #badge>
      <SBadge color="#ef4444">Featured</SBadge>
    </template>
  </SCardMedia>
  <SCardHeader title="Mountain Sunrise" subtitle="Swiss Alps" />
  <SCardContent>
    Breathtaking views of the Alps at dawn with golden light.
  </SCardContent>
  <SCardActions justify="between">
    <SButton variant="ghost" size="small" icon-left="heart-outline">Like</SButton>
    <SButton variant="ghost" size="small" icon-left="share-variant-outline">Share</SButton>
  </SCardActions>
</SCard>`

const horizontalCode = `<!-- Media on the left -->
<SCard horizontal hoverable>
  <SCardMedia
    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
    position="left"
  />
  <div class="flex-1 p-4">
    <SCardHeader title="Wireless Headphones" subtitle="Premium Audio" />
    <SCardContent>
      Experience crystal-clear sound with active noise cancellation.
    </SCardContent>
    <SCardFooter justify="between">
      <span class="text-lg font-bold">$299</span>
      <SButton size="small" icon-left="cart-outline">Add to Cart</SButton>
    </SCardFooter>
  </div>
</SCard>

<!-- Media on the right -->
<SCard horizontal media-right hoverable>
  <div class="flex-1 p-4">
    <SCardHeader title="Smart Watch Series 5" subtitle="Fitness & Health" />
    <SCardContent>
      Track your health metrics with advanced sensors and GPS.
    </SCardContent>
    <SCardFooter justify="between">
      <span class="text-lg font-bold">$449</span>
      <SButton size="small" icon-left="cart-outline">Add to Cart</SButton>
    </SCardFooter>
  </div>
  <SCardMedia
    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
    position="right"
  />
</SCard>`

const animationsCode = `<!-- Floating icons -->
<SCard>
  <span class="mdi mdi-star animate-float" />
  <span class="mdi mdi-heart animate-float" style="animation-delay: 0.2s" />
</SCard>

<!-- Pulse effect -->
<SCard>
  <div class="animate-ping" />
</SCard>

<!-- Progress bar animation -->
<SCard>
  <div class="animate-progress-85" />
</SCard>`

const loadingCode = computed(() => `<!-- Loading overlay -->
<SCard :loading="isLoading">
  <SCardHeader title="Loading Overlay" subtitle="Click button below" ${cp('loading')} />
  <SCardContent>
    This card shows a shimmer loading overlay when loading is true.
  </SCardContent>
</SCard>

<!-- Skeleton media + content -->
<SCard>
  <SCardMedia skeleton ratio="16/9" />
  <SCardContent :skeleton="true" :skeleton-lines="3" />
</SCard>

<!-- Skeleton with avatar -->
<SCard>
  <SCardContent :skeleton="true" :skeleton-lines="4" />
</SCard>`)

const overlayCode = `<SCard>
  <SCardMedia 
    src="https://example.com/image.jpg"
    ratio="16/9"
    overlay="linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
    overlayMode="hover"
  >
    <template #overlay>
      <div class="p-4 text-white">
        <h3 class="font-bold">Hover Overlay</h3>
        <p class="text-sm opacity-80">Content revealed on hover</p>
      </div>
    </template>
  </SCardMedia>
</SCard>`

// API Reference
const cardProps: ApiProp[] = [
  { name: 'variant', type: "'elevated' | 'outlined' | 'filled' | 'ghost' | 'glass'", default: "'elevated'", description: 'Visual style variant', category: 'Core' },
  { name: 'size', type: "'compact' | 'default' | 'comfortable'", default: "'default'", description: 'Size preset affecting padding', category: 'Core' },
  { name: 'rounded', type: "'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'", default: "'lg'", description: 'Border radius', category: 'Appearance' },
  { name: 'hoverable', type: 'boolean', default: 'false', description: 'Enable hover animation effects', category: 'Interactive' },
  { name: 'pressable', type: 'boolean', default: 'false', description: 'Enable press/click scale effect', category: 'Interactive' },
  { name: 'clickable', type: 'boolean', default: 'false', description: 'Make entire card clickable', category: 'Interactive' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading overlay', category: 'State' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state', category: 'State' },
  { name: 'spotlight', type: 'boolean', default: 'false', description: 'Enable spotlight glow effect', category: 'Effects' },
  { name: 'spotlightColor', type: 'string', default: "'var(--s-primary)'", description: 'Spotlight color', category: 'Effects' },
  { name: 'tilt', type: 'boolean', default: 'false', description: 'Enable 3D tilt effect', category: 'Effects' },
  { name: 'gradientBorder', type: 'string', default: '—', description: 'CSS gradient for border', category: 'Appearance' },
  { name: 'gradientBg', type: 'string', default: '—', description: 'CSS gradient for background', category: 'Appearance' },
  { name: 'horizontal', type: 'boolean', default: 'false', description: 'Horizontal layout', category: 'Layout' },
  { name: 'mediaRight', type: 'boolean', default: 'false', description: 'Flip media to right side', category: 'Layout' },
  { name: 'width', type: 'string', default: '—', description: 'Card width', category: 'Sizing' },
  { name: 'maxWidth', type: 'string', default: '—', description: 'Card max-width', category: 'Sizing' },
  { name: 'height', type: 'string', default: '—', description: 'Card height', category: 'Sizing' },
  { name: 'tag', type: 'string', default: "'div'", description: 'HTML tag to render', category: 'Advanced' },
  { name: 'href', type: 'string', default: '—', description: 'Link URL (renders as anchor)', category: 'Navigation' },
  { name: 'to', type: 'string | object', default: '—', description: 'Vue Router destination', category: 'Navigation' }
]

const headerProps: ApiProp[] = [
  { name: 'title', type: 'string', default: '—', description: 'Title text', category: 'Content' },
  { name: 'subtitle', type: 'string', default: '—', description: 'Subtitle text', category: 'Content' },
  { name: 'avatar', type: 'string', default: '—', description: 'Avatar image URL', category: 'Content' },
  { name: 'avatarFallback', type: 'string', default: '—', description: 'Avatar fallback text', category: 'Content' },
  { name: 'icon', type: 'string', default: '—', description: 'MDI icon name', category: 'Content' },
  { name: 'iconColor', type: 'string', default: "'var(--s-primary)'", description: 'Icon color', category: 'Appearance' },
  { name: 'divider', type: 'boolean', default: 'false', description: 'Show divider below', category: 'Appearance' },
  { name: 'layout', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout direction', category: 'Layout' },
  { name: 'align', type: "'start' | 'center' | 'end'", default: "'start'", description: 'Content alignment', category: 'Layout' }
]

const mediaProps: ApiProp[] = [
  { name: 'src', type: 'string', default: '—', description: 'Image source URL', category: 'Content' },
  { name: 'video', type: 'string', default: '—', description: 'Video source URL', category: 'Content' },
  { name: 'alt', type: 'string', default: "''", description: 'Alt text', category: 'Accessibility' },
  { name: 'ratio', type: "'auto' | '1/1' | '4/3' | '16/9' | '21/9' | '3/4' | '9/16'", default: "'auto'", description: 'Aspect ratio', category: 'Sizing' },
  { name: 'height', type: 'string', default: '—', description: 'Height override', category: 'Sizing' },
  { name: 'fit', type: "'cover' | 'contain' | 'fill' | 'none' | 'scale-down'", default: "'cover'", description: 'Object fit', category: 'Appearance' },
  { name: 'zoom', type: 'boolean', default: 'false', description: 'Zoom on hover', category: 'Effects' },
  { name: 'zoomScale', type: 'number', default: '1.1', description: 'Zoom scale factor', category: 'Effects' },
  { name: 'overlay', type: 'string', default: '—', description: 'Overlay color/gradient', category: 'Overlay' },
  { name: 'overlayOpacity', type: 'number', default: '0.5', description: 'Overlay opacity', category: 'Overlay' },
  { name: 'overlayMode', type: "'always' | 'hover'", default: "'always'", description: 'When to show overlay', category: 'Overlay' },
  { name: 'position', type: "'top' | 'bottom' | 'left' | 'right' | 'background'", default: "'top'", description: 'Position in card', category: 'Layout' },
  { name: 'lazy', type: 'boolean', default: 'true', description: 'Lazy load image', category: 'Performance' },
  { name: 'skeleton', type: 'boolean', default: 'false', description: 'Show skeleton', category: 'State' }
]

const contentProps: ApiProp[] = [
  { name: 'padding', type: 'string', default: '—', description: 'Custom padding override', category: 'Layout' },
  { name: 'align', type: "'left' | 'center' | 'right' | 'justify'", default: "'left'", description: 'Text alignment', category: 'Layout' },
  { name: 'maxHeight', type: 'string', default: '—', description: 'Maximum height for scrollable content', category: 'Layout' },
  { name: 'skeleton', type: 'boolean', default: 'false', description: 'Render a loading skeleton instead of slot content', category: 'State' },
  { name: 'skeletonLines', type: 'number', default: '3', description: 'Number of placeholder lines when skeleton is enabled', category: 'State' }
]

const footerProps: ApiProp[] = [
  { name: 'divider', type: 'boolean', default: 'false', description: 'Show a divider above the footer', category: 'Appearance' },
  { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", default: "'end'", description: 'Horizontal distribution of footer content', category: 'Layout' },
  { name: 'align', type: "'start' | 'center' | 'end' | 'stretch'", default: "'center'", description: 'Cross-axis alignment', category: 'Layout' },
  { name: 'gap', type: "'none' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Gap between footer items', category: 'Layout' },
  { name: 'padding', type: 'string', default: '—', description: 'Custom padding override', category: 'Layout' },
  { name: 'stackOnMobile', type: 'boolean', default: 'false', description: 'Stack footer content vertically on small screens', category: 'Responsive' }
]

const actionsProps: ApiProp[] = [
  { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", default: "'start'", description: 'Horizontal distribution of actions', category: 'Layout' },
  { name: 'align', type: "'start' | 'center' | 'end' | 'stretch'", default: "'center'", description: 'Cross-axis alignment', category: 'Layout' },
  { name: 'gap', type: "'none' | 'xs' | 'sm' | 'md' | 'lg'", default: "'sm'", description: 'Gap between actions', category: 'Layout' },
  { name: 'direction', type: "'row' | 'column'", default: "'row'", description: 'Layout direction for actions', category: 'Layout' },
  { name: 'padding', type: 'string', default: '—', description: 'Custom padding override', category: 'Layout' },
  { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretch action children to fill available width', category: 'Layout' },
  { name: 'stackOnMobile', type: 'boolean', default: 'false', description: 'Stack actions vertically on small screens', category: 'Responsive' },
  { name: 'reverse', type: 'boolean', default: 'false', description: 'Reverse the visual order of actions', category: 'Layout' }
]

const cardEvents: ApiEvent[] = [
  { name: '@click', description: 'Emitted when card is clicked (if clickable)' }
]

const cardSlots: ApiSlot[] = [
  { name: 'default', description: 'Main card content' }
]

const headerSlots: ApiSlot[] = [
  { name: 'default', description: 'Additional content' },
  { name: 'avatar', description: 'Custom avatar content' },
  { name: 'title', description: 'Custom title content' },
  { name: 'subtitle', description: 'Custom subtitle content' },
  { name: 'actions', description: 'Action buttons on the right' }
]

const mediaSlots: ApiSlot[] = [
  { name: 'default', description: 'Content overlay (centered)' },
  { name: 'overlay', description: 'Bottom overlay content' },
  { name: 'badge', description: 'Badge in top-right corner' },
  { name: 'actions', description: 'Actions at bottom of media' }
]

const contentSlots: ApiSlot[] = [
  { name: 'default', description: 'Main card body content' }
]

const footerSlots: ApiSlot[] = [
  { name: 'default', description: 'Footer actions or summary content' }
]

const actionsSlots: ApiSlot[] = [
  { name: 'default', description: 'Action buttons or links' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- @component SCard -->
    <!-- @props variant, size, rounded, hoverable, pressable, clickable, loading, disabled, spotlight, spotlightColor, tilt, gradientBorder, gradientBg, horizontal, mediaRight, width, maxWidth, height, tag, href, to -->
    <!-- @events @click -->
    <!-- @slots default -->
    <!-- @sections features, basic-usage, variants, interactive-effects, media-cards, horizontal-layout, content-animations, loading-states, real-world-examples, glass-morphism, api-reference -->
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Card</h1>
      <p class="text-lg text-(--s-text-secondary)">
        Versatile container component for displaying content with rich features including media support, 
        interactive effects, and beautiful animations.
      </p>
    </header>

    <!-- Features -->
    <article id="features">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-violet-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-palette-outline text-xl text-violet-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">5 Variants</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Elevated, outlined, filled, ghost, and glass morphism styles.</p>
        </div>
        <div class="p-4 rounded-xl bg-blue-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-gesture-tap text-xl text-blue-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Interactive Effects</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Hover lift, press scale, spotlight glow, and 3D tilt effects.</p>
        </div>
        <div class="p-4 rounded-xl bg-emerald-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-image-multiple text-xl text-emerald-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Rich Media</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Images, videos with zoom, overlays, and lazy loading.</p>
        </div>
        <div class="p-4 rounded-xl bg-pink-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-gradient-horizontal text-xl text-pink-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Gradient Support</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Beautiful gradient borders and background overlays.</p>
        </div>
        <div class="p-4 rounded-xl bg-amber-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-view-module text-xl text-amber-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Flexible Layout</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Vertical and horizontal layouts with composable sub-components.</p>
        </div>
        <div class="p-4 rounded-xl bg-cyan-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-loading text-xl text-cyan-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Loading States</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Shimmer loading overlays and skeleton content placeholders.</p>
        </div>
      </div>
    </article>

    <!-- Basic Usage -->
    <section id="basic-usage">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection 
        title="Complete Card"
        description="A card with header, content, and footer sub-components."
        :code="basicCode"
        language="vue"
        customBackground="bg-transparent"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SCard>
            <SCardHeader
              title="Project Overview"
              subtitle="Updated 2 hours ago"
              :icon="ri('folder-outline')"
            />
            <SCardContent class="mt-4">
              This is the card content area. Cards are surfaces that display content and actions on a single topic, making it easy to scan for relevant information.
            </SCardContent>
            <SCardFooter divider justify="end">
              <SButton variant="ghost" size="small">Cancel</SButton>
              <SButton size="small">Save</SButton>
            </SCardFooter>
          </SCard>

          <SCard>
            <SCardHeader 
              title="Team Member" 
              subtitle="Lead Designer"
              avatar="https://i.pravatar.cc/150?img=5"
            >
              <template #actions>
                <SButton variant="ghost" size="small" icon-only :icon-left="ri('dots-vertical')" />
              </template>
            </SCardHeader>
            <SCardContent class="mt-4">
              Responsible for design systems, UI/UX decisions, and maintaining visual consistency across products.
            </SCardContent>
            <SCardFooter divider justify="between">
              <SChip size="small" color="#8b5cf6">Design</SChip>
              <SButton variant="light" size="small" :icon-left="ri('message-outline')">Message</SButton>
            </SCardFooter>
          </SCard>

          <SCard>
            <SCardHeader 
              title="Statistics" 
              subtitle="This month"
              :icon="ri('chart-line')"
              icon-color="#10b981"
            />
            <SCardContent class="mt-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-2xl font-bold text-(--s-text-primary)">2,847</p>
                  <p class="text-xs text-(--s-text-tertiary)">Total Views</p>
                </div>
                <div>
                  <p class="text-2xl font-bold text-(--s-text-primary)">432</p>
                  <p class="text-xs text-(--s-text-tertiary)">New Users</p>
                </div>
              </div>
            </SCardContent>
            <SCardFooter divider>
              <SButton variant="link" size="small" :icon-right="ri('arrow-right')">View Report</SButton>
            </SCardFooter>
          </SCard>
        </div>
      </DemoSection>
    </section>

    <!-- Variants -->
    <section id="variants">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Variants</h2>
      <DemoSection 
        title="Card Variants"
        description="Choose from five visual styles to match your design needs."
        :code="variantsCode"
        language="vue"
        customBackground="bg-transparent"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <!-- Elevated - Notification Style -->
          <SCard variant="elevated" hoverable>
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <span class="mdi mdi-bell-ring text-blue-500 text-lg" />
              </div>
              <div class="min-w-0">
                <h4 class="font-semibold text-(--s-text-primary) text-sm">Elevated</h4>
                <p class="text-xs text-(--s-text-secondary) mt-0.5">New message received</p>
                <p class="text-xs text-(--s-text-tertiary) mt-1">2 min ago</p>
              </div>
            </div>
          </SCard>
          
          <!-- Outlined - Stats Style -->
          <SCard variant="outlined" hoverable>
            <div class="text-center">
              <span class="mdi mdi-trending-up text-2xl text-emerald-500" />
              <h4 class="font-semibold text-(--s-text-primary) text-sm mt-2">Outlined</h4>
              <p class="text-2xl font-bold text-emerald-500 mt-1">+24%</p>
              <p class="text-xs text-(--s-text-tertiary)">This week</p>
            </div>
          </SCard>
          
          <!-- Filled - Profile Style -->
          <SCard variant="filled" hoverable>
            <div class="flex flex-col items-center text-center">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <span class="text-white font-bold">JD</span>
              </div>
              <h4 class="font-semibold text-(--s-text-primary) text-sm mt-2">Filled</h4>
              <p class="text-xs text-(--s-text-secondary)">John Doe</p>
              <SChip size="small" color="#8b5cf6" class="mt-2">Pro</SChip>
            </div>
          </SCard>
          
          <!-- Ghost - Quick Action Style -->
          <SCard variant="ghost" hoverable pressable clickable class="border border-dashed border-(--s-border-subtle)">
            <div class="flex flex-col items-center justify-center h-full text-center py-2">
              <div class="w-10 h-10 rounded-full border-2 border-dashed border-(--s-text-tertiary) flex items-center justify-center">
                <span class="mdi mdi-plus text-xl text-(--s-text-tertiary)" />
              </div>
              <h4 class="font-semibold text-(--s-text-primary) text-sm mt-2">Ghost</h4>
              <p class="text-xs text-(--s-text-tertiary)">Add new item</p>
            </div>
          </SCard>
          
          <!-- Glass - Weather Widget Style -->
          <div class="relative rounded-xl overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700" />
            <div class="absolute inset-0 opacity-30">
              <div class="absolute top-2 right-2 w-16 h-16 bg-yellow-300 rounded-full blur-xl" />
            </div>
            <SCard variant="glass" class="relative">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-semibold text-white text-sm">Glass</h4>
                  <p class="text-2xl font-bold text-white mt-1">24°C</p>
                  <p class="text-xs text-white/70">Sunny day</p>
                </div>
                <span class="mdi mdi-weather-sunny text-4xl text-yellow-300" />
              </div>
            </SCard>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Interactive Effects -->
    <section id="interactive-effects">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Interactive Effects</h2>
      <DemoSection 
        title="Hover & Click Effects"
        description="Add interactivity with hover animations, press effects, spotlight glow, and 3D tilt."
        :code="interactiveCode"
        language="vue"
        customBackground="bg-transparent"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SCard hoverable>
            <SCardHeader title="Hoverable" :icon="ri('arrow-up')" icon-color="#3b82f6" />
            <SCardContent class="mt-3 text-sm">
              Hover me for a lift effect with enhanced shadow!
            </SCardContent>
          </SCard>
          
          <SCard pressable clickable>
            <SCardHeader title="Pressable" :icon="ri('gesture-tap')" icon-color="#ef4444" />
            <SCardContent class="mt-3 text-sm">
              Click me! I have a satisfying press effect.
            </SCardContent>
          </SCard>
          
          <SCard spotlight spotlight-color="#8b5cf6" variant="outlined">
            <SCardHeader title="Spotlight" :icon="ri('spotlight-beam')" icon-color="#8b5cf6" />
            <SCardContent class="mt-3 text-sm">
              Move your mouse around for a glow effect!
            </SCardContent>
          </SCard>
          
          <SCard tilt hoverable>
            <SCardHeader title="3D Tilt" :icon="ri('rotate-3d-variant')" icon-color="#10b981" />
            <SCardContent class="mt-3 text-sm">
              Perspective-based 3D rotation on hover.
            </SCardContent>
          </SCard>
        </div>
      </DemoSection>
    </section>

    <!-- Media Cards -->
    <section id="media-cards">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Media Cards</h2>
      <DemoSection 
        title="Cards with Images"
        description="Display images with zoom effects, overlays, and badges."
        :code="mediaCode"
        language="vue"
        customBackground="bg-transparent"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SCard hoverable>
            <SCardMedia 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop"
              ratio="16/9"
              zoom
            >
              <template #badge>
                <SBadge color="#ef4444">Featured</SBadge>
              </template>
            </SCardMedia>
            <SCardHeader title="Mountain Sunrise" subtitle="Swiss Alps" class="mt-4" />
            <SCardContent class="text-sm">
              Breathtaking views of the Alps at dawn with golden light.
            </SCardContent>
            <SCardActions class="mt-4" justify="between">
              <SButton 
                variant="ghost" 
                size="small" 
                :icon-left="likedCards.includes(1) ? 'heart' : 'heart-outline'"
                :color="likedCards.includes(1) ? '#ef4444' : undefined"
                @click="toggleLike(1)"
              >
                {{ likedCards.includes(1) ? 'Liked' : 'Like' }}
              </SButton>
              <SButton variant="ghost" size="small" :icon-left="ri('share-variant-outline')">Share</SButton>
            </SCardActions>
          </SCard>

          <SCard hoverable>
            <SCardMedia 
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop"
              ratio="16/9"
              overlay="linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)"
              overlay-mode="always"
            >
              <template #overlay>
                <div class="p-4 text-white w-full">
                  <p class="text-sm opacity-80">Workspace</p>
                  <h3 class="font-bold text-lg">Modern Office</h3>
                </div>
              </template>
            </SCardMedia>
            <SCardContent class="mt-4 text-sm">
              Minimalist workspace design for maximum productivity.
            </SCardContent>
            <SCardActions class="mt-4">
              <SButton size="small">Learn More</SButton>
            </SCardActions>
          </SCard>

          <SCard hoverable>
            <SCardMedia 
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop"
              ratio="16/9"
              overlay="linear-gradient(to top, rgba(139,92,246,0.9), transparent)"
              overlay-mode="hover"
            >
              <template #actions>
                <div class="flex gap-2">
                  <SButton size="small" variant="filled">Preview</SButton>
                  <SButton size="small" variant="ghost" class="text-white!">Details</SButton>
                </div>
              </template>
            </SCardMedia>
            <SCardHeader title="Developer Setup" subtitle="Coding environment" class="mt-4" />
            <SCardContent class="text-sm">
              The perfect development environment for productivity.
            </SCardContent>
          </SCard>
        </div>
      </DemoSection>
    </section>

    <!-- Horizontal Cards -->
    <section id="horizontal-layout">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Horizontal Layout</h2>
      <DemoSection 
        title="Side-by-side Media"
        description="Place media on the left or right side of the card content."
        :code="horizontalCode"
        language="vue"
        customBackground="bg-transparent"
      >
        <div class="space-y-4">
          <SCard horizontal hoverable>
            <SCardMedia 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop"
              position="left"
              class="w-32 h-32 sm:w-40 sm:h-40 shrink-0 rounded-l-lg"
            />
            <div class="flex-1 p-4">
              <SCardHeader title="Wireless Headphones" subtitle="Premium Audio" />
              <SCardContent class="mt-2 text-sm">
                Experience crystal-clear sound with active noise cancellation.
              </SCardContent>
              <SCardFooter class="mt-3" justify="between">
                <span class="text-lg font-bold text-(--s-primary)">$299</span>
                <SButton size="small" :icon-left="ri('cart-outline')">Add to Cart</SButton>
              </SCardFooter>
            </div>
          </SCard>

          <SCard horizontal media-right hoverable>
            <div class="flex-1 p-4">
              <SCardHeader title="Smart Watch Series 5" subtitle="Fitness & Health" />
              <SCardContent class="mt-2 text-sm">
                Track your health metrics with advanced sensors and GPS.
              </SCardContent>
              <SCardFooter class="mt-3" justify="between">
                <span class="text-lg font-bold text-(--s-primary)">$449</span>
                <SButton size="small" :icon-left="ri('cart-outline')">Add to Cart</SButton>
              </SCardFooter>
            </div>
            <SCardMedia 
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop"
              position="right"
              class="w-32 h-32 sm:w-40 sm:h-40 shrink-0 rounded-r-lg"
            />
          </SCard>
        </div>
      </DemoSection>
    </section>

    <!-- Content Animations -->
    <section id="content-animations">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Content Animations</h2>
      <DemoSection 
        title="Animated Card Content"
        description="Bring your cards to life with various content animation styles."
        :code="animationsCode"
        language="vue"
        customBackground="bg-transparent"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Floating Animation -->
          <SCard hoverable>
            <div class="flex items-center justify-between mb-4">
              <SCardHeader title="Floating Icons" class="flex-1" />
              <span class="mdi mdi-rocket-launch text-2xl text-violet-500 animate-float" />
            </div>
            <SCardContent class="text-sm">
              <div class="flex gap-3 justify-center">
                <span class="mdi mdi-star text-xl text-amber-400 animate-float" style="animation-delay: 0.2s" />
                <span class="mdi mdi-heart text-xl text-rose-500 animate-float" style="animation-delay: 0.4s" />
                <span class="mdi mdi-lightning-bolt text-xl text-yellow-500 animate-float" style="animation-delay: 0.6s" />
                <span class="mdi mdi-diamond text-xl text-cyan-400 animate-float" style="animation-delay: 0.8s" />
              </div>
              <p class="text-center mt-3 text-(--s-text-tertiary)">Smooth floating motion</p>
            </SCardContent>
          </SCard>

          <!-- Pulse Animation -->
          <SCard hoverable>
            <SCardHeader title="Pulse Effect" :icon="ri('heart-pulse')" icon-color="#ef4444" />
            <SCardContent class="mt-3">
              <div class="flex items-center justify-center gap-4">
                <div class="relative">
                  <div class="w-16 h-16 rounded-full bg-rose-500/20 animate-ping absolute" />
                  <div class="w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center relative">
                    <span class="mdi mdi-heart text-2xl text-white" />
                  </div>
                </div>
                <div class="text-left">
                  <p class="text-2xl font-bold text-(--s-text-primary) tabular-nums">128 <span class="text-base font-normal">BPM</span></p>
                  <p class="text-xs text-(--s-text-tertiary)">Heart Rate</p>
                </div>
              </div>
            </SCardContent>
          </SCard>

          <!-- Typing Animation -->
          <SCard hoverable>
            <SCardHeader title="Typewriter" :icon="ri('keyboard')" icon-color="#3b82f6" />
            <SCardContent class="mt-3">
              <div class="bg-(--s-bg-secondary) rounded-lg p-3 font-mono text-sm">
                <span class="text-emerald-500">const</span> <span class="text-blue-400">greeting</span> = <span class="animate-typewriter text-amber-400">"Hello World!"</span>
                <span class="animate-blink">|</span>
              </div>
              <p class="text-xs text-(--s-text-tertiary) mt-2 text-center">Character by character reveal</p>
            </SCardContent>
          </SCard>

          <!-- Counter Animation -->
          <SCard hoverable>
            <SCardHeader title="Counting Up" :icon="ri('counter')" icon-color="#10b981" />
            <SCardContent class="mt-3">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p class="text-2xl font-bold text-(--s-primary) tabular-nums animate-countup-1">0</p>
                  <p class="text-xs text-(--s-text-tertiary)">Users</p>
                </div>
                <div>
                  <p class="text-2xl font-bold text-emerald-500 tabular-nums animate-countup-2">0</p>
                  <p class="text-xs text-(--s-text-tertiary)">Sales</p>
                </div>
                <div>
                  <p class="text-2xl font-bold text-violet-500 tabular-nums animate-countup-3">0</p>
                  <p class="text-xs text-(--s-text-tertiary)">Revenue</p>
                </div>
              </div>
              <p class="text-xs text-(--s-text-tertiary) mt-3 text-center">Hover to see animation</p>
            </SCardContent>
          </SCard>

          <!-- Progress Animation -->
          <SCard hoverable>
            <SCardHeader title="Progress Bars" :icon="ri('chart-line-variant')" icon-color="#f59e0b" />
            <SCardContent class="mt-3 space-y-3">
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-(--s-text-secondary)">Design</span>
                  <span class="text-(--s-text-tertiary)">85%</span>
                </div>
                <div class="h-2 bg-(--s-bg-tertiary) rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full animate-progress-85" />
                </div>
              </div>
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-(--s-text-secondary)">Development</span>
                  <span class="text-(--s-text-tertiary)">62%</span>
                </div>
                <div class="h-2 bg-(--s-bg-tertiary) rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full animate-progress-62" />
                </div>
              </div>
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-(--s-text-secondary)">Testing</span>
                  <span class="text-(--s-text-tertiary)">40%</span>
                </div>
                <div class="h-2 bg-(--s-bg-tertiary) rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full animate-progress-40" />
                </div>
              </div>
            </SCardContent>
          </SCard>

          <!-- Staggered List Animation -->
          <SCard hoverable>
            <SCardHeader title="Staggered List" :icon="ri('format-list-bulleted')" icon-color="#8b5cf6" />
            <SCardContent class="mt-3">
              <ul class="space-y-2">
                <li class="flex items-center gap-2 p-2 rounded-lg bg-(--s-bg-secondary) animate-slide-in" style="animation-delay: 0s">
                  <span class="mdi mdi-check-circle text-emerald-500" />
                  <span class="text-sm">First task completed</span>
                </li>
                <li class="flex items-center gap-2 p-2 rounded-lg bg-(--s-bg-secondary) animate-slide-in" style="animation-delay: 0.1s">
                  <span class="mdi mdi-check-circle text-emerald-500" />
                  <span class="text-sm">Second task completed</span>
                </li>
                <li class="flex items-center gap-2 p-2 rounded-lg bg-(--s-bg-secondary) animate-slide-in" style="animation-delay: 0.2s">
                  <span class="mdi mdi-progress-clock text-amber-500" />
                  <span class="text-sm">Third task in progress</span>
                </li>
              </ul>
            </SCardContent>
          </SCard>
        </div>
      </DemoSection>
    </section>

    <!-- Loading States -->
    <section id="loading-states">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Loading States</h2>
      <DemoSection 
        title="Loading & Skeleton"
        description="Show loading overlays or skeleton placeholders while content loads."
        :code="loadingCode"
        language="vue"
        customBackground="bg-transparent"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="space-y-3">
            <SCard :loading="isLoading">
              <SCardHeader title="Loading Overlay" subtitle="Click button below" :icon="ri('loading')" />
              <SCardContent class="mt-3">
                This card shows a shimmer loading overlay when loading is true.
              </SCardContent>
            </SCard>
            <SButton @click="toggleLoading" :disabled="isLoading" block>
              {{ isLoading ? 'Loading...' : 'Toggle Loading' }}
            </SButton>
          </div>

          <SCard>
            <SCardMedia skeleton ratio="16/9" />
            <div class="mt-4 space-y-3">
              <div class="h-5 w-3/4 bg-(--s-bg-tertiary) rounded animate-pulse" />
              <div class="h-4 w-1/2 bg-(--s-bg-tertiary) rounded animate-pulse" />
            </div>
            <SCardContent class="mt-4" :skeleton="true" :skeleton-lines="3" />
          </SCard>

          <SCard>
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-(--s-bg-tertiary) animate-pulse" />
              <div class="flex-1 space-y-2">
                <div class="h-4 w-24 bg-(--s-bg-tertiary) rounded animate-pulse" />
                <div class="h-3 w-16 bg-(--s-bg-tertiary) rounded animate-pulse" />
              </div>
            </div>
            <SCardContent class="mt-4" :skeleton="true" :skeleton-lines="4" />
            <SCardFooter class="mt-4" divider>
              <div class="h-8 w-20 bg-(--s-bg-tertiary) rounded animate-pulse" />
              <div class="h-8 w-20 bg-(--s-bg-tertiary) rounded animate-pulse" />
            </SCardFooter>
          </SCard>
        </div>
      </DemoSection>
    </section>

    <!-- Team Cards Grid -->
    <section id="real-world-examples">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Real-World Examples</h2>
      <DemoSection 
        title="Team Members"
        description="Profile cards with avatars and actions."
        :code="basicCode"
        language="vue"
        customBackground="bg-transparent"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SCard 
            v-for="member in teamMembers" 
            :key="member.name"
            hoverable
            pressable
          >
            <SCardHeader layout="vertical" align="center">
              <template #avatar>
                <div class="w-20 h-20 rounded-full overflow-hidden ring-4 ring-(--s-primary)/20">
                  <img :src="member.avatar" :alt="member.name" class="w-full h-full object-cover" />
                </div>
              </template>
              <template #title>
                <h3 class="text-lg font-semibold mt-3">{{ member.name }}</h3>
              </template>
              <template #subtitle>
                <p class="text-sm text-(--s-text-tertiary)">{{ member.role }}</p>
              </template>
            </SCardHeader>
            <SCardActions class="mt-4" justify="center" gap="md">
              <SButton variant="ghost" size="small" icon-only :icon-left="ri('twitter')" />
              <SButton variant="ghost" size="small" icon-only :icon-left="ri('linkedin')" />
              <SButton variant="ghost" size="small" icon-only :icon-left="ri('github')" />
            </SCardActions>
            <SCardFooter class="mt-4" divider justify="center">
              <SButton variant="light" size="small" :icon-left="ri('email-outline')">Contact</SButton>
            </SCardFooter>
          </SCard>
        </div>
      </DemoSection>

      <DemoSection 
        title="Product Cards"
        description="E-commerce style product cards with ratings and actions."
        :code="basicCode"
        language="vue"
        class="mt-8"
        customBackground="bg-transparent"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SCard 
            v-for="product in products" 
            :key="product.id"
            hoverable
            pressable
            clickable
          >
            <SCardMedia 
              :src="product.image"
              ratio="4/3"
              zoom
            >
              <template #badge>
                <div class="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
                  <span class="mdi mdi-star text-amber-400 text-sm" />
                  <span class="text-white text-xs font-medium">{{ product.rating }}</span>
                </div>
              </template>
            </SCardMedia>
            <SCardContent class="mt-4">
              <h3 class="font-semibold text-(--s-text-primary)">{{ product.name }}</h3>
              <p class="text-xl font-bold text-(--s-primary) mt-1">{{ product.price }}</p>
            </SCardContent>
            <SCardActions class="mt-4" full-width gap="sm">
              <SButton variant="outlined" size="small" icon-only :icon-left="ri('heart-outline')" />
              <SButton size="small" :icon-left="ri('cart-outline')" block>Add to Cart</SButton>
            </SCardActions>
          </SCard>
        </div>
      </DemoSection>
    </section>

    <!-- Glass Card with Background -->
    <section id="glass-morphism">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Glass Morphism</h2>
      <DemoSection 
        title="Glass Cards"
        description="Beautiful glassmorphism effect with backdrop blur - works best on colorful backgrounds."
        :code="variantsCode"
        language="vue"
        customBackground="bg-transparent"
      >
        <div class="relative rounded-2xl overflow-hidden p-8">
          <!-- Animated gradient background -->
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 animate-gradient-shift" />
          <div class="absolute inset-0">
            <div class="absolute top-5 left-[10%] w-40 h-40 bg-cyan-400/40 rounded-full blur-3xl animate-float" />
            <div class="absolute bottom-5 right-[15%] w-48 h-48 bg-pink-400/40 rounded-full blur-3xl animate-float" style="animation-delay: 1s" />
            <div class="absolute top-[40%] right-[30%] w-32 h-32 bg-yellow-400/30 rounded-full blur-3xl animate-float" style="animation-delay: 0.5s" />
          </div>
          
          <div class="relative grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Music Player Card -->
            <SCard variant="glass" hoverable class="text-white">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-3xl">
                  🎵
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-semibold truncate">Midnight City</h4>
                  <p class="text-sm text-white/70 truncate">M83 • Hurry Up, We're Dreaming</p>
                </div>
              </div>
              <div class="mt-4">
                <div class="h-1 bg-white/20 rounded-full overflow-hidden">
                  <div class="h-full w-[65%] bg-white rounded-full" />
                </div>
                <div class="flex justify-between text-xs text-white/60 mt-1">
                  <span>2:45</span>
                  <span>4:03</span>
                </div>
              </div>
              <div class="flex items-center justify-center gap-6 mt-4">
                <SButton variant="ghost" iconOnly :iconLeft="ri('skip-previous')" class="text-white/70 hover:text-white" />
                <SButton variant="ghost" iconOnly :iconLeft="ri('play')" class="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white" />
                <SButton variant="ghost" iconOnly :iconLeft="ri('skip-next')" class="text-white/70 hover:text-white" />
              </div>
            </SCard>

            <!-- Crypto Widget Card -->
            <SCard variant="glass" hoverable spotlight spotlight-color="rgba(255,255,255,0.3)" class="text-white">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">₿</span>
                  <span class="font-semibold">Bitcoin</span>
                </div>
                <SChip size="small" color="#22c55e">+5.2%</SChip>
              </div>
              <p class="text-3xl font-bold">$67,432<span class="text-lg font-normal text-white/60">.18</span></p>
              <div class="mt-4 flex items-end justify-between h-16">
                <div class="w-[8%] bg-white/30 rounded-t" style="height: 40%" />
                <div class="w-[8%] bg-white/30 rounded-t" style="height: 60%" />
                <div class="w-[8%] bg-white/30 rounded-t" style="height: 45%" />
                <div class="w-[8%] bg-white/30 rounded-t" style="height: 75%" />
                <div class="w-[8%] bg-white/30 rounded-t" style="height: 55%" />
                <div class="w-[8%] bg-white/30 rounded-t" style="height: 85%" />
                <div class="w-[8%] bg-white/40 rounded-t" style="height: 100%" />
              </div>
              <p class="text-xs text-white/60 text-center mt-2">Last 7 days</p>
            </SCard>

            <!-- Quick Login Card -->
            <SCard variant="glass" hoverable class="text-white">
              <SCardHeader 
                title="Welcome back" 
                subtitle="Sign in to continue"
                class="text-center"
              />
              <div class="mt-5 space-y-3">
                <div class="relative">
                  <span class="mdi mdi-email-outline absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                  <input 
                    type="email" 
                    placeholder="Email address"
                    class="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                  />
                </div>
                <div class="relative">
                  <span class="mdi mdi-lock-outline absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                  <input 
                    type="password" 
                    placeholder="Password"
                    class="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                  />
                </div>
                <SButton block class="mt-4!">Sign In</SButton>
              </div>
              <p class="text-center text-xs text-white/60 mt-4">
                Don't have an account? <a href="#" class="text-white underline">Sign up</a>
              </p>
            </SCard>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      
      <div class="space-y-8">
        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-card-outline text-(--s-primary)" />
            SCard
          </h3>
          <SApiTable title="Props" type="props" :props="cardProps" />
          <SApiTable title="Events" type="events" :events="cardEvents" class="mt-6" />
          <SApiTable title="Slots" type="slots" :slots="cardSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-page-layout-header text-(--s-primary)" />
            SCardHeader
          </h3>
          <SApiTable title="Props" type="props" :props="headerProps" />
          <SApiTable title="Slots" type="slots" :slots="headerSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-text-box-outline text-(--s-primary)" />
            SCardContent
          </h3>
          <SApiTable title="Props" type="props" :props="contentProps" />
          <SApiTable title="Slots" type="slots" :slots="contentSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-dock-bottom text-(--s-primary)" />
            SCardFooter
          </h3>
          <SApiTable title="Props" type="props" :props="footerProps" />
          <SApiTable title="Slots" type="slots" :slots="footerSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-image text-(--s-primary)" />
            SCardMedia
          </h3>
          <SApiTable title="Props" type="props" :props="mediaProps" />
          <SApiTable title="Slots" type="slots" :slots="mediaSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-button-cursor text-(--s-primary)" />
            SCardActions
          </h3>
          <SApiTable title="Props" type="props" :props="actionsProps" />
          <SApiTable title="Slots" type="slots" :slots="actionsSlots" class="mt-6" />
        </div>
      </div>
    </SApiSection>
  </div>
</template>

<style scoped>
@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient-shift {
  background-size: 200% 200%;
  animation: gradient-shift 8s ease infinite;
}

/* Floating animation */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.animate-float {
  animation: float 2s ease-in-out infinite;
}

/* Blink animation (cursor) */
@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

.animate-blink {
  animation: blink 1s step-end infinite;
}

/* Typewriter animation */
@keyframes typewriter {
  0% {
    width: 0;
    opacity: 0;
  }
  1% {
    opacity: 1;
  }
  100% {
    width: 100%;
    opacity: 1;
  }
}

.animate-typewriter {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  animation: typewriter 2s steps(14, end) forwards;
}

/* Progress bar animations */
@keyframes progress-fill-85 {
  from {
    width: 0;
  }
  to {
    width: 85%;
  }
}

@keyframes progress-fill-62 {
  from {
    width: 0;
  }
  to {
    width: 62%;
  }
}

@keyframes progress-fill-40 {
  from {
    width: 0;
  }
  to {
    width: 40%;
  }
}

.animate-progress-85 {
  animation: progress-fill-85 1.5s ease-out forwards;
}

.animate-progress-62 {
  animation: progress-fill-62 1.5s ease-out 0.2s forwards;
  width: 0;
}

.animate-progress-40 {
  animation: progress-fill-40 1.5s ease-out 0.4s forwards;
  width: 0;
}

/* Slide in animation */
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slide-in 0.4s ease-out forwards;
  animation-fill-mode: both;
}
</style>
