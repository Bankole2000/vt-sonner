import { h, markRaw } from 'vue'
import { toast as toastOriginal } from 'vue-sonner'
import VSonner from './VSonner.vue'
import Toast from './Toast.vue'
import type { ExternalToast, ToastProps } from './types'

type Options = Omit<ToastProps, 'text'> & Partial<Pick<ExternalToast, 'duration' | 'onAutoClose' | 'onDismiss' | 'id' | 'important'>>

function toastFunction(text: string, options?: Options) {
  const { description, action, ...rest } = options || {}
  return toastOriginal.custom(markRaw(h(Toast, {
    ...rest,
    progressBar: options?.progressBar ?? true,
    progressDuration: options?.duration ?? 5000,
    progressBarProps: {
      ...options?.progressBarProps,
      indeterminate: options?.loading,
    },
    description,
    action,
    text,
  })), {
    ...rest,
    unstyled: true,
  })
}

function createToastFunction(color: string, icon: string) {
  return function (text: string, options?: Options) {
    return toastFunction(text, {
      prependIcon: icon,
      cardProps: {
        color,
        ...options?.cardProps,
      },
      ...options,
    })
  }
}

function dismiss(toastId?: number | string) {
  return toastOriginal.dismiss(toastId)
}

type ToastFunction = typeof toastFunction
type CreateToastFunction = ReturnType<typeof createToastFunction>
type DismissFunction = typeof dismiss
type VSonnerToast = {
  success: CreateToastFunction
  error: CreateToastFunction
  warning: CreateToastFunction
  info: CreateToastFunction
  primary: CreateToastFunction
  secondary: CreateToastFunction
  dismiss: DismissFunction
  toastOriginal: typeof toastOriginal
} & ToastFunction

export const toast: VSonnerToast = Object.assign(toastFunction, {
  success: createToastFunction('success', 'mdi-check-circle'),
  error: createToastFunction('error', 'mdi-cancel'),
  warning: createToastFunction('warning', 'mdi-alert'),
  info: createToastFunction('info', 'mdi-alert-circle'),
  primary: createToastFunction('primary', 'mdi-bell'),
  secondary: createToastFunction('secondary', 'mdi-bell'),
  dismiss,
  toastOriginal,
})

export {
  VSonner,
}
