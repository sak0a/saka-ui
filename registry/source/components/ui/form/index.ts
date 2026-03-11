import type { InjectionKey } from 'vue'
import type { FormState } from '../../../composables/useForm'

export const FORM_CONTEXT_KEY: InjectionKey<FormState> = Symbol('form-context')

// Re-export components for convenience
export { default as SForm } from './SForm.vue'
export { default as SFormField } from './SFormField.vue'
