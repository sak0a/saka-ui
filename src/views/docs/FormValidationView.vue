<script setup lang="ts">
import { ref } from 'vue'
import { 
  SInput, SButton, SApiSection, SApiTable, SCard, SCardContent, SAlert,
  useForm, required, email, passwordStrength, PasswordStrength, sameAs
} from '../../index'
import type { ApiProp, ApiEvent, ApiMethod } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// Demo form with new API
interface DemoFormValues extends Record<string, unknown> {
  email: string
  password: string
  confirmPassword: string
}

const demoForm = useForm<DemoFormValues>({
  initialValues: {
    email: '',
    password: '',
    confirmPassword: ''
  },
  fields: {
    email: { rules: [required('Email is required'), email('Invalid email')] },
    password: { rules: [required(), passwordStrength(PasswordStrength.MEDIUM)] },
    confirmPassword: { 
      rules: [required(), sameAs('password', 'Passwords must match')],
      deps: ['password'] // Revalidate when password changes
    }
  }
})
const demoResult = ref('')

// Using handleSubmit for form submission
const submitDemo = demoForm.handleSubmit(
  async (values) => {
    // Simulate API call
    await new Promise(r => setTimeout(r, 500))
    demoResult.value = 'Form valid! Values: ' + JSON.stringify(values)
  },
  (error) => {
    console.error('Form submission failed:', error)
  }
)

// Code snippets
const basicCode = `import { useForm, required, email, minLength } from 'saka-ui'

const form = useForm({
  initialValues: {
    email: '',
    password: ''
  },
  fields: {
    email: { rules: [required(), email()] },
    password: { rules: [required(), minLength(8)] }
  }
})

// Submit with handleSubmit
const onSubmit = form.handleSubmit(async (values) => {
  await api.login(values)
})

// Template: v-model="form.fields.email.value.value"
// Error: :error="form.fields.email.error.value"`

const validatorsCode = `// Built-in validators
required('Custom message')     // Field must have value
minLength(8, 'Too short')      // Min string length
maxLength(100)                 // Max string length
email('Invalid email')         // Email format
url()                          // URL format
pattern(/^[A-Z]/, 'Start uppercase')
sameAs('fieldName', 'Must match')
different('fieldName')         // Must be different
oneOf(['a', 'b', 'c'])         // Must be in list
notOneOf(['banned'])           // Cannot be in list
hasUppercase()                 // Contains uppercase
hasLowercase()                 // Contains lowercase
hasDigit()                     // Contains number
hasSpecial()                   // Contains special char`

const passwordStrengthCode = `import { passwordStrength, PasswordStrength } from 'saka-ui'

// Strength levels:
// WEAK        - 6+ chars
// MEDIUM      - 8+ chars, 1 uppercase, 1 number
// STRONG      - 10+ chars, upper, lower, number, special
// VERY_STRONG - 12+ chars, 2 upper, 2 lower, 2 numbers, 1 special

passwordStrength(PasswordStrength.STRONG, 'Password too weak')`

const customCode = `import { custom } from 'saka-ui'

// Simple boolean check
custom((value) => value.startsWith('A'), 'Must start with A')

// Access other fields
custom((value, formData) => value !== formData.username, 'Cannot match username')

// Async validation (automatically debounced)
custom(async (value) => {
  const res = await fetch(\`/api/check-username?u=\${value}\`)
  return res.ok
}, 'Username already taken')`

const formStateCode = `const form = useForm({
  initialValues: { email: '', password: '' },
  fields: { ... }
})

// Field access (type-safe!)
form.fields.email.value.value    // Current value (string)
form.fields.email.error.value    // Error message
form.fields.email.valid.value    // Boolean
form.fields.email.validate()     // Manual validate

// Form-level state
form.valid.value           // All fields valid
form.dirty.value           // Any field modified
form.touched.value         // Any field blurred
form.isSubmitting.value    // Currently submitting
form.submitError.value     // Last submit error

// Methods
form.validate()                     // Validate all (async)
form.reset()                        // Reset all fields
form.reset({ email: 'new' })        // Reset with new values
form.getValues()                    // { field: value }
form.setValue('email', 'new@x.com') // Set single field
form.setValues({ ... })             // Set multiple fields
form.resetField('email')            // Reset single field
form.setFieldTouched('email')       // Mark touched
form.clearErrors()                  // Clear all errors`

