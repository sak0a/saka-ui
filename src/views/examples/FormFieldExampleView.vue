<script setup lang="ts">
import { 
  SCard, SCardHeader, SCardContent, SCardFooter, 
  SButton, SAlert,
  SForm, SFormField, SInput, SColorPicker, SSelect, SOption,
  useForm,
  required,
  email,
  sameAs,
  passwordStrength,
  PasswordStrength,
  oneOf
} from '../../index'

// Form using the new useForm API
const form = useForm({
  initialValues: {
    email: '',
    password: '',
    confirmPassword: '',
    favoriteColor: '',
    country: ''
  },
  fields: {
    email: {
      rules: [
        required('Email is required'),
        email('Invalid email format')
      ]
    },
    password: {
      rules: [
        required('Password is required'),
        passwordStrength(PasswordStrength.MEDIUM, 'Need 8+ chars, 1 uppercase, 1 number')
      ]
    },
    confirmPassword: {
      rules: [
        required('Please confirm password'),
        sameAs('password', 'Passwords do not match')
      ]
    },
    favoriteColor: {
      rules: [
        required('Please select a color'),
        oneOf(['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'], 'Invalid color selection')
      ]
    },
    country: {
      rules: [
        required('Country is required')
      ]
    }
  }
})

// Submit using the new handleSubmit API
const submit = form.handleSubmit(
  async (values) => {
    await new Promise(r => setTimeout(r, 1000))
    return 'Form submitted successfully! Values: ' + JSON.stringify(values, null, 2)
  }
)

const reset = () => {
  form.reset()
  form.clearErrors()
}
</script>

<template>
  <div class="min-h-screen p-6 bg-(--s-bg-primary)">
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-(--s-text-primary) mb-2">Form & FormField Example</h1>
        <p class="text-(--s-text-secondary)">
          Easy form validation with automatic error display - works with any component!
        </p>
      </div>

      <SCard variant="elevated" rounded="xl">
        <SCardHeader 
          title="Registration Form"
          subtitle="Using SForm and SFormField for automatic validation"
          layout="vertical"
        />
        
        <SCardContent>
          <SForm :form="form" :disabled="form.isSubmitting.value">
            <!-- Alert -->
            <SAlert 
              v-if="form.isSubmitSuccessful.value" 
              type="success"
              description="Form submitted successfully!"
              closable
              class="mb-4"
            />
            <SAlert 
              v-else-if="form.submitError.value" 
              type="error"
              :description="form.submitError.value"
              closable
              @close="form.clearErrors()"
              class="mb-4"
            />

            <!-- Email field - using scoped slot with automatic v-model binding -->
            <SFormField name="email">
              <template #default="{ value, error, onUpdate, onBlur }">
                <SInput
                  :model-value="value as string"
                  @update:model-value="onUpdate"
                  @blur="onBlur"
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  icon-left="email"
                  :error="error"
                  :disabled="form.isSubmitting.value"
                  hint="We'll never share your email"
                />
              </template>
            </SFormField>

            <!-- Password field -->
            <SFormField name="password">
              <template #default="{ value, error, onUpdate, onBlur }">
                <SInput
                  :model-value="value as string"
                  @update:model-value="onUpdate"
                  @blur="onBlur"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  icon-left="lock"
                  show-password-toggle
                  :error="error"
                  :disabled="form.isSubmitting.value"
                  hint="MEDIUM strength required"
                />
              </template>
            </SFormField>

            <!-- Confirm Password -->
            <SFormField name="confirmPassword">
              <template #default="{ value, error, onUpdate, onBlur }">
                <SInput
                  :model-value="value as string"
                  @update:model-value="onUpdate"
                  @blur="onBlur"
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  icon-left="lock-check"
                  show-password-toggle
                  :error="error"
                  :disabled="form.isSubmitting.value"
                />
              </template>
            </SFormField>

            <!-- Color Picker - works with any component! -->
            <SFormField name="favoriteColor">
              <template #default="{ value, error, onUpdate, onBlur }">
                <div class="space-y-1.5">
                  <label class="block text-sm font-medium text-(--s-text-primary)">Favorite Color</label>
                  <SColorPicker
                    :model-value="value as string"
                    @update:model-value="onUpdate"
                    @blur="onBlur"
                    :disabled="form.isSubmitting.value"
                  />
                  <p v-if="error" class="text-xs text-red-500 flex items-center gap-1">
                    <span class="mdi mdi-alert-circle" />
                    {{ error }}
                  </p>
                  <p v-else class="text-xs text-(--s-text-tertiary)">Select your favorite color</p>
                </div>
              </template>
            </SFormField>

            <!-- Select - also works! -->
            <SFormField name="country">
              <template #default="{ value, error, onUpdate, onBlur }">
                <SSelect
                  :model-value="value as string"
                  @update:model-value="onUpdate"
                  @blur="onBlur"
                  label="Country"
                  placeholder="Select a country"
                  :error="error"
                  :disabled="form.isSubmitting.value"
                >
                  <SOption value="us">United States</SOption>
                  <SOption value="uk">United Kingdom</SOption>
                  <SOption value="ca">Canada</SOption>
                  <SOption value="au">Australia</SOption>
                  <SOption value="de">Germany</SOption>
                </SSelect>
              </template>
            </SFormField>
          </SForm>
        </SCardContent>

        <SCardFooter class="flex gap-2">
          <SButton 
            variant="outlined" 
            @click="reset"
            :disabled="form.isSubmitting.value"
          >
            Reset
          </SButton>
          <SButton 
            block 
            :loading="form.isSubmitting.value" 
            :disabled="!form.valid.value || form.isSubmitting.value" 
            @click="submit"
          >
            Submit Form
          </SButton>
        </SCardFooter>
      </SCard>

      <!-- Comparison: Old vs New -->
      <SCard variant="outlined" rounded="lg">
        <SCardHeader title="Before vs After" />
        <SCardContent>
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-(--s-text-primary) mb-2">Old Way (Manual Binding)</h3>
              <pre class="text-xs bg-(--s-bg-tertiary) p-3 rounded overflow-x-auto"><code>&lt;SInput
  v-model="(form.fields.email.value.value as string)"
  :error="form.fields.email.error.value"
  @blur="form.fields.email.touched.value = true; form.fields.email.validate()"
/&gt;</code></pre>
            </div>
            <div>
              <h3 class="font-semibold text-(--s-text-primary) mb-2">New Way (Automatic)</h3>
              <pre class="text-xs bg-(--s-bg-tertiary) p-3 rounded overflow-x-auto"><code>&lt;SFormField name="email"&gt;
  &lt;template #default="{ value, onUpdate, onBlur }"&gt;
    &lt;SInput
      :model-value="value"
      @update:model-value="onUpdate"
      @blur="onBlur"
    /&gt;
  &lt;/template&gt;
&lt;/SFormField&gt;</code></pre>
            </div>
            <p class="text-sm text-(--s-text-secondary) mt-4">
              <strong>Benefits:</strong> Automatic error display, works with any component, 
              cleaner code, no need to manually pass error props!
            </p>
          </div>
        </SCardContent>
      </SCard>
    </div>
  </div>
</template>
