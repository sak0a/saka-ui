<script setup lang="ts">
import { ref, watch } from 'vue'
import { 
  SCard, SCardHeader, SCardContent, SCardFooter, SInput, SButton, SAlert, SCheckbox, SSelect, SRadio, SRadioGroup,
  SForm, SFormField,
  useForm, required, minLength, pattern, oneOf, custom
} from '../../index'

// Form field types
interface ProjectFormValues {
  projectName: string
  framework: string
  language: string
  packageManager: string
  features: string[]
}

// Framework options with rich information
const frameworkOptions = [
  { 
    value: 'vue', 
    label: 'Vue.js', 
    icon: 'vuejs',
    description: 'Progressive JavaScript framework for building UIs'
  },
  { 
    value: 'react', 
    label: 'React', 
    icon: 'react',
    description: 'A library for building user interfaces by Meta'
  },
  { 
    value: 'svelte', 
    label: 'Svelte', 
    icon: 'svelte',
    description: 'Cybernetically enhanced web apps with zero runtime'
  },
  { 
    value: 'angular', 
    label: 'Angular', 
    icon: 'angular',
    description: 'Platform for building mobile & desktop apps by Google'
  },
  { 
    value: 'nuxt', 
    label: 'Nuxt', 
    icon: 'nuxt',
    description: 'The intuitive Vue framework with SSR & static generation'
  },
  { 
    value: 'next', 
    label: 'Next.js', 
    icon: 'nextjs',
    description: 'The React framework for production by Vercel'
  },
  { 
    value: 'astro', 
    label: 'Astro', 
    icon: 'star-four-points',
    description: 'Build faster websites with less client-side JavaScript'
  },
  { 
    value: 'solid', 
    label: 'SolidJS', 
    icon: 'solid',
    description: 'Simple and performant reactivity for building UIs'
  },
]

// Package manager options with rich information
const packageManagerOptions = [
  { 
    value: 'npm', 
    label: 'npm', 
    icon: 'npm',
    description: 'The default Node.js package manager'
  },
  { 
    value: 'yarn', 
    label: 'Yarn', 
    icon: 'yarn',
    description: 'Fast, reliable, and secure dependency management'
  },
  { 
    value: 'pnpm', 
    label: 'pnpm', 
    icon: 'package-variant',
    description: 'Fast, disk space efficient package manager'
  },
  { 
    value: 'bun', 
    label: 'Bun', 
    icon: 'lightning-bolt',
    description: 'Incredibly fast all-in-one JavaScript runtime'
  },
]

// UI State
const alertMessage = ref('')
const alertType = ref<'success' | 'error'>('success')
const generatedCommand = ref('')

// Feature selections (array-based v-model)
const selectedFeatures = ref<string[]>([])
const gitInit = ref(true)

// Form using the new useForm API with initial values
const form = useForm<ProjectFormValues>({
  initialValues: {
    projectName: '',
    framework: '',
    language: '',
    packageManager: '',
    features: []
  },
  fields: {
    projectName: {
      rules: [
        required('Project name is required'),
        minLength(2, 'Min 2 characters'),
        pattern(/^[a-z][a-z0-9-]*$/, 'Use lowercase, numbers, hyphens only. Start with letter.')
      ]
    },
    framework: {
      rules: [
        required('Please select a framework'),
        oneOf(frameworkOptions.map(f => f.value), 'Invalid framework')
      ]
    },
    language: {
      rules: [
        required('Please select a language')
      ]
    },
    packageManager: {
      rules: [
        required('Please select a package manager')
      ]
    },
    features: {
      rules: [
        custom(
          (v) => Array.isArray(v) && v.length >= 1,
          'Select at least one feature'
        )
      ]
    }
  }
})

// Watch form field and sync to selectedFeatures using the new watchField API
form.watchField('features', (val) => {
  if (Array.isArray(val)) {
    selectedFeatures.value = val
  }
})

// Watch selectedFeatures and sync to form field using setValue
watch(selectedFeatures, (val) => {
  form.setValue('features', val)
})

