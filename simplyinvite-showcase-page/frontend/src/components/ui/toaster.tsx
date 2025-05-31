
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()
  
  // Since we're using Sonner, we just render the provider with empty content
  // The actual toasts are handled by the Sonner component in App.tsx
  return (
    <ToastProvider>
      {/* We don't need to map over toasts since we're using Sonner */}
      <ToastViewport />
    </ToastProvider>
  )
}
