<script setup lang="ts">
import { inject, computed, provide, type InjectionKey } from 'vue'
import type { FormState, FieldState } from '../../../composables/useForm'
import { FORM_CONTEXT_KEY } from './index'
import { cn } from '../../../lib/utils'

defineOptions({ inheritAttrs: false })

export interface Props {
  /** Field name matching the key in useFormValidation config */
  name: string
}

const props = defineProps<Props>()

// Get form context from parent SForm
const form = inject<FormState | null>(FORM_CONTEXT_KEY, null)

if (!form) {
  console.warn('[SFormField] Must be used inside SForm component')
}

// Get field state
const field = computed<FieldState | null>(() => {
  if (!form) return null
  return form.fields[props.name] || null
})

// Display error from field
const displayError = computed(() => field.value?.error.value || '')

// Validation state for styling
const validationState = computed<'error' | 'success' | null>(() => {
  if (!field.value) return null
  if (field.value.error.value) return 'error'
  if (field.value.valid.value && field.value.dirty.value) return 'success'
  return null
})

// Handle blur event for validation
const handleBlur = () => {
  if (field.value) {
    field.value.touched.value = true
    field.value.validate()
  }
}

// Handle input event for validation
const handleInput = () => {
  // Validation happens automatically via watchers in useFormValidation
}

// Provide field context to child components (for advanced use cases)
const FIELD_CONTEXT_KEY: InjectionKey<FieldState | null> = Symbol('field-context')
provide(FIELD_CONTEXT_KEY, field.value)
</script>

<template>
  <div v-bind="$attrs" :class="cn('s-form-field')">
    <!-- Slot for the actual input/component -->
    <slot 
      :field="field"
      :value="field?.value.value"
      :error="displayError || undefined"
      :validation-state="validationState"
      :model-value="field?.value.value"
      :on-update="(val: unknown) => { if (field) field.value.value = val }"
      :on-blur="handleBlur"
      :on-input="handleInput"
    />
  </div>
</template>

<style scoped>
.s-form-field {
  @apply w-full;
}
</style>