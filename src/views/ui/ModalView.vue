<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '../../components/DemoSection.vue'
import {
  SModal,
  SModalHeader,
  SModalContent,
  SModalFooter,
  SModalTitle,
  SModalDescription,
  SModalClose,
  SButton,
  SInput,
  SSwitch,
  SSelect,
  SOption,
  SApiSection,
  SApiTable,
  SApiKeyboard,
  SBadge,
  SKbd
} from '../../index'
import type { ApiProp, ApiEvent, ApiSlot, KeyboardShortcut } from '../../index'

// Demo states
const basicModal = ref(false)
const customHeaderModal = ref(false)
const composableModal = ref(false)
const confirmModal = ref(false)
const formModal = ref(false)
const sizeModal = ref(false)
const animationModal = ref(false)
const variantModal = ref(false)
const fullscreenModal = ref(false)
const nestedModal1 = ref(false)
const nestedModal2 = ref(false)
const scrollModal = ref(false)
const glassModal = ref(false)
const positionModal = ref(false)

// Demo options
const selectedSize = ref<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'>('md')
const selectedAnimation = ref<'fade' | 'scale' | 'slide-up' | 'slide-down' | 'zoom' | 'flip'>('scale')
const selectedVariant = ref<'default' | 'glass' | 'bordered' | 'elevated'>('default')
const selectedPosition = ref<'center' | 'top' | 'bottom' | 'left' | 'right'>('center')

// Form data
const formData = ref({
  name: '',
  email: '',
  subscribe: false
})

// Code snippets
const basicCode = `<SButton @click="showModal = true">Open Modal</SButton>

<SModal
  v-model="showModal"
  title="Welcome to SModal"
  description="This is a basic modal with a title and description. It supports keyboard navigation, focus trapping, and smooth animations."
>
  <SModalContent>
    <p>Your content here...</p>
  </SModalContent>
  <SModalFooter>
    <SButton variant="outlined">Cancel</SButton>
    <SButton>Got it!</SButton>
  </SModalFooter>
</SModal>`

const sizesCode = `<SModal v-model="showModal" size="xs">...</SModal>
<SModal v-model="showModal" size="sm">...</SModal>
<SModal v-model="showModal" size="md">...</SModal>
<SModal v-model="showModal" size="lg">...</SModal>
<SModal v-model="showModal" size="xl">...</SModal>
<SModal v-model="showModal" size="full">...</SModal>`

const animationsCode = `<SModal v-model="showModal" animation="fade">...</SModal>
<SModal v-model="showModal" animation="scale">...</SModal>
<SModal v-model="showModal" animation="slide-up">...</SModal>
<SModal v-model="showModal" animation="slide-down">...</SModal>
<SModal v-model="showModal" animation="zoom">...</SModal>
<SModal v-model="showModal" animation="flip">...</SModal>`

const variantsCode = `<!-- Default -->
<SModal v-model="showModal" variant="default">...</SModal>

<!-- Bordered -->
<SModal v-model="showModal" variant="bordered">...</SModal>

<!-- Elevated -->
<SModal v-model="showModal" variant="elevated">...</SModal>

<!-- Glass with backdrop blur -->
<SModal v-model="showModal" variant="glass" backdrop-blur>...</SModal>`

const positionsCode = `<SModal v-model="showModal" position="center">...</SModal>
<SModal v-model="showModal" position="top">...</SModal>
<SModal v-model="showModal" position="bottom">...</SModal>
<SModal v-model="showModal" position="left">...</SModal>
<SModal v-model="showModal" position="right">...</SModal>`

const customHeaderCode = `<SModal v-model="showModal" hide-header>
  <SModalHeader closable>
    <template #title>
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
          <span class="mdi mdi-star text-xl" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-(--s-text-primary)">Premium Feature</h2>
          <p class="text-sm text-(--s-text-tertiary)">Upgrade to unlock</p>
        </div>
      </div>
    </template>
    <template #extra>
      <SBadge color="amber" variant="light">PRO</SBadge>
    </template>
  </SModalHeader>
  <SModalContent>...</SModalContent>
  <SModalFooter>
    <SButton variant="outlined">Maybe Later</SButton>
    <SButton color="amber">Upgrade Now</SButton>
  </SModalFooter>
</SModal>`

