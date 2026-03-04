<template>
  <div class="max-w-4xl mx-auto py-12 px-4 transition-colors duration-300">
    <div class="text-center mb-16">
      <h1 class="text-5xl font-extrabold text-(--s-text-primary) mb-6">
        Welcome to <span class="bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Saka-UI</span>
      </h1>
      <p class="text-xl text-(--s-text-secondary) leading-relaxed">
        A premium, high-performance Vue 3 component library built with Tailwind CSS v4 and Bun.
        Designed for speed, beauty, and developer experience.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-(--s-bg-secondary) p-8 rounded-2xl border border-(--s-border) transition-all duration-300">
        <div class="w-12 h-12 bg-(--s-primary-alpha) rounded-xl flex items-center justify-center text-emerald-500 mb-6 font-bold text-2xl">
          <span class="mdi mdi-lightning-bolt"></span>
        </div>
        <h3 class="text-xl font-bold text-(--s-text-primary) mb-3">Lightning Fast</h3>
        <p class="text-(--s-text-secondary)">Powered by Bun and Vite 7, experience near-instant HMR and ultra-fast builds.</p>
      </div>

      <div class="bg-(--s-bg-secondary) p-8 rounded-2xl border border-(--s-border) transition-all duration-300">
        <div class="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-500 mb-6 font-bold text-2xl">
          <span class="mdi mdi-palette"></span>
        </div>
        <h3 class="text-xl font-bold text-(--s-text-primary) mb-3">Tailwind CSS v4</h3>
        <p class="text-(--s-text-secondary)">Built using the latest features of Tailwind CSS v4 for absolute styling flexibility.</p>
      </div>

      <div class="bg-(--s-bg-secondary) p-8 rounded-2xl border border-(--s-border) transition-all duration-300">
        <div class="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 mb-6 font-bold text-2xl">
          <span class="mdi mdi-language-typescript"></span>
        </div>
        <h3 class="text-xl font-bold text-(--s-text-primary) mb-3">TypeScript Native</h3>
        <p class="text-(--s-text-secondary)">First-class TypeScript support with automatic type generation for library distribution.</p>
      </div>

      <div class="bg-(--s-bg-secondary) p-8 rounded-2xl border border-(--s-border) transition-all duration-300">
        <div class="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-6 font-bold text-2xl">
          <span class="mdi mdi-package-variant"></span>
        </div>
        <h3 class="text-xl font-bold text-(--s-text-primary) mb-3">Library Mode</h3>
        <p class="text-(--s-text-secondary)">Configured out-of-the-box for professional library distribution via Vite's library mode.</p>
      </div>
    </div>

    <div class="mt-16 p-8 bg-linear-to-br from-emerald-500/5 to-cyan-500/5 rounded-3xl border border-(--s-primary-alpha) text-center transition-all duration-300">
      <h2 class="text-2xl font-bold text-(--s-text-primary) mb-4">Get Started</h2>
      <p class="text-(--s-text-secondary) mb-8">Select a component from the sidebar to view documentation and live examples.</p>
      <router-link to="/ui/tabs" class="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 active:scale-95">
        Explore Components
        <span class="mdi mdi-arrow-right"></span>
      </router-link>
    </div>
  </div>
</template>
