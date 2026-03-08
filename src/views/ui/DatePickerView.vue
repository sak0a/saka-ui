<script setup lang="ts">
import { ref } from 'vue'
import { SDatePicker, SApiSection, SApiTable, SApiKeyboard } from '../../index'
import type { ApiProp, ApiEvent, KeyboardShortcut } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// Basic usage
const basicDate = ref<Date | null>(null)

// Range selection
const rangeDate = ref<[Date, Date] | null>(null)

// Multiple selection
const multipleDates = ref<Date[]>([])

// Variants
const variantDate = ref<Date | null>(null)

// Sizes
const sizeDate = ref<Date | null>(null)

// Colors
const colorDate = ref<Date | null>(null)

// Constraints
const constrainedDate = ref<Date | null>(null)
const minDate = new Date()
minDate.setDate(minDate.getDate() - 7)
const maxDate = new Date()
maxDate.setDate(maxDate.getDate() + 30)

// Disabled dates
const disabledDatesValue = ref<Date | null>(null)
const holidayDates = [
  new Date(2026, 0, 1),  // New Year
  new Date(2026, 0, 6),  // Epiphany
  new Date(2026, 11, 25), // Christmas
  new Date(2026, 11, 26)  // Boxing Day
]

// With time
const dateTime = ref<Date | null>(null)
const dateTime12h = ref<Date | null>(null)

// Week config
const weekDate = ref<Date | null>(null)

// States
const loadingDate = ref<Date | null>(null)
const disabledDate = ref<Date | null>(null)

// Code snippets
const basicCode = `<script setup>
import { ref } from 'vue'
const date = ref(null)
<\/script>

<template>
  <SDatePicker v-model="date" label="Select Date" />
</template>`

const rangeCode = `<script setup>
const range = ref(null)
<\/script>

<template>
  <SDatePicker 
    v-model="range" 
    mode="range" 
    label="Date Range"
    placeholder="Select date range..."
  />
</template>`

const multipleCode = `<script setup>
const dates = ref([])
<\/script>

<template>
  <SDatePicker 
    v-model="dates" 
    mode="multiple" 
    label="Multiple Dates"
    :close-on-select="false"
  />
</template>`

const variantsCode = `<SDatePicker v-model="variantDate" variant="outlined" label="Outlined" />
<SDatePicker v-model="variantDate" variant="filled" label="Filled" />
<SDatePicker v-model="variantDate" variant="ghost" label="Ghost" />`

const sizesCode = `<SDatePicker v-model="sizeDate" size="small" label="Small" />
<SDatePicker v-model="sizeDate" size="medium" label="Medium" />
<SDatePicker v-model="sizeDate" size="large" label="Large" />`

const colorsCode = `<SDatePicker v-model="colorDate" color="#f43f5e" label="Rose" />
<SDatePicker v-model="colorDate" color="#8b5cf6" label="Violet" />
<SDatePicker v-model="colorDate" color="#10b981" label="Emerald" />`

const constraintsCode = `<script setup>
const minDate = new Date()
minDate.setDate(minDate.getDate() - 7)
const maxDate = new Date()
maxDate.setDate(maxDate.getDate() + 30)
<\/script>

<template>
  <SDatePicker 
    v-model="date" 
    :min-date="minDate"
    :max-date="maxDate"
    label="Constrained Range"
  />
</template>`

const disabledDatesCode = `<script setup>
const holidays = [
  new Date(2026, 0, 1),
  new Date(2026, 11, 25)
]
<\/script>

<template>
  <SDatePicker 
    v-model="date" 
    :disabled-dates="holidays"
    :disabled-weekdays="[0, 6]"
    label="No Weekends or Holidays"
  />
</template>`

const timeCode = `<SDatePicker
  v-model="dateTime"
  :enable-time="true"
  time-format="24h"
  label="24h Format"
/>
<SDatePicker
  v-model="dateTime12h"
  :enable-time="true"
  time-format="12h"
  label="12h Format (AM/PM)"
/>`

const weekCode = `<SDatePicker v-model="weekDate" :first-day-of-week="0" label="Week starts Sunday" />
<SDatePicker v-model="weekDate" :first-day-of-week="1" label="Week starts Monday" />`

