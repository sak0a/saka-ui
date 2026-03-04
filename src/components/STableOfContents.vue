<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'

interface TocItem {
  id: string
  text: string
  level: number
}

const route = useRoute()
const tocItems = ref<TocItem[]>([])
const activeId = ref<string>('')

// Extract headings from the page
const extractHeadings = () => {
  nextTick(() => {
    const items: TocItem[] = []
    
    // Find all h2 elements (main sections)
    const h2s = document.querySelectorAll('main h2')
    h2s.forEach((heading) => {
      const text = heading.textContent?.trim() || ''
      let id = heading.id
      if (!id) {
        id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        heading.id = id
      }
      items.push({ id, text, level: 2 })
    })
    
    // Find h3 elements only within API sections (marked with data-toc-section)
    // Only include h3s that are direct children of divs (component names like SCard)
    // Exclude h3s inside <article> (those are SApiTable titles like "Props", "Slots")
    const apiH3s = document.querySelectorAll('main [data-toc-section] h3')
    apiH3s.forEach((heading) => {
      // Skip if inside an article element (SApiTable)
      if (heading.closest('article')) return
      
      const text = heading.textContent?.trim() || ''
      let id = heading.id
      if (!id) {
        id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        heading.id = id
      }
      items.push({ id, text, level: 3 })
    })
    
    // Sort by document order
    items.sort((a, b) => {
      const elA = document.getElementById(a.id)
      const elB = document.getElementById(b.id)
      if (!elA || !elB) return 0
      return elA.compareDocumentPosition(elB) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    })

    tocItems.value = items
    
    // Set initial active
    if (items.length > 0 && !activeId.value) {
      activeId.value = items[0].id
    }
  })
}

// Intersection Observer for tracking active section
let observer: IntersectionObserver | null = null

const setupObserver = () => {
  if (observer) {
    observer.disconnect()
  }

  const mainEl = document.querySelector('main')
  
  const options: IntersectionObserverInit = {
    root: mainEl,
    rootMargin: '-32px 0px -66% 0px',
    threshold: 0
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeId.value = entry.target.id
      }
    })
  }, options)

  // Observe all headings
  tocItems.value.forEach((item) => {
    const element = document.getElementById(item.id)
    if (element) {
      observer?.observe(element)
    }
  })
}

// Scroll to section
const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    // Find the scrollable main container
    const mainEl = document.querySelector('main')
    if (mainEl) {
      // Get element position relative to the scrollable container
      const elementRect = element.getBoundingClientRect()
      const mainRect = mainEl.getBoundingClientRect()
      const scrollOffset = mainEl.scrollTop + (elementRect.top - mainRect.top) - 32
      
      mainEl.scrollTo({
        top: scrollOffset,
        behavior: 'smooth'
      })
    }
    
    activeId.value = id
  }
}

// Re-extract headings on route change
watch(() => route.path, () => {
  setTimeout(() => {
    extractHeadings()
    nextTick(setupObserver)
  }, 100)
})

onMounted(() => {
  setTimeout(() => {
    extractHeadings()
    nextTick(setupObserver)
  }, 200)
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <nav 
    v-if="tocItems.length > 0"
    class="w-44 shrink-0 hidden xl:block"
    aria-label="Table of contents"
  >
    <div class="sticky top-8">
      <h4 class="text-[10px] font-semibold text-(--s-text-tertiary) uppercase tracking-wider mb-2">
        On this page
      </h4>
      <ul class="space-y-0.5 border-l border-(--s-border)">
        <li v-for="item in tocItems" :key="item.id">
          <button
            @click="scrollToSection(item.id)"
            :class="[
              'block w-full text-left py-1 -ml-px border-l-2 transition-all duration-200 leading-tight',
              item.level === 2 ? 'pl-3 text-xs' : 'pl-5 text-[11px]',
              activeId === item.id
                ? 'border-(--s-primary) text-(--s-primary) font-medium'
                : 'border-transparent text-(--s-text-tertiary) hover:text-(--s-text-primary) hover:border-(--s-border-strong)'
            ]"
          >
            {{ item.text }}
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>
