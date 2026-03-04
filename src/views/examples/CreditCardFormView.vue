<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import {
  SCard, SCardContent, SInput, SButton, SSelect,
  useForm,
  required,
  minLength,
  pattern,
  custom
} from '../../index'

// Form field types
interface CreditCardFormValues {
  cardNumber: string
  cardName: string
  cardMonth: string
  cardYear: string
  cardCvv: string
}

// Card backgrounds - beautiful gradient options
const cardBackgrounds = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)'
]

// State
const isCardFlipped = ref(false)
const focusedField = ref<string | null>(null)
const currentCardBackground = ref(cardBackgrounds[Math.floor(Math.random() * cardBackgrounds.length)])
const cardNumberRef = ref<HTMLElement | null>(null)
const cardNameRef = ref<HTMLElement | null>(null)
const cardDateRef = ref<HTMLElement | null>(null)
const focusBoxStyle = ref<Record<string, string> | null>(null)

// Month/Year options
const currentYear = new Date().getFullYear()
const monthOptions = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1).padStart(2, '0'),
  label: String(i + 1).padStart(2, '0')
}))

const yearOptions = Array.from({ length: 12 }, (_, i) => ({
  value: String(currentYear + i),
  label: String(currentYear + i)
}))

// Form using the new useForm API with initial values
const form = useForm<CreditCardFormValues>({
  initialValues: {
    cardNumber: '',
    cardName: '',
    cardMonth: '',
    cardYear: '',
    cardCvv: ''
  },
  fields: {
    cardNumber: {
      rules: [
        required('Card number is required'),
        custom(
          (v) => String(v).replace(/\s/g, '').length >= 15,
          'Enter a valid card number'
        )
      ]
    },
    cardName: {
      rules: [
        required('Card holder name is required'),
        minLength(3, 'Name too short'),
        pattern(/^[a-zA-Z\s]+$/, 'Only letters allowed')
      ]
    },
    cardMonth: {
      rules: [required('Month required')]
    },
    cardYear: {
      rules: [required('Year required')]
    },
    cardCvv: {
      rules: [
        required('CVV is required'),
        pattern(/^\d{3,4}$/, 'Enter 3 or 4 digits')
      ]
    }
  }
})

// Computed card values
const cardNumber = computed(() => String(form.fields.cardNumber.value.value || ''))
const cardName = computed(() => String(form.fields.cardName.value.value || ''))
const cardMonth = computed(() => String(form.fields.cardMonth.value.value || ''))
const cardYear = computed(() => String(form.fields.cardYear.value.value || ''))
const cardCvv = computed(() => String(form.fields.cardCvv.value.value || ''))

// Card number mask for each digit
const cardNumberMask = computed(() => {
  const num = cardNumber.value.replace(/\s/g, '')
  const result: { char: string; filled: boolean; masked: boolean }[] = []
  
  for (let i = 0; i < 16; i++) {
    const char = num[i] || '#'
    const filled = i < num.length
    // Mask middle digits (positions 4-11) when filled
    const masked = filled && i >= 4 && i < 12
    result.push({ char: masked ? '*' : char, filled, masked })
    
    // Add space every 4 digits (but not at the end)
    if ((i + 1) % 4 === 0 && i < 15) {
      result.push({ char: ' ', filled: false, masked: false })
    }
  }
  
  return result
})

// Detect card type based on number
const cardType = computed(() => {
  const num = cardNumber.value.replace(/\s/g, '')
  if (/^4/.test(num)) return 'visa'
  if (/^(34|37)/.test(num)) return 'amex'
  if (/^5[1-5]/.test(num)) return 'mastercard'
  if (/^6011/.test(num)) return 'discover'
  if (/^9792/.test(num)) return 'troy'
  return 'visa' // default
})

// Card type label
const cardTypeLabel = computed(() => {
  const labels: Record<string, string> = {
    visa: 'VISA',
    mastercard: 'MasterCard',
    amex: 'AMEX',
    discover: 'Discover',
    troy: 'Troy'
  }
  return labels[cardType.value] || 'VISA'
})