const composableCode = `<SModal v-model="showModal" hide-header>
  <div class="flex items-center justify-between p-6 border-b border-(--s-border)">
    <div class="flex items-center gap-4">
      <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white">
        <span class="mdi mdi-puzzle text-2xl" />
      </div>
      <div>
        <SModalTitle>Composable Header</SModalTitle>
        <SModalDescription class="mt-1">
          Built with individual components
        </SModalDescription>
      </div>
    </div>
    <SModalClose />
  </div>

  <SModalContent>
    <p>Use SModalTitle, SModalDescription, and SModalClose
    for maximum flexibility in your layouts.</p>
  </SModalContent>

  <SModalFooter>
    <SButton variant="outlined">Cancel</SButton>
    <SButton>Got it!</SButton>
  </SModalFooter>
</SModal>`

const confirmCode = `<SModal v-model="confirmModal" size="sm" animation="zoom">
  <SModalContent centered padding="lg">
    <div class="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-red-500/10 text-red-500 mb-4">
      <span class="mdi mdi-alert-circle-outline text-4xl" />
    </div>
    <h3 class="text-lg font-semibold text-(--s-text-primary) mb-2">Delete this item?</h3>
    <p class="text-(--s-text-secondary) text-sm max-w-xs">
      This action cannot be undone. This will permanently delete the item and all associated data.
    </p>
  </SModalContent>
  <SModalFooter align="stretch" gap="md" stack-on-mobile>
    <SButton variant="outlined">Cancel</SButton>
    <SButton color="red">Delete</SButton>
  </SModalFooter>
</SModal>`

const formCode = `<SModal
  v-model="formModal"
  size="sm"
  title="Create Account"
  description="Fill in your details to get started"
>
  <SModalContent>
    <form class="space-y-4">
      <SInput v-model="formData.name" label="Full Name" placeholder="John Doe" prefix-icon="account" />
      <SInput v-model="formData.email" label="Email Address" type="email" placeholder="john@example.com" prefix-icon="email" />
      <div class="flex items-center justify-between py-2">
        <span class="text-sm text-(--s-text-secondary)">Subscribe to newsletter</span>
        <SSwitch v-model="formData.subscribe" />
      </div>
    </form>
  </SModalContent>
  <SModalFooter>
    <SButton variant="outlined">Cancel</SButton>
    <SButton>Create Account</SButton>
  </SModalFooter>
</SModal>`

const scrollCode = `<SModal
  v-model="scrollModal"
  title="Terms of Service"
  description="Please read carefully before accepting"
>
  <SModalContent max-height="300px">
    <div class="space-y-4">
      <p v-for="i in 10" :key="i">Long content...</p>
    </div>
  </SModalContent>
  <SModalFooter>
    <SButton variant="outlined">Decline</SButton>
    <SButton>Accept</SButton>
  </SModalFooter>
</SModal>`

const nestedCode = `<SModal
  v-model="nestedModal1"
  title="First Modal"
  description="This is the first modal layer"
  :stack-order="0"
>
  <SModalContent>
    <p>Click the button below to open another modal on top of this one.</p>
    <SButton>Open Second Modal</SButton>
  </SModalContent>
  <SModalFooter>
    <SButton variant="outlined">Close</SButton>
  </SModalFooter>
</SModal>

<SModal
  v-model="nestedModal2"
  title="Second Modal"
  description="This modal is on top of the first one"
  size="sm"
  :stack-order="1"
  animation="slide-up"
>
  <SModalContent>
    <p>Notice how this modal appears above the first one with a higher z-index.</p>
  </SModalContent>
  <SModalFooter>
    <SButton>Close</SButton>
  </SModalFooter>
</SModal>`

const fullscreenCode = `<SModal v-model="fullscreenModal" fullscreen animation="zoom">
  <SModalHeader title="Fullscreen Mode" description="The modal takes up the entire viewport" />
  <SModalContent centered>
    <div class="text-center max-w-lg mx-auto">
      <span class="mdi mdi-monitor text-8xl text-(--s-primary) mb-6 block" />
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Immersive Experience</h2>
      <p class="text-(--s-text-secondary)">
        Fullscreen modals are perfect for image galleries, video players,
        or any content that benefits from maximum screen real estate.
      </p>
    </div>
  </SModalContent>
  <SModalFooter align="center">
    <SButton size="lg">Exit Fullscreen</SButton>
  </SModalFooter>
</SModal>`

