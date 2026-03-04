<script setup lang="ts">
import { ref } from 'vue'
import { SAvatar, SAvatarImage, SAvatarFallback, SAvatarGroup, SApiSection, SApiTable } from '../../index'
import type { ApiProp, ApiEvent, ApiSlot } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// Sample user data
const users = [
  { name: 'John Doe', initials: 'JD', src: 'https://i.pravatar.cc/150?u=john' },
  { name: 'Jane Smith', initials: 'JS', src: 'https://i.pravatar.cc/150?u=jane' },
  { name: 'Mike Johnson', initials: 'MJ', src: 'https://i.pravatar.cc/150?u=mike' },
  { name: 'Sarah Wilson', initials: 'SW', src: 'https://i.pravatar.cc/150?u=sarah' },
  { name: 'Alex Brown', initials: 'AB', src: 'https://i.pravatar.cc/150?u=alex' },
]

// State for interactive demo
const currentStatus = ref<'online' | 'offline' | 'busy' | 'away'>('online')
const toggleStatus = () => {
  const statuses: ('online' | 'offline' | 'busy' | 'away')[] = ['online', 'offline', 'busy', 'away']
  const currentIndex = statuses.indexOf(currentStatus.value)
  currentStatus.value = statuses[(currentIndex + 1) % statuses.length]
}

// Code snippets
const basicUsageCode = `<SAvatar>
  <SAvatarImage src="https://i.pravatar.cc/150?u=john" alt="John Doe" />
  <SAvatarFallback>JD</SAvatarFallback>
</SAvatar>`

const sizesCode = `<SAvatar size="xs">...</SAvatar>
<SAvatar size="sm">...</SAvatar>
<SAvatar size="md">...</SAvatar>
<SAvatar size="lg">...</SAvatar>
<SAvatar size="xl">...</SAvatar>
<SAvatar size="2xl">...</SAvatar>
<SAvatar :size="80">...</SAvatar> <!-- Custom size in pixels -->`

const shapesCode = `<SAvatar shape="circle">...</SAvatar>
<SAvatar shape="rounded">...</SAvatar>
<SAvatar shape="square">...</SAvatar>`

const fallbackCode = `<!-- With initials -->
<SAvatar>
  <SAvatarImage src="/broken-link.jpg" />
  <SAvatarFallback>CN</SAvatarFallback>
</SAvatar>

<!-- With icon (default) -->
<SAvatar>
  <SAvatarFallback />
</SAvatar>

<!-- With custom content -->
<SAvatar>
  <SAvatarFallback>
    <span class="mdi mdi-account-group" />
  </SAvatarFallback>
</SAvatar>`

const statusCode = `<SAvatar status="online">...</SAvatar>
<SAvatar status="away">...</SAvatar>
<SAvatar status="busy">...</SAvatar>
<SAvatar status="offline">...</SAvatar>`

const borderedCode = `<SAvatar bordered borderColor="var(--s-primary)">
  ...
</SAvatar>

<SAvatar ring ringColor="var(--s-primary)">
  ...
</SAvatar>`

const groupCode = `<SAvatarGroup spacing="normal">
  <SAvatar>
    <SAvatarImage src="..." />
    <SAvatarFallback>JD</SAvatarFallback>
  </SAvatar>
  <SAvatar>
    <SAvatarImage src="..." />
    <SAvatarFallback>JS</SAvatarFallback>
  </SAvatar>
  <!-- More avatars... -->
</SAvatarGroup>`

const delayCode = `<!-- Show fallback after 600ms delay if image hasn't loaded -->
<SAvatar>
  <SAvatarImage src="https://slow-server.com/image.jpg" />
  <SAvatarFallback :delayMs="600">JD</SAvatarFallback>
</SAvatar>`

