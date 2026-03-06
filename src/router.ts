import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/ui'
        },
        {
            path: '/ui',
            component: () => import('./layouts/UILayout.vue'),
            children: [
                {
                    path: '',
                    name: 'ui-home',
                    component: () => import('./views/ui/HomeView.vue')
                },
                {
                    path: 'tabs',
                    name: 'ui-tabs',
                    component: () => import('./views/ui/TabsView.vue')
                },
                {
                    path: 'glass-button',
                    name: 'ui-glass-button',
                    component: () => import('./views/ui/GlassButtonView.vue')
                },
                {
                    path: 'icons',
                    name: 'ui-icons',
                    component: () => import('./views/ui/IconsView.vue')
                },
                {
                    path: 'chips',
                    name: 'ui-chips',
                    component: () => import('./views/ui/ChipView.vue')
                },
                {
                    path: 'switch',
                    name: 'ui-switch',
                    component: () => import('./views/ui/SwitchView.vue')
                },
                {
                    path: 'buttons',
                    name: 'ui-buttons',
                    component: () => import('./views/ui/ButtonView.vue')
                },
                {
                    path: 'tooltips',
                    name: 'ui-tooltips',
                    component: () => import('./views/ui/TooltipView.vue')
                },
                {
                    path: 'alerts',
                    name: 'ui-alerts',
                    component: () => import('./views/ui/AlertView.vue')
                },
                {
                    path: 'badges',
                    name: 'ui-badges',
                    component: () => import('./views/ui/BadgeView.vue')
                },
                {
                    path: 'checkbox',
                    name: 'ui-checkbox',
                    component: () => import('./views/ui/CheckboxView.vue')
                },
                {
                    path: 'avatar',
                    name: 'ui-avatar',
                    component: () => import('./views/ui/AvatarView.vue')
                },
                {
                    path: 'select',
                    name: 'ui-select',
                    component: () => import('./views/ui/SelectView.vue')
                },
                {
                    path: 'carousel',
                    name: 'ui-carousel',
                    component: () => import('./views/ui/CarouselView.vue')
                },
                {
                    path: 'radio',
                    name: 'ui-radio',
                    component: () => import('./views/ui/RadioView.vue')
                },
                {
                    path: 'accordion',
                    name: 'ui-accordion',
                    component: () => import('./views/ui/AccordionView.vue')
                },
                {
                    path: 'date-picker',
                    name: 'ui-date-picker',
                    component: () => import('./views/ui/DatePickerView.vue')
                },
                {
                    path: 'color-picker',
                    name: 'ui-color-picker',
                    component: () => import('./views/ui/ColorPickerView.vue')
                },
                {
                    path: 'dropdown',
                    name: 'ui-dropdown',
                    component: () => import('./views/ui/DropdownView.vue')
                },
                {
                    path: 'card',
                    name: 'ui-card',
                    component: () => import('./views/ui/CardView.vue')
                },
                {
                    path: 'input',
                    name: 'ui-input',
                    component: () => import('./views/ui/InputView.vue')
                },
                {
                    path: 'kbd',
                    name: 'ui-kbd',
                    component: () => import('./views/ui/KbdView.vue')
                },
                {
                    path: 'modal',
                    name: 'ui-modal',
                    component: () => import('./views/ui/ModalView.vue')
                },
                {
                    path: 'morphing-modal',
                    name: 'ui-morphing-modal',
                    component: () => import('./views/ui/MorphingModalView.vue')
                },
                {
                    path: 'morphing-card',
                    name: 'ui-morphing-card',
                    component: () => import('./views/ui/MorphingCardView.vue')
                },
                {
                    path: 'drawer',
                    name: 'ui-drawer',
                    component: () => import('./views/ui/DrawerView.vue')
                },
                {
                    path: 'otp',
                    name: 'ui-otp',
                    component: () => import('./views/ui/OTPView.vue')
                },
                {
                    path: 'progress',
                    name: 'ui-progress',
                    component: () => import('./views/ui/ProgressView.vue')
                },
                {
                    path: 'pagination',
                    name: 'ui-pagination',
                    component: () => import('./views/ui/PaginationView.vue')
                },
                {
                    path: 'skeleton',
                    name: 'ui-skeleton',
                    component: () => import('./views/ui/SkeletonView.vue')
                },
                {
                    path: 'stepper',
                    name: 'ui-stepper',
                    component: () => import('./views/ui/StepperView.vue')
                },
                {
                    path: 'table',
                    name: 'ui-table',
                    component: () => import('./views/ui/TableView.vue')
                },
                {
                    path: 'toast',
                    name: 'ui-toast',
                    component: () => import('./views/ui/ToastView.vue')
                },
                {
                    path: 'dialog',
                    name: 'ui-dialog',
                    component: () => import('./views/ui/DialogView.vue')
                },
                {
                    path: 'glass-card',
                    name: 'ui-glass-card',
                    component: () => import('./views/ui/GlassCardView.vue')
                },
            ]
        },
        {
            path: '/docs',
            component: () => import('./layouts/UILayout.vue'),
            children: [
                {
                    path: '',
                    redirect: '/docs/styling-guide'
                },
                {
                    path: 'styling-guide',
                    name: 'docs-styling-guide',
                    component: () => import('./views/docs/StylingGuideView.vue')
                },
                {
                    path: 'customization',
                    name: 'docs-customization',
                    component: () => import('./views/docs/CustomizationView.vue')
                },
                {
                    path: 'form-validation',
                    name: 'docs-form-validation',
                    component: () => import('./views/docs/FormValidationView.vue')
                },
                {
                    path: 'use-theme',
                    name: 'docs-use-theme',
                    component: () => import('./views/docs/UseThemeView.vue')
                },
                {
                    path: 'use-clipboard',
                    name: 'docs-use-clipboard',
                    component: () => import('./views/docs/UseClipboardView.vue')
                },
                {
                    path: 'use-click-outside',
                    name: 'docs-use-click-outside',
                    component: () => import('./views/docs/UseClickOutsideView.vue')
                },
                {
                    path: 'use-media-query',
                    name: 'docs-use-media-query',
                    component: () => import('./views/docs/UseMediaQueryView.vue')
                },
                {
                    path: 'use-debounce',
                    name: 'docs-use-debounce',
                    component: () => import('./views/docs/UseDebounceView.vue')
                },
                {
                    path: 'use-local-storage',
                    name: 'docs-use-local-storage',
                    component: () => import('./views/docs/UseLocalStorageView.vue')
                },
                {
                    path: 'use-async',
                    name: 'docs-use-async',
                    component: () => import('./views/docs/UseAsyncView.vue')
                },
                {
                    path: 'use-hotkey',
                    name: 'docs-use-hotkey',
                    component: () => import('./views/docs/UseHotkeyView.vue')
                },
                {
                    path: 'use-intersection-observer',
                    name: 'docs-use-intersection-observer',
                    component: () => import('./views/docs/UseIntersectionObserverView.vue')
                }
            ]
        },
        {
            path: '/examples',
            component: () => import('./layouts/UILayout.vue'),
            children: [
                {
                    path: '',
                    redirect: '/examples/auth'
                },
                {
                    path: 'auth',
                    name: 'examples-auth',
                    component: () => import('./views/examples/AuthFormView.vue')
                },
                {
                    path: 'project',
                    name: 'examples-project',
                    component: () => import('./views/examples/ProjectFormView.vue')
                },
                {
                    path: 'form-field',
                    name: 'examples-form-field',
                    component: () => import('./views/examples/FormFieldExampleView.vue')
                },
                {
                    path: 'credit-card',
                    name: 'examples-credit-card',
                    component: () => import('./views/examples/CreditCardFormView.vue')
                }
            ]
        }
    ]
})

export default router
