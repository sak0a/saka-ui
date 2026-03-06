<script setup lang="ts">
interface Props {
  /** Optional heading for the section */
  title?: string
}

defineProps<Props>()
</script>

<template>
  <section
    data-toc-section
    class="rounded-2xl border border-border/70 bg-muted/20 p-5 shadow-sm sm:p-6"
  >
    <div
      v-if="title"
      class="mb-5 flex items-center gap-3 border-b border-border/60 pb-4"
    >
      <span class="h-5 w-1 rounded-full bg-primary/60" aria-hidden="true" />
      <h3 class="text-lg font-semibold tracking-tight text-foreground">
        {{ title }}
      </h3>
    </div>

    <div class="space-y-6">
      <slot />
    </div>
  </section>
</template>
