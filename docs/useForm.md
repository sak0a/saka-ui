# useForm

A comprehensive Vue 3 composable for form management with validation, submission handling, and reactive state management. Full TypeScript support included.

## Installation

```typescript
import { 
  useForm,
  required, minLength, email, passwordStrength, PasswordStrength, custom
} from '@sakoa/ui'
```

## Basic Usage

```typescript
const form = useForm({
  initialValues: {
    email: '',
    password: ''
  },
  fields: {
    email: { rules: [required('Email required'), email('Invalid email')] },
    password: { rules: [required(), passwordStrength(PasswordStrength.MEDIUM)] }
  }
})

// Use handleSubmit for form submission
const onSubmit = form.handleSubmit(async (values) => {
  await api.login(values)
})
```

```vue
<template>
  <SForm :form="form" @submit="onSubmit">
    <SInput 
      v-model="form.fields.email.value.value"
      :error="form.fields.email.error.value"
      label="Email"
    />
    <SInput 
      v-model="form.fields.password.value.value"
      :error="form.fields.password.error.value"
      type="password"
      label="Password"
    />
    <SButton type="submit" :loading="form.isSubmitting.value" :disabled="!form.valid.value">
      Submit
    </SButton>
  </SForm>
</template>
```

## Type-Safe Field Access

Field values are fully typed based on your `initialValues`:

```typescript
interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

const form = useForm<LoginForm>({
  initialValues: {
    email: '',
    password: '',
    rememberMe: false
  },
  fields: {
    email: { rules: [required(), email()] },
    password: { rules: [required()] },
    rememberMe: {}
  }
})

// Type-safe access - returns string, not unknown
const emailValue: string = form.fields.email.value.value

// Type-safe setValue
form.setValue('email', 'test@example.com')  // ✅ OK
form.setValue('email', 123)                  // ❌ Type error
```

## Built-in Validators

| Validator | Description | Example |
|-----------|-------------|---------|
| `required(msg?)` | Field must have a value | `required('Required')` |
| `minLength(n, msg?)` | Min string length | `minLength(8, 'Too short')` |
| `maxLength(n, msg?)` | Max string length | `maxLength(100)` |
| `min(n, msg?)` | Min numeric value | `min(0, 'Must be positive')` |
| `max(n, msg?)` | Max numeric value | `max(100)` |
| `email(msg?)` | Valid email format | `email('Invalid email')` |
| `url(msg?)` | Valid URL format | `url()` |
| `pattern(regex, msg?)` | Custom regex match | `pattern(/^[A-Z]/, 'Start with capital')` |
| `sameAs(field, msg?)` | Match another field | `sameAs('password', 'Must match')` |
| `different(field, msg?)` | Different from field | `different('oldPassword')` |
| `oneOf(values, msg?)` | Must be in list | `oneOf(['admin', 'user'])` |
| `notOneOf(values, msg?)` | Cannot be in list | `notOneOf(['test', 'admin'])` |
| `hasUppercase(msg?)` | Contains uppercase | `hasUppercase()` |
| `hasLowercase(msg?)` | Contains lowercase | `hasLowercase()` |
| `hasDigit(msg?)` | Contains number | `hasDigit()` |
| `hasSpecial(msg?)` | Contains special char | `hasSpecial()` |
| `alphanumeric(msg?)` | Only letters/numbers | `alphanumeric()` |
| `numeric(msg?)` | Only digits | `numeric()` |

## Password Strength

```typescript
import { passwordStrength, PasswordStrength } from '@sakoa/ui'

// Levels:
// WEAK        - 6+ chars
// MEDIUM      - 8+ chars, 1 uppercase, 1 number
// STRONG      - 10+ chars, upper, lower, number, special
// VERY_STRONG - 12+ chars, 2 upper, 2 lower, 2 numbers, 1 special

passwordStrength(PasswordStrength.STRONG, 'Password too weak')
```

## Custom Validators

```typescript
import { custom } from '@sakoa/ui'

// Simple boolean check
custom((value) => value.startsWith('A'), 'Must start with A')

// Access other form fields
custom((value, formData) => value !== formData.username, 'Cannot match username')

// Async validation (automatically debounced)
custom(async (value) => {
  const res = await fetch(`/api/check-username?u=${value}`)
  return res.ok
}, 'Username already taken')
```

## Form Options

```typescript
interface UseFormOptions<TValues> {
  /** Initial values for form fields */
  initialValues?: Partial<TValues>
  
  /** Field configurations with validation rules */
  fields?: { [K in keyof TValues]?: FieldConfig }
  
  /** Zod schema for validation (alternative to fields.rules) */
  schema?: ZodLikeSchema<TValues>
  
  /** Global debounce delay for async validations (default: 300ms) */
  debounceDelay?: number
  
  /** Validation mode: 'onChange' | 'onBlur' | 'onSubmit' | 'all' (default: 'onChange') */
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'all'
  
  /** Persistence options for auto-saving form state */
  persist?: PersistOptions
}

interface FieldConfig {
  rules?: (ValidationRule | AsyncValidationRule)[]
  validateOn?: 'input' | 'blur' | 'submit'
  debounce?: number              // Per-field debounce override
  deps?: string[]                // Field dependencies for revalidation
  persist?: boolean              // Whether to persist this field (default: true)
}

interface PersistOptions {
  key: string                    // Storage key
  storage?: 'localStorage' | 'sessionStorage'  // Default: 'localStorage'
  debounce?: number              // Save debounce in ms (default: 500)
}
```

