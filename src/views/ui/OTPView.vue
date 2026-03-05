<script setup lang="ts">
import { ref } from 'vue'
import { SApiSection, SApiTable, SButton } from '../../index'
import type { ApiProp, ApiEvent, ApiSlot, ApiMethod } from '../../index'
import DemoSection from '../../components/DemoSection.vue'
import { SOTP, SOTPSlot, SOTPGroup, SOTPSeparator } from '../../components/ui/otp'

// Demo states
const basicOtp = ref('')
const numericOtp = ref('')
const alphanumericOtp = ref('')
const alphabeticOtp = ref('')

const outlinedOtp = ref('')
const filledOtp = ref('')
const underlinedOtp = ref('')
const ghostOtp = ref('')
const morphingOtp = ref('')

const smallOtp = ref('')
const mediumOtp = ref('')
const largeOtp = ref('')
const xlOtp = ref('')

const bounceOtp = ref('')
const shakeOtp = ref('')
const pulseOtp = ref('')
const flipOtp = ref('')
const morphOtp = ref('')
const glowOtp = ref('')
const waveOtp = ref('')

const popOtp = ref('')
const squeezeOtp = ref('')
const jellyOtp = ref('')
const rubberOtp = ref('')

const separatorOtp = ref('')
const maskedOtp = ref('')
const countdownOtp = ref('')
const customLengthOtp = ref('')

const celebrateOtp = ref('')
const checkOtp = ref('')
const rippleOtp = ref('')

const errorOtpRef = ref<InstanceType<typeof SOTP> | null>(null)
const errorOtp = ref('')

// Custom slots demos
const customPlaceholderOtp = ref('')
const customMaskOtp = ref('')
const customDigitOtp = ref('')

// Compound demo
const compoundOtp = ref('')
const compoundMixedOtp = ref('')

// Methods
const simulateError = () => {
  errorOtpRef.value?.triggerError('Invalid verification code')
}

const handleComplete = (value: string) => {
  console.log('OTP Complete:', value)
}

const handleResend = () => {
  console.log('Resend requested')
}

// Code snippets
const basicCode = `<SOTP
  v-model="otp"
  @complete="handleComplete"
>
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>

// Numeric mode (default)
<SOTP v-model="otp" mode="numeric" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>

// Alphanumeric (A-Z, 0-9)
<SOTP v-model="otp" mode="alphanumeric" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>

// Alphabetic only (A-Z)
<SOTP v-model="otp" mode="alphabetic" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>`

const variantsCode = `<!-- Outlined (default) -->
<SOTP v-model="otp" variant="outlined" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>

<!-- Filled -->
<SOTP v-model="otp" variant="filled" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>

<!-- Underlined -->
<SOTP v-model="otp" variant="underlined" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>

<!-- Ghost -->
<SOTP v-model="otp" variant="ghost" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>

<!-- Morphing (with glow effects) -->
<SOTP v-model="otp" variant="morphing" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>`

const sizesCode = `<SOTP v-model="otp" size="small" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>

<SOTP v-model="otp" size="medium" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>

<SOTP v-model="otp" size="large" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>

<SOTP v-model="otp" size="xl" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>`

const animationsCode = `<!-- Entry animations (visual prop cascaded from SOTP) -->
<SOTP v-model="otp" entry-animation="scale" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>

<!-- Input animations (on character entry) -->
<SOTP v-model="otp" input-animation="pop" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>

<SOTP v-model="otp" input-animation="squeeze" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>

<SOTP v-model="otp" input-animation="jelly" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>

<SOTP v-model="otp" input-animation="rubber" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>`

const successCode = `<!-- Different success animations -->
<SOTP v-model="otp" success-animation="celebrate" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>

<SOTP v-model="otp" success-animation="check" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>

<SOTP v-model="otp" success-animation="ripple" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>`

