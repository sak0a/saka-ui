<script setup lang="ts">
import { provide, computed } from 'vue'
import type { FormState } from '../../../composables/useForm'
import { FORM_CONTEXT_KEY } from './index'
import { cn } from '../../../lib/utils'

defineOptions({ inheritAttrs: false })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Props {
  /** Form state from useForm */
  form: FormState<any>
  /** Whether the form is disabled */
  disabled?: boolean
  /** Gap between form fields */
  gap?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  gap: 'md'
})

const emit = defineEmits<{
  /** Emitted when the form is submitted and validation passes */
  submit: [values: Record<string, unknown>]
}>()

// Provide form context to child FormFields
provide(FORM_CONTEXT_KEY, props.form)

// Handle native form submission
const handleSubmit = async (event: Event) => {
  event.preventDefault()
  
  if (props.disabled || props.form.isSubmitting?.value) {
    return
  }
  
  const isValid = await props.form.validate()
  if (isValid) {
    emit('submit', props.form.getValues())
  }
}

// Gap class mapping
const gapClass = computed(() => {
  const gaps = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4'
  }
  return gaps[props.gap]
})
</script>

<template>
  <form
    v-bind="$attrs"
    :class="cn('s-form', gapClass, { 's-form--disabled': disabled })"
    @submit="handleSubmit"
  >
    <slot 
      :is-submitting="form.isSubmitting?.value ?? false"
      :is-valid="form.valid.value"
      :is-dirty="form.dirty.value"
      :errors="form.errors.value"
    />
  </form>
</template>

<style scoped>
.s-form {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.s-form--disabled {
  opacity: 0.6;
  pointer-events: none;
}
</style>
