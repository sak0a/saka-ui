import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SAlert from '~/components/ui/SAlert.vue'

describe('SAlert', () => {
  it('renders with default variant (info)', () => {
    const wrapper = mount(SAlert, {
      props: { title: 'Info alert' },
    })

    const classes = wrapper.find('[role="alert"]').classes().join(' ')
    expect(classes).toContain('bg-info-light')
    expect(classes).toContain('text-info-light-foreground')
  })

  it('renders title and description via props', () => {
    const wrapper = mount(SAlert, {
      props: {
        title: 'Alert Title',
        description: 'Alert description text',
      },
    })

    expect(wrapper.text()).toContain('Alert Title')
    expect(wrapper.text()).toContain('Alert description text')
  })

  it('closable button exists and triggers visibility change', async () => {
    const wrapper = mount(SAlert, {
      props: {
        title: 'Closable',
        closable: true,
      },
    })

    const closeButton = wrapper.find('button[aria-label="Close alert"]')
    expect(closeButton.exists()).toBe(true)

    await closeButton.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('respects closable: false (no close button)', () => {
    const wrapper = mount(SAlert, {
      props: {
        title: 'Not closable',
        closable: false,
      },
    })

    const closeButton = wrapper.find('button[aria-label="Close alert"]')
    expect(closeButton.exists()).toBe(false)
  })

  it('has correct ARIA role="alert"', () => {
    const wrapper = mount(SAlert, {
      props: { title: 'Accessible alert' },
    })

    const alertElement = wrapper.find('[role="alert"]')
    expect(alertElement.exists()).toBe(true)
    expect(alertElement.attributes('aria-live')).toBe('polite')
  })

  it('renders success variant with correct classes', () => {
    const wrapper = mount(SAlert, {
      props: {
        variant: 'success',
        title: 'Success',
      },
    })

    const classes = wrapper.find('[role="alert"]').classes().join(' ')
    expect(classes).toContain('bg-success-light')
    expect(classes).toContain('text-success-light-foreground')
  })

  it('renders error variant with correct classes', () => {
    const wrapper = mount(SAlert, {
      props: {
        variant: 'error',
        title: 'Error',
      },
    })

    const classes = wrapper.find('[role="alert"]').classes().join(' ')
    expect(classes).toContain('bg-error-light')
    expect(classes).toContain('text-error-light-foreground')
  })
})