// API Reference data
const avatarProps: ApiProp[] = [
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number", default: "'md'", description: 'Avatar size, preset or custom pixels', category: 'Appearance' },
  { name: 'shape', type: "'circle' | 'square' | 'rounded'", default: "'circle'", description: 'Avatar shape', category: 'Appearance' },
  { name: 'bordered', type: 'boolean', default: 'false', description: 'Add a border ring', category: 'Border & Ring' },
  { name: 'borderColor', type: 'string', default: "'var(--s-border)'", description: 'Border color (CSS)', category: 'Border & Ring' },
  { name: 'ring', type: 'boolean', default: 'false', description: 'Add a focus ring with offset', category: 'Border & Ring' },
  { name: 'ringColor', type: 'string', default: "'var(--s-primary)'", description: 'Ring color (CSS)', category: 'Border & Ring' },
  { name: 'status', type: "'online' | 'offline' | 'busy' | 'away' | null", default: 'null', description: 'Status indicator', category: 'Status Indicator' },
  { name: 'statusPosition', type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'", default: "'bottom-right'", description: 'Status indicator position', category: 'Status Indicator' }
]

const avatarImageProps: ApiProp[] = [
  { name: 'src', type: 'string', default: 'undefined', description: 'Image source URL' },
  { name: 'alt', type: 'string', default: "'Avatar'", description: 'Alternative text' },
  { name: 'loading', type: "'eager' | 'lazy'", default: "'eager'", description: 'Image loading strategy' }
]

const avatarFallbackProps: ApiProp[] = [
  { name: 'delayMs', type: 'number', default: '0', description: 'Delay before showing fallback (prevents flicker)' },
  { name: 'color', type: 'string', default: 'undefined', description: 'Text color (CSS)' },
  { name: 'bgColor', type: 'string', default: 'undefined', description: 'Background color (CSS)' }
]

const avatarGroupProps: ApiProp[] = [
  { name: 'max', type: 'number', default: 'undefined', description: 'Maximum avatars to display' },
  { name: 'spacing', type: "'tight' | 'normal' | 'loose' | number", default: "'normal'", description: 'Overlap spacing between avatars' },
  { name: 'bordered', type: 'boolean', default: 'true', description: 'Add borders to all avatars' }
]

const avatarImageEvents: ApiEvent[] = [
  { name: '@load', payload: 'Event', description: 'Emitted when image loads successfully' },
  { name: '@error', payload: 'Event', description: 'Emitted when image fails to load' }
]

const avatarSlots: ApiSlot[] = [
  { name: 'SAvatar - default', description: 'Container for SAvatarImage and SAvatarFallback components' },
  { name: 'SAvatarFallback - default', description: 'Fallback content (initials, icon, or custom element)' },
  { name: 'SAvatarGroup - default', description: 'Container for multiple SAvatar components' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Avatar</h1>
      <p class="text-lg text-(--s-text-secondary)">
        An image element with a fallback for representing the user.
      </p>
    </header>

    <!-- Features -->
    <article>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-resize text-xl text-emerald-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Multiple Sizes</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Six preset sizes from xs to 2xl, plus custom pixel values for maximum flexibility.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-shape-outline text-xl text-blue-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Flexible Shapes</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Circle, square, or rounded shapes to match your design system requirements.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-account-alert text-xl text-purple-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Smart Fallback</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Automatic fallback with initials, icons, or custom content when image fails to load.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-circle text-xl text-green-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Status Indicator</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Show online, offline, busy, or away status with customizable position.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-account-group text-xl text-amber-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Avatar Groups</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Stack multiple avatars with configurable spacing and overlap effects.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-timer-sand text-xl text-cyan-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Delayed Fallback</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Optional delay before showing fallback to prevent flicker for slow-loading images.</p>
        </div>
      </div>
    </article>

    <!-- Basic Usage -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection 
        title="Avatar with Image and Fallback"
        description="The basic Avatar component with an image and fallback content."
        :code="basicUsageCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-center">
          <SAvatar>
            <SAvatarImage :src="users[0].src" :alt="users[0].name" />
            <SAvatarFallback>{{ users[0].initials }}</SAvatarFallback>
          </SAvatar>
          <SAvatar>
            <SAvatarImage :src="users[1].src" :alt="users[1].name" />
            <SAvatarFallback>{{ users[1].initials }}</SAvatarFallback>
          </SAvatar>
          <SAvatar>
            <SAvatarImage :src="users[2].src" :alt="users[2].name" />
            <SAvatarFallback>{{ users[2].initials }}</SAvatarFallback>
          </SAvatar>
        </div>
      </DemoSection>
    </section>

    <!-- Sizes -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Sizes</h2>
      <DemoSection 
        title="Avatar Sizes"
        description="Avatars come in six preset sizes or accept a custom pixel value."
        :code="sizesCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-4 items-end">
          <div class="flex flex-col items-center gap-2">
            <SAvatar size="xs">
              <SAvatarImage :src="users[0].src" />
              <SAvatarFallback>XS</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">xs</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SAvatar size="sm">
              <SAvatarImage :src="users[0].src" />
              <SAvatarFallback>SM</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">sm</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SAvatar size="md">
              <SAvatarImage :src="users[0].src" />
              <SAvatarFallback>MD</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">md</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SAvatar size="lg">
              <SAvatarImage :src="users[0].src" />
              <SAvatarFallback>LG</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">lg</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SAvatar size="xl">
              <SAvatarImage :src="users[0].src" />
              <SAvatarFallback>XL</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">xl</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SAvatar size="2xl">
              <SAvatarImage :src="users[0].src" />
              <SAvatarFallback>2XL</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">2xl</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SAvatar :size="80">
              <SAvatarImage :src="users[0].src" />
              <SAvatarFallback>80</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">80px</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Shapes -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Shapes</h2>
      <DemoSection 
        title="Avatar Shapes"
        description="Choose between circle, rounded, or square shapes."
        :code="shapesCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-6 items-center">
          <div class="flex flex-col items-center gap-2">
            <SAvatar shape="circle" size="lg">
              <SAvatarImage :src="users[0].src" />
              <SAvatarFallback>JD</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">circle</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SAvatar shape="rounded" size="lg">
              <SAvatarImage :src="users[1].src" />
              <SAvatarFallback>JS</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">rounded</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SAvatar shape="square" size="lg">
              <SAvatarImage :src="users[2].src" />
              <SAvatarFallback>MJ</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">square</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Fallback -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Fallback</h2>
      <DemoSection 
        title="Fallback Content"
        description="When the image fails to load or isn't provided, the fallback is displayed."
        :code="fallbackCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-6 items-center">
          <div class="flex flex-col items-center gap-2">
            <SAvatar size="lg">
              <SAvatarImage src="/broken-link.jpg" />
              <SAvatarFallback>CN</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">Initials</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SAvatar size="lg">
              <SAvatarFallback />
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">Icon (default)</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SAvatar size="lg">
              <SAvatarFallback>
                <span class="mdi mdi-account-group text-[1.2em]" />
              </SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">Custom icon</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SAvatar size="lg">
              <SAvatarFallback color="#fff" bgColor="#8b5cf6">AB</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">Custom colors</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Status -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Status Indicator</h2>
      <DemoSection 
        title="Online Status"
        description="Show user availability with status indicators."
        :code="statusCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-6 items-center">
          <div class="flex flex-col items-center gap-2">
            <SAvatar size="lg" status="online">
              <SAvatarImage :src="users[0].src" />
              <SAvatarFallback>JD</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">online</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SAvatar size="lg" status="away">
              <SAvatarImage :src="users[1].src" />
              <SAvatarFallback>JS</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">away</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SAvatar size="lg" status="busy">
              <SAvatarImage :src="users[2].src" />
              <SAvatarFallback>MJ</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">busy</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SAvatar size="lg" status="offline">
              <SAvatarImage :src="users[3].src" />
              <SAvatarFallback>SW</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">offline</span>
          </div>
        </div>
      </DemoSection>

      <!-- Status Positions -->
      <DemoSection 
        title="Status Positions"
        description="Position the status indicator at different corners."
        code="<SAvatar status='online' statusPosition='top-right'>...</SAvatar>"
        language="vue"
        class="mt-6"
      >
        <div class="flex flex-wrap gap-8 items-center">
          <div class="flex flex-col items-center gap-2">
            <SAvatar size="xl" status="online" statusPosition="top-right">
              <SAvatarImage :src="users[0].src" />
              <SAvatarFallback>JD</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">top-right</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SAvatar size="xl" status="online" statusPosition="top-left">
              <SAvatarImage :src="users[1].src" />
              <SAvatarFallback>JS</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">top-left</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SAvatar size="xl" status="online" statusPosition="bottom-right">
              <SAvatarImage :src="users[2].src" />
              <SAvatarFallback>MJ</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">bottom-right</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SAvatar size="xl" status="online" statusPosition="bottom-left">
              <SAvatarImage :src="users[3].src" />
              <SAvatarFallback>SW</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">bottom-left</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Bordered & Ring -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Bordered & Ring</h2>
      <DemoSection 
        title="Border Styles"
        description="Add borders or ring effects around avatars."
        :code="borderedCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-8 items-center">
          <div class="flex flex-col items-center gap-2">
            <SAvatar size="xl" bordered borderColor="var(--s-border)">
              <SAvatarImage :src="users[0].src" />
              <SAvatarFallback>JD</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">bordered</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SAvatar size="xl" bordered borderColor="var(--s-primary)">
              <SAvatarImage :src="users[1].src" />
              <SAvatarFallback>JS</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">primary border</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SAvatar size="xl" ring ringColor="var(--s-primary)">
              <SAvatarImage :src="users[2].src" />
              <SAvatarFallback>MJ</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">ring</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SAvatar size="xl" ring ringColor="#ec4899">
              <SAvatarImage :src="users[3].src" />
              <SAvatarFallback>SW</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">pink ring</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Avatar Group -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Avatar Group</h2>
      <DemoSection 
        title="Stacked Avatars"
        description="Display multiple avatars in an overlapping group."
        :code="groupCode"
        language="vue"
      >
        <div class="space-y-6">
          <div class="flex flex-col gap-2">
            <SAvatarGroup>
              <SAvatar v-for="(user, idx) in users" :key="idx">
                <SAvatarImage :src="user.src" :alt="user.name" />
                <SAvatarFallback>{{ user.initials }}</SAvatarFallback>
              </SAvatar>
            </SAvatarGroup>
            <span class="text-xs font-mono text-(--s-text-secondary)">Normal spacing</span>
          </div>
          
          <div class="flex flex-col gap-2">
            <SAvatarGroup spacing="tight">
              <SAvatar v-for="(user, idx) in users" :key="idx">
                <SAvatarImage :src="user.src" :alt="user.name" />
                <SAvatarFallback>{{ user.initials }}</SAvatarFallback>
              </SAvatar>
            </SAvatarGroup>
            <span class="text-xs font-mono text-(--s-text-secondary)">Tight spacing</span>
          </div>
          
          <div class="flex flex-col gap-2">
            <SAvatarGroup spacing="loose">
              <SAvatar v-for="(user, idx) in users" :key="idx" size="lg">
                <SAvatarImage :src="user.src" :alt="user.name" />
                <SAvatarFallback>{{ user.initials }}</SAvatarFallback>
              </SAvatar>
            </SAvatarGroup>
            <span class="text-xs font-mono text-(--s-text-secondary)">Loose spacing (large size)</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Fallback Delay -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Fallback Delay</h2>
      <DemoSection 
        title="Delayed Fallback"
        description="Show fallback only after a specified delay, preventing flicker for slow-loading images."
        :code="delayCode"
        language="vue"
      >
        <div class="flex flex-wrap gap-6 items-center">
          <div class="flex flex-col items-center gap-2">
            <SAvatar size="lg">
              <SAvatarImage src="https://slow-loading-image.test/avatar.jpg" />
              <SAvatarFallback :delayMs="0">Instant</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">No delay</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SAvatar size="lg">
              <SAvatarImage src="https://slow-loading-image.test/avatar2.jpg" />
              <SAvatarFallback :delayMs="600">Delayed</SAvatarFallback>
            </SAvatar>
            <span class="text-xs font-mono text-(--s-text-secondary)">600ms delay</span>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Interactive Demo -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Interactive Demo</h2>
      <DemoSection 
        title="Toggle Status"
        description="Click the button to cycle through status states."
        code="<SAvatar :status='currentStatus'>...</SAvatar>"
        language="vue"
      >
        <div class="flex items-center gap-6">
          <SAvatar size="xl" :status="currentStatus">
            <SAvatarImage :src="users[0].src" />
            <SAvatarFallback>JD</SAvatarFallback>
          </SAvatar>
          <button 
            @click="toggleStatus"
            class="px-4 py-2 text-sm bg-(--s-bg-tertiary) text-(--s-text-secondary) rounded-lg hover:bg-(--s-bg-secondary) hover:text-(--s-text-primary) transition-colors"
          >
            Toggle Status: {{ currentStatus }}
          </button>
        </div>
      </DemoSection>
    </section>

    <!-- Real-World Examples -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Real-World Examples</h2>
      <DemoSection 
        title="User Profile Card"
        description="A typical user profile display with avatar, status, and details."
        code="<SAvatar size='xl' :status='userStatus'>...</SAvatar>"
        language="vue"
      >
        <div class="p-6 rounded-xl bg-(--s-bg-primary) border border-(--s-border) max-w-xs">
          <div class="flex flex-col items-center text-center">
            <SAvatar size="2xl" status="online" ring ringColor="var(--s-primary)">
              <SAvatarImage :src="users[0].src" :alt="users[0].name" />
              <SAvatarFallback>{{ users[0].initials }}</SAvatarFallback>
            </SAvatar>
            <h3 class="mt-4 font-semibold text-(--s-text-primary)">{{ users[0].name }}</h3>
            <p class="text-sm text-(--s-text-secondary)">Software Engineer</p>
            <div class="flex gap-4 mt-4 text-sm text-(--s-text-tertiary)">
              <span><strong class="text-(--s-text-primary)">1.2K</strong> followers</span>
              <span><strong class="text-(--s-text-primary)">48</strong> projects</span>
            </div>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <SApiTable title="SAvatar Props" type="props" :props="avatarProps" />
      <SApiTable title="SAvatarImage Props" type="props" :props="avatarImageProps" />
      <SApiTable title="SAvatarFallback Props" type="props" :props="avatarFallbackProps" />
      <SApiTable title="SAvatarGroup Props" type="props" :props="avatarGroupProps" />
      <SApiTable title="SAvatarImage Events" type="events" :events="avatarImageEvents" />
      <SApiTable title="Slots" type="slots" :slots="avatarSlots">
        <div class="mt-4 p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <h4 class="text-sm font-semibold text-(--s-text-primary) mb-3">Example: Complete avatar with fallback</h4>
          <pre class="text-xs bg-(--s-bg-tertiary) p-3 rounded-lg overflow-x-auto"><code class="text-(--s-text-secondary)">&lt;SAvatar size="lg" status="online"&gt;
  &lt;SAvatarImage src="https://example.com/avatar.jpg" alt="User" /&gt;
  &lt;SAvatarFallback color="#fff" bgColor="#8b5cf6"&gt;JD&lt;/SAvatarFallback&gt;
&lt;/SAvatar&gt;</code></pre>
        </div>
      </SApiTable>
    </SApiSection>
  </div>
</template>