const depsCode = `// Validation dependencies - revalidate when other fields change
const form = useForm({
  initialValues: { password: '', confirmPassword: '' },
  fields: {
    password: { rules: [required(), minLength(8)] },
    confirmPassword: { 
      rules: [required(), sameAs('password', 'Must match')],
      deps: ['password']  // Revalidate when password changes
    }
  }
})`

const zodCode = `import { z } from 'zod'
import { useForm } from 'saka-ui'

const form = useForm({
  schema: z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Too short')
  }),
  initialValues: { email: '', password: '' }
})`

const persistCode = `const form = useForm({
  initialValues: { email: '', rememberMe: false },
  fields: {
    email: { rules: [required()] },
    rememberMe: {}
  },
  persist: {
    key: 'login-form',
    storage: 'localStorage',  // or 'sessionStorage'
    debounce: 500
  }
})

// Clear persisted data
form.clearPersisted()`

// API tables
const formStateProps: ApiProp[] = [
  { name: 'fields', type: 'TypedFields<TValues>', description: 'Type-safe field states indexed by name' },
  { name: 'valid', type: 'ComputedRef<boolean>', description: 'True when all fields are valid' },
  { name: 'dirty', type: 'ComputedRef<boolean>', description: 'True when any field has been modified' },
  { name: 'touched', type: 'ComputedRef<boolean>', description: 'True when any field has been blurred' },
  { name: 'errors', type: 'ComputedRef<Record<string, string>>', description: 'All error messages by field name' },
  { name: 'isSubmitting', type: 'Ref<boolean>', description: 'True during form submission' },
  { name: 'submitError', type: 'Ref<string | null>', description: 'Error message from last failed submit' },
  { name: 'submitCount', type: 'Ref<number>', description: 'Number of submit attempts' },
  { name: 'isSubmitSuccessful', type: 'Ref<boolean>', description: 'True if last submit succeeded' }
]

const fieldStateProps: ApiProp[] = [
  { name: 'value', type: 'Ref<T>', description: 'Current field value (typed)' },
  { name: 'error', type: 'Ref<string>', description: 'Current error message (empty if valid)' },
  { name: 'valid', type: 'ComputedRef<boolean>', description: 'True when field has no errors' },
  { name: 'touched', type: 'Ref<boolean>', description: 'True when field has been blurred' },
  { name: 'dirty', type: 'Ref<boolean>', description: 'True when field value has changed' }
]

const formMethods: ApiMethod[] = [
  { name: 'validate()', description: 'Validate all fields, returns Promise<boolean>' },
  { name: 'reset(values?)', description: 'Reset all fields, optionally with new values' },
  { name: 'getValues()', description: 'Get all field values as typed object' },
  { name: 'setValue(name, value)', description: 'Set a single field value' },
  { name: 'setValues(values)', description: 'Set multiple field values' },
  { name: 'getFieldValue(name)', description: 'Get a single field value' },
  { name: 'resetField(name)', description: 'Reset a single field to initial value' },
  { name: 'setFieldTouched(name, touched?)', description: 'Set field touched state' },
  { name: 'setFieldDirty(name, dirty?)', description: 'Set field dirty state' },
  { name: 'setError(name, error)', description: 'Set a field error manually' },
  { name: 'clearError(name)', description: 'Clear a field error' },
  { name: 'clearErrors()', description: 'Clear all errors including submitError' },
  { name: 'handleSubmit(onSubmit, onError?)', description: 'Create submit handler with validation' },
  { name: 'watchForm(callback)', description: 'Watch all form values, returns stop function' },
  { name: 'watchField(name, callback)', description: 'Watch specific field, returns stop function' },
  { name: 'clearPersisted()', description: 'Clear persisted form data from storage' }
]

