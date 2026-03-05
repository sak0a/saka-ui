# Package Mode vs Open-Code Mode

Saka UI supports two ways to use components:

## Package Mode (default)

Import components directly from the `saka-ui` npm package:

```vue
<script setup>
import { SButton, SCard } from 'saka-ui'
</script>
```

**Best for:** Quick setup, automatic updates with `npm update`, consistent component versions across your app.

**Trade-off:** Customization is limited to props, slots, CSS variables, and class overrides.

## Open-Code Mode

Copy component source files into your project using the CLI:

```bash
npx saka-ui init
npx saka-ui add button card input
```

Components land in your project as regular `.vue` files you can edit freely:

```
src/components/ui/
├── SButton.vue          # yours to edit
├── SInput.vue
└── card/
    ├── SCard.vue
    ├── SCardHeader.vue
    └── ...
```

**Best for:** Deep visual customization, structural changes, removing unused features, building design-system forks.

**Trade-off:** You own the code — upstream updates require manual merging via `saka-ui diff`.

## Using Both Together

You can mix modes in the same project. Use package imports for components you don't need to customize, and open-code copies for components you want full control over:

```vue
<script setup>
// Package mode — standard badge, no customization needed
import { SBadge } from 'saka-ui'
// Open-code mode — heavily customized button
import SButton from '@/components/ui/SButton.vue'
</script>
```

## Comparison

| | Package Mode | Open-Code Mode |
|---|---|---|
| Setup | `npm install saka-ui` | `saka-ui init` + `saka-ui add` |
| Updates | `npm update` | `saka-ui diff` + manual merge |
| Customization | Props, slots, CSS vars | Full source editing |
| Maintenance | Automatic | You maintain the copy |
| Bundle size | Tree-shaken from package | Only what you copy |
