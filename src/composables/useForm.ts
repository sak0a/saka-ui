import { ref, computed, watch, onMounted, type Ref, type ComputedRef, type WatchStopHandle } from 'vue'

// ============================================================================
// Types
// ============================================================================

export type ValidationRule<T = unknown> = (value: T, formData?: Record<string, unknown>) => string | true
export type AsyncValidationRule<T = unknown> = (value: T, formData?: Record<string, unknown>) => Promise<string | true>

export interface FieldConfig<T = unknown> {
    rules?: (ValidationRule<T> | AsyncValidationRule<T>)[]
    validateOn?: 'input' | 'blur' | 'submit'
    /** Debounce delay in ms for async validations (default: 300) */
    debounce?: number
    /** Field dependencies - revalidate this field when these fields change */
    deps?: string[]
    /** Whether to persist this field (default: true). Set to false to exclude from persistence */
    persist?: boolean
}

export interface FieldState<T = unknown> {
    value: Ref<T>
    error: Ref<string>
    touched: Ref<boolean>
    dirty: Ref<boolean>
    valid: ComputedRef<boolean>
    validate: () => Promise<boolean>
    reset: () => void
}

/** Mapped type for type-safe field access */
export type TypedFields<TValues extends Record<string, unknown>> = {
    [K in keyof TValues]: FieldState<TValues[K]>
}

/** Persistence options for form state */
export interface PersistOptions {
    /** Storage key for the form data */
    key: string
    /** Storage type: 'localStorage' or 'sessionStorage' (default: 'localStorage') */
    storage?: 'localStorage' | 'sessionStorage'
    /** Debounce delay for saving in ms (default: 500) */
    debounce?: number
}

/** Zod-like schema interface for type inference */
export interface ZodLikeSchema<T = unknown> {
    safeParse: (data: unknown) => { success: true; data: T } | { success: false; error: { errors: Array<{ path: (string | number)[]; message: string }> } }
    shape?: Record<string, unknown>
}

/** Form state returned by useForm composable */
export interface FormState<TValues extends Record<string, unknown> = Record<string, unknown>> {
    /** Type-safe field access */
    fields: TypedFields<TValues>
    errors: ComputedRef<Record<string, string>>
    valid: ComputedRef<boolean>
    dirty: ComputedRef<boolean>
    touched: ComputedRef<boolean>
    validate: () => Promise<boolean>
    reset: (values?: Partial<TValues>) => void
    getValues: () => TValues
    // Submission state
    isSubmitting: Ref<boolean>
    submitError: Ref<string | null>
    submitCount: Ref<number>
    isSubmitSuccessful: Ref<boolean>
    // Value management
    setValue: <K extends keyof TValues>(name: K, value: TValues[K]) => void
    setValues: (values: Partial<TValues>) => void
    getFieldValue: <K extends keyof TValues>(name: K) => TValues[K]
    // Error management
    setError: (name: keyof TValues, error: string) => void
    clearError: (name: keyof TValues) => void
    clearErrors: () => void
    // Field state management
    resetField: (name: keyof TValues) => void
    setFieldTouched: (name: keyof TValues, touched?: boolean) => void
    setFieldDirty: (name: keyof TValues, dirty?: boolean) => void
    // Submission
    handleSubmit: <TResult = void>(
        onSubmit: (values: TValues) => Promise<TResult> | TResult,
        onError?: (error: unknown) => void
    ) => () => Promise<TResult | undefined>
    // Watchers
    watchForm: (callback: (values: TValues) => void) => WatchStopHandle
    watchField: <K extends keyof TValues>(name: K, callback: (value: TValues[K], oldValue: TValues[K]) => void) => WatchStopHandle
    // Persistence
    clearPersisted: () => void
}

/** Options for useForm composable */
export interface UseFormOptions<TValues extends Record<string, unknown> = Record<string, unknown>> {
    /** Initial values for form fields */
    initialValues?: Partial<TValues>
    /** Field configurations with validation rules */
    fields?: { [K in keyof TValues]?: FieldConfig<TValues[K]> }
    /** Zod schema for validation (alternative to fields.rules) */
    schema?: ZodLikeSchema<TValues>
    /** Global debounce delay for async validations (default: 300ms) */
    debounceDelay?: number
    /** Validation mode: 'onChange' | 'onBlur' | 'onSubmit' | 'all' (default: 'onChange') */
    mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'all'
    /** Persistence options for auto-saving form state */
    persist?: PersistOptions
}