// Generate scaffold command
const generateCommand = (values: ProjectFormValues) => {
  const { projectName: name, framework, language: lang, packageManager: pm } = values
  
  // Build command based on framework
  const cmds: Record<string, string> = {
    vue: `${pm} create vue@latest ${name}`,
    react: `${pm} create vite@latest ${name} -- --template react${lang === 'typescript' ? '-ts' : ''}`,
    svelte: `${pm} create svelte@latest ${name}`,
    angular: `npx @angular/cli new ${name}`,
    nuxt: `npx nuxi@latest init ${name}`,
    next: `${pm} create next-app@latest ${name}`,
    astro: `${pm} create astro@latest ${name}`,
    solid: `${pm} create vite@latest ${name} -- --template solid${lang === 'typescript' ? '-ts' : ''}`,
  }
  
  let cmd = cmds[framework] || `${pm} create ${framework} ${name}`
  
  // Add features as comments
  if (selectedFeatures.value.length > 0) {
    cmd += `\n# Features: ${selectedFeatures.value.join(', ')}`
  }
  if (gitInit.value) {
    cmd += '\ncd ' + name + ' && git init'
  }
  
  return cmd
}

// Submit using the new handleSubmit API
const submit = form.handleSubmit(
  async (values) => {
    // Simulate processing
    await new Promise(r => setTimeout(r, 1000))
    
    generatedCommand.value = generateCommand(values)
    alertType.value = 'success'
    alertMessage.value = 'Project configuration complete! Copy the command below.'
  },
  () => {
    alertType.value = 'error'
    alertMessage.value = 'Please fix the errors above.'
  }
)

// Copy command
const copyCommand = async () => {
  try {
    await navigator.clipboard.writeText(generatedCommand.value)
    alertMessage.value = 'Command copied to clipboard!'
  } catch {
    alertMessage.value = 'Failed to copy command'
    alertType.value = 'error'
  }
}

