<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '../../components/DemoSection.vue'
import {
  SDrawer,
  SDrawerHeader,
  SDrawerContent,
  SDrawerFooter,
  SDrawerTitle,
  SDrawerDescription,
  SDrawerClose,
  SDrawerHandle,
  SButton,
  SInput,
  SSwitch,
  SSelect,
  SOption,
  SApiSection,
  SApiTable,
  SApiKeyboard,
  SBadge,
  SAvatar,
  SAvatarImage,
  SAvatarFallback
} from '../../index'
import type { ApiProp, ApiEvent, ApiSlot, KeyboardShortcut } from '../../index'
import type { DrawerSide, DrawerSize, DrawerVariant } from '../../components/ui/drawer'

// Demo states
const basicDrawer = ref(false)
const sideDrawer = ref(false)
const sizeDrawer = ref(false)
const variantDrawer = ref(false)
const mobileDrawer = ref(false)
const formDrawer = ref(false)
const menuDrawer = ref(false)
const settingsDrawer = ref(false)
const cartDrawer = ref(false)
const filterDrawer = ref(false)
const notificationDrawer = ref(false)
const composableDrawer = ref(false)

// Demo options
const selectedSide = ref<DrawerSide>('bottom')
const selectedSize = ref<DrawerSize>('md')
const selectedVariant = ref<DrawerVariant>('default')

// Form data
const formData = ref({
  name: '',
  email: '',
  notify: true
})

// Settings data
const settings = ref({
  darkMode: false,
  notifications: true,
  sounds: false,
  autoSave: true
})