// ============================================================================
// Built-in Validators
// ============================================================================

/** Required field validator */
export const required = (msg = 'This field is required'): ValidationRule =>
    (value) => {
        if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
            return msg
        }
        return true
    }

/** Minimum length validator */
export const minLength = (min: number, msg?: string): ValidationRule =>
    (value) => {
        const str = String(value ?? '')
        if (str.length < min) {
            return msg ?? `Minimum ${min} characters`
        }
        return true
    }

/** Maximum length validator */
export const maxLength = (max: number, msg?: string): ValidationRule =>
    (value) => {
        const str = String(value ?? '')
        if (str.length > max) {
            return msg ?? `Maximum ${max} characters`
        }
        return true
    }

/** Minimum value validator (for numbers) */
export const min = (minVal: number, msg?: string): ValidationRule =>
    (value) => {
        const num = Number(value)
        if (isNaN(num) || num < minVal) {
            return msg ?? `Minimum value is ${minVal}`
        }
        return true
    }

/** Maximum value validator (for numbers) */
export const max = (maxVal: number, msg?: string): ValidationRule =>
    (value) => {
        const num = Number(value)
        if (isNaN(num) || num > maxVal) {
            return msg ?? `Maximum value is ${maxVal}`
        }
        return true
    }

/** Email format validator */
export const email = (msg = 'Invalid email address'): ValidationRule =>
    (value) => {
        const str = String(value ?? '')
        if (!str) return true // Skip if empty (use required for required fields)
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) {
            return msg
        }
        return true
    }

/** URL format validator */
export const url = (msg = 'Invalid URL'): ValidationRule =>
    (value) => {
        const str = String(value ?? '')
        if (!str) return true
        try {
            new URL(str)
            return true
        } catch {
            return msg
        }
    }

/** Regex pattern validator */
export const pattern = (regex: RegExp, msg = 'Invalid format'): ValidationRule =>
    (value) => {
        const str = String(value ?? '')
        if (!str) return true
        if (!regex.test(str)) {
            return msg
        }
        return true
    }

/** Match another field validator */
export const sameAs = (fieldName: string, msg?: string): ValidationRule =>
    (value, formData) => {
        if (!formData) return true
        if (value !== formData[fieldName]) {
            return msg ?? `Must match ${fieldName}`
        }
        return true
    }

/** Contain uppercase letter */
export const hasUppercase = (msg = 'Must contain an uppercase letter'): ValidationRule =>
    (value) => {
        const str = String(value ?? '')
        if (!str) return true
        if (!/[A-Z]/.test(str)) return msg
        return true
    }

/** Contain lowercase letter */
export const hasLowercase = (msg = 'Must contain a lowercase letter'): ValidationRule =>
    (value) => {
        const str = String(value ?? '')
        if (!str) return true
        if (!/[a-z]/.test(str)) return msg
        return true
    }

/** Contain digit */
export const hasDigit = (msg = 'Must contain a number'): ValidationRule =>
    (value) => {
        const str = String(value ?? '')
        if (!str) return true
        if (!/\d/.test(str)) return msg
        return true
    }

/** Contain special character */
export const hasSpecial = (msg = 'Must contain a special character'): ValidationRule =>
    (value) => {
        const str = String(value ?? '')
        if (!str) return true
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(str)) return msg
        return true
    }

/** Alphanumeric only */
export const alphanumeric = (msg = 'Only letters and numbers allowed'): ValidationRule =>
    (value) => {
        const str = String(value ?? '')
        if (!str) return true
        if (!/^[a-zA-Z0-9]+$/.test(str)) return msg
        return true
    }

/** Numeric only */
export const numeric = (msg = 'Only numbers allowed'): ValidationRule =>
    (value) => {
        const str = String(value ?? '')
        if (!str) return true
        if (!/^\d+$/.test(str)) return msg
        return true
    }

// ============================================================================
// Custom Validators
// ============================================================================

/**
 * Create a custom validator from a boolean function
 * @example custom((v) => v.length > 5, 'Too short')
 * @example custom(async (v) => await checkUsername(v), 'Username taken')
 */
export const custom = (
    fn: (value: unknown, formData?: Record<string, unknown>) => boolean | Promise<boolean>,
    msg = 'Validation failed'
): ValidationRule | AsyncValidationRule =>
    async (value, formData) => {
        const result = await fn(value, formData)
        return result ? true : msg
    }

