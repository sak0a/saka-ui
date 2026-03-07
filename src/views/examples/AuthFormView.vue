<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  SCard, SCardHeader, SCardContent, SCardFooter, SInput, SButton, SAlert, SCheckbox,
  SForm, SFormField,
  // Composable and validators
  useForm,
  required,
  minLength,
  email,
  sameAs,
  passwordStrength,
  PasswordStrength,
  custom,
  notOneOf
} from '../../index'

// Form field types
interface AuthFormValues {
  name: string
  email: string
  password: string
  confirmPassword: string
}

// Remember me state
const rememberMe = ref(false)

// Form mode & UI state
const isLoginMode = ref(true)
const alertMessage = ref('')
const alertType = ref<'success' | 'error'>('error')

// Email suggestions
const emailSuggestions = ['@gmail.com', '@outlook.com', '@yahoo.com', '@icloud.com']

// Banned usernames for custom validation demo
const bannedNames = ['admin', 'root', 'test', 'user']

// Form using the new useForm API with initial values and handleSubmit
const form = useForm<AuthFormValues>({
  initialValues: {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  },
  fields: {
    name: {
      rules: [
        required('Name is required'),
        minLength(2, 'Min 2 characters'),
        // Custom validator: no banned names
        notOneOf(bannedNames, 'This name is not allowed')
      ]
    },
    email: {
      rules: [
        required('Email is required'),
        email('Invalid email format'),
        // Custom: no disposable email domains
        custom(
          (v) => !String(v).match(/@(tempmail|throwaway|guerrilla)/i),
          'Disposable emails not allowed'
        )
      ]
    },
    password: {
      rules: [
        required('Password is required'),
        // Use passwordStrength instead of separate checks!
        passwordStrength(PasswordStrength.MEDIUM, 'Need 8+ chars, 1 uppercase, 1 number')
      ]
    },
    confirmPassword: {
      rules: [
        required('Please confirm password'),
        sameAs('password', 'Passwords do not match')
      ]
    }
  }
})

// Is form valid for current mode?
const isValid = computed(() => {
  const { name, email, password, confirmPassword } = form.fields
  if (isLoginMode.value) {
    return email.value.value && password.value.value && email.valid.value && password.valid.value
  }
  return name.value.value && email.value.value && password.value.value && confirmPassword.value.value &&
    name.valid.value && email.valid.value && password.valid.value && confirmPassword.valid.value
})

// Toggle mode
const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  form.reset()
  alertMessage.value = ''
}

