# Customization Strategy

Saka UI offers three levels of customization. Use the lightest level that meets your needs.

## Level 1: Props and Slots (Package Mode)

Use props for behavior, variants, sizes, and state:

```vue
<SButton variant="outlined" size="large" color="red" loading>
  Submit
</SButton>
```

Use slots for content composition:

```vue
<SCard>
  <SCardHeader title="Custom" subtitle="Layout">
    <template #actions>
      <SButton size="small">Edit</SButton>
    </template>
  </SCardHeader>
  <SCardContent>Your content</SCardContent>
</SCard>
```

Use class merge props for targeted styling:

```vue
<SButton contentClass="tracking-wider uppercase" iconClass="text-lg" />
<SInput inputClass="font-mono" labelClass="text-blue-500" />
```

## Level 2: CSS Variables and Class Overrides (Package Mode)

Override design tokens globally:

```css
:root {
  --s-primary: #6366f1;
  --s-primary-alpha: rgba(99, 102, 241, 0.15);
  --s-bg-primary: #ffffff;
  --s-bg-secondary: #f8fafc;
  --s-bg-tertiary: #f1f5f9;
  --s-text-primary: #0f172a;
  --s-text-secondary: #475569;
  --s-text-tertiary: #94a3b8;
  --s-border: #e2e8f0;
  --s-border-hover: #cbd5e1;
}
```

Or scope overrides to specific instances:

```vue
<SButton style="--btn-bg: #6366f1; --btn-text: white" />
```

## Level 3: Source Editing (Open-Code Mode)

When props and CSS variables aren't enough, copy the component and edit the source:

```bash
npx saka-ui add button
```

Now edit `src/components/ui/SButton.vue` directly — change the template structure, add new computed properties, remove features you don't need.

## Decision Tree

1. Need to change **behavior, variant, size, state**? → Use **props**
2. Need to change **colors, spacing, typography**? → Use **CSS variables**
3. Need to change **specific element styling**? → Use **class merge props**
4. Need to change **template structure or logic**? → Use **open-code mode**