// API Documentation
const modalProps: ApiProp[] = [
  { name: 'modelValue', type: 'boolean', default: 'false', description: 'Control modal visibility with v-model', category: 'State' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'", default: "'md'", description: 'Modal size variant', category: 'Appearance' },
  { name: 'variant', type: "'default' | 'glass' | 'bordered' | 'elevated'", default: "'default'", description: 'Visual style variant', category: 'Appearance' },
  { name: 'animation', type: "'fade' | 'scale' | 'slide-up' | 'slide-down' | 'zoom' | 'flip'", default: "'scale'", description: 'Animation style', category: 'Appearance' },
  { name: 'position', type: "'center' | 'top' | 'bottom' | 'left' | 'right'", default: "'center'", description: 'Position on screen', category: 'Appearance' },
  { name: 'title', type: 'string', default: 'undefined', description: 'Modal title (creates default header)', category: 'Content' },
  { name: 'description', type: 'string', default: 'undefined', description: 'Modal description text', category: 'Content' },
  { name: 'closable', type: 'boolean', default: 'true', description: 'Show close button', category: 'Behavior' },
  { name: 'closeOnBackdrop', type: 'boolean', default: 'true', description: 'Close when clicking backdrop', category: 'Behavior' },
  { name: 'closeOnEscape', type: 'boolean', default: 'true', description: 'Close on Escape key press', category: 'Behavior' },
  { name: 'lockScroll', type: 'boolean', default: 'true', description: 'Lock body scroll when open', category: 'Behavior' },
  { name: 'trapFocus', type: 'boolean', default: 'true', description: 'Trap focus within modal', category: 'Accessibility' },
  { name: 'backdrop', type: 'boolean', default: 'true', description: 'Show backdrop overlay', category: 'Appearance' },
  { name: 'backdropBlur', type: 'boolean', default: 'false', description: 'Enable backdrop blur effect', category: 'Appearance' },
  { name: 'persistent', type: 'boolean', default: 'false', description: 'Prevent closing via backdrop/escape', category: 'Behavior' },
  { name: 'fullscreen', type: 'boolean', default: 'false', description: 'Fullscreen mode', category: 'Appearance' },
  { name: 'hideHeader', type: 'boolean', default: 'false', description: 'Hide default header', category: 'Content' },
  { name: 'teleport', type: 'boolean | string', default: 'true', description: 'Teleport target', category: 'Advanced' },
  { name: 'zIndex', type: 'number', default: '1000', description: 'Z-index value', category: 'Advanced' },
  { name: 'initialFocus', type: 'string', default: 'undefined', description: 'CSS selector for initial focus', category: 'Accessibility' },
  { name: 'autoFocus', type: 'boolean', default: 'false', description: 'Auto-focus first interactive element (skips close button)', category: 'Accessibility' },
  { name: 'stackOrder', type: 'number', default: '0', description: 'Stacking order for nested modals', category: 'Advanced' }
]

const modalEvents: ApiEvent[] = [
  { name: 'update:modelValue', payload: 'boolean', description: 'Emitted when visibility changes' },
  { name: 'open', payload: 'void', description: 'Emitted when modal opens' },
  { name: 'close', payload: 'void', description: 'Emitted when modal closes' },
  { name: 'opened', payload: 'void', description: 'Emitted after open animation completes' },
  { name: 'closed', payload: 'void', description: 'Emitted after close animation completes' },
  { name: 'before-open', payload: 'void', description: 'Emitted before opening' },
  { name: 'before-close', payload: 'void', description: 'Emitted before closing' }
]

const modalSlots: ApiSlot[] = [
  { name: 'default', description: 'Main modal content' },
  { name: 'header', description: 'Custom header content (replaces default header)' },
  { name: 'footer', description: 'Footer content' }
]

const triggerProps: ApiProp[] = [
  { name: 'as', type: 'string', default: "'button'", description: 'HTML element or component used for the trigger' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable trigger interaction' },
  { name: 'triggerClass', type: 'string', default: "''", description: 'Additional CSS class for the trigger wrapper' }
]

const triggerEvents: ApiEvent[] = [
  { name: 'click', payload: 'MouseEvent', description: 'Emitted when the trigger opens the modal' }
]

const triggerSlots: ApiSlot[] = [
  { name: 'default', description: 'Trigger content that opens the modal' }
]

const headerProps: ApiProp[] = [
  { name: 'title', type: 'string', default: 'undefined', description: 'Header title' },
  { name: 'description', type: 'string', default: 'undefined', description: 'Description text' },
  { name: 'closable', type: 'boolean', default: 'true', description: 'Show close button' },
  { name: 'divider', type: 'boolean', default: 'true', description: 'Show bottom divider' },
  { name: 'padding', type: "'none' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Padding size' },
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
  { name: 'default', description: 'Main modal body content' }
]

const footerProps: ApiProp[] = [
  { name: 'align', type: "'left' | 'center' | 'right' | 'between' | 'stretch'", default: "'right'", description: 'Button alignment' },
  { name: 'divider', type: 'boolean', default: 'true', description: 'Show top divider' },
  { name: 'padding', type: "'none' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Padding size' },
  { name: 'gap', type: "'none' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Gap between items' },
  { name: 'stackOnMobile', type: 'boolean', default: 'false', description: 'Stack buttons on mobile' },
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
  { name: 'default', description: 'Modal title content' }
]

const descriptionProps: ApiProp[] = [
  { name: 'as', type: "'p' | 'span' | 'div'", default: "'p'", description: 'HTML tag to use' },
  { name: 'descriptionClass', type: 'string', default: "''", description: 'Additional CSS class' }
]

const descriptionSlots: ApiSlot[] = [
  { name: 'default', description: 'Modal description content' }
]

const closeProps: ApiProp[] = [
  { name: 'closeClass', type: 'string', default: "''", description: 'Additional CSS class' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the close button' }
]

const closeSlots: ApiSlot[] = [
  { name: 'default', description: 'Custom close icon or label content' }
]

const keyboardShortcuts: KeyboardShortcut[] = [
  { keys: 'Escape', action: 'Close modal (if closeOnEscape is true)' },
  { keys: 'Tab', action: 'Navigate to next focusable element' },
  { keys: 'Shift + Tab', action: 'Navigate to previous focusable element' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- @component SModal -->
    <!-- @props modelValue, size, variant, animation, position, title, description, closable, closeOnBackdrop, closeOnEscape, lockScroll, trapFocus, backdrop, backdropBlur, persistent, fullscreen, hideHeader, teleport, zIndex, initialFocus, autoFocus, stackOrder -->
    <!-- @events update:modelValue, open, close, opened, closed, before-open, before-close -->
    <!-- @slots default, header, footer -->
    <!-- @sections features, basic-usage, sizes, animations, variants, positions, custom-header, composable-components, confirmation-dialog, form-modal, scrollable-content, nested-modals, fullscreen-modal, real-world-examples, keyboard-shortcut-hints -->
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Modal</h1>
      <p class="text-lg text-(--s-text-secondary)">Advanced dialog component with accessibility, animations, and focus management.</p>
    </header>

    <!-- Features -->
    <article id="features">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-emerald-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-keyboard text-xl text-emerald-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Keyboard Support</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">ESC to close, Tab navigation with focus trapping.</p>
        </div>
        <div class="p-4 rounded-xl bg-blue-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-eye text-xl text-blue-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">ARIA Accessible</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Full ARIA support with role, aria-modal, and labeling.</p>
        </div>
        <div class="p-4 rounded-xl bg-purple-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-animation text-xl text-purple-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Six Animations</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Fade, scale, slide, zoom, and flip animations.</p>
        </div>
        <div class="p-4 rounded-xl bg-amber-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-resize text-xl text-amber-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Six Sizes</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">From extra small to fullscreen modal sizes.</p>
        </div>
        <div class="p-4 rounded-xl bg-red-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-layers-outline text-xl text-red-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Nested Support</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Stack multiple modals with proper z-index handling.</p>
        </div>
        <div class="p-4 rounded-xl bg-cyan-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-blur text-xl text-cyan-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Glass Variant</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Beautiful frosted glass effect with backdrop blur.</p>
        </div>
      </div>
    </article>

    <!-- Basic Usage -->
    <section id="basic-usage">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection
        title="Basic Modal"
        description="A simple modal with title and description. Click outside or press Escape to close."
        :code="basicCode"
        language="vue"
      >
        <div class="flex gap-3">
          <SButton @click="basicModal = true">
            <span class="mdi mdi-card-text-outline mr-2" />
            Open Modal
          </SButton>
        </div>

        <SModal
          v-model="basicModal"
          title="Welcome to SModal"
          description="This is a basic modal with a title and description. It supports keyboard navigation, focus trapping, and smooth animations."
        >
          <SModalContent>
            <p class="text-(--s-text-secondary)">
              This modal demonstrates the basic usage with the built-in header. You can close it by:
            </p>
            <ul class="mt-4 space-y-2 text-(--s-text-secondary)">
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
                Clicking outside the modal
              </li>
            </ul>
          </SModalContent>
          <SModalFooter>
            <SButton variant="outlined" @click="basicModal = false">Cancel</SButton>
            <SButton @click="basicModal = false">Got it!</SButton>
          </SModalFooter>
        </SModal>
      </DemoSection>
    </section>

    <!-- Sizes -->
    <section id="sizes">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Sizes</h2>
      <DemoSection
        title="Modal Sizes"
        description="Modal comes in various sizes from extra-small to full width."
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
          <SButton @click="sizeModal = true">
            Open {{ selectedSize.toUpperCase() }} Modal
          </SButton>
        </div>

        <SModal
          v-model="sizeModal"
          :size="selectedSize"
          :title="`${selectedSize.toUpperCase()} Size Modal`"
          description="Different sizes for different use cases"
        >
          <SModalContent>
            <p class="text-(--s-text-secondary)">
              This modal is using the <strong class="text-(--s-primary)">{{ selectedSize }}</strong> size variant.
            </p>
            <div class="mt-4 p-4 rounded-lg bg-(--s-bg-tertiary) border border-(--s-border)">
              <code class="text-sm text-(--s-text-secondary)">
                &lt;SModal size="{{ selectedSize }}" /&gt;
              </code>
            </div>
          </SModalContent>
          <SModalFooter>
            <SButton @click="sizeModal = false">Close</SButton>
          </SModalFooter>
        </SModal>
      </DemoSection>
    </section>

    <!-- Animations -->
    <section id="animations">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Animations</h2>
      <DemoSection
        title="Animation Styles"
        description="Choose from multiple animation styles for opening and closing."
        :code="animationsCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-3">
          <SSelect v-model="selectedAnimation" placeholder="Select animation">
            <SOption value="fade">Fade</SOption>
            <SOption value="scale">Scale</SOption>
            <SOption value="slide-up">Slide Up</SOption>
            <SOption value="slide-down">Slide Down</SOption>
            <SOption value="zoom">Zoom</SOption>
            <SOption value="flip">Flip</SOption>
          </SSelect>
          <SButton @click="animationModal = true">
            <span class="mdi mdi-animation-play-outline mr-2" />
            Open with {{ selectedAnimation }}
          </SButton>
        </div>

        <SModal
          v-model="animationModal"
          :animation="selectedAnimation"
          title="Animation Demo"
          :description="`Using the '${selectedAnimation}' animation`"
        >
          <SModalContent>
            <div class="flex items-center justify-center py-8">
              <div class="text-center">
                <span class="mdi mdi-animation text-6xl text-(--s-primary)" />
                <p class="mt-4 text-(--s-text-secondary)">
                  Animation: <strong class="text-(--s-primary)">{{ selectedAnimation }}</strong>
                </p>
              </div>
            </div>
          </SModalContent>
          <SModalFooter>
            <SButton @click="animationModal = false">Close</SButton>
          </SModalFooter>
        </SModal>
      </DemoSection>
    </section>

    <!-- Variants -->
    <section id="variants">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Variants</h2>
      <DemoSection
        title="Visual Variants"
        description="Different visual styles for various contexts."
        :code="variantsCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-3">
          <SButton variant="outlined" @click="selectedVariant = 'default'; variantModal = true">Default</SButton>
          <SButton variant="outlined" @click="selectedVariant = 'bordered'; variantModal = true">Bordered</SButton>
          <SButton variant="outlined" @click="selectedVariant = 'elevated'; variantModal = true">Elevated</SButton>
          <SButton variant="outlined" @click="glassModal = true">
            <span class="mdi mdi-blur mr-2" />
            Glass
          </SButton>
        </div>

        <SModal
          v-model="variantModal"
          :variant="selectedVariant"
          title="Variant Demo"
          :description="`This modal uses the '${selectedVariant}' variant`"
        >
          <SModalContent>
            <p class="text-(--s-text-secondary)">
              The {{ selectedVariant }} variant provides a distinct visual style.
            </p>
          </SModalContent>
          <SModalFooter>
            <SButton @click="variantModal = false">Close</SButton>
          </SModalFooter>
        </SModal>

        <SModal
          v-model="glassModal"
          variant="glass"
          backdrop-blur
          title="Glass Variant"
          description="Frosted glass effect with backdrop blur"
        >
          <SModalContent>
            <p class="text-(--s-text-secondary)">
              The glass variant creates a beautiful frosted glass effect with a blurred backdrop.
            </p>
          </SModalContent>
          <SModalFooter>
            <SButton @click="glassModal = false">Beautiful!</SButton>
          </SModalFooter>
        </SModal>
      </DemoSection>
    </section>

    <!-- Positions -->
    <section id="positions">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Positions</h2>
      <DemoSection
        title="Screen Positions"
        description="Position the modal on different parts of the screen."
        :code="positionsCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-3">
          <SButton variant="outlined" @click="selectedPosition = 'center'; positionModal = true">Center</SButton>
          <SButton variant="outlined" @click="selectedPosition = 'top'; positionModal = true">Top</SButton>
          <SButton variant="outlined" @click="selectedPosition = 'bottom'; positionModal = true">Bottom</SButton>
          <SButton variant="outlined" @click="selectedPosition = 'left'; positionModal = true">Left</SButton>
          <SButton variant="outlined" @click="selectedPosition = 'right'; positionModal = true">Right</SButton>
        </div>

        <SModal
          v-model="positionModal"
          :position="selectedPosition"
          animation="slide-up"
          title="Position Demo"
          :description="`Positioned at: ${selectedPosition}`"
        >
          <SModalContent>
            <p class="text-(--s-text-secondary)">
              This modal is positioned at the <strong class="text-(--s-primary)">{{ selectedPosition }}</strong> of the screen.
            </p>
          </SModalContent>
          <SModalFooter>
            <SButton @click="positionModal = false">Close</SButton>
          </SModalFooter>
        </SModal>
      </DemoSection>
    </section>

    <!-- Custom Header -->
    <section id="custom-header">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Custom Header</h2>
      <DemoSection
        title="Custom Modal Header"
        description="Use SModalHeader for full control over the header appearance."
        :code="customHeaderCode"
        language="vue"
      >
        <SButton @click="customHeaderModal = true">
          <span class="mdi mdi-palette-outline mr-2" />
          Custom Header
        </SButton>

        <SModal v-model="customHeaderModal" hide-header>
          <SModalHeader closable>
            <template #title>
              <div class="flex items-center gap-3">
                <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                  <span class="mdi mdi-star text-xl" />
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-(--s-text-primary)">Premium Feature</h2>
                  <p class="text-sm text-(--s-text-tertiary)">Upgrade to unlock</p>
                </div>
              </div>
            </template>
            <template #extra>
              <SBadge color="amber" variant="light">PRO</SBadge>
            </template>
          </SModalHeader>
          <SModalContent>
            <div class="space-y-4">
              <p class="text-(--s-text-secondary)">
                This example shows a completely custom header with an icon, badge, and styled title.
              </p>
              <div class="p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                <div class="flex items-start gap-3">
                  <span class="mdi mdi-lightbulb-on text-2xl text-amber-500" />
                  <p class="text-sm text-(--s-text-secondary)">
                    Use the <code class="px-1 bg-(--s-bg-tertiary) rounded">SModalHeader</code> component
                    with slots for complete customization.
                  </p>
                </div>
              </div>
            </div>
          </SModalContent>
          <SModalFooter>
            <SButton variant="outlined" @click="customHeaderModal = false">Maybe Later</SButton>
            <SButton color="amber" @click="customHeaderModal = false">Upgrade Now</SButton>
          </SModalFooter>
        </SModal>
      </DemoSection>
    </section>

    <!-- Composable Components -->
    <section id="composable-components">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Composable Components</h2>
      <DemoSection
        title="Title, Description & Close"
        description="Use SModalTitle, SModalDescription, and SModalClose for flexible layouts."
        :code="composableCode"
        language="vue"
      >
        <SButton @click="composableModal = true">
          <span class="mdi mdi-puzzle-outline mr-2" />
          Composable Modal
        </SButton>

        <SModal v-model="composableModal" hide-header>
          <!-- Custom header with composable components -->
          <div class="flex items-center justify-between p-6 border-b border-(--s-border)">
            <div class="flex items-center gap-4">
              <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white">
                <span class="mdi mdi-puzzle text-2xl" />
              </div>
              <div>
                <SModalTitle>Composable Header</SModalTitle>
                <SModalDescription class="mt-1">
                  Built with individual components
                </SModalDescription>
              </div>
            </div>
            <SModalClose />
          </div>
          
          <SModalContent>
            <div class="space-y-4">
              <p class="text-(--s-text-secondary)">
                This modal demonstrates using the individual composable components instead of <code class="px-1 bg-(--s-bg-tertiary) rounded">SModalHeader</code>.
              </p>
              <div class="p-4 rounded-lg bg-(--s-bg-tertiary) border border-(--s-border)">
                <h4 class="font-medium text-(--s-text-primary) mb-2">Available Components:</h4>
                <ul class="space-y-2 text-sm text-(--s-text-secondary)">
                  <li class="flex items-center gap-2">
                    <span class="mdi mdi-tag text-violet-500" />
                    <code>SModalTitle</code> - Auto-binds to ARIA labelledby
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="mdi mdi-text text-violet-500" />
                    <code>SModalDescription</code> - Auto-binds to ARIA describedby
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="mdi mdi-close-circle text-violet-500" />
                    <code>SModalClose</code> - Uses context to close modal
                  </li>
                </ul>
              </div>
            </div>
          </SModalContent>
          
          <SModalFooter>
            <SButton variant="outlined" @click="composableModal = false">Cancel</SButton>
            <SButton @click="composableModal = false">Got it!</SButton>
          </SModalFooter>
        </SModal>
      </DemoSection>
    </section>

    <!-- Confirmation Modal -->
    <section id="confirmation-dialog">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Confirmation Dialog</h2>
      <DemoSection
        title="Delete Confirmation"
        description="A common pattern for destructive actions."
        :code="confirmCode"
        language="vue"
      >
        <SButton color="red" @click="confirmModal = true">
          <span class="mdi mdi-delete-outline mr-2" />
          Delete Item
        </SButton>

        <SModal
          v-model="confirmModal"
          size="sm"
          animation="zoom"
        >
          <SModalContent centered padding="lg">
            <div class="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-red-500/10 text-red-500 mb-4">
              <span class="mdi mdi-alert-circle-outline text-4xl" />
            </div>
            <h3 class="text-lg font-semibold text-(--s-text-primary) mb-2">Delete this item?</h3>
            <p class="text-(--s-text-secondary) text-sm max-w-xs">
              This action cannot be undone. This will permanently delete the item and all associated data.
            </p>
          </SModalContent>
          <SModalFooter align="stretch" gap="md" stack-on-mobile>
            <SButton variant="outlined" @click="confirmModal = false">Cancel</SButton>
            <SButton color="red" @click="confirmModal = false">
              <span class="mdi mdi-delete mr-2" />
              Delete
            </SButton>
          </SModalFooter>
        </SModal>
      </DemoSection>
    </section>

    <!-- Form Modal -->
    <section id="form-modal">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Form Modal</h2>
      <DemoSection
        title="Modal with Form"
        description="Modal with form inputs and validation."
        :code="formCode"
        language="vue"
      >
        <SButton @click="formModal = true">
          <span class="mdi mdi-form-textbox mr-2" />
          Open Form
        </SButton>

        <SModal
          v-model="formModal"
          size="sm"
          title="Create Account"
          description="Fill in your details to get started"
        >
          <SModalContent>
            <form class="space-y-4" @submit.prevent>
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
              <div class="flex items-center justify-between py-2">
                <span class="text-sm text-(--s-text-secondary)">Subscribe to newsletter</span>
                <SSwitch v-model="formData.subscribe" />
              </div>
            </form>
          </SModalContent>
          <SModalFooter>
            <SButton variant="outlined" @click="formModal = false">Cancel</SButton>
            <SButton @click="formModal = false">Create Account</SButton>
          </SModalFooter>
        </SModal>
      </DemoSection>
    </section>

    <!-- Scrollable Content -->
    <section id="scrollable-content">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Scrollable Content</h2>
      <DemoSection
        title="Long Content Modal"
        description="Long content automatically becomes scrollable."
        :code="scrollCode"
        language="vue"
      >
        <SButton @click="scrollModal = true">
          <span class="mdi mdi-text-long mr-2" />
          Long Content
        </SButton>

        <SModal
          v-model="scrollModal"
          title="Terms of Service"
          description="Please read carefully before accepting"
        >
          <SModalContent max-height="300px">
            <div class="space-y-4 text-(--s-text-secondary)">
              <p v-for="i in 10" :key="i">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur.
              </p>
            </div>
          </SModalContent>
          <SModalFooter>
            <SButton variant="outlined" @click="scrollModal = false">Decline</SButton>
            <SButton @click="scrollModal = false">Accept</SButton>
          </SModalFooter>
        </SModal>
      </DemoSection>
    </section>

    <!-- Nested Modals -->
    <section id="nested-modals">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Nested Modals</h2>
      <DemoSection
        title="Stacked Modals"
        description="Stack multiple modals with proper z-index handling."
        :code="nestedCode"
        language="vue"
      >
        <SButton @click="nestedModal1 = true">
          <span class="mdi mdi-layers-outline mr-2" />
          Open First Modal
        </SButton>

        <SModal
          v-model="nestedModal1"
          title="First Modal"
          description="This is the first modal layer"
          :stack-order="0"
        >
          <SModalContent>
            <p class="text-(--s-text-secondary) mb-4">
              Click the button below to open another modal on top of this one.
            </p>
            <SButton @click="nestedModal2 = true">
              <span class="mdi mdi-layers-plus mr-2" />
              Open Second Modal
            </SButton>
          </SModalContent>
          <SModalFooter>
            <SButton variant="outlined" @click="nestedModal1 = false">Close</SButton>
          </SModalFooter>
        </SModal>

        <SModal
          v-model="nestedModal2"
          title="Second Modal"
          description="This modal is on top of the first one"
          size="sm"
          :stack-order="1"
          animation="slide-up"
        >
          <SModalContent>
            <p class="text-(--s-text-secondary)">
              Notice how this modal appears above the first one with a higher z-index.
            </p>
          </SModalContent>
          <SModalFooter>
            <SButton @click="nestedModal2 = false">Close</SButton>
          </SModalFooter>
        </SModal>
      </DemoSection>
    </section>

    <!-- Fullscreen -->
    <section id="fullscreen-modal">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Fullscreen Modal</h2>
      <DemoSection
        title="Fullscreen Mode"
        description="Take over the entire screen for immersive experiences."
        :code="fullscreenCode"
        language="vue"
      >
        <SButton @click="fullscreenModal = true">
          <span class="mdi mdi-fullscreen mr-2" />
          Fullscreen
        </SButton>

        <SModal
          v-model="fullscreenModal"
          fullscreen
          animation="zoom"
        >
          <SModalHeader title="Fullscreen Mode" description="The modal takes up the entire viewport" />
          <SModalContent centered>
            <div class="text-center max-w-lg mx-auto">
              <span class="mdi mdi-monitor text-8xl text-(--s-primary) mb-6 block" />
              <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Immersive Experience</h2>
              <p class="text-(--s-text-secondary)">
                Fullscreen modals are perfect for image galleries, video players,
                or any content that benefits from maximum screen real estate.
              </p>
            </div>
          </SModalContent>
          <SModalFooter align="center">
            <SButton size="lg" @click="fullscreenModal = false">
              <span class="mdi mdi-fullscreen-exit mr-2" />
              Exit Fullscreen
            </SButton>
          </SModalFooter>
        </SModal>
      </DemoSection>
    </section>

    <!-- Real-World Examples -->
    <section id="real-world-examples">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Real-World Examples</h2>
      <p class="text-(--s-text-secondary) mb-4">
        See the Confirmation Dialog, Form Modal, and Nested Modals examples above for comprehensive real-world use cases.
      </p>
    </section>

    <!-- Keyboard Shortcut Hints -->
    <section id="keyboard-shortcut-hints">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Keyboard Shortcut Hints</h2>
      <DemoSection
        title="Escape Key Hint"
        description="Display keyboard hints to help users discover modal shortcuts."
        code="<p class=&quot;text-sm text-(--s-text-secondary)&quot;>
  Press <SKbd size=&quot;sm&quot;>Esc</SKbd> to close the modal.
</p>"
        language="vue"
      >
        <div class="max-w-md p-4 rounded-xl border border-(--s-border) bg-(--s-bg-secondary)/30">
          <p class="text-sm text-(--s-text-secondary) leading-relaxed">
            Press <SKbd size="sm">Esc</SKbd> to close the modal.
          </p>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <div class="space-y-8">
        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-window-maximize text-(--s-primary)" />
            SModal
          </h3>
          <SApiTable title="Props" type="props" :props="modalProps" />
          <SApiTable title="Events" type="events" :events="modalEvents" class="mt-6" />
          <SApiTable title="Slots" type="slots" :slots="modalSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-page-layout-header text-(--s-primary)" />
            SModalHeader
          </h3>
          <SApiTable title="Props" type="props" :props="headerProps" />
          <SApiTable title="Slots" type="slots" :slots="headerSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-text-box-outline text-(--s-primary)" />
            SModalContent
          </h3>
          <SApiTable title="Props" type="props" :props="contentProps" />
          <SApiTable title="Slots" type="slots" :slots="contentSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-dock-bottom text-(--s-primary)" />
            SModalFooter
          </h3>
          <SApiTable title="Props" type="props" :props="footerProps" />
          <SApiTable title="Slots" type="slots" :slots="footerSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-cursor-default-click-outline text-(--s-primary)" />
            SModalTrigger
          </h3>
          <SApiTable title="Props" type="props" :props="triggerProps" />
          <SApiTable title="Events" type="events" :events="triggerEvents" class="mt-6" />
          <SApiTable title="Slots" type="slots" :slots="triggerSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-format-title text-(--s-primary)" />
            SModalTitle
          </h3>
          <SApiTable title="Props" type="props" :props="titleProps" />
          <SApiTable title="Slots" type="slots" :slots="titleSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-text text-(--s-primary)" />
            SModalDescription
          </h3>
          <SApiTable title="Props" type="props" :props="descriptionProps" />
          <SApiTable title="Slots" type="slots" :slots="descriptionSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-(--s-text-primary) mb-4 flex items-center gap-2">
            <span class="mdi mdi-close-circle-outline text-(--s-primary)" />
            SModalClose
          </h3>
          <SApiTable title="Props" type="props" :props="closeProps" />
          <SApiTable title="Slots" type="slots" :slots="closeSlots" class="mt-6" />
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