// Submit using the new handleSubmit API
const submit = form.handleSubmit(
  async (values) => {
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500))
    
    const success = values.email === 'demo@example.com' && values.password === 'Demo1234' 
      ? true 
      : Math.random() > 0.3
    
    if (!success) {
      throw new Error(
        isLoginMode.value 
          ? 'Invalid credentials. Try demo@example.com / Demo1234' 
          : 'Registration failed'
      )
    }
    
    alertType.value = 'success'
    alertMessage.value = isLoginMode.value ? 'Login successful!' : 'Account created!'
  },
  (error) => {
    alertType.value = 'error'
    alertMessage.value = error instanceof Error ? error.message : String(error)
  }
)
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-(--s-bg-primary) via-(--s-bg-secondary) to-(--s-bg-primary)">
    <!-- Background blobs -->


    <div class="relative w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br from-violet-500 to-fuchsia-500 mb-3 shadow-lg">
          <span class="mdi mdi-rocket-launch text-2xl text-white" />
        </div>
        <h1 class="text-xl font-bold text-(--s-text-primary)">Saka UI</h1>
      </div>

      <!-- Auth Card -->
      <SCard variant="elevated" rounded="xl">
        <SCardHeader 
          :title="isLoginMode ? 'Sign In' : 'Create Account'"
          :subtitle="isLoginMode ? 'Enter your credentials' : 'Fill in your details'"
          layout="vertical"
          align="center"
        />
        
        <SCardContent class="space-y-3">
          <!-- Alert -->
          <SAlert 
            v-if="alertMessage" 
            :type="alertType"
            :description="alertMessage"
            closable
            @close="alertMessage = ''"
          />

          <SForm :form="form" :disabled="form.isSubmitting.value">
            <!-- Name (register only) -->
            <SFormField
              v-if="!isLoginMode"
              name="name"
            >
              <template #default="{ value, error, onUpdate, onBlur }">
                <SInput
                  :model-value="value as string"
                  @update:model-value="onUpdate"
                  @blur="onBlur"
                  label="Full Name"
                  placeholder="John Doe"
                  icon-left="account"
                  :error="error"
                  :disabled="form.isSubmitting.value"
                  hint="Cannot use: admin, root, test, user"
                />
              </template>
            </SFormField>

            <!-- Email -->
            <SFormField name="email">
              <template #default="{ value, error, onUpdate, onBlur }">
                <SInput
                  :model-value="value as string"
                  @update:model-value="onUpdate"
                  @blur="onBlur"
                  type="email"
                  label="Email"
                  placeholder="you@example.com"
                  icon-left="email"
                  :suggestions="emailSuggestions"
                  :error="error"
                  :disabled="form.isSubmitting.value"
                  :hint="isLoginMode ? 'Try: demo@example.com' : 'No disposable emails'"
                />
              </template>
            </SFormField>

            <!-- Password -->
            <SFormField name="password">
              <template #default="{ value, error, onUpdate, onBlur }">
                <SInput
                  :model-value="value as string"
                  @update:model-value="onUpdate"
                  @blur="onBlur"
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                  icon-left="lock"
                  show-password-toggle
                  :error="error"
                  :disabled="form.isSubmitting.value"
                  :hint="isLoginMode ? 'Try: Demo1234' : 'MEDIUM strength required'"
                />
              </template>
            </SFormField>

            <!-- Confirm Password (register only) -->
            <SFormField
              v-if="!isLoginMode"
              name="confirmPassword"
            >
              <template #default="{ value, error, onUpdate, onBlur }">
                <SInput
                  :model-value="value as string"
                  @update:model-value="onUpdate"
                  @blur="onBlur"
                  type="password"
                  label="Confirm Password"
                  placeholder="••••••••"
                  icon-left="lock-check"
                  show-password-toggle
                  :error="error"
                  :disabled="form.isSubmitting.value"
                />
              </template>
            </SFormField>
          </SForm>

          <!-- Remember / Forgot (login only) -->
          <div v-if="isLoginMode" class="flex justify-between items-center my-2">
            <SCheckbox v-model="rememberMe" size="small" :disabled="form.isSubmitting.value">
              <span class="text-xs text-(--s-text-secondary)">Remember me</span>
            </SCheckbox>
            <a href="#" class="text-xs text-violet-500 hover:text-violet-400">Forgot password?</a>
          </div>

          <!-- Terms (register only) -->
          <p v-if="!isLoginMode" class="text-xs text-(--s-text-tertiary) text-center my-3 pt-2">
            By signing up, you agree to our <a href="#" class="text-violet-500 hover:underline">Terms of Service</a> and <a href="#" class="text-violet-500 hover:underline">Privacy Policy</a>
          </p>
        </SCardContent>

        <SCardFooter class="flex-col gap-2">
          <SButton 
            block 
            :loading="form.isSubmitting.value" 
            :disabled="!isValid || form.isSubmitting.value" 
            @click="submit"
          >
            {{ form.isSubmitting.value ? (isLoginMode ? 'Signing in...' : 'Creating...') : (isLoginMode ? 'Sign In' : 'Create Account') }}
          </SButton>

          <!-- Divider -->
          <div class="relative w-full my-1">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-(--s-border)" /></div>
            <div class="relative flex justify-center text-xs">
              <span class="px-2 bg-(--s-bg-primary) text-(--s-text-tertiary)">or</span>
            </div>
          </div>

          <!-- Social buttons -->
          <div class="flex gap-2 w-full">
            <SButton variant="outlined" class="flex-1" :disabled="form.isSubmitting.value">
              <span class="mdi mdi-google mr-1" /> Google
            </SButton>
            <SButton variant="outlined" class="flex-1" :disabled="form.isSubmitting.value">
              <span class="mdi mdi-github mr-1" /> GitHub
            </SButton>
          </div>
        </SCardFooter>
      </SCard>

      <!-- Toggle -->
      <p class="text-center mt-4 text-sm text-(--s-text-secondary)">
        {{ isLoginMode ? "No account?" : "Have an account?" }}
        <SButton variant="link" @click="toggleMode" class="text-violet-500 hover:text-violet-400 font-medium ml-1" :disabled="form.isSubmitting.value">
          {{ isLoginMode ? 'Sign up' : 'Sign in' }}
        </SButton>
      </p>
    </div>
  </div>
</template>