## Form State API

```typescript
const form = useForm({ ... })

// ============================================
// Field Access (Type-Safe)
// ============================================
form.fields.email.value.value    // Current value (typed based on TValues)
form.fields.email.error.value    // Error message (empty if valid)
form.fields.email.valid.value    // Boolean validity
form.fields.email.touched.value  // Has been blurred
form.fields.email.dirty.value    // Has been modified from initial
form.fields.email.validate()     // Manual validation (async)
form.fields.email.reset()        // Reset to initial state

// ============================================
// Form-level State
// ============================================
form.valid.value              // All fields valid
form.dirty.value              // Any field differs from initial value
form.touched.value            // Any field touched
form.errors.value             // { fieldName: 'error message' }
form.isSubmitting.value       // Currently submitting
form.submitError.value        // Last submission error (string | null)
form.submitCount.value        // Number of submit attempts
form.isSubmitSuccessful.value // Last submit was successful

// ============================================
// Methods
// ============================================
form.validate()               // Validate all (async, returns boolean)
form.reset()                  // Reset all fields to initial values
form.reset({ email: 'new' })  // Reset with new values
form.getValues()              // { fieldName: value }

// Value Management
form.setValue('email', 'new@example.com')  // Set single field
form.setValues({ email: 'a', name: 'b' })  // Set multiple fields
form.getFieldValue('email')                // Get single field value

// Error Management
form.setError('email', 'Custom error')     // Set field error manually
form.clearError('email')                   // Clear field error
form.clearErrors()                         // Clear all errors

// Individual Field State Management
form.resetField('email')                   // Reset single field to initial
form.setFieldTouched('email', true)        // Set field touched state
form.setFieldDirty('email', false)         // Set field dirty state

// Submission
const submit = form.handleSubmit(
  async (values) => { await api.save(values) },  // Success handler
  (error) => { console.error(error) }            // Optional error handler
)
await submit()  // Execute submission

// Watchers
const stop = form.watchForm((values) => {
  console.log('Form changed:', values)
})
const stopField = form.watchField('email', (newVal, oldVal) => {
  console.log('Email changed:', newVal)
})
stop()       // Stop watching
stopField()  // Stop watching field

// Persistence
form.clearPersisted()  // Clear stored form data from storage
```

## Validation Dependencies

Fields can trigger revalidation of other fields when they change. This is useful for fields like password confirmation that depend on another field:

```typescript
const form = useForm({
  initialValues: {
    password: '',
    confirmPassword: ''
  },
  fields: {
    password: { 
      rules: [required(), minLength(8)] 
    },
    confirmPassword: { 
      rules: [required(), sameAs('password', 'Passwords must match')],
      deps: ['password']  // Revalidate when password changes
    }
  }
})

// When password changes, confirmPassword is automatically revalidated
form.setValue('password', 'newPassword123')
// confirmPassword will now show error if it doesn't match
```

## Zod Schema Integration

Use a Zod schema instead of manual rule definitions for validation:

```typescript
import { z } from 'zod'
import { useForm } from '@sakoa/ui'

const schema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  age: z.number().min(18, 'Must be 18 or older')
})

// Type is automatically inferred from schema
const form = useForm({
  schema,
  initialValues: {
    email: '',
    password: '',
    age: 0
  }
})

// You can also combine Zod with custom rules
const form2 = useForm({
  schema,
  initialValues: { email: '', password: '', age: 0 },
  fields: {
    email: {
      // Additional rules run after Zod validation
      rules: [
        custom(async (v) => await checkEmailAvailable(v), 'Email already in use')
      ]
    }
  }
})
```

> **Note:** Zod is an optional peer dependency. Install it with `npm install zod` if you want to use schema validation.

## Form Persistence

Automatically save and restore form state to localStorage or sessionStorage:

```typescript
const form = useForm({
  initialValues: {
    email: '',
    password: '',
    rememberMe: false
  },
  fields: {
    email: { rules: [required(), email()] },
    password: { 
      rules: [required()],
      persist: false  // Don't persist sensitive fields
    },
    rememberMe: {}
  },
  persist: {
    key: 'login-form',          // Storage key
    storage: 'localStorage',     // or 'sessionStorage'
    debounce: 500               // Save after 500ms of inactivity
  }
})

// Form values are automatically restored on mount
// and saved whenever values change (except password)

// Clear persisted data manually
form.clearPersisted()
```

### Excluding Sensitive Fields

Set `persist: false` in individual field configs to exclude them from persistence:

```typescript
fields: {
  username: {},                    // Will be persisted
  password: { persist: false },    // Won't be persisted
  creditCard: { persist: false }   // Won't be persisted
}
```

## Submission Handling

The `handleSubmit` method provides a clean way to handle form submission:

