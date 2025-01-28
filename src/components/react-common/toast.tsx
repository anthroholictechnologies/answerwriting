// utils/toast.tsx
import { useToast } from 'answerwriting/hooks/use-toast'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ShowToastOptions {
  title: string
  description?: string
  action?: React.ReactNode
  duration?: number
}

const toastStyles: Record<ToastType, string> = {
  success: `
    group
    bg-gradient-to-r from-green-500/90 to-green-600/90
    border-none
    text-white
    shadow-lg
    shadow-green-500/20
    backdrop-blur-sm
    rounded-xl
    p-4
    transition-all
    hover:shadow-green-500/30
    dark:from-green-900/90 dark:to-green-950/90
  `,
  error: `
    group
    bg-gradient-to-r from-red-500/90 to-red-600/90
    border-none
    text-white
    shadow-lg
    shadow-red-500/20
    backdrop-blur-sm
    rounded-xl
    p-4
    transition-all
    hover:shadow-red-500/30
    dark:from-red-900/90 dark:to-red-950/90
  `,
  warning: `
    group
    bg-gradient-to-r from-yellow-500/90 to-yellow-600/90
    border-none
    text-white
    shadow-lg
    shadow-yellow-500/20
    backdrop-blur-sm
    rounded-xl
    p-4
    transition-all
    hover:shadow-yellow-500/30
    dark:from-yellow-900/90 dark:to-yellow-950/90
  `,
  info: `
    group
    bg-gradient-to-r from-blue-500/90 to-blue-600/90
    border-none
    text-white
    shadow-lg
    shadow-blue-500/20
    backdrop-blur-sm
    rounded-xl
    p-4
    transition-all
    hover:shadow-blue-500/30
    dark:from-blue-900/90 dark:to-blue-950/90
  `,
}

export const useCustomToast = () => {
  const { toast } = useToast()

  const showToast = (type: ToastType, options: ShowToastOptions) => {
    const { title, description, action, duration = 5000 } = options

    const defaultAction = action ? (
      <div className="flex gap-2 items-center">
        {action}
      </div>
    ) : null

    toast({
      title,
      description,
      duration,
      className: toastStyles[type],
      action: defaultAction ?? undefined,
    })
  }

  return {
    success: (options: ShowToastOptions) => showToast('success', options),
    error: (options: ShowToastOptions) => showToast('error', options),
    warning: (options: ShowToastOptions) => showToast('warning', options),
    info: (options: ShowToastOptions) => showToast('info', options),
  }
}