/** Password strength levels */
export enum PasswordStrength {
    /** 6+ chars */
    WEAK = 'weak',
    /** 8+ chars, 1 uppercase, 1 number */
    MEDIUM = 'medium',
    /** 10+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special */
    STRONG = 'strong',
    /** 12+ chars, 2 uppercase, 2 lowercase, 2 numbers, 1 special */
    VERY_STRONG = 'very_strong'
}

/** Password strength validator with configurable levels */
export const passwordStrength = (
    strength: PasswordStrength = PasswordStrength.MEDIUM,
    msg?: string
): ValidationRule =>
    (value) => {
        const str = String(value ?? '')
        if (!str) return true // Use required() for required check

        const checks = {
            [PasswordStrength.WEAK]: {
                minLength: 6,
                test: () => true,
                defaultMsg: 'Password must be at least 6 characters'
            },
            [PasswordStrength.MEDIUM]: {
                minLength: 8,
                test: () => /[A-Z]/.test(str) && /\d/.test(str),
                defaultMsg: 'Password needs 8+ chars, 1 uppercase, 1 number'
            },
            [PasswordStrength.STRONG]: {
                minLength: 10,
                test: () =>
                    /[A-Z]/.test(str) &&
                    /[a-z]/.test(str) &&
                    /\d/.test(str) &&
                    /[!@#$%^&*(),.?":{}|<>]/.test(str),
                defaultMsg: 'Password needs 10+ chars, upper, lower, number, special'
            },
            [PasswordStrength.VERY_STRONG]: {
                minLength: 12,
                test: () => {
                    const uppers = (str.match(/[A-Z]/g) || []).length >= 2
                    const lowers = (str.match(/[a-z]/g) || []).length >= 2
                    const digits = (str.match(/\d/g) || []).length >= 2
                    const special = /[!@#$%^&*(),.?":{}|<>]/.test(str)
                    return uppers && lowers && digits && special
                },
                defaultMsg: 'Password needs 12+ chars, 2 upper, 2 lower, 2 numbers, 1 special'
            }
        }

        const check = checks[strength]
        if (str.length < check.minLength) {
            return msg || check.defaultMsg
        }
        if (!check.test()) {
            return msg || check.defaultMsg
        }
        return true
    }

/** Check if value is different from another field */
export const different = (fieldName: string, msg?: string): ValidationRule =>
    (value, formData) => {
        if (!formData) return true
        if (value === formData[fieldName]) {
            return msg ?? `Must be different from ${fieldName}`
        }
        return true
    }

/** Check if value is in a list of allowed values */
export const oneOf = <T>(allowed: T[], msg?: string): ValidationRule =>
    (value) => {
        if (!allowed.includes(value as T)) {
            return msg ?? `Must be one of: ${allowed.join(', ')}`
        }
        return true
    }

/** Check if value is NOT in a list of disallowed values */
export const notOneOf = <T>(disallowed: T[], msg?: string): ValidationRule =>
    (value) => {
        if (disallowed.includes(value as T)) {
            return msg ?? `Cannot be: ${disallowed.join(', ')}`
        }
        return true
    }


// ============================================================================
// Debounce utility
// ============================================================================

function debounce<T extends (...args: unknown[]) => unknown>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    return (...args: Parameters<T>) => {
        if (timeoutId) clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn(...args), delay)
    }
}

// ============================================================================
// Storage utilities
// ============================================================================

function getStorage(type: 'localStorage' | 'sessionStorage'): Storage | null {
    try {
        return type === 'localStorage' ? localStorage : sessionStorage
    } catch {
        return null
    }
}

function loadFromStorage<T>(key: string, storage: Storage | null): T | null {
    if (!storage) return null
    try {
        const data = storage.getItem(key)
        return data ? JSON.parse(data) : null
    } catch {
        return null
    }
}

function saveToStorage(key: string, data: unknown, storage: Storage | null): void {
    if (!storage) return
    try {
        storage.setItem(key, JSON.stringify(data))
    } catch {
        // Storage full or unavailable
    }
}

function removeFromStorage(key: string, storage: Storage | null): void {
    if (!storage) return
    try {
        storage.removeItem(key)
    } catch {
        // Storage unavailable
    }
}

// ============================================================================
// Zod validation helper
// ============================================================================