// Format card number input
const formatCardNumber = (value: string) => {
  // Remove all non-digit characters
  let cleaned = value.replace(/\D/g, '')
  // Limit to 16 digits
  cleaned = cleaned.slice(0, 16)
  // Add spaces every 4 digits
  const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
  return formatted
}

// Handle card number input
const onCardNumberInput = (val: string | number) => {
  const formatted = formatCardNumber(String(val))
  form.fields.cardNumber.value.value = formatted
}

// Handle card name input
const onCardNameInput = (val: string | number) => {
  form.fields.cardName.value.value = String(val).toUpperCase()
}

// Handle CVV input
const onCvvInput = (val: string | number) => {
  const cleaned = String(val).replace(/\D/g, '').slice(0, 4)
  form.fields.cardCvv.value.value = cleaned
}

// Calculate focus box position
const updateFocusBox = async () => {
  await nextTick()
  
  let targetRef: HTMLElement | null = null
  
  switch (focusedField.value) {
    case 'cardNumber':
      targetRef = cardNumberRef.value
      break
    case 'cardName':
      targetRef = cardNameRef.value
      break
    case 'cardMonth':
    case 'cardYear':
      targetRef = cardDateRef.value
      break
    default:
      focusBoxStyle.value = null
      return
  }
  
  if (targetRef) {
    const rect = targetRef.getBoundingClientRect()
    const parent = targetRef.closest('.credit-card-front')
    if (parent) {
      const parentRect = parent.getBoundingClientRect()
      focusBoxStyle.value = {
        width: `${rect.width + 16}px`,
        height: `${rect.height + 12}px`,
        transform: `translate(${rect.left - parentRect.left - 8}px, ${rect.top - parentRect.top - 6}px)`
      }
    }
  }
}

// Watch focused field
watch(focusedField, updateFocusBox)
watch([cardNumber, cardName, cardMonth, cardYear], updateFocusBox)

// Focus handlers
const handleFocus = (field: string) => {
  focusedField.value = field
}

const handleBlur = () => {
  setTimeout(() => {
    focusedField.value = null
  }, 200)
}

// Watch focusedField to flip card when CVV is focused
watch(focusedField, (field) => {
  if (field === 'cardCvv') {
    isCardFlipped.value = true
  } else {
    isCardFlipped.value = false
  }
})

// Submit using the new handleSubmit API
const isSuccess = ref(false)

const submit = form.handleSubmit(async () => {
  // Simulate processing
  await new Promise(r => setTimeout(r, 2000))
  
  isSuccess.value = true
  
  // Reset after showing success
  setTimeout(() => {
    form.reset()
    isSuccess.value = false
  }, 3000)
})

// Computed validation state - using form.valid and checking all fields have values
const isFormValid = computed(() => {
  const { cardNumber, cardName, cardMonth, cardYear, cardCvv } = form.fields
  return form.valid.value &&
         cardNumber.value.value && cardName.value.value && 
         cardMonth.value.value && cardYear.value.value && cardCvv.value.value
})

// Initialize on mount
onMounted(() => {
  // Random background
  currentCardBackground.value = cardBackgrounds[Math.floor(Math.random() * cardBackgrounds.length)]
})
</script>

