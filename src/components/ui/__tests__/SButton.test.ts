import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SButton from '~/components/ui/SButton.vue'
import { buttonVariants } from '~/components/ui/button'

describe('SButton', () => {
  it('renders with default props', () => {
    const wrapper = mount(SButton, {
      slots: { default: 'Click me' },
    })

    expect(wrapper.text()).toContain('Click me')
    expect(wrapper.element.tagName).toBe('BUTTON')
  })

  it('renders correct variant classes for filled', () => {
    const wrapper = mount(SButton, {
      props: { variant: 'filled' },
      slots: { default: 'Filled' },
    })

    const classes = wrapper.classes().join(' ')
    const expectedClasses = buttonVariants({ variant: 'filled' })
    // Filled variant should include bg-primary
    expect(classes).toContain('bg-primary')
    expect(classes).toContain('text-primary-foreground')
  })

  it('renders correct variant classes for outlined', () => {
    const wrapper = mount(SButton, {
      props: { variant: 'outlined' },
      slots: { default: 'Outlined' },
    })

    const classes = wrapper.classes().join(' ')
    expect(classes).toContain('border-primary')
    expect(classes).toContain('bg-transparent')
  })

  it('renders correct variant classes for ghost', () => {
    const wrapper = mount(SButton, {
      props: { variant: 'ghost' },
      slots: { default: 'Ghost' },
    })

    const classes = wrapper.classes().join(' ')
    expect(classes).toContain('bg-transparent')
    expect(classes).toContain('text-primary')
  })

  it('renders correct size classes', () => {
    const wrapper = mount(SButton, {
      props: { size: 'lg' },
      slots: { default: 'Large' },
    })

    const classes = wrapper.classes().join(' ')
    // Large size should include px-2.5 and text-base per button.ts
    expect(classes).toContain('text-base')
  })

  it('disabled state prevents click emission', async () => {
    const wrapper = mount(SButton, {
      props: { disabled: true },
      slots: { default: 'Disabled' },
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('loading state shows loader', () => {
    const wrapper = mount(SButton, {
      props: { loading: true },
      slots: { default: 'Loading' },
    })

    const spinner = wrapper.find('.mdi-loading')
    expect(spinner.exists()).toBe(true)
    expect(spinner.classes()).toContain('animate-spin')
  })

  it('loading state prevents click emission', async () => {
    const wrapper = mount(SButton, {
      props: { loading: true },
      slots: { default: 'Loading' },
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('emits click event', async () => {
    const wrapper = mount(SButton, {
      slots: { default: 'Click' },
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('renders as <a> when href is provided', () => {
    const wrapper = mount(SButton, {
      props: { href: 'https://example.com' },
      slots: { default: 'Link' },
    })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('https://example.com')
  })

  it('renders as router-link when to is provided', () => {
    const wrapper = mount(SButton, {
      props: { to: '/about' },
      slots: { default: 'Route' },
      global: {
        stubs: {
          'router-link': {
            template: '<a><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Route')
    // The component should render the router-link stub
    expect(wrapper.find('a').exists()).toBe(true)
  })

  it('applies disabled attribute and styling', () => {
    const wrapper = mount(SButton, {
      props: { disabled: true },
      slots: { default: 'Disabled' },
    })

    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('data-disabled')).toBeDefined()
    const classes = wrapper.classes().join(' ')
    expect(classes).toContain('cursor-not-allowed')
  })
})