const statesCode = `<SDatePicker v-model="disabledDate" disabled label="Disabled" />
<SDatePicker v-model="loadingDate" loading label="Loading" />
<SDatePicker v-model="disabledDate" readonly label="Read Only" />`

const bookingCode = `<SDatePicker
  v-model="rangeDate"
  mode="range"
  label="Check-in / Check-out"
  placeholder="Select dates..."
  color="#10b981"
/>`

// API Reference data
const datePickerProps: ApiProp[] = [
  { name: 'modelValue', type: 'Date | Date[] | [Date, Date] | null', default: 'null', description: 'Selected date(s)', category: 'Core' },
  { name: 'mode', type: "'single' | 'range' | 'multiple'", default: "'single'", description: 'Selection mode', category: 'Core' },
  { name: 'variant', type: "'outlined' | 'filled' | 'ghost'", default: "'outlined'", description: 'Visual variant', category: 'Display' },
  { name: 'size', type: "'small' | 'medium' | 'large'", default: "'medium'", description: 'Size variant', category: 'Display' },
  { name: 'color', type: 'string', default: "'var(--s-primary)'", description: 'Accent color', category: 'Display' },
  { name: 'minDate', type: 'Date', default: 'undefined', description: 'Minimum selectable date', category: 'Constraints' },
  { name: 'maxDate', type: 'Date', default: 'undefined', description: 'Maximum selectable date', category: 'Constraints' },
  { name: 'disabledDates', type: 'Date[] | (date: Date) => boolean', default: 'undefined', description: 'Dates to disable', category: 'Constraints' },
  { name: 'disabledWeekdays', type: 'number[]', default: '[]', description: 'Weekdays to disable (0=Sun, 6=Sat)', category: 'Constraints' },
  { name: 'enableTime', type: 'boolean', default: 'false', description: 'Show time picker', category: 'Time Picker' },
  { name: 'timeFormat', type: "'12h' | '24h'", default: "'24h'", description: 'Time format', category: 'Time Picker' },
  { name: 'firstDayOfWeek', type: '0-6', default: '0', description: 'First day of week (0=Sunday)', category: 'Time Picker' },
  { name: 'clearable', type: 'boolean', default: 'true', description: 'Show clear button', category: 'Behavior' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the picker', category: 'Behavior' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading state', category: 'Behavior' },
  { name: 'label', type: 'string', default: 'undefined', description: 'Input label', category: 'Labels' },
]

const datePickerEvents: ApiEvent[] = [
  { name: 'update:modelValue', payload: 'Date | Date[] | [Date, Date] | null', description: 'Emitted when selection changes' },
  { name: 'open', payload: '-', description: 'Calendar opened' },
  { name: 'close', payload: '-', description: 'Calendar closed' },
  { name: 'clear', payload: '-', description: 'Selection cleared' },
  { name: 'monthChange', payload: '(month: number, year: number)', description: 'View month changed' },
]