<template>
  <div class="credit-card-example min-h-screen flex items-center justify-center p-6">
    <!-- Animated background -->
    <div class="fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl animate-pulse" />
      <div class="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-fuchsia-500/20 blur-3xl animate-pulse" style="animation-delay: 1s" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse" style="animation-delay: 0.5s" />
    </div>

    <div class="w-full max-w-xl">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br from-violet-500 to-fuchsia-500 mb-3 shadow-lg shadow-violet-500/30">
          <span class="mdi mdi-credit-card-outline text-2xl text-white" />
        </div>
        <h1 class="text-2xl font-bold text-(--s-text-primary)">Interactive Credit Card</h1>
        <p class="text-sm text-(--s-text-secondary) mt-1">Try filling in the form to see the magic ✨</p>
      </div>

      <!-- Card Container -->
      <div class="relative mb-6 z-10 perspective-1000 pointer-events-none">
        <div 
          class="credit-card-wrapper w-full max-w-[400px] mx-auto aspect-[1.586/1] transition-transform duration-700 transform-style-3d"
          :class="{ 'rotate-y-180': isCardFlipped }"
        >
          <!-- Front of card -->
          <div 
            class="credit-card-front absolute inset-0 rounded-2xl overflow-hidden backface-hidden shadow-2xl shadow-black/30"
          >
            <!-- Background gradient -->
            <div 
              class="absolute inset-0 transition-all duration-500"
              :style="{ background: currentCardBackground }"
            />
            
            <!-- Glassmorphism overlay -->
            <div class="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            
            <!-- Focus highlight box -->
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div 
                v-if="focusBoxStyle"
                class="absolute border-2 border-white/60 rounded-lg pointer-events-none transition-all duration-300 ease-out"
                :style="focusBoxStyle"
              >
                <div class="absolute inset-0 bg-white/5 rounded-lg backdrop-blur-xs" />
              </div>
            </Transition>
            
            <!-- Card content -->
            <div class="relative h-full p-6 flex flex-col">
              <!-- Top row: Chip & Card Type -->
              <div class="flex justify-between items-start mb-auto">
                <!-- Chip -->
                <div class="w-12 h-9 rounded-md bg-linear-to-br from-amber-200 via-amber-300 to-amber-400 shadow-lg flex items-center justify-center">
                  <div class="w-8 h-6 border border-amber-500/50 rounded-sm grid grid-cols-3 gap-px">
                    <div v-for="i in 6" :key="i" class="bg-amber-400/50 rounded-xs" />
                  </div>
                </div>
                
                <!-- Card type -->
                <Transition
                  enter-active-class="transition-all duration-300 ease-out"
                  enter-from-class="opacity-0 translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 -translate-y-2"
                  mode="out-in"
                >
                  <div 
                    :key="cardType"
                    class="text-white font-bold text-xl tracking-wide"
                  >
                    {{ cardTypeLabel }}
                  </div>
                </Transition>
              </div>
              
              <!-- Card number -->
              <div 
                ref="cardNumberRef"
                class="card-number font-mono text-base sm:text-xl text-white tracking-wider my-4 cursor-pointer select-none"
              >
                <TransitionGroup
                  name="card-digit"
                  tag="span"
                  class="inline-flex items-center relative flex-wrap"
                >
                  <span
                    v-for="(digit, index) in cardNumberMask"
                    :key="`${index}-${digit.char}`"
                    class="card-number-digit inline-flex items-center justify-center"
                    :class="{
                      'w-[14px] sm:w-[18px] h-7': digit.char !== ' ',
                      'w-1.5 sm:w-2': digit.char === ' ',
                      'text-white/40': !digit.filled && digit.char === '#',
                      'text-shadow-lg text-white': digit.filled
                    }"
                    :style="{ transitionDelay: `${(index % 4) * 30}ms` }"
                  >
                    {{ digit.char }}
                  </span>
                </TransitionGroup>
              </div>
              
              <!-- Bottom row: Name & Expiry -->
              <div class="flex justify-between items-end mt-auto">
                <!-- Card holder -->
                <div ref="cardNameRef" class="cursor-pointer">
                  <div class="text-white/60 text-xs uppercase tracking-wider mb-1">Card Holder</div>
                  <div class="text-white font-medium tracking-wide truncate max-w-48 h-6 overflow-hidden">
                    <TransitionGroup
                      name="card-name"
                      tag="span"
                      class="inline-flex relative items-center"
                    >
                      <span
                        v-for="(char, index) in (cardName || 'FULL NAME').split('')"
                        :key="`name-${index}-${char}`"
                        class="inline-flex items-center justify-center"
                        :class="{
                          'text-white/40': !cardName,
                          'text-white text-shadow-lg': cardName,
                          'w-2': char === ' '
                        }"
                        :style="{ transitionDelay: `${index * 25}ms` }"
                      >
                        {{ char === ' ' ? '' : char }}
                      </span>
                    </TransitionGroup>
                  </div>
                </div>
                
                <!-- Expiry -->
                <div ref="cardDateRef" class="text-right cursor-pointer">
                  <div class="text-white/60 text-xs uppercase tracking-wider mb-1">Expires</div>
                  <div class="text-white font-medium tracking-wide flex items-center justify-end gap-0.5">
                    <Transition name="card-date" mode="out-in">
                      <span 
                        :key="cardMonth || 'MM'" 
                        class="inline-block"
                        :class="{ 'text-white/40': !cardMonth, 'text-shadow-lg': cardMonth }"
                      >
                        {{ cardMonth || 'MM' }}
                      </span>
                    </Transition>
                    <span class="text-white/60">/</span>
                    <Transition name="card-date" mode="out-in">
                      <span 
                        :key="cardYear || 'YY'" 
                        class="inline-block"
                        :class="{ 'text-white/40': !cardYear, 'text-shadow-lg': cardYear }"
                      >
                        {{ cardYear ? cardYear.slice(-2) : 'YY' }}
                      </span>
                    </Transition>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Back of card -->
          <div 
            class="credit-card-back absolute inset-0 rounded-2xl overflow-hidden backface-hidden rotate-y-180 shadow-2xl shadow-black/30"
          >
            <!-- Background gradient -->
            <div 
              class="absolute inset-0 transition-all duration-500"
              :style="{ background: currentCardBackground }"
            />
            
            <!-- Glassmorphism overlay -->
            <div class="absolute inset-0 bg-white/10" />
            
            <!-- Card content -->
            <div class="relative h-full flex flex-col">
              <!-- Magnetic stripe -->
              <div class="w-full h-12 bg-gray-900/90 mt-6" />
              
              <!-- CVV section -->
              <div class="px-6 mt-6">
                <div class="text-white/60 text-xs uppercase tracking-wider text-right mb-2">CVV</div>
                <div class="bg-white rounded h-10 flex items-center justify-end px-4 text-gray-800 font-mono text-lg tracking-widest">
                  <TransitionGroup name="card-digit" tag="span">
                    <span v-for="i in cardCvv.length" :key="i">*</span>
                  </TransitionGroup>
                  <span v-if="!cardCvv" class="text-gray-400">***</span>
                </div>
              </div>
              
              <!-- Card type on back -->
              <div class="mt-auto px-6 pb-6 flex justify-end">
                <div class="text-white/70 font-bold text-lg tracking-wide">
                  {{ cardTypeLabel }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form -->
      <SCard variant="elevated" rounded="2xl">
        <SCardContent>
          <!-- Success overlay -->
          <Transition
            enter-active-class="transition-all duration-500 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div 
              v-if="isSuccess" 
              class="absolute inset-0 z-20 rounded-2xl bg-(--s-bg-primary) flex flex-col items-center justify-center"
            >
              <div class="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4 animate-bounce">
                <span class="mdi mdi-check text-4xl text-green-500" />
              </div>
              <h3 class="text-xl font-bold text-(--s-text-primary)">Payment Successful!</h3>
              <p class="text-sm text-(--s-text-secondary) mt-1">Thank you for your purchase</p>
            </div>
          </Transition>

          <div class="space-y-4">
            <!-- Card Number -->
            <SInput
              :model-value="cardNumber"
              @update:model-value="onCardNumberInput"
              @focus="() => handleFocus('cardNumber')"
              @blur="handleBlur"
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              icon-left="credit-card-outline"
              :error="form.fields.cardNumber.touched.value ? form.fields.cardNumber.error.value : undefined"
              :disabled="form.isSubmitting.value || isSuccess"
              maxlength="19"
              inputmode="numeric"
              autocomplete="cc-number"
            />
            
            <!-- Card Holder -->
            <SInput
              :model-value="cardName"
              @update:model-value="onCardNameInput"
              @focus="() => handleFocus('cardName')"
              @blur="handleBlur"
              label="Card Holder"
              placeholder="JOHN DOE"
              icon-left="account-outline"
              :error="form.fields.cardName.touched.value ? form.fields.cardName.error.value : undefined"
              :disabled="form.isSubmitting.value || isSuccess"
              autocomplete="cc-name"
            />
            
            <!-- Expiry & CVV row -->
            <div class="grid grid-cols-3 gap-3">
              <!-- Month -->
              <SSelect
                :model-value="cardMonth"
                @update:model-value="(v: unknown) => form.fields.cardMonth.value.value = v"
                @focus="() => handleFocus('cardMonth')"
                @blur="handleBlur"
                label="Month"
                placeholder="MM"
                :options="monthOptions"
                :error="form.fields.cardMonth.touched.value ? form.fields.cardMonth.error.value : undefined"
                :disabled="form.isSubmitting.value || isSuccess"
              />
              
              <!-- Year -->
              <SSelect
                :model-value="cardYear"
                @update:model-value="(v: unknown) => form.fields.cardYear.value.value = v"
                @focus="() => handleFocus('cardYear')"
                @blur="handleBlur"
                label="Year"
                placeholder="YYYY"
                :options="yearOptions"
                :error="form.fields.cardYear.touched.value ? form.fields.cardYear.error.value : undefined"
                :disabled="form.isSubmitting.value || isSuccess"
              />
              
              <!-- CVV -->
              <div @focusin="() => handleFocus('cardCvv')" @focusout="handleBlur">
                <SInput
                  :model-value="cardCvv"
                  @update:model-value="onCvvInput"
                  label="CVV"
                  placeholder="***"
                  type="password"
                :error="form.fields.cardCvv.touched.value ? form.fields.cardCvv.error.value : undefined"
                  :disabled="form.isSubmitting.value || isSuccess"
                  maxlength="4"
                  inputmode="numeric"
                  autocomplete="cc-csc"
                />
              </div>
            </div>
            
            <!-- Submit button -->
            <SButton
              block
              size="large"
              :loading="form.isSubmitting.value"
              :disabled="!isFormValid || form.isSubmitting.value || isSuccess"
              @click="submit"
              class="mt-6"
            >
              <span class="mdi mdi-lock-outline mr-2" />
              {{ form.isSubmitting.value ? 'Processing...' : 'Pay Now' }}
            </SButton>
            
            <!-- Security note -->
            <p class="text-center text-xs text-(--s-text-tertiary) mt-4 flex items-center justify-center gap-1">
              <span class="mdi mdi-shield-check text-green-500" />
              Your payment info is secure and encrypted
            </p>
          </div>
        </SCardContent>
      </SCard>

      <!-- Footer -->
      <p class="text-center mt-6 text-xs text-(--s-text-tertiary)">
        Built with <span class="text-red-500">♥</span> using Saka UI components
      </p>
    </div>
  </div>
</template>

<style scoped>
/* 3D perspective */
.perspective-1000 {
  perspective: 1000px;
}

.transform-style-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

/* Card digit animations - flip morphing effect */
.card-digit-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card-digit-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
}

.card-digit-enter-from {
  opacity: 0;
  transform: translateY(20px) rotateX(-90deg) scale(0.8);
}

.card-digit-leave-to {
  opacity: 0;
  transform: translateY(-15px) rotateX(90deg) scale(0.8);
}

.card-digit-move {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Card name character animations - smooth slide-in */
.card-name-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card-name-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
}

.card-name-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.5);
}

.card-name-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.5);
}

.card-name-move {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Date morphing animation */
.card-date-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card-date-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-date-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.7);
}

.card-date-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.7);
}

/* Text shadow for better readability */
.text-shadow-lg {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Card hover effect */
.credit-card-wrapper {
  transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
}

.credit-card-front,
.credit-card-back {
  transition: box-shadow 0.3s ease;
}

.credit-card-wrapper:hover .credit-card-front,
.credit-card-wrapper:hover .credit-card-back {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

/* Number digit styling */
.card-number-digit {
  transition: all 0.15s ease;
}

/* Ensure smooth digit list transitions */
.card-number {
  min-height: 1.5em;
}
</style>