// Reset form using the new reset API
const resetForm = () => {
  form.reset()
  selectedFeatures.value = []
  gitInit.value = true
  generatedCommand.value = ''
  alertMessage.value = ''
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-(--s-bg-primary) via-(--s-bg-secondary) to-(--s-bg-primary)">
    <div class="relative w-full max-w-lg">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 mb-3 shadow-lg">
          <span class="mdi mdi-rocket-launch text-2xl text-white" />
        </div>
        <h1 class="text-xl font-bold text-(--s-text-primary)">Project Scaffold</h1>
        <p class="text-sm text-(--s-text-secondary) mt-1">Create a new web project with your preferred stack</p>
      </div>

      <!-- Form Card -->
      <SCard variant="elevated" rounded="xl">
        <SCardHeader 
          title="New Project"
          subtitle="Configure your project settings"
          layout="vertical"
          align="center"
        />
        
        <SCardContent class="space-y-6">
          <!-- Alert -->
          <SAlert 
            v-if="alertMessage" 
            :type="alertType"
            :description="alertMessage"
            closable
            @close="alertMessage = ''"
          />

          <SForm :form="form" :disabled="form.isSubmitting.value">
            <!-- Project Name -->
            <SFormField name="projectName">
              <template #default="{ value, error, onUpdate, onBlur }">
                <SInput
                  :model-value="value as string"
                  @update:model-value="onUpdate"
                  @blur="onBlur"
                  label="Project Name"
                  placeholder="my-awesome-project"
                  icon-left="folder"
                  :error="error"
                  :disabled="form.isSubmitting.value"
                  hint="Lowercase, hyphens, no spaces"
                />
              </template>
            </SFormField>

            <!-- Framework Select -->
            <SFormField name="framework">
              <template #default="{ value, error, onUpdate, onBlur }">
                <SSelect
                  :model-value="value as string"
                  @update:model-value="onUpdate"
                  @blur="onBlur"
                  label="Framework"
                  placeholder="Select a framework..."
                  :options="frameworkOptions"
                  :error="error"
                  :disabled="form.isSubmitting.value"
                />
              </template>
            </SFormField>

            <!-- Language Radio -->
            <SFormField name="language">
              <template #default="{ value, error, onUpdate }">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-(--s-text-secondary)">
                    Language <span class="text-red-500">*</span>
                  </label>
                  <SRadioGroup 
                    :model-value="value as string"
                    @update:model-value="onUpdate"
                    layout="horizontal"
                    :disabled="form.isSubmitting.value"
                  >
                    <SRadio value="typescript" label="TypeScript" />
                    <SRadio value="javascript" label="JavaScript" />
                  </SRadioGroup>
                  <p v-if="error" class="text-xs text-red-500 flex items-center gap-1">
                    <span class="mdi mdi-alert-circle" />
                    {{ error }}
                  </p>
                </div>
              </template>
            </SFormField>

            <!-- Package Manager Select -->
            <SFormField name="packageManager">
              <template #default="{ value, error, onUpdate, onBlur }">
                <SSelect
                  :model-value="value as string"
                  @update:model-value="onUpdate"
                  @blur="onBlur"
                  label="Package Manager"
                  placeholder="Select package manager..."
                  :options="packageManagerOptions"
                  :error="error"
                  :disabled="form.isSubmitting.value"
                />
              </template>
            </SFormField>

            <!-- Features Checkboxes -->
            <SFormField name="features">
              <template #default="{ error }">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-(--s-text-secondary)">
                    Features <span class="text-red-500">*</span>
                  </label>
                  <div class="grid grid-cols-2 gap-2">
                    <SCheckbox 
                      v-model="selectedFeatures"
                      value="router" 
                      label="Router" 
                      :disabled="form.isSubmitting.value" 
                    />
                    <SCheckbox 
                      v-model="selectedFeatures"
                      value="state" 
                      label="State Management" 
                      :disabled="form.isSubmitting.value" 
                    />
                    <SCheckbox 
                      v-model="selectedFeatures"
                      value="testing" 
                      label="Testing" 
                      :disabled="form.isSubmitting.value" 
                    />
                    <SCheckbox 
                      v-model="selectedFeatures"
                      value="linting" 
                      label="ESLint + Prettier" 
                      :disabled="form.isSubmitting.value" 
                    />
                    <SCheckbox 
                      v-model="selectedFeatures"
                      value="tailwind" 
                      label="Tailwind CSS" 
                      :disabled="form.isSubmitting.value" 
                    />
                    <SCheckbox 
                      v-model="selectedFeatures"
                      value="i18n" 
                      label="Internationalization" 
                      :disabled="form.isSubmitting.value" 
                    />
                  </div>
                  <p v-if="error" class="text-xs text-red-500 flex items-center gap-1">
                    <span class="mdi mdi-alert-circle" />
                    {{ error }}
                  </p>
                </div>
              </template>
            </SFormField>
          </SForm>

          <!-- Git Init -->
          <SCheckbox v-model="gitInit" label="Initialize Git repository" :disabled="form.isSubmitting.value" />

          <!-- Generated Command -->
          <div v-if="generatedCommand" class="mt-4">
            <label class="block text-sm font-medium text-(--s-text-secondary) mb-2">Generated Command</label>
            <div class="relative">
              <pre class="bg-(--s-bg-tertiary) text-(--s-text-primary) p-4 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap">{{ generatedCommand }}</pre>
              <SButton
                @click="copyCommand"
                variant="ghost"
                iconOnly
                iconLeft="content-copy"
                class="absolute top-2 right-2"
                title="Copy command"
              />
            </div>
          </div>
        </SCardContent>

        <SCardFooter class="flex-col gap-2">
          <div class="flex gap-2 w-full">
            <SButton 
              variant="outlined" 
              class="flex-1" 
              :disabled="form.isSubmitting.value"
              @click="resetForm"
            >
              <span class="mdi mdi-refresh mr-1" /> Reset
            </SButton>
            <SButton 
              class="flex-1" 
              :loading="form.isSubmitting.value" 
              :disabled="form.isSubmitting.value" 
              @click="submit"
            >
              <span class="mdi mdi-rocket-launch mr-1" /> Generate
            </SButton>
          </div>
        </SCardFooter>
      </SCard>

      <!-- Info -->
      <p class="text-center mt-4 text-xs text-(--s-text-tertiary)">
        Demonstrates validation with SInput, SSelect, SRadio, and SCheckbox
      </p>
    </div>
  </div>
</template>