const fieldMethods: ApiMethod[] = [
  { name: 'validate()', description: 'Validate this field, returns Promise<boolean>' },
  { name: 'reset()', description: 'Reset this field to initial state' }
]

const validatorsTable: ApiEvent[] = [
  { name: 'required(msg?)', description: 'Field must have a value' },
  { name: 'minLength(n, msg?)', description: 'Minimum string length' },
  { name: 'maxLength(n, msg?)', description: 'Maximum string length' },
  { name: 'min(n, msg?)', description: 'Minimum numeric value' },
  { name: 'max(n, msg?)', description: 'Maximum numeric value' },
  { name: 'email(msg?)', description: 'Valid email format' },
  { name: 'url(msg?)', description: 'Valid URL format' },
  { name: 'pattern(regex, msg?)', description: 'Matches regex pattern' },
  { name: 'sameAs(field, msg?)', description: 'Must match another field' },
  { name: 'different(field, msg?)', description: 'Must differ from field' },
  { name: 'oneOf(values, msg?)', description: 'Must be in allowed list' },
  { name: 'notOneOf(values, msg?)', description: 'Cannot be in list' },
  { name: 'hasUppercase(msg?)', description: 'Contains uppercase letter' },
  { name: 'hasLowercase(msg?)', description: 'Contains lowercase letter' },
  { name: 'hasDigit(msg?)', description: 'Contains number' },
  { name: 'hasSpecial(msg?)', description: 'Contains special character' },
  { name: 'alphanumeric(msg?)', description: 'Only letters and numbers' },
  { name: 'numeric(msg?)', description: 'Only digits' },
  { name: 'passwordStrength(level, msg?)', description: 'Password strength check (WEAK/MEDIUM/STRONG/VERY_STRONG)' },
  { name: 'custom(fn, msg)', description: 'Custom boolean/async function' }
]

