# Saka-UI Component Development Rules

## Component Creation Workflow

When creating a new component for saka-ui, **always** follow these steps:

### 1. Component Implementation
Create the component in `src/components/` with:
- TypeScript interface for props
- Proper prop defaults
- Event emitters for interactions
- Scoped styles
- Modern, polished design with smooth transitions

**Example Structure:**
```vue
<script setup lang="ts">
export interface Props {
  // Define props with TypeScript
}

const props = withDefaults(defineProps<Props>(), {
  // Set defaults
})

const emit = defineEmits<{
  // Define events
}>()
</script>

<template>
  <!-- Component template -->
</template>

<style scoped>
/* Component styles */
</style>
```

### 2. Detailed UI View Page
**IMPORTANT:** Every component **must** have a corresponding detailed view page in `src/views/ui/`.

The view should include:
- **Header**: Component name and description
- **Demo Sections**: Multiple sections showcasing different features using `DemoSection` component
- **API Reference**: Complete documentation tables for:
  - Props with type, default, and description
  - Events with payload and description
  - Slots (if applicable)
- **Code Snippets**: Include code examples for each demo

**Example Structure:**
```vue
<script setup lang="ts">
import { ComponentName } from '../../index'
import DemoSection from '../../components/DemoSection.vue'

// Demo code snippets
const basicUsageCode = `<ComponentName>...</ComponentName>`

// More code snippets...
</script>

<template>
  <div class="space-y-12 pb-20">
    <header>
      <h1 class="text-4xl font-extrabold text-white mb-2">Component Name</h1>
      <p class="text-lg text-gray-400">Component description</p>
    </header>

    <!-- Demo Sections -->
    <section>
      <h2 class="text-2xl font-bold text-white mb-6">Feature Name</h2>
      <DemoSection 
        title="Demo Title"
        description="Demo description"
        :code="basicUsageCode"
        language="vue"
      >
        <!-- Demo content -->
      </DemoSection>
    </section>

    <!-- API Reference -->
    <section>
      <h2 class="text-2xl font-bold text-white mb-6">API Reference</h2>
      <!-- Props, Events, Slots tables -->
    </section>
  </div>
</template>
```

### 3. Integration Steps
After creating the component and view:

#### a. Export in `src/index.ts`
```typescript
export { default as ComponentName } from './components/ComponentName.vue'
```

#### b. Add Route in `src/router.ts`
```typescript
{
  path: 'component-name',
  name: 'ui-component-name',
  component: () => import('./views/ui/ComponentNameView.vue')
}
```

#### c. Add to Navigation in `src/layouts/UILayout.vue`
```typescript
const navigation = [
  // ...existing items
  { name: 'Component Name', href: '/ui/component-name', icon: 'mdi-icon-name' },
]
```

### 4. Verification
- Test the component in the browser at `/ui/component-name`
- Verify all interactive features work correctly
- Check all demo sections display properly
- Ensure API reference is complete and accurate

## Design Guidelines

### Visual Standards
- Use modern, vibrant colors (avoid plain colors)
- Implement smooth transitions and hover effects
- Add micro-animations for better UX
- Ensure responsive design
- Follow existing component patterns

### Component Props
- Always use TypeScript interfaces
- Provide sensible defaults
- Support common customization (size, color, variant, etc.)
- Include disabled state when relevant

### Documentation
- Write clear, concise descriptions
- Include multiple demo sections
- Show different use cases
- Provide complete API reference
- Add code snippets for all examples

## Naming Conventions

- Components: `SComponentName.vue` (prefix with 'S' for Saka)
- Views: `ComponentNameView.vue`
- Routes: `'component-name'` (kebab-case)
- Route names: `'ui-component-name'`

## Example: Chips Component

Reference the Chips component as a template:
- Component: `src/components/SChip.vue`
- View: `src/views/ui/ChipView.vue`
- Route: `/ui/chips`
- Navigation: Added to UILayout

This component demonstrates:
- Multiple variants (filled, outlined, light)
- Size options (small, medium, large)
- Interactive features (closable, clickable)
- Comprehensive documentation with 7+ demo sections
- Complete API reference