function validateWithZod<TValues>(
    schema: ZodLikeSchema<TValues>,
    values: Record<string, unknown>,
    fieldName?: string
): Record<string, string> {
    const result = schema.safeParse(values)
    const errors: Record<string, string> = {}
    
    if (!result.success) {
        for (const err of result.error.errors) {
            const path = err.path[0]?.toString() ?? ''
            if (!fieldName || path === fieldName) {
                if (!errors[path]) {
                    errors[path] = err.message
                }
            }
        }
    }
    
    return errors
}

// ============================================================================
// Main Composable: useForm
// ============================================================================

/**
 * Comprehensive form management composable with validation, submission handling,
 * and reactive state management.
 * 
 * @example
 * const form = useForm({
 *   initialValues: { email: '', password: '' },
 *   fields: {
 *     email: { rules: [required(), email()] },
 *     password: { rules: [required(), minLength(8)] }
 *   }
 * })
 * 
 * // With Zod schema
 * const form = useForm({
 *   schema: z.object({
 *     email: z.string().email(),
 *     password: z.string().min(8)
 *   })
 * })
 * 
 * const onSubmit = form.handleSubmit(async (values) => {
 *   await api.login(values)
 * })
 */
export function useForm<TValues extends Record<string, unknown> = Record<string, unknown>>(
    options: UseFormOptions<TValues>
): FormState<TValues> {
    const { 
        initialValues = {}, 
        fields: fieldsConfig = {}, 
        schema,
        debounceDelay = 300, 
        mode = 'onChange',
        persist 
    } = options
    
    // Internal field storage with proper typing
    const fields: Record<string, FieldState<unknown>> = {}
    const initialValuesStore: Record<string, unknown> = { ...initialValues }
    const fieldDependencies: Record<string, string[]> = {}
    
    // Storage for persistence
    const storage = persist ? getStorage(persist.storage ?? 'localStorage') : null
    const persistDebounce = persist?.debounce ?? 500
    
    // Form-level state
    const isSubmitting = ref(false)
    const submitError = ref<string | null>(null)
    const submitCount = ref(0)
    const isSubmitSuccessful = ref(false)

    // Get all values as object
    const getValues = (): TValues => {
        const values: Record<string, unknown> = {}
        for (const [name, field] of Object.entries(fields)) {
            values[name] = field.value.value
        }
        return values as TValues
    }

    // Get persistable values (excluding fields with persist: false)
    const getPersistableValues = (): Record<string, unknown> => {
        const values: Record<string, unknown> = {}
        const configMap = fieldsConfig as Record<string, FieldConfig | undefined>
        for (const [name, field] of Object.entries(fields)) {
            const config = configMap[name]
            if (config?.persist !== false) {
                values[name] = field.value.value
            }
        }
        return values
    }

    // Debounced save to storage
    const debouncedSave = persist 
        ? debounce(() => {
            saveToStorage(persist.key, getPersistableValues(), storage)
        }, persistDebounce)
        : () => {}

    // Load persisted values
    const loadPersistedValues = (): Record<string, unknown> | null => {
        if (!persist) return null
        return loadFromStorage<Record<string, unknown>>(persist.key, storage)
    }

    // Get field names from schema or fieldsConfig
    const getFieldNames = (): string[] => {
        if (schema?.shape) {
            return Object.keys(schema.shape)
        }
        // Combine keys from fieldsConfig and initialValues
        const keys = new Set([
            ...Object.keys(fieldsConfig),
            ...Object.keys(initialValues)
        ])
        return Array.from(keys)
    }

    // Initialize each field
    const fieldNames = getFieldNames()
    const persistedValues = loadPersistedValues()
    const configMap = fieldsConfig as Record<string, FieldConfig | undefined>

    for (const name of fieldNames) {
        const config = configMap[name]
        
        // Use persisted value, then initial value, then empty string
        const persistedValue = persistedValues?.[name]
        const fieldInitialValue = persistedValue !== undefined 
            ? persistedValue 
            : (initialValuesStore[name] ?? '')
        
        const value = ref<unknown>(fieldInitialValue)
        const error = ref('')
        const touched = ref(false)
        const dirty = ref(false)
        const initialValue = ref<unknown>(initialValuesStore[name] ?? '')

        const valid = computed(() => !error.value)

        // Store dependencies for this field
        if (config?.deps) {
            fieldDependencies[name] = config.deps
        }

        const validate = async (): Promise<boolean> => {
            const formData = getValues()
            
            // Validate with Zod schema if provided
            if (schema) {
                const zodErrors = validateWithZod(schema, formData as Record<string, unknown>, name)
                if (zodErrors[name]) {
                    error.value = zodErrors[name]
                    return false
                }
            }
            
            // Validate with custom rules
            const rules = config?.rules ?? []
            for (const rule of rules) {
                const result = await rule(value.value, formData as Record<string, unknown>)
                if (result !== true) {
                    error.value = result
                    return false
                }
            }

            error.value = ''
            return true
        }

        // Create debounced validate for async operations
        const fieldDebounce = config?.debounce ?? debounceDelay
        const debouncedValidate = debounce(validate, fieldDebounce)

        const reset = () => {
            value.value = initialValue.value
            error.value = ''
            touched.value = false
            dirty.value = false
        }

        // Determine validation trigger based on config and mode
        const validateOn = config?.validateOn ?? (mode === 'onChange' ? 'input' : mode === 'onBlur' ? 'blur' : 'submit')

        // Watch for changes to trigger validation
        watch(value, async (newVal, oldVal) => {
            if (newVal !== oldVal) {
                dirty.value = newVal !== initialValue.value
            }

            // Save to storage if persistence is enabled
            if (persist && config?.persist !== false) {
                debouncedSave()
            }

            // Only validate if touched or dirty
            if (touched.value || dirty.value) {
                if (validateOn === 'input') {
                    // Check if any rule is async
                    const hasAsyncRules = (config?.rules ?? []).some(
                        rule => rule.constructor.name === 'AsyncFunction'
                    )
                    if (hasAsyncRules) {
                        debouncedValidate()
                    } else {
                        await validate()
                    }
                }
            }

            // Trigger revalidation of dependent fields
            for (const [depFieldName, deps] of Object.entries(fieldDependencies)) {
                if (deps.includes(name) && fields[depFieldName]) {
                    const depField = fields[depFieldName]
                    if (depField.touched.value || depField.dirty.value) {
                        depField.validate()
                    }
                }
            }
        })

        fields[name] = {
            value,
            error,
            touched,
            dirty,
            valid,
            validate,
            reset
        }
    }

    // Computed: all errors
    const errors = computed(() => {
        const errs: Record<string, string> = {}
        for (const [name, field] of Object.entries(fields)) {
            errs[name] = field.error.value
        }
        return errs
    })

    // Computed: form is valid
    const valid = computed(() => {
        return Object.values(fields).every(field => field.valid.value)
    })

    // Computed: form is dirty (compared to initial values)
    const dirty = computed(() => {
        return Object.entries(fields).some(([name, field]) => {
            const initial = initialValuesStore[name] ?? ''
            return field.value.value !== initial
        })
    })

    // Computed: form is touched
    const touched = computed(() => {
        return Object.values(fields).some(field => field.touched.value)
    })

    // Validate all fields
    const validate = async (): Promise<boolean> => {
        const results = await Promise.all(
            Object.values(fields).map(field => field.validate())
        )
        return results.every(Boolean)
    }

    // Reset all fields (optionally with new values)
    const reset = (values?: Partial<TValues>) => {
        if (values) {
            // Update initial values and reset to them
            Object.assign(initialValuesStore, values)
            for (const [name, val] of Object.entries(values)) {
                if (fields[name]) {
                    (fields[name].value as Ref<unknown>).value = val
                    fields[name].error.value = ''
                    fields[name].touched.value = false
                    fields[name].dirty.value = false
                }
            }
        } else {
            Object.values(fields).forEach(field => field.reset())
        }
        submitError.value = null
        isSubmitSuccessful.value = false
    }

    // Reset a single field
    const resetField = (name: keyof TValues) => {
        if (fields[name as string]) {
            fields[name as string].reset()
        }
    }

    // Set a single field value
    const setValue = <K extends keyof TValues>(name: K, value: TValues[K]) => {
        if (fields[name as string]) {
            (fields[name as string].value as Ref<unknown>).value = value
        }
    }

    // Set multiple field values
    const setValues = (values: Partial<TValues>) => {
        for (const [name, val] of Object.entries(values)) {
            if (fields[name]) {
                (fields[name].value as Ref<unknown>).value = val
            }
        }
    }

    // Get a single field value
    const getFieldValue = <K extends keyof TValues>(name: K): TValues[K] => {
        return fields[name as string]?.value.value as TValues[K]
    }

    // Set a field error manually
    const setError = (name: keyof TValues, errorMsg: string) => {
        if (fields[name as string]) {
            fields[name as string].error.value = errorMsg
        }
    }

    // Clear a field error
    const clearError = (name: keyof TValues) => {
        if (fields[name as string]) {
            fields[name as string].error.value = ''
        }
    }

    // Clear all errors
    const clearErrors = () => {
        Object.values(fields).forEach(field => {
            field.error.value = ''
        })
        submitError.value = null
    }

    // Set field touched state
    const setFieldTouched = (name: keyof TValues, touchedState = true) => {
        if (fields[name as string]) {
            fields[name as string].touched.value = touchedState
        }
    }

    // Set field dirty state
    const setFieldDirty = (name: keyof TValues, dirtyState = true) => {
        if (fields[name as string]) {
            fields[name as string].dirty.value = dirtyState
        }
    }

    // Clear persisted data
    const clearPersisted = () => {
        if (persist) {
            removeFromStorage(persist.key, storage)
        }
    }

    // Handle form submission
    const handleSubmit = <TResult = void>(
        onSubmit: (values: TValues) => Promise<TResult> | TResult,
        onError?: (error: unknown) => void
    ): (() => Promise<TResult | undefined>) => {
        return async () => {
            submitCount.value++
            isSubmitting.value = true
            submitError.value = null
            isSubmitSuccessful.value = false

            try {
                // Validate all fields first
                const isValid = await validate()
                if (!isValid) {
                    isSubmitting.value = false
                    return undefined
                }

                // Execute submit handler
                const values = getValues()
                const result = await onSubmit(values)
                isSubmitSuccessful.value = true
                return result
            } catch (err) {
                submitError.value = err instanceof Error ? err.message : String(err)
                if (onError) {
                    onError(err)
                }
                return undefined
            } finally {
                isSubmitting.value = false
            }
        }
    }

    // Watch entire form for changes
    const watchForm = (callback: (values: TValues) => void): WatchStopHandle => {
        const fieldRefs = Object.values(fields).map(f => f.value)
        return watch(
            fieldRefs,
            () => callback(getValues()),
            { deep: true }
        )
    }

    // Watch a specific field
    const watchField = <K extends keyof TValues>(
        name: K,
        callback: (value: TValues[K], oldValue: TValues[K]) => void
    ): WatchStopHandle => {
        const field = fields[name as string]
        if (!field) {
            console.warn(`[useForm] Field "${String(name)}" not found`)
            return () => {}
        }
        return watch(
            field.value,
            (newVal, oldVal) => callback(newVal as TValues[K], oldVal as TValues[K])
        )
    }

    // Mount hook for persistence initialization
    if (persist) {
        onMounted(() => {
            // Values are already loaded in field initialization
            // This hook can be used for any additional setup
        })
    }

    return {
        fields: fields as TypedFields<TValues>,
        errors,
        valid,
        dirty,
        touched,
        validate,
        reset,
        getValues,
        // Submission state
        isSubmitting,
        submitError,
        submitCount,
        isSubmitSuccessful,
        // Value management
        setValue,
        setValues,
        getFieldValue,
        // Error management
        setError,
        clearError,
        clearErrors,
        // Field state management
        resetField,
        setFieldTouched,
        setFieldDirty,
        // Submission
        handleSubmit,
        // Watchers
        watchForm,
        watchField,
        // Persistence
        clearPersisted
    }
}

