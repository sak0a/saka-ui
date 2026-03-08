<script setup lang="ts">
import { SApiSection, SApiTable } from '../../index'
import type { ApiProp, ApiSlot } from '../../index'
import {
  SBreadcrumb,
  SBreadcrumbList,
  SBreadcrumbItem,
  SBreadcrumbLink,
  SBreadcrumbPage,
  SBreadcrumbSeparator,
  SBreadcrumbEllipsis
} from '../../components/ui/breadcrumb'
import DemoSection from '../../components/DemoSection.vue'

const basicCode = `<SBreadcrumb>
  <SBreadcrumbList>
    <SBreadcrumbItem>
      <SBreadcrumbLink href="#" @click.prevent>Docs</SBreadcrumbLink>
    </SBreadcrumbItem>
    <SBreadcrumbSeparator />
    <SBreadcrumbItem>
      <SBreadcrumbPage>Breadcrumb</SBreadcrumbPage>
    </SBreadcrumbItem>
  </SBreadcrumbList>
</SBreadcrumb>`

const currentPageCode = `<SBreadcrumb label="Project navigation">
  <SBreadcrumbList>
    <SBreadcrumbItem>
      <SBreadcrumbLink href="#" @click.prevent>Dashboard</SBreadcrumbLink>
    </SBreadcrumbItem>
    <SBreadcrumbSeparator />
    <SBreadcrumbItem>
      <SBreadcrumbLink href="#" @click.prevent>Projects</SBreadcrumbLink>
    </SBreadcrumbItem>
    <SBreadcrumbSeparator />
    <SBreadcrumbItem>
      <SBreadcrumbPage>Design System</SBreadcrumbPage>
    </SBreadcrumbItem>
  </SBreadcrumbList>
</SBreadcrumb>`

const separatorCode = `<SBreadcrumb>
  <SBreadcrumbList>
    <SBreadcrumbItem>
      <SBreadcrumbLink href="#" @click.prevent>Settings</SBreadcrumbLink>
    </SBreadcrumbItem>
    <SBreadcrumbSeparator>
      <span class="text-muted-foreground">/</span>
    </SBreadcrumbSeparator>
    <SBreadcrumbItem>
      <SBreadcrumbLink href="#" @click.prevent>Team</SBreadcrumbLink>
    </SBreadcrumbItem>
    <SBreadcrumbSeparator>
      <span class="text-muted-foreground">/</span>
    </SBreadcrumbSeparator>
    <SBreadcrumbItem>
      <SBreadcrumbPage>Members</SBreadcrumbPage>
    </SBreadcrumbItem>
  </SBreadcrumbList>
</SBreadcrumb>`

const ellipsisCode = `<SBreadcrumb>
  <SBreadcrumbList>
    <SBreadcrumbItem>
      <SBreadcrumbLink href="#" @click.prevent>Home</SBreadcrumbLink>
    </SBreadcrumbItem>
    <SBreadcrumbSeparator />
    <SBreadcrumbItem>
      <SBreadcrumbEllipsis />
    </SBreadcrumbItem>
    <SBreadcrumbSeparator />
    <SBreadcrumbItem>
      <SBreadcrumbLink href="#" @click.prevent>Components</SBreadcrumbLink>
    </SBreadcrumbItem>
    <SBreadcrumbSeparator />
    <SBreadcrumbItem>
      <SBreadcrumbPage>Breadcrumb</SBreadcrumbPage>
    </SBreadcrumbItem>
  </SBreadcrumbList>
</SBreadcrumb>`

const breadcrumbProps: ApiProp[] = [
  { name: 'label', type: 'string', default: "'Breadcrumb'", description: 'Accessible label applied to the wrapping nav element.', category: 'Accessibility' }
]

const breadcrumbSlots: ApiSlot[] = [
  { name: 'default', description: 'Use `SBreadcrumbList` and related subcomponents to compose the trail.' }
]

const listSlots: ApiSlot[] = [
  { name: 'default', description: 'Ordered breadcrumb items and separators.' }
]

const itemSlots: ApiSlot[] = [
  { name: 'default', description: 'Place a link, page label, or ellipsis inside each breadcrumb item.' }
]

const linkProps: ApiProp[] = [
  { name: 'tag', type: 'string', default: "'a'", description: 'Fallback element when neither `to` nor `href` is provided.', category: 'Rendering' },
  { name: 'href', type: 'string', default: 'undefined', description: 'Renders an anchor element and forwards the `href` attribute.', category: 'Navigation' },
  { name: 'to', type: 'string | object', default: 'undefined', description: 'Renders `router-link` when provided.', category: 'Navigation' }
]