// Cart items
const cartItems = ref([
  { id: 1, name: 'Wireless Headphones', price: 199.99, qty: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop' },
  { id: 2, name: 'Smart Watch', price: 299.99, qty: 2, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop' },
  { id: 3, name: 'Laptop Stand', price: 79.99, qty: 1, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop' }
])

const cartTotal = ref(() => cartItems.value.reduce((sum, item) => sum + item.price * item.qty, 0))

// Filter options
const filters = ref({
  priceRange: [0, 500],
  categories: ['Electronics', 'Accessories'],
  inStock: true,
  onSale: false
})

// Notifications
const notifications = ref([
  { id: 1, type: 'success', title: 'Order Shipped', message: 'Your order #12345 has been shipped', time: '2 min ago', read: false },
  { id: 2, type: 'info', title: 'New Feature', message: 'Check out our new dark mode!', time: '1 hour ago', read: false },
  { id: 3, type: 'warning', title: 'Low Stock', message: 'Item in your cart is running low', time: '3 hours ago', read: true }
])

// Menu items
const menuItems = [
  { icon: 'home', label: 'Home', badge: null },
  { icon: 'account', label: 'Profile', badge: null },
  { icon: 'bell', label: 'Notifications', badge: '3' },
  { icon: 'cart', label: 'Cart', badge: '2' },
  { icon: 'heart', label: 'Wishlist', badge: null },
  { icon: 'cog', label: 'Settings', badge: null },
  { icon: 'help-circle', label: 'Help', badge: null }
]

// Code snippets
const basicCode = `<SButton @click="showDrawer = true">Open Drawer</SButton>

<SDrawer
  v-model="showDrawer"
  title="Welcome to SDrawer"
  description="Swipe down or tap outside to close"
>
  <SDrawerContent>
    <p>Your content here...</p>
  </SDrawerContent>
  <SDrawerFooter>
    <SButton variant="secondary" @click="showDrawer = false">Cancel</SButton>
    <SButton @click="showDrawer = false">Confirm</SButton>
  </SDrawerFooter>
</SDrawer>`

const sidesCode = `<!-- Bottom (default) -->
<SDrawer v-model="showDrawer" side="bottom">...</SDrawer>

<!-- Top -->
<SDrawer v-model="showDrawer" side="top">...</SDrawer>

<!-- Left -->
<SDrawer v-model="showDrawer" side="left">...</SDrawer>

<!-- Right -->
<SDrawer v-model="showDrawer" side="right">...</SDrawer>`

const sizesCode = `<SDrawer v-model="showDrawer" size="xs">...</SDrawer>
<SDrawer v-model="showDrawer" size="sm">...</SDrawer>
<SDrawer v-model="showDrawer" size="md">...</SDrawer>
<SDrawer v-model="showDrawer" size="lg">...</SDrawer>
<SDrawer v-model="showDrawer" size="xl">...</SDrawer>
<SDrawer v-model="showDrawer" size="full">...</SDrawer>`

const variantsCode = `<!-- Default -->
<SDrawer v-model="showDrawer" variant="default">...</SDrawer>

<!-- Glass -->
<SDrawer v-model="showDrawer" variant="glass" backdrop-blur>...</SDrawer>

<!-- Bordered -->
<SDrawer v-model="showDrawer" variant="bordered">...</SDrawer>

<!-- Elevated -->
<SDrawer v-model="showDrawer" variant="elevated">...</SDrawer>

<!-- Minimal -->
<SDrawer v-model="showDrawer" variant="minimal">...</SDrawer>`

const mobileCode = `<SDrawer
  v-model="showDrawer"
  side="bottom"
  :swipeable="true"
  :show-handle="true"
  modal
  title="Mobile Drawer"
>
  <SDrawerContent>
    <p>Swipe down to close, or tap the backdrop.</p>
  </SDrawerContent>
</SDrawer>`

const cartCode = `<SDrawer
  v-model="cartDrawer"
  side="right"
  size="md"
  title="Shopping Cart"
>
  <SDrawerContent>
    <div v-for="item in cartItems" :key="item.id" class="flex gap-4 py-4">
      <img :src="item.image" class="w-16 h-16 rounded-lg object-cover" />
      <div class="flex-1">
        <h4>{{ item.name }}</h4>
        <p>{{ item.price }}</p>
      </div>
    </div>
  </SDrawerContent>
  <SDrawerFooter>
    <SButton block>Checkout</SButton>
  </SDrawerFooter>
</SDrawer>`

const composableCode = `<SDrawer v-model="showDrawer" hide-header>
  <!-- Custom header with composable components -->
  <div class="flex items-center justify-between p-6 border-b border-(--s-border)">
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
        <span class="mdi mdi-palette text-2xl text-white" />
      </div>
      <div>
        <SDrawerTitle>Custom Header</SDrawerTitle>
        <SDrawerDescription class="mt-1">
          Built with composable components
        </SDrawerDescription>
      </div>
    </div>
    <SDrawerClose />
  </div>
  
  <SDrawerContent>
    <p>Use individual components for maximum flexibility.</p>
  </SDrawerContent>
</SDrawer>`

// API Documentation
const drawerProps: ApiProp[] = [
  { name: 'modelValue', type: 'boolean', default: 'false', description: 'Control drawer visibility with v-model', category: 'State' },
  { name: 'side', type: "'left' | 'right' | 'top' | 'bottom'", default: "'bottom'", description: 'Which side the drawer slides from', category: 'Position' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'", default: "'md'", description: 'Drawer size', category: 'Appearance' },
  { name: 'variant', type: "'default' | 'glass' | 'bordered' | 'elevated' | 'minimal'", default: "'default'", description: 'Visual style variant', category: 'Appearance' },
  { name: 'title', type: 'string', default: 'undefined', description: 'Drawer title (creates default header)', category: 'Content' },
  { name: 'description', type: 'string', default: 'undefined', description: 'Drawer description text', category: 'Content' },
  { name: 'closable', type: 'boolean', default: 'true', description: 'Show close button', category: 'Behavior' },
  { name: 'closeOnBackdrop', type: 'boolean', default: 'true', description: 'Close when clicking backdrop', category: 'Behavior' },
  { name: 'closeOnEscape', type: 'boolean', default: 'true', description: 'Close on Escape key press', category: 'Behavior' },
  { name: 'lockScroll', type: 'boolean', default: 'true', description: 'Lock body scroll when open', category: 'Behavior' },
  { name: 'trapFocus', type: 'boolean', default: 'true', description: 'Trap focus within drawer', category: 'Accessibility' },
  { name: 'swipeable', type: 'boolean', default: 'true', description: 'Enable swipe/drag to close', category: 'Gestures' },
  { name: 'swipeThreshold', type: 'number', default: '0.3', description: 'Swipe threshold to close (0-1)', category: 'Gestures' },
  { name: 'showHandle', type: 'boolean', default: 'true', description: 'Show drag handle indicator', category: 'Appearance' },
  { name: 'modal', type: 'boolean', default: 'false', description: 'Enable modal mode (rounded corners, handle)', category: 'Appearance' },
  { name: 'rounded', type: 'boolean', default: 'true', description: 'Apply rounded corners', category: 'Appearance' },
  { name: 'backdrop', type: 'boolean', default: 'true', description: 'Show backdrop overlay', category: 'Appearance' },
  { name: 'backdropBlur', type: 'boolean', default: 'false', description: 'Enable backdrop blur effect', category: 'Appearance' },
  { name: 'duration', type: 'number', default: '300', description: 'Animation duration in ms', category: 'Animation' },
  { name: 'overlayOpacity', type: 'number', default: '0.5', description: 'Backdrop opacity (0-1)', category: 'Appearance' },
  { name: 'hideHeader', type: 'boolean', default: 'false', description: 'Hide default header', category: 'Content' },
  { name: 'teleport', type: 'boolean | string', default: 'true', description: 'Teleport target', category: 'Advanced' },
  { name: 'zIndex', type: 'number', default: '1000', description: 'Z-index value', category: 'Advanced' }
]

const drawerEvents: ApiEvent[] = [
  { name: 'update:modelValue', payload: 'boolean', description: 'Emitted when visibility changes' },
  { name: 'open', payload: 'void', description: 'Emitted when drawer opens' },
  { name: 'close', payload: 'void', description: 'Emitted when drawer closes' },
  { name: 'opened', payload: 'void', description: 'Emitted after open animation completes' },
  { name: 'closed', payload: 'void', description: 'Emitted after close animation completes' },
  { name: 'drag-start', payload: 'void', description: 'Emitted when drag/swipe starts' },
  { name: 'drag-end', payload: 'number', description: 'Emitted when drag/swipe ends with progress value' },
  { name: 'snap', payload: '[index: number, value: number]', description: 'Emitted when drawer snaps to a point' }
]

const drawerSlots: ApiSlot[] = [
  { name: 'default', description: 'Main drawer content' },
  { name: 'header', description: 'Custom header content (replaces default header)' },
  { name: 'footer', description: 'Footer content' }
]

const headerProps: ApiProp[] = [
  { name: 'title', type: 'string', default: 'undefined', description: 'Header title' },
  { name: 'description', type: 'string', default: 'undefined', description: 'Description text' },
  { name: 'closable', type: 'boolean', default: 'true', description: 'Show close button' },
  { name: 'divider', type: 'boolean', default: 'true', description: 'Show bottom divider' },
  { name: 'padding', type: "'none' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Padding size' },
  { name: 'sticky', type: 'boolean', default: 'false', description: 'Sticky header' },
  { name: 'headerClass', type: 'string', default: "''", description: 'Additional CSS class for the header container' }
]

const headerSlots: ApiSlot[] = [
  { name: 'title', description: 'Custom title content rendered before the description' },
  { name: 'description', description: 'Custom description content under the title' },
  { name: 'extra', description: 'Additional content shown before the close button' }
]

const contentProps: ApiProp[] = [
  { name: 'padding', type: "'none' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Padding size' },
  { name: 'centered', type: 'boolean', default: 'false', description: 'Center content' },
  { name: 'scrollable', type: 'boolean', default: 'true', description: 'Enable scrolling' },
  { name: 'maxHeight', type: 'string', default: 'undefined', description: 'Max height for scroll' },
  { name: 'contentClass', type: 'string', default: "''", description: 'Additional CSS class for the content container' }
]

const contentSlots: ApiSlot[] = [
  { name: 'default', description: 'Main drawer body content' }
]

const footerProps: ApiProp[] = [
  { name: 'align', type: "'left' | 'center' | 'right' | 'between' | 'stretch'", default: "'right'", description: 'Button alignment' },
  { name: 'divider', type: 'boolean', default: 'true', description: 'Show top divider' },
  { name: 'padding', type: "'none' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Padding size' },
  { name: 'gap', type: "'none' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Gap between items' },
  { name: 'stackOnMobile', type: 'boolean', default: 'false', description: 'Stack buttons on mobile' },
  { name: 'sticky', type: 'boolean', default: 'false', description: 'Sticky footer' },
  { name: 'footerClass', type: 'string', default: "''", description: 'Additional CSS class for the footer container' }
]

const footerSlots: ApiSlot[] = [
  { name: 'default', description: 'Footer actions or summary content' }
]

const titleProps: ApiProp[] = [
  { name: 'as', type: "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'", default: "'h2'", description: 'HTML tag to use' },
  { name: 'titleClass', type: 'string', default: "''", description: 'Additional CSS class' }
]

const titleSlots: ApiSlot[] = [
  { name: 'default', description: 'Drawer title content' }
]

const descriptionProps: ApiProp[] = [
  { name: 'as', type: "'p' | 'span' | 'div'", default: "'p'", description: 'HTML tag to use' },
  { name: 'descriptionClass', type: 'string', default: "''", description: 'Additional CSS class' }
]

const descriptionSlots: ApiSlot[] = [
  { name: 'default', description: 'Drawer description content' }
]

const closeProps: ApiProp[] = [
  { name: 'closeClass', type: 'string', default: "''", description: 'Additional CSS class' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the close button' },
  { name: 'variant', type: "'default' | 'ghost' | 'subtle'", default: "'default'", description: 'Close button visual style' },
  { name: 'icon', type: 'string', default: "'close'", description: 'MDI icon name without the mdi- prefix' }
]

const triggerProps: ApiProp[] = [
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the trigger' },
  { name: 'asChild', type: 'boolean', default: 'false', description: 'Render the first child as the interactive trigger' }
]

const triggerEvents: ApiEvent[] = [
  { name: 'click', payload: 'MouseEvent', description: 'Emitted when the trigger is activated' }
]

const triggerSlots: ApiSlot[] = [
  { name: 'default', description: 'Trigger content used to open the drawer' }
]

const handleProps: ApiProp[] = [
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Handle size' },
  { name: 'handleClass', type: 'string', default: "''", description: 'Additional CSS class for the handle' },
  { name: 'showProgress', type: 'boolean', default: 'false', description: 'Show drag progress while swiping' }
]

const keyboardShortcuts: KeyboardShortcut[] = [
  { keys: 'Escape', action: 'Close drawer (if closeOnEscape is true)' },
  { keys: 'Tab', action: 'Navigate to next focusable element' },
  { keys: 'Shift + Tab', action: 'Navigate to previous focusable element' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Drawer</h1>
      <p class="text-lg text-(--s-text-secondary)">A slide-in panel component with swipe gestures, perfect for mobile navigation, forms, and side panels.</p>
    </header>

    <!-- Features -->
    <article>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-gesture-swipe text-xl text-emerald-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Swipe Gestures</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Native swipe-to-close with smooth spring animations.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-arrow-all text-xl text-blue-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Four Directions</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Slide from left, right, top, or bottom of the screen.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-cellphone text-xl text-purple-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Mobile Optimized</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Touch-friendly with drag handle and snap points.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-resize text-xl text-amber-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Six Sizes</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">From compact overlays to fullscreen takeovers.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-blur text-xl text-cyan-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Glass Variant</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Beautiful frosted glass effect with backdrop blur.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-keyboard text-xl text-red-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Accessible</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Full keyboard navigation and ARIA support.</p>
        </div>
      </div>
    </article>

    <!-- Basic Usage -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection
        title="Basic Drawer"
        description="A simple bottom drawer with title and description. Swipe down or tap outside to close."
        :code="basicCode"
        language="vue"
      >
        <div class="flex gap-3">
          <SButton @click="basicDrawer = true">
            <span class="mdi mdi-dock-bottom mr-2" />
            Open Drawer
          </SButton>
        </div>

        <SDrawer
          v-model="basicDrawer"
          title="Welcome to SDrawer"
          description="This is a modern drawer component with swipe gestures and smooth animations."
        >
          <SDrawerContent>
            <p class="text-(--s-text-secondary)">
              This drawer demonstrates basic usage with built-in header. You can close it by:
            </p>
            <ul class="mt-4 space-y-2 text-(--s-text-secondary)">
              <li class="flex items-center gap-2">
                <span class="mdi mdi-gesture-swipe-down text-(--s-primary)" />
                Swiping down on the handle
              </li>
              <li class="flex items-center gap-2">
                <span class="mdi mdi-keyboard text-(--s-primary)" />
                Pressing the <kbd class="px-2 py-0.5 text-xs bg-(--s-bg-tertiary) rounded border border-(--s-border)">Esc</kbd> key
              </li>
              <li class="flex items-center gap-2">
                <span class="mdi mdi-close-circle-outline text-(--s-primary)" />
                Clicking the close button
              </li>
              <li class="flex items-center gap-2">
                <span class="mdi mdi-cursor-default-click-outline text-(--s-primary)" />
                Tapping the backdrop
              </li>
            </ul>
          </SDrawerContent>
          <SDrawerFooter>
            <SButton variant="secondary" @click="basicDrawer = false">Cancel</SButton>
            <SButton @click="basicDrawer = false">Got it!</SButton>
          </SDrawerFooter>
        </SDrawer>
      </DemoSection>
    </section>

    <!-- Sides -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Drawer Sides</h2>
      <DemoSection
        title="Position Options"
        description="The drawer can slide in from any edge of the screen."
        :code="sidesCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-3">
          <SButton variant="secondary" @click="selectedSide = 'bottom'; sideDrawer = true">
            <span class="mdi mdi-dock-bottom mr-2" />
            Bottom
          </SButton>
          <SButton variant="secondary" @click="selectedSide = 'top'; sideDrawer = true">
            <span class="mdi mdi-dock-top mr-2" />
            Top
          </SButton>
          <SButton variant="secondary" @click="selectedSide = 'left'; sideDrawer = true">
            <span class="mdi mdi-dock-left mr-2" />
            Left
          </SButton>
          <SButton variant="secondary" @click="selectedSide = 'right'; sideDrawer = true">
            <span class="mdi mdi-dock-right mr-2" />
            Right
          </SButton>
        </div>

        <SDrawer
          v-model="sideDrawer"
          :side="selectedSide"
          :title="`${selectedSide.charAt(0).toUpperCase() + selectedSide.slice(1)} Drawer`"
          :description="`This drawer slides in from the ${selectedSide}`"
        >
          <SDrawerContent>
            <div class="flex flex-col items-center justify-center py-8">
              <span class="mdi mdi-arrow-all text-6xl text-(--s-primary) mb-4" />
              <p class="text-(--s-text-secondary)">
                Sliding from: <strong class="text-(--s-primary)">{{ selectedSide }}</strong>
              </p>
            </div>
          </SDrawerContent>
          <SDrawerFooter>
            <SButton @click="sideDrawer = false">Close</SButton>
          </SDrawerFooter>
        </SDrawer>
      </DemoSection>
    </section>

    <!-- Sizes -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Sizes</h2>
      <DemoSection
        title="Drawer Sizes"
        description="Choose from various sizes to fit your content."
        :code="sizesCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-3">
          <SSelect v-model="selectedSize" placeholder="Select size">
            <SOption value="xs">Extra Small</SOption>
            <SOption value="sm">Small</SOption>
            <SOption value="md">Medium</SOption>
            <SOption value="lg">Large</SOption>
            <SOption value="xl">Extra Large</SOption>
            <SOption value="full">Full</SOption>
          </SSelect>
          <SButton @click="sizeDrawer = true">
            Open {{ selectedSize.toUpperCase() }} Drawer
          </SButton>
        </div>

        <SDrawer
          v-model="sizeDrawer"
          :size="selectedSize"
          :title="`${selectedSize.toUpperCase()} Size Drawer`"
          description="Different sizes for different use cases"
        >
          <SDrawerContent>
            <p class="text-(--s-text-secondary)">
              This drawer is using the <strong class="text-(--s-primary)">{{ selectedSize }}</strong> size variant.
            </p>
            <div class="mt-4 p-4 rounded-lg bg-(--s-bg-tertiary) border border-(--s-border)">
              <code class="text-sm text-(--s-text-secondary)">
                &lt;SDrawer size="{{ selectedSize }}" /&gt;
              </code>
            </div>
          </SDrawerContent>
          <SDrawerFooter>
            <SButton @click="sizeDrawer = false">Close</SButton>
          </SDrawerFooter>
        </SDrawer>
      </DemoSection>
    </section>

    <!-- Variants -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Variants</h2>
      <DemoSection
        title="Visual Variants"
        description="Different visual styles for various contexts."
        :code="variantsCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-3">
          <SButton variant="secondary" @click="selectedVariant = 'default'; variantDrawer = true">Default</SButton>
          <SButton variant="secondary" @click="selectedVariant = 'glass'; variantDrawer = true">Glass</SButton>
          <SButton variant="secondary" @click="selectedVariant = 'bordered'; variantDrawer = true">Bordered</SButton>
          <SButton variant="secondary" @click="selectedVariant = 'elevated'; variantDrawer = true">Elevated</SButton>
          <SButton variant="secondary" @click="selectedVariant = 'minimal'; variantDrawer = true">Minimal</SButton>
        </div>

        <SDrawer
          v-model="variantDrawer"
          :variant="selectedVariant"
          :backdrop-blur="selectedVariant === 'glass'"
          title="Variant Demo"
          :description="`Using the '${selectedVariant}' variant`"
        >
          <SDrawerContent>
            <p class="text-(--s-text-secondary)">
              The <strong class="text-(--s-primary)">{{ selectedVariant }}</strong> variant provides a distinct visual style.
            </p>
          </SDrawerContent>
          <SDrawerFooter>
            <SButton @click="variantDrawer = false">Close</SButton>
          </SDrawerFooter>
        </SDrawer>
      </DemoSection>
    </section>

    <!-- Mobile Modal Style -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Mobile Modal Style</h2>
      <DemoSection
        title="Mobile-Optimized Drawer"
        description="A drawer styled like native mobile modals with swipe gestures."
        :code="mobileCode"
        language="vue"
      >
        <SButton @click="mobileDrawer = true">
          <span class="mdi mdi-cellphone mr-2" />
          Open Mobile Drawer
        </SButton>

        <SDrawer
          v-model="mobileDrawer"
          side="bottom"
          size="md"
          modal
          title="Share this content"
          description="Choose how you'd like to share"
        >
          <SDrawerContent padding="none">
            <div class="grid grid-cols-4 gap-4 p-6">
              <button class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-(--s-bg-secondary) transition-colors">
                <div class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <span class="mdi mdi-twitter text-xl" />
                </div>
                <span class="text-xs text-(--s-text-secondary)">Twitter</span>
              </button>
              <button class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-(--s-bg-secondary) transition-colors">
                <div class="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <span class="mdi mdi-facebook text-xl" />
                </div>
                <span class="text-xs text-(--s-text-secondary)">Facebook</span>
              </button>
              <button class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-(--s-bg-secondary) transition-colors">
                <div class="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <span class="mdi mdi-whatsapp text-xl" />
                </div>
                <span class="text-xs text-(--s-text-secondary)">WhatsApp</span>
              </button>
              <button class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-(--s-bg-secondary) transition-colors">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  <span class="mdi mdi-instagram text-xl" />
                </div>
                <span class="text-xs text-(--s-text-secondary)">Instagram</span>
              </button>
              <button class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-(--s-bg-secondary) transition-colors">
                <div class="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center text-white">
                  <span class="mdi mdi-telegram text-xl" />
                </div>
                <span class="text-xs text-(--s-text-secondary)">Telegram</span>
              </button>
              <button class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-(--s-bg-secondary) transition-colors">
                <div class="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white">
                  <span class="mdi mdi-email text-xl" />
                </div>
                <span class="text-xs text-(--s-text-secondary)">Email</span>
              </button>
              <button class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-(--s-bg-secondary) transition-colors">
                <div class="w-12 h-12 rounded-full bg-(--s-bg-tertiary) flex items-center justify-center text-(--s-text-primary)">
                  <span class="mdi mdi-link-variant text-xl" />
                </div>
                <span class="text-xs text-(--s-text-secondary)">Copy Link</span>
              </button>
              <button class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-(--s-bg-secondary) transition-colors">
                <div class="w-12 h-12 rounded-full bg-(--s-bg-tertiary) flex items-center justify-center text-(--s-text-primary)">
                  <span class="mdi mdi-dots-horizontal text-xl" />
                </div>
                <span class="text-xs text-(--s-text-secondary)">More</span>
              </button>
            </div>
          </SDrawerContent>
        </SDrawer>
      </DemoSection>
    </section>

    <!-- Navigation Menu -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Navigation Menu</h2>
      <DemoSection
        title="Side Menu Drawer"
        description="A common pattern for mobile navigation menus."
        :code="cartCode"
        language="vue"
      >
        <SButton @click="menuDrawer = true">
          <span class="mdi mdi-menu mr-2" />
          Open Menu
        </SButton>

        <SDrawer
          v-model="menuDrawer"
          side="left"
          size="sm"
          :show-handle="false"
          hide-header
        >
          <div class="p-6 border-b border-(--s-border)">
            <div class="flex items-center gap-4">
              <SAvatar size="lg">
                <SAvatarImage src="https://i.pravatar.cc/150?img=68" alt="User" />
                <SAvatarFallback>JD</SAvatarFallback>
              </SAvatar>
              <div>
                <h3 class="font-semibold text-(--s-text-primary)">John Doe</h3>
                <p class="text-sm text-(--s-text-tertiary)">john@example.com</p>
              </div>
            </div>
          </div>
          
          <SDrawerContent padding="sm">
            <nav class="space-y-1">
              <button
                v-for="item in menuItems"
                :key="item.label"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-(--s-text-secondary) hover:text-(--s-text-primary) hover:bg-(--s-bg-secondary) transition-colors"
                @click="menuDrawer = false"
              >
                <span :class="`mdi mdi-${item.icon} text-xl`" />
                <span class="flex-1 text-left">{{ item.label }}</span>
                <SBadge v-if="item.badge" size="sm" color="red">{{ item.badge }}</SBadge>
              </button>
            </nav>
          </SDrawerContent>
          
          <SDrawerFooter divider>
            <SButton variant="ghost" color="red" class="w-full justify-start" @click="menuDrawer = false">
              <span class="mdi mdi-logout mr-2" />
              Sign Out
            </SButton>
          </SDrawerFooter>
        </SDrawer>
      </DemoSection>
    </section>

    <!-- Shopping Cart -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Shopping Cart</h2>
      <DemoSection
        title="Cart Drawer"
        description="E-commerce cart sidebar pattern."
        :code="cartCode"
        language="vue"
      >
        <SButton @click="cartDrawer = true">
          <span class="mdi mdi-cart mr-2" />
          View Cart
          <SBadge size="sm" class="ml-2">{{ cartItems.length }}</SBadge>
        </SButton>

        <SDrawer
          v-model="cartDrawer"
          side="right"
          size="md"
          title="Shopping Cart"
          :description="`${cartItems.length} items in your cart`"
        >
          <SDrawerContent padding="none">
            <div class="divide-y divide-(--s-border)">
              <div
                v-for="item in cartItems"
                :key="item.id"
                class="flex gap-4 p-6 hover:bg-(--s-bg-secondary)/50 transition-colors"
              >
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="w-20 h-20 rounded-xl object-cover"
                />
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-(--s-text-primary) truncate">{{ item.name }}</h4>
                  <p class="text-sm text-(--s-text-tertiary) mt-1">Qty: {{ item.qty }}</p>
                  <p class="font-semibold text-(--s-primary) mt-2">${{ (item.price * item.qty).toFixed(2) }}</p>
                </div>
                <button class="shrink-0 w-8 h-8 rounded-lg text-(--s-text-tertiary) hover:text-red-500 hover:bg-red-500/10 transition-colors">
                  <span class="mdi mdi-delete-outline text-lg" />
                </button>
              </div>
            </div>
          </SDrawerContent>
          
          <SDrawerFooter align="stretch" divider class="flex-col gap-4">
            <div class="flex items-center justify-between py-2">
              <span class="text-(--s-text-secondary)">Subtotal</span>
              <span class="text-xl font-bold text-(--s-text-primary)">${{ cartTotal().toFixed(2) }}</span>
            </div>
            <SButton size="large" class="w-full">
              <span class="mdi mdi-lock mr-2" />
              Checkout
            </SButton>
            <SButton variant="secondary" class="w-full" @click="cartDrawer = false">
              Continue Shopping
            </SButton>
          </SDrawerFooter>
        </SDrawer>
      </DemoSection>
    </section>

    <!-- Form Drawer -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Form Drawer</h2>
      <DemoSection
        title="Drawer with Form"
        description="Side panel for forms and data entry."
        :code="cartCode"
        language="vue"
      >
        <SButton @click="formDrawer = true">
          <span class="mdi mdi-account-plus mr-2" />
          Add Contact
        </SButton>

        <SDrawer
          v-model="formDrawer"
          side="right"
          size="md"
          title="Add New Contact"
          description="Fill in the contact details"
        >
          <SDrawerContent>
            <form class="space-y-5" @submit.prevent>
              <SInput
                v-model="formData.name"
                label="Full Name"
                placeholder="John Doe"
                prefix-icon="account"
              />
              <SInput
                v-model="formData.email"
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                prefix-icon="email"
              />
              <SInput
                label="Phone Number"
                placeholder="+1 (555) 000-0000"
                prefix-icon="phone"
              />
              <SInput
                label="Company"
                placeholder="Acme Inc."
                prefix-icon="domain"
              />
              <div class="flex items-center justify-between py-2">
                <span class="text-sm text-(--s-text-secondary)">Send welcome email</span>
                <SSwitch v-model="formData.notify" />
              </div>
            </form>
          </SDrawerContent>
          <SDrawerFooter>
            <SButton variant="secondary" @click="formDrawer = false">Cancel</SButton>
            <SButton @click="formDrawer = false">
              <span class="mdi mdi-check mr-2" />
              Save Contact
            </SButton>
          </SDrawerFooter>
        </SDrawer>
      </DemoSection>
    </section>

    <!-- Settings Drawer -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Settings Panel</h2>
      <DemoSection
        title="Settings Drawer"
        description="Quick settings panel pattern."
        :code="cartCode"
        language="vue"
      >
        <SButton @click="settingsDrawer = true">
          <span class="mdi mdi-cog mr-2" />
          Settings
        </SButton>

        <SDrawer
          v-model="settingsDrawer"
          side="right"
          size="sm"
          title="Settings"
          description="Customize your experience"
        >
          <SDrawerContent padding="none">
            <div class="divide-y divide-(--s-border)">
              <div class="flex items-center justify-between p-6">
                <div>
                  <h4 class="font-medium text-(--s-text-primary)">Dark Mode</h4>
                  <p class="text-sm text-(--s-text-tertiary)">Toggle dark theme</p>
                </div>
                <SSwitch v-model="settings.darkMode" />
              </div>
              <div class="flex items-center justify-between p-6">
                <div>
                  <h4 class="font-medium text-(--s-text-primary)">Notifications</h4>
                  <p class="text-sm text-(--s-text-tertiary)">Enable push notifications</p>
                </div>
                <SSwitch v-model="settings.notifications" />
              </div>
              <div class="flex items-center justify-between p-6">
                <div>
                  <h4 class="font-medium text-(--s-text-primary)">Sound Effects</h4>
                  <p class="text-sm text-(--s-text-tertiary)">Play sounds for actions</p>
                </div>
                <SSwitch v-model="settings.sounds" />
              </div>
              <div class="flex items-center justify-between p-6">
                <div>
                  <h4 class="font-medium text-(--s-text-primary)">Auto-save</h4>
                  <p class="text-sm text-(--s-text-tertiary)">Save changes automatically</p>
                </div>
                <SSwitch v-model="settings.autoSave" />
              </div>
            </div>
          </SDrawerContent>
          <SDrawerFooter>
            <SButton variant="secondary" @click="settingsDrawer = false">Close</SButton>
          </SDrawerFooter>
        </SDrawer>
      </DemoSection>
    </section>

    <!-- Notifications -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Notifications Panel</h2>
      <DemoSection
        title="Notifications Drawer"
        description="Display notifications in a side panel."
        :code="cartCode"
        language="vue"
      >
        <SButton @click="notificationDrawer = true">
          <span class="mdi mdi-bell mr-2" />
          Notifications
          <SBadge size="sm" color="red" class="ml-2">3</SBadge>
        </SButton>

        <SDrawer
          v-model="notificationDrawer"
          side="right"
          size="md"
          hide-header
        >
          <SDrawerHeader title="Notifications" closable>
            <template #extra>
              <SButton variant="ghost" size="small">
                Mark all read
              </SButton>
            </template>
          </SDrawerHeader>
          
          <SDrawerContent padding="none">
            <div class="divide-y divide-(--s-border)">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="flex gap-4 p-6 hover:bg-(--s-bg-secondary)/50 transition-colors cursor-pointer"
                :class="{ 'bg-(--s-bg-secondary)/30': !notification.read }"
              >
                <div
                  class="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  :class="{
                    'bg-emerald-500/10 text-emerald-500': notification.type === 'success',
                    'bg-blue-500/10 text-blue-500': notification.type === 'info',
                    'bg-amber-500/10 text-amber-500': notification.type === 'warning'
                  }"
                >
                  <span
                    class="mdi text-xl"
                    :class="{
                      'mdi-check-circle': notification.type === 'success',
                      'mdi-information': notification.type === 'info',
                      'mdi-alert': notification.type === 'warning'
                    }"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <h4 class="font-medium text-(--s-text-primary)">{{ notification.title }}</h4>
                    <span class="text-xs text-(--s-text-tertiary) whitespace-nowrap">{{ notification.time }}</span>
                  </div>
                  <p class="text-sm text-(--s-text-secondary) mt-1">{{ notification.message }}</p>
                </div>
                <div v-if="!notification.read" class="shrink-0 w-2 h-2 rounded-full bg-(--s-primary) mt-2" />
              </div>
            </div>
          </SDrawerContent>
          
          <SDrawerFooter align="center">
            <SButton variant="ghost" @click="notificationDrawer = false">
              View All Notifications
            </SButton>
          </SDrawerFooter>
        </SDrawer>
      </DemoSection>
    </section>

    <!-- Composable Components -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Composable Components</h2>
      <DemoSection
        title="Custom Layout"
        description="Use individual components for complete layout control."
        :code="composableCode"
        language="vue"
      >
        <SButton @click="composableDrawer = true">
          <span class="mdi mdi-puzzle-outline mr-2" />
          Composable Drawer
        </SButton>

        <SDrawer v-model="composableDrawer" hide-header>
          <!-- Custom header with composable components -->
          <div class="flex items-center justify-between p-6 border-b border-(--s-border)">
            <div class="flex items-center gap-4">
              <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <span class="mdi mdi-puzzle text-2xl" />
              </div>
              <div>
                <SDrawerTitle>Custom Header</SDrawerTitle>
                <SDrawerDescription class="mt-1">
                  Built with composable components
                </SDrawerDescription>
              </div>
            </div>
            <SDrawerClose />
          </div>
          
          <SDrawerContent>
            <div class="space-y-4">
              <p class="text-(--s-text-secondary)">
                This drawer demonstrates using individual composable components for maximum flexibility in your layouts.
              </p>
              <div class="p-4 rounded-lg bg-(--s-bg-tertiary) border border-(--s-border)">
                <h4 class="font-medium text-(--s-text-primary) mb-2">Available Components:</h4>
                <ul class="space-y-2 text-sm text-(--s-text-secondary)">
                  <li class="flex items-center gap-2">
                    <span class="mdi mdi-tag text-indigo-500" />
                    <code>SDrawerTitle</code> - Auto-binds to ARIA labelledby
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="mdi mdi-text text-indigo-500" />
                    <code>SDrawerDescription</code> - Auto-binds to ARIA describedby
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="mdi mdi-close-circle text-indigo-500" />
                    <code>SDrawerClose</code> - Uses context to close drawer
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="mdi mdi-drag-horizontal text-indigo-500" />
                    <code>SDrawerHandle</code> - Customizable drag handle
                  </li>
                </ul>
              </div>
            </div>
          </SDrawerContent>
          
          <SDrawerFooter>
            <SButton variant="secondary" @click="composableDrawer = false">Cancel</SButton>
            <SButton @click="composableDrawer = false">Got it!</SButton>
          </SDrawerFooter>
        </SDrawer>
      </DemoSection>
    </section>

    <!-- Real-World Examples -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Real-World Examples</h2>
      <p class="text-(--s-text-secondary) mb-4">
        See the Shopping Cart, Navigation Menu, Form, Settings, and Notifications drawers above for comprehensive real-world examples.
      </p>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <div class="space-y-8">
        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-dock-window text-(--s-primary)" />
            SDrawer
          </h3>
          <SApiTable title="Props" type="props" :props="drawerProps" />
          <SApiTable title="Events" type="events" :events="drawerEvents" class="mt-6" />
          <SApiTable title="Slots" type="slots" :slots="drawerSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-page-layout-header text-(--s-primary)" />
            SDrawerHeader
          </h3>
          <SApiTable title="Props" type="props" :props="headerProps" />
          <SApiTable title="Slots" type="slots" :slots="headerSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-text-box-outline text-(--s-primary)" />
            SDrawerContent
          </h3>
          <SApiTable title="Props" type="props" :props="contentProps" />
          <SApiTable title="Slots" type="slots" :slots="contentSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-dock-bottom text-(--s-primary)" />
            SDrawerFooter
          </h3>
          <SApiTable title="Props" type="props" :props="footerProps" />
          <SApiTable title="Slots" type="slots" :slots="footerSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-format-title text-(--s-primary)" />
            SDrawerTitle
          </h3>
          <SApiTable title="Props" type="props" :props="titleProps" />
          <SApiTable title="Slots" type="slots" :slots="titleSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-text text-(--s-primary)" />
            SDrawerDescription
          </h3>
          <SApiTable title="Props" type="props" :props="descriptionProps" />
          <SApiTable title="Slots" type="slots" :slots="descriptionSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-close-circle-outline text-(--s-primary)" />
            SDrawerClose
          </h3>
          <SApiTable title="Props" type="props" :props="closeProps" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-cursor-default-click-outline text-(--s-primary)" />
            SDrawerTrigger
          </h3>
          <SApiTable title="Props" type="props" :props="triggerProps" />
          <SApiTable title="Events" type="events" :events="triggerEvents" class="mt-6" />
          <SApiTable title="Slots" type="slots" :slots="triggerSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-drag-horizontal-variant text-(--s-primary)" />
            SDrawerHandle
          </h3>
          <SApiTable title="Props" type="props" :props="handleProps" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-keyboard-outline text-(--s-primary)" />
            Keyboard Navigation
          </h3>
          <SApiKeyboard :shortcuts="keyboardShortcuts" />
        </div>
      </div>
    </SApiSection>
  </div>
</template>

<style scoped>
kbd {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
</style>