// ============================================================================
// Simple helper for quick field binding
// ============================================================================

export interface SimpleFieldBinding {
    modelValue: unknown
    error: string
    'onUpdate:modelValue': (value: unknown) => void
    onBlur: () => void
}

/** Create bindings for a field to use with v-bind on SInput */
export function createFieldBindings(field: FieldState): SimpleFieldBinding {
    return {
        modelValue: field.value.value,
        error: field.error.value,
        'onUpdate:modelValue': (value: unknown) => {
            field.value.value = value
        },
        onBlur: () => {
            field.touched.value = true
            field.validate()
        }
    }
}

/**
 * Helper to get field bindings for use with FormField scoped slots
 * Returns reactive bindings that automatically sync with form validation
 */
export function useFormFieldBindings(field: FieldState | null) {
    if (!field) {
        return {
            modelValue: computed(() => undefined),
            error: computed(() => ''),
            'onUpdate:modelValue': () => {},
            onBlur: () => {},
            onInput: () => {}
        }
    }

    return {
        modelValue: field.value,
        error: field.error,
        'onUpdate:modelValue': (value: unknown) => {
            field.value.value = value
        },
        onBlur: () => {
            field.touched.value = true
            field.validate()
        },
        onInput: () => {
            // Validation happens automatically via watchers
        }
    }
}

export default useForm