```typescript
const form = useForm({
  initialValues: { email: '', password: '' },
  fields: {
    email: { rules: [required(), email()] },
    password: { rules: [required()] }
  }
})

// handleSubmit returns a function you can call
const onSubmit = form.handleSubmit(
  async (values) => {
    // This only runs if validation passes
    const response = await api.login(values)
    return response  // Return value is available from onSubmit()
  },
  (error) => {
    // Optional error handler
    console.error('Submit failed:', error)
  }
)

// Use in template or call directly
await onSubmit()

// Access submission state
form.isSubmitting.value       // true during submission
form.submitError.value        // Error message if failed
form.isSubmitSuccessful.value // true if last submit succeeded
form.submitCount.value        // Number of attempts
```

## With SForm and SFormField Components

```vue
<script setup lang="ts">
import { useForm, SForm, SFormField, SInput, SButton, required, email } from '@sakoa/ui'

const form = useForm({
  initialValues: { email: '', name: '' },
  fields: {
    email: { rules: [required(), email()] },
    name: { rules: [required()] }
  }
})

const onSubmit = form.handleSubmit(async (values) => {
  await saveUser(values)
})
</script>

<template>
  <SForm :form="form" @submit="onSubmit">
    <template #default="{ isSubmitting, isValid }">
      <SFormField name="email">
        <template #default="{ value, error, onUpdate, onBlur }">
          <SInput
            :model-value="value"
            @update:model-value="onUpdate"
            @blur="onBlur"
            label="Email"
            :error="error"
          />
        </template>
      </SFormField>

      <SFormField name="name">
        <template #default="{ value, error, onUpdate, onBlur }">
          <SInput
            :model-value="value"
            @update:model-value="onUpdate"
            @blur="onBlur"
            label="Name"
            :error="error"
          />
        </template>
      </SFormField>

      <SButton type="submit" :loading="isSubmitting" :disabled="!isValid">
        Save
      </SButton>
    </template>
  </SForm>
</template>
```

## Async Validation with Debouncing

Async validators are automatically debounced to prevent excessive API calls:

```typescript
const form = useForm({
  debounceDelay: 500,  // Global debounce: 500ms
  fields: {
    username: {
      rules: [
        required(),
        custom(async (value) => {
          const res = await fetch(`/api/check-username?u=${value}`)
          return res.ok
        }, 'Username already taken')
      ],
      debounce: 300  // Override: 300ms for this field only
    }
  }
})
```

## Watching Form Changes

```typescript
// Watch entire form
const stopWatching = form.watchForm((values) => {
  localStorage.setItem('draft', JSON.stringify(values))
})

// Watch specific field
const stopEmail = form.watchField('email', (newVal, oldVal) => {
  if (newVal.includes('@')) {
    // Do something when email has @
  }
})

// Clean up (optional - done automatically on unmount)
onUnmounted(() => {
  stopWatching()
  stopEmail()
})
```

## Complete Example

```vue
<script setup lang="ts">
import { 
  useForm, SForm, SFormField, SInput, SButton, SAlert,
  required, email, sameAs, passwordStrength, PasswordStrength 
} from '@sakoa/ui'

interface RegistrationForm {
  email: string
  password: string
  confirmPassword: string
}

const form = useForm<RegistrationForm>({
  initialValues: {
    email: '',
    password: '',
    confirmPassword: ''
  },
  fields: {
    email: { rules: [required(), email()] },
    password: { rules: [required(), passwordStrength(PasswordStrength.MEDIUM)] },
    confirmPassword: { 
      rules: [required(), sameAs('password', 'Passwords must match')],
      deps: ['password']  // Revalidate when password changes
    }
  },
  persist: {
    key: 'registration-form',
    storage: 'sessionStorage'
  }
})

const onSubmit = form.handleSubmit(async (values) => {
  await api.register(values)
  form.clearPersisted()  // Clear saved data on successful submit
  form.reset()
})
</script>

<template>
  <SForm :form="form" @submit="onSubmit">
    <SAlert 
      v-if="form.submitError.value" 
      type="error" 
      :description="form.submitError.value"
      closable
      @close="form.clearErrors()"
    />

    <SFormField name="email" v-slot="{ value, error, onUpdate, onBlur }">
      <SInput 
        :model-value="value"
        @update:model-value="onUpdate"
        @blur="onBlur"
        :error="error"
        label="Email"
      />
    </SFormField>

    <SFormField name="password" v-slot="{ value, error, onUpdate, onBlur }">
      <SInput 
        :model-value="value"
        @update:model-value="onUpdate"
        @blur="onBlur"
        :error="error"
        type="password"
        label="Password"
      />
    </SFormField>

    <SFormField name="confirmPassword" v-slot="{ value, error, onUpdate, onBlur }">
      <SInput 
        :model-value="value"
        @update:model-value="onUpdate"
        @blur="onBlur"
        :error="error"
        type="password"
        label="Confirm Password"
      />
    </SFormField>

    <SButton 
      type="submit" 
      :loading="form.isSubmitting.value" 
      :disabled="!form.valid.value"
    >
      Register
    </SButton>
  </SForm>
</template>
```