const featuresCode = `<!-- With separator (XXX-XXX format) -->
<SOTP v-model="otp" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot :index="0" />
    <SOTPSlot :index="1" />
    <SOTPSlot :index="2" />
  </SOTPGroup>
  <SOTPSeparator>-</SOTPSeparator>
  <SOTPGroup>
    <SOTPSlot :index="3" />
    <SOTPSlot :index="4" />
    <SOTPSlot :index="5" />
  </SOTPGroup>
</SOTP>

<!-- Masked (hidden digits) -->
<SOTP v-model="otp" masked :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>

<!-- With countdown timer -->
<SOTP
  v-model="otp"
  :countdown="60"
  @resend="handleResend"
  :auto-focus="false"
>
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>

<!-- Custom length (4 digits) -->
<SOTP v-model="otp" :maxlength="4" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 4" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>`

const compoundCode = `<!-- Simple: all slots share visual config from root -->
<SOTP v-model="otp" variant="filled" size="large" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
  </SOTPGroup>
</SOTP>

<!-- Grouped with separator -->
<SOTP v-model="otp" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot :index="0" />
    <SOTPSlot :index="1" />
    <SOTPSlot :index="2" />
  </SOTPGroup>
  <SOTPSeparator>-</SOTPSeparator>
  <SOTPGroup>
    <SOTPSlot :index="3" />
    <SOTPSlot :index="4" />
    <SOTPSlot :index="5" />
  </SOTPGroup>
</SOTP>

<!-- Per-slot overrides (mix variants) -->
<SOTP v-model="otp" variant="outlined" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot :index="0" variant="filled" />
    <SOTPSlot :index="1" />
    <SOTPSlot :index="2" />
    <SOTPSlot :index="3" />
    <SOTPSlot :index="4" />
    <SOTPSlot :index="5" variant="filled" />
  </SOTPGroup>
</SOTP>`

const customSlotsCode = `<!-- Custom placeholder (empty state) — slot is on SOTPSlot -->
<SOTP v-model="otp" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1">
      <template #placeholder="{ isFocused }">
        <span
          class="mdi"
          :class="isFocused ? 'mdi-circle-outline' : 'mdi-minus'"
        />
      </template>
    </SOTPSlot>
  </SOTPGroup>
</SOTP>

<!-- Custom mask (hidden input) — slot is on SOTPSlot -->
<SOTP v-model="otp" masked :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1">
      <template #mask>
        <span class="mdi mdi-asterisk" />
      </template>
    </SOTPSlot>
  </SOTPGroup>
</SOTP>

<!-- Custom digit rendering — slot is on SOTPSlot -->
<SOTP v-model="otp" :auto-focus="false">
  <SOTPGroup>
    <SOTPSlot v-for="i in 6" :key="i" :index="i - 1">
      <template #digit="{ value }">
        <span class="font-mono italic">{{ value }}</span>
      </template>
    </SOTPSlot>
  </SOTPGroup>
</SOTP>`