const datePickerKeyboard: KeyboardShortcut[] = [
  { keys: ['Enter', 'Space'], action: 'Open calendar' },
  { keys: 'Escape', action: 'Close calendar' },
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- @component SDatePicker -->
    <!-- @props modelValue, mode, variant, size, color, minDate, maxDate, disabledDates, disabledWeekdays, enableTime, timeFormat, firstDayOfWeek, clearable, disabled, loading, label -->
    <!-- @events update:modelValue, open, close, clear, monthChange -->
    <!-- @sections basic-usage, selection-modes, variants, sizes, colors, date-constraints, time-picker, week-configuration, states, real-world-examples, api-reference -->
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">Date Picker</h1>
      <p class="text-lg text-(--s-text-secondary) max-w-3xl">
        A powerful, customizable date picker with single, range, and multiple selection modes.
        Includes time picker integration, date constraints, and full keyboard navigation.
      </p>
    </header>

    <!-- Features -->
    <article id="features" class="space-y-4">
      <h2 class="text-2xl font-bold text-(--s-text-primary)">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-emerald-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-calendar-multiple text-2xl text-emerald-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Multiple Selection Modes</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Single date, date range, or multiple dates selection with visual feedback.</p>
        </div>
        <div class="p-4 rounded-xl bg-blue-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-clock-outline text-2xl text-blue-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Time Picker Integration</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Optional time picker with 12h/24h format support and scroll wheel input.</p>
        </div>
        <div class="p-4 rounded-xl bg-rose-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-calendar-remove text-2xl text-rose-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Date Constraints</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Min/max dates, disabled weekdays, and custom disabled date functions.</p>
        </div>
        <div class="p-4 rounded-xl bg-violet-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-palette-outline text-2xl text-violet-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Variants & Themes</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Outlined, filled, and ghost variants with customizable accent colors.</p>
        </div>
        <div class="p-4 rounded-xl bg-amber-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-animation-outline text-2xl text-amber-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Smooth Animations</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Ripple effects on date selection and smooth dropdown transitions.</p>
        </div>
        <div class="p-4 rounded-xl bg-cyan-500/5 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-keyboard text-2xl text-cyan-400"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Keyboard Navigation</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Full keyboard support with Enter/Space to open and Escape to close.</p>
        </div>
      </div>
    </article>

    <!-- Basic Usage -->
    <section id="basic-usage">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection 
        title="Single Date Selection"
        description="Click to open the calendar and select a date."
        :code="basicCode"
        language="vue"
      >
        <div class="flex flex-col gap-4 max-w-xs">
          <SDatePicker v-model="basicDate" label="Select Date" />
          <p class="text-sm text-(--s-text-secondary)">
            Selected: <code class="font-mono text-emerald-400">{{ basicDate?.toLocaleDateString() ?? 'None' }}</code>
          </p>
        </div>
      </DemoSection>
    </section>

    <!-- Selection Modes -->
    <section id="selection-modes">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Selection Modes</h2>
      
      <div class="space-y-6">
        <DemoSection 
          title="Range Selection"
          description="Select a start and end date for date ranges."
          :code="rangeCode"
          language="vue"
        >
          <div class="flex flex-col gap-4 max-w-sm">
            <SDatePicker 
              v-model="rangeDate" 
              mode="range" 
              label="Date Range"
              placeholder="Select date range..."
            />
            <p class="text-sm text-(--s-text-secondary)">
              Range: 
              <code class="font-mono text-emerald-400">
                {{ rangeDate ? `${rangeDate[0]?.toLocaleDateString()} - ${rangeDate[1]?.toLocaleDateString()}` : 'None' }}
              </code>
            </p>
          </div>
        </DemoSection>

        <DemoSection 
          title="Multiple Selection"
          description="Select multiple individual dates."
          :code="multipleCode"
          language="vue"
        >
          <div class="flex flex-col gap-4 max-w-sm">
            <SDatePicker 
              v-model="multipleDates" 
              mode="multiple" 
              label="Multiple Dates"
              :close-on-select="false"
            />
            <p class="text-sm text-(--s-text-secondary)">
              Selected: <code class="font-mono text-emerald-400">{{ multipleDates.length }} dates</code>
            </p>
          </div>
        </DemoSection>
      </div>
    </section>

    <!-- Variants -->
    <section id="variants">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Variants</h2>
      <DemoSection 
        title="Visual Variants"
        description="Three distinct visual styles for different design contexts."
        :code="variantsCode"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SDatePicker v-model="variantDate" variant="outlined" label="Outlined" />
          <SDatePicker v-model="variantDate" variant="filled" label="Filled" />
          <SDatePicker v-model="variantDate" variant="ghost" label="Ghost" />
        </div>
      </DemoSection>
    </section>

    <!-- Sizes -->
    <section id="sizes">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Sizes</h2>
      <DemoSection 
        title="Size Options"
        description="Three size variants for different contexts."
        :code="sizesCode"
        language="vue"
      >
        <div class="flex flex-col gap-4 max-w-xs">
          <SDatePicker v-model="sizeDate" size="small" label="Small" />
          <SDatePicker v-model="sizeDate" size="medium" label="Medium" />
          <SDatePicker v-model="sizeDate" size="large" label="Large" />
        </div>
      </DemoSection>
    </section>

    <!-- Colors -->
    <section id="colors">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Colors</h2>
      <DemoSection 
        title="Custom Colors"
        description="Customize the accent color with any CSS color value."
        :code="colorsCode"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SDatePicker v-model="colorDate" color="#f43f5e" label="Rose" />
          <SDatePicker v-model="colorDate" color="#8b5cf6" label="Violet" />
          <SDatePicker v-model="colorDate" color="#10b981" label="Emerald" />
        </div>
      </DemoSection>
    </section>

    <!-- Constraints -->
    <section id="date-constraints">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Date Constraints</h2>
      
      <div class="space-y-6">
        <DemoSection 
          title="Min/Max Range"
          description="Restrict selection to a specific date range."
          :code="constraintsCode"
          language="vue"
        >
          <div class="flex flex-col gap-4 max-w-xs">
            <SDatePicker 
              v-model="constrainedDate"
              :min-date="minDate"
              :max-date="maxDate"
              label="Constrained Range"
            />
            <p class="text-xs text-(--s-text-tertiary)">
              Can select dates from 7 days ago to 30 days ahead.
            </p>
          </div>
        </DemoSection>

        <DemoSection 
          title="Disabled Dates"
          description="Disable specific dates or weekdays."
          :code="disabledDatesCode"
          language="vue"
        >
          <div class="flex flex-col gap-4 max-w-xs">
            <SDatePicker 
              v-model="disabledDatesValue"
              :disabled-dates="holidayDates"
              :disabled-weekdays="[0, 6]"
              label="No Weekends or Holidays"
            />
            <p class="text-xs text-(--s-text-tertiary)">
              Weekends and major holidays are disabled.
            </p>
          </div>
        </DemoSection>
      </div>
    </section>

    <!-- Time Picker -->
    <section id="time-picker">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Time Picker</h2>
      <DemoSection 
        title="Date & Time Selection"
        description="Enable time picker for combined date and time selection."
        :code="timeCode"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col gap-4">
            <SDatePicker 
              v-model="dateTime"
              :enable-time="true"
              time-format="24h"
              label="24h Format"
            />
            <p class="text-xs text-(--s-text-tertiary)">
              Selected: {{ dateTime?.toLocaleString() ?? 'None' }}
            </p>
          </div>
          <div class="flex flex-col gap-4">
            <SDatePicker 
              v-model="dateTime12h"
              :enable-time="true"
              time-format="12h"
              label="12h Format (AM/PM)"
            />
            <p class="text-xs text-(--s-text-tertiary)">
              Selected: {{ dateTime12h?.toLocaleString() ?? 'None' }}
            </p>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- Week Configuration -->
    <section id="week-configuration">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Week Configuration</h2>
      <DemoSection 
        title="First Day of Week"
        description="Configure which day the week starts on."
        :code="weekCode"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SDatePicker v-model="weekDate" :first-day-of-week="0" label="Week starts Sunday" />
          <SDatePicker v-model="weekDate" :first-day-of-week="1" label="Week starts Monday" />
        </div>
      </DemoSection>
    </section>

    <!-- States -->
    <section id="states">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">States</h2>
      <DemoSection 
        title="Disabled, Loading & Read Only"
        description="Various interactive states for the date picker."
        :code="statesCode"
        language="vue"
      >
        <div class="flex flex-col gap-4 max-w-xs">
          <SDatePicker v-model="disabledDate" disabled label="Disabled" />
          <SDatePicker v-model="loadingDate" loading label="Loading" />
          <SDatePicker v-model="disabledDate" readonly label="Read Only" />
        </div>
      </DemoSection>
    </section>

    <!-- Real-World Examples -->
    <section id="real-world-examples">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Real-World Examples</h2>
      <DemoSection 
        title="Booking Form"
        description="A typical travel or hotel booking date selection."
        :code="bookingCode"
        language="vue"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg">
          <SDatePicker
            v-model="rangeDate"
            mode="range"
            label="Check-in / Check-out"
            placeholder="Select dates..."
            color="#10b981"
          />
          <div class="flex flex-col justify-center">
            <p class="text-sm text-(--s-text-secondary)">
              <span v-if="rangeDate">
                {{ Math.ceil((rangeDate[1]?.getTime() - rangeDate[0]?.getTime()) / (1000 * 60 * 60 * 24)) || 0 }} nights
              </span>
              <span v-else>Select dates for your stay</span>
            </p>
          </div>
        </div>
      </DemoSection>
    </section>

    <!-- API Reference -->
    <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
    <SApiSection>
      <SApiTable title="Props" type="props" :props="datePickerProps" />
      <SApiTable title="Events" type="events" :events="datePickerEvents" />
      <SApiKeyboard title="Keyboard Shortcuts" :shortcuts="datePickerKeyboard" />
    </SApiSection>
  </div>
</template>