const fieldConfigProps: ApiProp[] = [
  { name: 'rules', type: 'ValidationRule[]', description: 'Array of validation rules for this field' },
  { name: 'validateOn', type: "'input' | 'blur' | 'submit'", description: 'When to validate (default: based on mode)' },
  { name: 'debounce', type: 'number', description: 'Debounce delay for async validation (ms)' },
  { name: 'deps', type: 'string[]', description: 'Field names that trigger revalidation when changed' },
  { name: 'persist', type: 'boolean', description: 'Whether to persist this field (default: true)' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header>
      <h1 class="text-4xl font-extrabold text-(--s-text-primary) mb-2">useForm</h1>
      <p class="text-lg text-(--s-text-secondary)">
        Comprehensive form management composable with validation, submission handling, and TypeScript support.
      </p>
    </header>

    <!-- Features -->
    <article>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-shield-check text-xl text-emerald-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">20+ Validators</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Built-in validators for common use cases.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-code-braces text-xl text-blue-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Type-Safe</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Full TypeScript support with typed field access.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-function text-xl text-violet-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Custom Validators</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Create sync or async custom validation logic.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-alpha-z-box text-xl text-orange-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Zod Integration</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Use Zod schemas for validation.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-content-save text-xl text-cyan-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Persistence</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Auto-save to localStorage/sessionStorage.</p>
        </div>
        <div class="p-4 rounded-xl bg-(--s-bg-secondary)/50 border border-(--s-border)">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-link-variant text-xl text-pink-500"></span>
            <h3 class="font-semibold text-(--s-text-primary)">Field Dependencies</h3>
          </div>
          <p class="text-sm text-(--s-text-secondary)">Revalidate fields when others change.</p>
        </div>
      </div>
    </article>

    <!-- Basic Usage -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Basic Usage</h2>
      <DemoSection 
        title="Setup & Template Binding"
        description="Define initial values and validation rules, then use handleSubmit for submission."
        :code="basicCode"
        language="typescript"
      >
        <SCard variant="outlined" class="max-w-md mx-auto">
          <SCardContent class="space-y-4">
            <SAlert 
              v-if="demoForm.submitError.value" 
              type="error" 
              :description="demoForm.submitError.value" 
              closable 
              @close="demoForm.clearErrors()" 
            />
            <SAlert 
              v-if="demoResult" 
              type="success" 
              :description="demoResult" 
              closable 
              @close="demoResult = ''" 
            />
            <SInput 
              v-model="demoForm.fields.email.value.value"
              type="email"
              label="Email"
              placeholder="you@example.com"
              icon-left="email"
              :error="demoForm.fields.email.error.value"
            />
            <SInput 
              v-model="demoForm.fields.password.value.value"
              type="password"
              label="Password"
              placeholder="8+ chars, 1 upper, 1 number"
              icon-left="lock"
              show-password-toggle
              :error="demoForm.fields.password.error.value"
            />
            <SInput 
              v-model="demoForm.fields.confirmPassword.value.value"
              type="password"
              label="Confirm Password"
              placeholder="Repeat password"
              icon-left="lock-check"
              :error="demoForm.fields.confirmPassword.error.value"
            />
            <SButton 
              block 
              @click="submitDemo" 
              :disabled="!demoForm.valid.value"
              :loading="demoForm.isSubmitting.value"
            >
              Validate & Submit
            </SButton>
          </SCardContent>
        </SCard>
      </DemoSection>
    </section>

    <!-- Validators -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Built-in Validators</h2>
      <DemoSection 
        title="Available Validators"
        description="Import and chain multiple validators for each field."
        :code="validatorsCode"
        language="typescript"
        code-only
      />
    </section>

    <!-- Password Strength -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Password Strength</h2>
      <DemoSection 
        title="passwordStrength Validator"
        description="Validate password complexity with predefined strength levels."
        :code="passwordStrengthCode"
        language="typescript"
        code-only
      />
    </section>

    <!-- Custom Validators -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Custom Validators</h2>
      <DemoSection 
        title="custom() Function"
        description="Create custom validation logic with sync or async functions. Async validators are automatically debounced."
        :code="customCode"
        language="typescript"
        code-only
      />
    </section>

    <!-- Validation Dependencies -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Validation Dependencies</h2>
      <DemoSection 
        title="Field Dependencies"
        description="Fields can trigger revalidation of other fields when they change. Perfect for password confirmation."
        :code="depsCode"
        language="typescript"
        code-only
      />
    </section>

    <!-- Zod Integration -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Zod Integration</h2>
      <DemoSection 
        title="Using Zod Schemas"
        description="Use a Zod schema instead of manual rule definitions. Types are automatically inferred."
        :code="zodCode"
        language="typescript"
        code-only
      />
    </section>

    <!-- Form Persistence -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Form Persistence</h2>
      <DemoSection 
        title="Auto-Save to Storage"
        description="Automatically save and restore form state. Exclude sensitive fields with persist: false."
        :code="persistCode"
        language="typescript"
        code-only
      />
    </section>

    <!-- Form State -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">Form State API</h2>
      <DemoSection 
        title="Accessing Form & Field State"
        description="The composable returns reactive state with full TypeScript support."
        :code="formStateCode"
        language="typescript"
        code-only
      />
    </section>

    <!-- API Reference -->
    <section>
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-6">API Reference</h2>
      
      <SApiSection title="FormState">
        <SApiTable title="Properties" :props="formStateProps" type="props" />
        <SApiTable title="Methods" :methods="formMethods" type="methods" />
      </SApiSection>

      <div class="mt-8">
        <SApiSection title="FieldState">
          <SApiTable title="Properties" :props="fieldStateProps" type="props" />
          <SApiTable title="Methods" :methods="fieldMethods" type="methods" />
        </SApiSection>
      </div>

      <div class="mt-8">
        <SApiSection title="FieldConfig">
          <SApiTable title="Properties" :props="fieldConfigProps" type="props" />
        </SApiSection>
      </div>

      <div class="mt-8">
        <SApiSection title="Validators">
          <SApiTable title="Built-in Validators" :events="validatorsTable" type="events" />
        </SApiSection>
      </div>
    </section>
  </div>
</template>