// API Reference
const otpProps: ApiProp[] = [
  { name: 'modelValue', type: 'string', default: "''", description: 'The OTP value (v-model)', category: 'Core' },
  { name: 'maxlength', type: 'number', default: '6', description: 'Number of OTP digits (loop count for SOTPSlot must match)', category: 'Core' },
  { name: 'mode', type: "'numeric' | 'alphanumeric' | 'alphabetic' | 'any'", default: "'numeric'", description: 'Character type allowed', category: 'Core' },
  { name: 'variant', type: "'outlined' | 'filled' | 'underlined' | 'ghost' | 'morphing'", default: "'outlined'", description: 'Cascading default visual style for SOTPSlot children', category: 'Appearance' },
  { name: 'size', type: "'small' | 'medium' | 'large' | 'xl'", default: "'medium'", description: 'Cascading default size for SOTPSlot children', category: 'Appearance' },
  { name: 'color', type: 'string', default: 'var(--s-primary)', description: 'Cascading default color for focus/active states', category: 'Appearance' },
  { name: 'rounded', type: "'none' | 'sm' | 'md' | 'lg' | 'full'", default: "'md'", description: 'Cascading default border radius for SOTPSlot children', category: 'Appearance' },
  { name: 'gap', type: "'tight' | 'normal' | 'wide'", default: "'normal'", description: 'Spacing between boxes in the root container', category: 'Appearance' },
  { name: 'animation', type: "'none' | 'bounce' | 'shake' | 'pulse' | 'flip' | 'morph' | 'glow' | 'wave'", default: "'bounce'", description: 'Cascading default general animation style', category: 'Animation' },
  { name: 'entryAnimation', type: "'none' | 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'rotate' | 'blur'", default: "'scale'", description: 'Cascading default entry animation', category: 'Animation' },
  { name: 'inputAnimation', type: "'none' | 'pop' | 'squeeze' | 'jelly' | 'rubber'", default: "'pop'", description: 'Cascading default input animation', category: 'Animation' },
  { name: 'successAnimation', type: "'none' | 'celebrate' | 'check' | 'ripple'", default: "'celebrate'", description: 'Cascading default success animation', category: 'Animation' },
  { name: 'errorAnimation', type: "'none' | 'shake' | 'wobble' | 'flash'", default: "'shake'", description: 'Cascading default error animation', category: 'Animation' },
  { name: 'morphText', type: 'boolean', default: 'true', description: 'Cascading default for text morphing animation', category: 'Animation' },
  { name: 'morphDuration', type: 'number', default: '150', description: 'Cascading default morph animation duration (ms)', category: 'Animation' },
  { name: 'showPlaceholder', type: 'boolean', default: 'true', description: 'Cascading default for showing placeholder character', category: 'Content' },
  { name: 'placeholderChar', type: 'string', default: "'○'", description: 'Cascading default placeholder character', category: 'Content' },
  { name: 'maskChar', type: 'string', default: "'●'", description: 'Cascading default mask character', category: 'Content' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the input', category: 'State' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Make input read-only', category: 'State' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading state', category: 'State' },
  { name: 'error', type: 'string | boolean', default: '—', description: 'Error state/message', category: 'State' },
  { name: 'success', type: 'string | boolean', default: '—', description: 'Success state/message', category: 'State' },
  { name: 'autoFocus', type: 'boolean', default: 'true', description: 'Auto focus on mount', category: 'Behavior' },
  { name: 'autoSubmit', type: 'boolean', default: 'true', description: 'Auto emit complete when filled', category: 'Behavior' },
  { name: 'masked', type: 'boolean', default: 'false', description: 'Hide entered characters', category: 'Behavior' },
  { name: 'clearOnError', type: 'boolean', default: 'false', description: 'Clear input on error', category: 'Behavior' },
  { name: 'allowPaste', type: 'boolean', default: 'true', description: 'Allow paste from clipboard', category: 'Behavior' },
  { name: 'label', type: 'string', default: '—', description: 'Label text above input', category: 'Content' },
  { name: 'hint', type: 'string', default: '—', description: 'Hint text below input', category: 'Content' },
  { name: 'errorMessage', type: 'string', default: '—', description: 'Custom error message', category: 'Content' },
  { name: 'successMessage', type: 'string', default: '—', description: 'Custom success message', category: 'Content' },
  { name: 'countdown', type: 'number', default: '0', description: 'Countdown seconds for resend', category: 'Countdown' },
  { name: 'resendText', type: 'string', default: "'Resend code'", description: 'Text for resend button', category: 'Countdown' }
]

const slotProps: ApiProp[] = [
  { name: 'index', type: 'number', default: '—', description: 'Zero-based digit index (required)', category: 'Core' },
  { name: 'variant', type: "'outlined' | 'filled' | 'underlined' | 'ghost' | 'morphing'", default: 'inherited', description: 'Per-slot variant override (falls back to SOTP root)', category: 'Appearance' },
  { name: 'size', type: "'small' | 'medium' | 'large' | 'xl'", default: 'inherited', description: 'Per-slot size override', category: 'Appearance' },
  { name: 'color', type: 'string', default: 'inherited', description: 'Per-slot color override', category: 'Appearance' },
  { name: 'rounded', type: "'none' | 'sm' | 'md' | 'lg' | 'full'", default: 'inherited', description: 'Per-slot border radius override', category: 'Appearance' },
  { name: 'animation', type: "'none' | 'bounce' | 'shake' | 'pulse' | 'flip' | 'morph' | 'glow' | 'wave'", default: 'inherited', description: 'Per-slot general animation override', category: 'Animation' },
  { name: 'entryAnimation', type: "'none' | 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'rotate' | 'blur'", default: 'inherited', description: 'Per-slot entry animation override', category: 'Animation' },
  { name: 'inputAnimation', type: "'none' | 'pop' | 'squeeze' | 'jelly' | 'rubber'", default: 'inherited', description: 'Per-slot input animation override', category: 'Animation' },
  { name: 'successAnimation', type: "'none' | 'celebrate' | 'check' | 'ripple'", default: 'inherited', description: 'Per-slot success animation override', category: 'Animation' },
  { name: 'errorAnimation', type: "'none' | 'shake' | 'wobble' | 'flash'", default: 'inherited', description: 'Per-slot error animation override', category: 'Animation' },
  { name: 'morphText', type: 'boolean', default: 'inherited', description: 'Per-slot morph text override', category: 'Animation' },
  { name: 'morphDuration', type: 'number', default: 'inherited', description: 'Per-slot morph duration override', category: 'Animation' },
  { name: 'showPlaceholder', type: 'boolean', default: 'inherited', description: 'Per-slot show placeholder override', category: 'Content' },
  { name: 'placeholderChar', type: 'string', default: 'inherited', description: 'Per-slot placeholder char override', category: 'Content' },
  { name: 'maskChar', type: 'string', default: 'inherited', description: 'Per-slot mask char override', category: 'Content' }
]

const groupProps: ApiProp[] = [
  { name: 'gap', type: "'tight' | 'normal' | 'wide'", default: "'normal'", description: 'Spacing between SOTPSlot children within this group', category: 'Appearance' }
]

const otpEvents: ApiEvent[] = [
  { name: '@update:modelValue', description: 'Emitted when OTP value changes' },
  { name: '@complete', description: 'Emitted when all digits are filled' },
  { name: '@change', description: 'Emitted on any value change' },
  { name: '@input', description: 'Emitted when a single digit is entered (index, value)' },
  { name: '@focus', description: 'Emitted when a digit box is focused (index)' },
  { name: '@blur', description: 'Emitted when a digit box loses focus (index)' },
  { name: '@paste', description: 'Emitted when OTP is pasted' },
  { name: '@resend', description: 'Emitted when resend is clicked' },
  { name: '@error', description: 'Emitted when error is triggered' },
  { name: '@success', description: 'Emitted on successful completion' }
]

const otpRootSlots: ApiSlot[] = [
  { name: 'default', description: 'Compound component children (SOTPGroup, SOTPSlot, SOTPSeparator)' },
  { name: 'resend', description: 'Custom resend button content' }
]

const slotSlots: ApiSlot[] = [
  { name: 'placeholder', description: 'Custom content for empty/unfilled boxes. Receives: { index, isFocused, size }' },
  { name: 'mask', description: 'Custom content for masked/hidden input. Receives: { index, value, size }' },
  { name: 'digit', description: 'Custom content for displaying entered digits. Receives: { index, value, size }' }
]

const groupSlots: ApiSlot[] = [
  { name: 'default', description: 'SOTPSlot children to group together' }
]

const separatorSlots: ApiSlot[] = [
  { name: 'default', description: 'Separator content (defaults to "-")' }
]

const otpMethods: ApiMethod[] = [
  { name: 'clear()', description: 'Clear all OTP digits' },
  { name: 'focus()', description: 'Focus the first input' },
  { name: 'focusInput(index)', description: 'Focus a specific input by index' },
  { name: 'blur()', description: 'Blur the active input' },
  { name: 'triggerError(message?)', description: 'Trigger error state with animation' },
  { name: 'getValue()', description: 'Get current OTP value' },
  { name: 'isComplete()', description: 'Check if OTP is complete' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">OTP Input</h1>
      <p class="text-lg text-(--s-text-secondary)">
        Advanced one-time password input built with compound components. Compose SOTP, SOTPSlot, SOTPGroup, and SOTPSeparator for full layout and visual control.
      </p>
    </header>

    <!-- Features -->
    <article>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-puzzle text-xl text-violet-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Compound Components</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Compose SOTP, SOTPSlot, SOTPGroup, and SOTPSeparator for flexible layouts.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-animation text-xl text-violet-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Rich Animations</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Multiple entry, input, success, and error animations to choose from.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-text-box-edit text-xl text-blue-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Text Morphing</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Smooth character transitions with scale and rotation effects.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-format-letter-case text-xl text-emerald-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Multiple Modes</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Numeric, alphanumeric, alphabetic, or any character support.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-palette text-xl text-pink-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">5 Variants</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Outlined, filled, underlined, ghost, and morphing styles.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-content-paste text-xl text-amber-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Clipboard Support</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Paste OTP codes directly from clipboard with validation.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-timer text-xl text-cyan-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Countdown Timer</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Built-in resend countdown with customizable duration.</p>
        </div>
      </div>
    </article>

    <!-- Compound Components -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Compound Components</h2>
      <DemoSection
        title="Composable Pattern"
        description="Use SOTPGroup to group slots, SOTPSeparator for visual dividers, and per-slot visual overrides. Visual props set on SOTP cascade down to SOTPSlot children as defaults."
        :code="compoundCode"
        language="vue"
      >
        <div class="space-y-8">
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Grouped with separator (XXX-XXX)</p>
            <SOTP v-model="compoundOtp" :auto-focus="false">
              <SOTPGroup>
                <SOTPSlot :index="0" />
                <SOTPSlot :index="1" />
                <SOTPSlot :index="2" />
              </SOTPGroup>
              <SOTPSeparator>-</SOTPSeparator>
              <SOTPGroup>
                <SOTPSlot :index="3" />
                <SOTPSlot :index="4" />
                <SOTPSlot :index="5" />
              </SOTPGroup>
            </SOTP>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Per-slot variant overrides (first and last are filled)</p>
            <SOTP v-model="compoundMixedOtp" variant="outlined" :auto-focus="false">
              <SOTPGroup>
                <SOTPSlot :index="0" variant="filled" />
                <SOTPSlot :index="1" />
                <SOTPSlot :index="2" />
                <SOTPSlot :index="3" />
                <SOTPSlot :index="4" />
                <SOTPSlot :index="5" variant="filled" />
              </SOTPGroup>
            </SOTP>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Basic Usage -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection
        title="Input Modes"
        description="Different character modes for various OTP requirements."
        :code="basicCode"
        language="vue"
      >
        <div class="space-y-8">
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Numeric (default)</p>
            <SOTP
              v-model="numericOtp"
              mode="numeric"
              label="Enter verification code"
              hint="Enter the 6-digit code sent to your phone"
              :auto-focus="false"
              @complete="handleComplete"
            >
              <SOTPGroup>
                <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
              </SOTPGroup>
            </SOTP>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Alphanumeric (A-Z, 0-9)</p>
            <SOTP
              v-model="alphanumericOtp"
              mode="alphanumeric"
              label="Enter license key"
              :auto-focus="false"
            >
              <SOTPGroup>
                <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
              </SOTPGroup>
            </SOTP>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Alphabetic only (A-Z)</p>
            <SOTP
              v-model="alphabeticOtp"
              mode="alphabetic"
              label="Enter code"
              :auto-focus="false"
            >
              <SOTPGroup>
                <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
              </SOTPGroup>
            </SOTP>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Variants -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Variants</h2>
      <DemoSection
        title="Visual Styles"
        description="Choose from five visual styles to match your design. Visual props cascade from SOTP to all SOTPSlot children."
        :code="variantsCode"
        language="vue"
      >
        <div class="space-y-8">
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Outlined (default)</p>
            <SOTP v-model="outlinedOtp" variant="outlined" :auto-focus="false">
              <SOTPGroup>
                <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
              </SOTPGroup>
            </SOTP>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Filled</p>
            <SOTP v-model="filledOtp" variant="filled" :auto-focus="false">
              <SOTPGroup>
                <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
              </SOTPGroup>
            </SOTP>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Underlined</p>
            <SOTP v-model="underlinedOtp" variant="underlined" :auto-focus="false">
              <SOTPGroup>
                <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
              </SOTPGroup>
            </SOTP>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Ghost</p>
            <SOTP v-model="ghostOtp" variant="ghost" :auto-focus="false">
              <SOTPGroup>
                <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
              </SOTPGroup>
            </SOTP>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Morphing (with glow effects)</p>
            <SOTP v-model="morphingOtp" variant="morphing" :auto-focus="false">
              <SOTPGroup>
                <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
              </SOTPGroup>
            </SOTP>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Sizes -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Sizes</h2>
      <DemoSection
        title="Size Options"
        description="Four size presets for different contexts."
        :code="sizesCode"
        language="vue"
      >
        <div class="space-y-8">
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Small</p>
            <SOTP v-model="smallOtp" size="small" :auto-focus="false">
              <SOTPGroup>
                <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
              </SOTPGroup>
            </SOTP>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Medium (default)</p>
            <SOTP v-model="mediumOtp" size="medium" :auto-focus="false">
              <SOTPGroup>
                <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
              </SOTPGroup>
            </SOTP>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Large</p>
            <SOTP v-model="largeOtp" size="large" :auto-focus="false">
              <SOTPGroup>
                <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
              </SOTPGroup>
            </SOTP>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">XL</p>
            <SOTP v-model="xlOtp" size="xl" :auto-focus="false">
              <SOTPGroup>
                <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
              </SOTPGroup>
            </SOTP>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Input Animations -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Input Animations</h2>
      <DemoSection
        title="Character Entry Animations"
        description="Different animations when typing characters. Try typing to see the effects!"
        :code="animationsCode"
        language="vue"
      >
        <div class="space-y-8">
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Pop (default)</p>
            <SOTP v-model="popOtp" input-animation="pop" :auto-focus="false">
              <SOTPGroup>
                <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
              </SOTPGroup>
            </SOTP>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Squeeze</p>
            <SOTP v-model="squeezeOtp" input-animation="squeeze" :auto-focus="false">
              <SOTPGroup>
                <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
              </SOTPGroup>
            </SOTP>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Jelly</p>
            <SOTP v-model="jellyOtp" input-animation="jelly" :auto-focus="false">
              <SOTPGroup>
                <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
              </SOTPGroup>
            </SOTP>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Rubber</p>
            <SOTP v-model="rubberOtp" input-animation="rubber" :auto-focus="false">
              <SOTPGroup>
                <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
              </SOTPGroup>
            </SOTP>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Success Animations -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Success Animations</h2>
      <DemoSection
        title="Completion Celebrations"
        description="Beautiful animations when OTP is successfully completed. Type a complete code to see the effect!"
        :code="successCode"
        language="vue"
      >
        <div class="space-y-8">
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Celebrate (default) - boxes do a happy dance!</p>
            <SOTP v-model="celebrateOtp" success-animation="celebrate" :auto-focus="false">
              <SOTPGroup>
                <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
              </SOTPGroup>
            </SOTP>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Check - checkmark overlay</p>
            <SOTP v-model="checkOtp" success-animation="check" :auto-focus="false">
              <SOTPGroup>
                <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
              </SOTPGroup>
            </SOTP>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Ripple - expanding ring effect</p>
            <SOTP v-model="rippleOtp" success-animation="ripple" :auto-focus="false">
              <SOTPGroup>
                <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
              </SOTPGroup>
            </SOTP>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Error Animation -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Error State</h2>
      <DemoSection
        title="Error Animation"
        description="Trigger error states programmatically with shake animations."
        :code="`<SOTP ref='otpRef' v-model='otp' error-animation='shake' :auto-focus='false'>
  <SOTPGroup>
    <SOTPSlot v-for='i in 6' :key='i' :index='i - 1' />
  </SOTPGroup>
</SOTP>

// Trigger error
otpRef.value.triggerError('Invalid code')`"
        language="vue"
      >
        <div class="space-y-4">
          <SOTP
            ref="errorOtpRef"
            v-model="errorOtp"
            error-animation="shake"
            :auto-focus="false"
          >
            <SOTPGroup>
              <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
            </SOTPGroup>
          </SOTP>
          <div class="flex justify-center">
            <SButton @click="simulateError" variant="outlined" color="#ef4444">
              <span class="mdi mdi-alert-circle mr-2"></span>
              Trigger Error
            </SButton>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Additional Features -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Additional Features</h2>
      <DemoSection
        title="Extra Functionality"
        description="Separators via SOTPSeparator, masking, countdown timers, and custom lengths."
        :code="featuresCode"
        language="vue"
      >
        <div class="space-y-8">
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">With separator (XXX-XXX format)</p>
            <SOTP
              v-model="separatorOtp"
              :auto-focus="false"
            >
              <SOTPGroup>
                <SOTPSlot :index="0" />
                <SOTPSlot :index="1" />
                <SOTPSlot :index="2" />
              </SOTPGroup>
              <SOTPSeparator>-</SOTPSeparator>
              <SOTPGroup>
                <SOTPSlot :index="3" />
                <SOTPSlot :index="4" />
                <SOTPSlot :index="5" />
              </SOTPGroup>
            </SOTP>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Masked (hidden digits)</p>
            <SOTP
              v-model="maskedOtp"
              masked
              hint="Your input is hidden for security"
              :auto-focus="false"
            >
              <SOTPGroup>
                <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
              </SOTPGroup>
            </SOTP>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">With countdown timer</p>
            <SOTP
              v-model="countdownOtp"
              :countdown="30"
              @resend="handleResend"
              :auto-focus="false"
            >
              <SOTPGroup>
                <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
              </SOTPGroup>
            </SOTP>
          </div>
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Custom length (4 digits)</p>
            <SOTP
              v-model="customLengthOtp"
              :maxlength="4"
              :auto-focus="false"
            >
              <SOTPGroup>
                <SOTPSlot v-for="i in 4" :key="i" :index="i - 1" />
              </SOTPGroup>
            </SOTP>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Custom Slots -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Custom Slots</h2>
      <DemoSection
        title="Customizable Templates"
        description="Use slots on SOTPSlot to completely customize the appearance of placeholder, mask, and digit displays."
        :code="customSlotsCode"
        language="vue"
      >
        <div class="space-y-8">
          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Custom placeholder (dashes instead of circles)</p>
            <SOTP v-model="customPlaceholderOtp" :auto-focus="false">
              <SOTPGroup>
                <SOTPSlot v-for="i in 6" :key="i" :index="i - 1">
                  <template #placeholder="{ isFocused }">
                    <span
                      class="mdi text-2xl transition-all duration-200"
                      :class="isFocused ? 'mdi-circle-outline scale-110' : 'mdi-minus'"
                    />
                  </template>
                </SOTPSlot>
              </SOTPGroup>
            </SOTP>
          </div>

          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Custom mask (asterisks instead of dots)</p>
            <SOTP v-model="customMaskOtp" masked :auto-focus="false">
              <SOTPGroup>
                <SOTPSlot v-for="i in 6" :key="i" :index="i - 1">
                  <template #mask>
                    <span class="mdi mdi-asterisk text-lg text-(--s-primary)" />
                  </template>
                </SOTPSlot>
              </SOTPGroup>
            </SOTP>
          </div>

          <div>
            <p class="text-sm text-(--s-text-secondary) mb-3">Custom digit styling (monospace italic)</p>
            <SOTP v-model="customDigitOtp" :auto-focus="false">
              <SOTPGroup>
                <SOTPSlot v-for="i in 6" :key="i" :index="i - 1">
                  <template #digit="{ value }">
                    <span class="font-mono italic text-cyan-500 tracking-wider">{{ value }}</span>
                  </template>
                </SOTPSlot>
              </SOTPGroup>
            </SOTP>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Real-world Example -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Real-world Example</h2>
      <DemoSection
        title="Phone Verification"
        description="A complete phone verification flow using compound components."
        :code="`<SOTP
  v-model='otp'
  variant='morphing'
  size='large'
  label='Verify your phone'
  hint='A 6-digit code was sent to +1 *** *** 1234'
  success-animation='celebrate'
  :countdown='60'
  @complete='verifyCode'
  @resend='resendCode'
>
  <SOTPGroup>
    <SOTPSlot v-for='i in 6' :key='i' :index='i - 1' />
  </SOTPGroup>
</SOTP>`"
        language="vue"
      >
        <div class="max-w-md mx-auto bg-(--s-bg-primary) p-8 rounded-2xl border border-(--s-border) shadow-xl">
          <div class="text-center mb-6">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-(--s-primary)/10 flex items-center justify-center">
              <span class="mdi mdi-cellphone text-3xl text-(--s-primary)"></span>
            </div>
            <h3 class="text-xl font-bold text-(--s-text-primary)">Verify your phone</h3>
            <p class="text-sm text-(--s-text-secondary) mt-1">
              We sent a verification code to<br/>
              <span class="font-medium">+1 *** *** 1234</span>
            </p>
          </div>

          <SOTP
            v-model="basicOtp"
            variant="morphing"
            size="large"
            success-animation="celebrate"
            :countdown="60"
            @complete="handleComplete"
            @resend="handleResend"
          >
            <SOTPGroup>
              <SOTPSlot v-for="i in 6" :key="i" :index="i - 1" />
            </SOTPGroup>
          </SOTP>

          <div class="mt-6">
            <SButton block :disabled="basicOtp.length < 6">
              Verify Code
            </SButton>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>

      <SApiSection title="SOTP">
        <SApiTable title="Props" :props="otpProps" type="props" />
        <SApiTable title="Events" :events="otpEvents" type="events" />
        <SApiTable title="Slots" :slots="otpRootSlots" type="slots" />
        <SApiTable title="Methods" :methods="otpMethods" type="methods" />
      </SApiSection>

      <SApiSection title="SOTPSlot">
        <SApiTable title="Props" :props="slotProps" type="props" />
        <SApiTable title="Slots" :slots="slotSlots" type="slots" />
      </SApiSection>

      <SApiSection title="SOTPGroup">
        <SApiTable title="Props" :props="groupProps" type="props" />
        <SApiTable title="Slots" :slots="groupSlots" type="slots" />
      </SApiSection>

      <SApiSection title="SOTPSeparator">
        <SApiTable title="Slots" :slots="separatorSlots" type="slots" />
      </SApiSection>
    </section>

    <!-- Accessibility -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Accessibility</h2>
      <div class="bg-(--s-bg-secondary)/50 border border-(--s-border) rounded-xl p-6">
        <ul class="space-y-3 text-(--s-text-secondary)">
          <li class="flex items-start gap-3">
            <span class="mdi mdi-check-circle text-emerald-500 mt-0.5"></span>
            <span><strong class="text-(--s-text-primary)">Keyboard navigation:</strong> Arrow keys to move between boxes, Backspace to delete, Home/End for first/last</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="mdi mdi-check-circle text-emerald-500 mt-0.5"></span>
            <span><strong class="text-(--s-text-primary)">ARIA labels:</strong> Each input has proper aria-label for screen readers</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="mdi mdi-check-circle text-emerald-500 mt-0.5"></span>
            <span><strong class="text-(--s-text-primary)">Focus management:</strong> Auto-focus and visual focus indicators</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="mdi mdi-check-circle text-emerald-500 mt-0.5"></span>
            <span><strong class="text-(--s-text-primary)">Autocomplete:</strong> <code class="bg-(--s-bg-tertiary) px-1 rounded">autocomplete="one-time-code"</code> for browser autofill</span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