const linkSlots: ApiSlot[] = [
  { name: 'default', description: 'Link label and optional leading/trailing content.' }
]

const pageSlots: ApiSlot[] = [
  { name: 'default', description: 'Current page label. This subcomponent adds `aria-current="page"`.' }
]

const separatorSlots: ApiSlot[] = [
  { name: 'default', description: 'Optional custom separator content. Defaults to a chevron icon.' }
]

const ellipsisSlots: ApiSlot[] = [
  { name: 'default', description: 'Optional overflow indicator content. Defaults to a three-dots icon with screen-reader text.' }
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <header>
      <h1 class="text-4xl font-extrabold text-foreground mb-2">Breadcrumb</h1>
      <p class="text-lg text-muted-foreground">Compose accessible breadcrumb trails with links, a current-page primitive, custom separators, and collapsed overflow states.</p>
    </header>

    <article>
      <h2 class="text-2xl font-bold text-foreground mb-6">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-4 rounded-xl bg-emerald-500/5 border border-border">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-puzzle text-xl text-emerald-400"></span>
            <span class="font-semibold text-foreground">Compound API</span>
          </div>
          <p class="text-sm text-muted-foreground">Compose the trail with focused primitives instead of a monolithic data prop.</p>
        </div>
        <div class="p-4 rounded-xl bg-cyan-500/5 border border-border">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-navigation-variant-outline text-xl text-cyan-400"></span>
            <span class="font-semibold text-foreground">Current Page</span>
          </div>
          <p class="text-sm text-muted-foreground">Use `SBreadcrumbPage` for the active location with the correct `aria-current` semantics.</p>
        </div>
        <div class="p-4 rounded-xl bg-violet-500/5 border border-border">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-swap-horizontal text-xl text-violet-400"></span>
            <span class="font-semibold text-foreground">Custom Separators</span>
          </div>
          <p class="text-sm text-muted-foreground">Swap the default chevron for your own icon or text using the separator slot.</p>
        </div>
        <div class="p-4 rounded-xl bg-amber-500/5 border border-border">
          <div class="flex items-center gap-3 mb-2">
            <span class="mdi mdi-dots-horizontal-circle-outline text-xl text-amber-400"></span>
            <span class="font-semibold text-foreground">Overflow Ready</span>
          </div>
          <p class="text-sm text-muted-foreground">Collapse long trails by composing `SBreadcrumbEllipsis` inside a breadcrumb item.</p>
        </div>
      </div>
    </article>

    <section>
      <h2 class="text-2xl font-bold text-foreground mb-6">Basic Usage</h2>
      <DemoSection
        title="Simple Trail"
        description="Start with the root nav, render a list, and use `SBreadcrumbPage` for the final non-interactive segment."
        :code="basicCode"
        language="vue"
      >
        <SBreadcrumb>
          <SBreadcrumbList>
            <SBreadcrumbItem>
              <SBreadcrumbLink href="#" @click.prevent>Docs</SBreadcrumbLink>
            </SBreadcrumbItem>
            <SBreadcrumbSeparator />
            <SBreadcrumbItem>
              <SBreadcrumbPage>Breadcrumb</SBreadcrumbPage>
            </SBreadcrumbItem>
          </SBreadcrumbList>
        </SBreadcrumb>
      </DemoSection>
    </section>

    <section>
      <h2 class="text-2xl font-bold text-foreground mb-6">Current Page</h2>
      <DemoSection
        title="Mark the Active Segment"
        description="Previous segments stay interactive with `SBreadcrumbLink`, while the current location uses `SBreadcrumbPage`."
        :code="currentPageCode"
        language="vue"
      >
        <div class="space-y-3">
          <SBreadcrumb label="Project navigation">
            <SBreadcrumbList>
              <SBreadcrumbItem>
                <SBreadcrumbLink href="#" @click.prevent>Dashboard</SBreadcrumbLink>
              </SBreadcrumbItem>
              <SBreadcrumbSeparator />
              <SBreadcrumbItem>
                <SBreadcrumbLink href="#" @click.prevent>Projects</SBreadcrumbLink>
              </SBreadcrumbItem>
              <SBreadcrumbSeparator />
              <SBreadcrumbItem>
                <SBreadcrumbPage>Design System</SBreadcrumbPage>
              </SBreadcrumbItem>
            </SBreadcrumbList>
          </SBreadcrumb>
          <p class="text-sm text-muted-foreground">Use the `label` prop when the breadcrumb landmark needs a more specific accessible name.</p>
        </div>
      </DemoSection>
    </section>

    <section>
      <h2 class="text-2xl font-bold text-foreground mb-6">Custom Separator</h2>
      <DemoSection
        title="Swap the Default Chevron"
        description="`SBreadcrumbSeparator` accepts slot content, so you can use text, icons, or any other decorative separator."
        :code="separatorCode"
        language="vue"
      >
        <SBreadcrumb>
          <SBreadcrumbList>
            <SBreadcrumbItem>
              <SBreadcrumbLink href="#" @click.prevent>Settings</SBreadcrumbLink>
            </SBreadcrumbItem>
            <SBreadcrumbSeparator>
              <span class="text-muted-foreground">/</span>
            </SBreadcrumbSeparator>
            <SBreadcrumbItem>
              <SBreadcrumbLink href="#" @click.prevent>Team</SBreadcrumbLink>
            </SBreadcrumbItem>
            <SBreadcrumbSeparator>
              <span class="text-muted-foreground">/</span>
            </SBreadcrumbSeparator>
            <SBreadcrumbItem>
              <SBreadcrumbPage>Members</SBreadcrumbPage>
            </SBreadcrumbItem>
          </SBreadcrumbList>
        </SBreadcrumb>
      </DemoSection>
    </section>

    <section>
      <h2 class="text-2xl font-bold text-foreground mb-6">Ellipsis &amp; Overflow</h2>
      <DemoSection
        title="Collapsed Trail Composition"
        description="For long paths, render `SBreadcrumbEllipsis` inside `SBreadcrumbItem` and keep separators as their own list entries."
        :code="ellipsisCode"
        language="vue"
      >
        <div class="space-y-3">
          <SBreadcrumb>
            <SBreadcrumbList>
              <SBreadcrumbItem>
                <SBreadcrumbLink href="#" @click.prevent>Home</SBreadcrumbLink>
              </SBreadcrumbItem>
              <SBreadcrumbSeparator />
              <SBreadcrumbItem>
                <SBreadcrumbEllipsis />
              </SBreadcrumbItem>
              <SBreadcrumbSeparator />
              <SBreadcrumbItem>
                <SBreadcrumbLink href="#" @click.prevent>Components</SBreadcrumbLink>
              </SBreadcrumbItem>
              <SBreadcrumbSeparator />
              <SBreadcrumbItem>
                <SBreadcrumbPage>Breadcrumb</SBreadcrumbPage>
              </SBreadcrumbItem>
            </SBreadcrumbList>
          </SBreadcrumb>
          <p class="text-sm text-muted-foreground">This matches the implemented API: ellipsis is inline content inside an item, not a standalone separator or list item component.</p>
        </div>
      </DemoSection>
    </section>

    <h2 class="text-2xl font-bold text-foreground mb-6">API Reference</h2>
    <SApiSection>
      <div class="space-y-8">
        <div>
          <h3 class="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span class="mdi mdi-map-marker-path text-primary" />
            SBreadcrumb
          </h3>
          <SApiTable title="Props" type="props" :props="breadcrumbProps" />
          <SApiTable title="Slots" type="slots" :slots="breadcrumbSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span class="mdi mdi-format-list-numbered text-primary" />
            SBreadcrumbList &amp; SBreadcrumbItem
          </h3>
          <SApiTable title="SBreadcrumbList Slots" type="slots" :slots="listSlots" />
          <SApiTable title="SBreadcrumbItem Slots" type="slots" :slots="itemSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span class="mdi mdi-link-variant text-primary" />
            SBreadcrumbLink
          </h3>
          <SApiTable title="Props" type="props" :props="linkProps" />
          <SApiTable title="Slots" type="slots" :slots="linkSlots" class="mt-6" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span class="mdi mdi-checkbox-marked-circle-outline text-primary" />
            SBreadcrumbPage
          </h3>
          <SApiTable title="Slots" type="slots" :slots="pageSlots" />
        </div>

        <div>
          <h3 class="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span class="mdi mdi-chevron-right text-primary" />
            SBreadcrumbSeparator &amp; SBreadcrumbEllipsis
          </h3>
          <SApiTable title="SBreadcrumbSeparator Slots" type="slots" :slots="separatorSlots" />
          <SApiTable title="SBreadcrumbEllipsis Slots" type="slots" :slots="ellipsisSlots" class="mt-6" />
        </div>

        <div class="rounded-xl border border-border bg-muted p-4">
          <h3 class="text-base font-semibold text-foreground mb-2">Events</h3>
          <p class="text-sm text-muted-foreground">These breadcrumb primitives do not emit custom Vue events. Navigation behavior comes from `SBreadcrumbLink` via `to`, `href`, and standard forwarded attributes.</p>
        </div>
      </div>
    </SApiSection>
  </div>
</template>