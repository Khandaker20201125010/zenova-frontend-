/* eslint-disable @typescript-eslint/no-explicit-any */
// components/shared/modal-provider.tsx
"use client"

import { createContext, useContext, useState, useCallback } from "react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { X } from "lucide-react"

interface ModalProps {
  title?: string
  description?: string
  content: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
  onClose?: () => void
  showCloseButton?: boolean
}

interface ModalContextType {
  openModal: (props: ModalProps) => void
  closeModal: () => void
  isOpen: boolean
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider")
  }
  return context
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalProps | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const openModal = useCallback((props: ModalProps) => {
    setModal(props)
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    modal?.onClose?.()
    setIsOpen(false)
    setTimeout(() => setModal(null), 300) // Wait for animation
  }, [modal])

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-[95vw]",
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}
      
      <Dialog open={isOpen} onOpenChange={(open :any) => !open && closeModal()}>
        <DialogContent className={sizeClasses[modal?.size || "md"]}>
          {(modal?.title || modal?.description) && (
            <DialogHeader>
              {modal?.title && <DialogTitle>{modal.title}</DialogTitle>}
              {modal?.description && (
                <DialogDescription>{modal.description}</DialogDescription>
              )}
            </DialogHeader>
          )}
          
          {modal?.content}
          
          {modal?.showCloseButton !== false && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={closeModal}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  )
}

// Hook for common modal patterns
export function useCommonModals() {
  const { openModal, closeModal } = useModal()

  const confirm = useCallback(({
    title = "Are you sure?",
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    variant = "default",
  }: {
    title?: string
    description?: string
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
    onCancel?: () => void
    variant?: "default" | "destructive"
  }) => {
    openModal({
      title,
      description,
      content: (
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => {
            onCancel?.()
            closeModal()
          }}>
            {cancelText}
          </Button>
          <Button 
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={() => {
              onConfirm()
              closeModal()
            }}
          >
            {confirmText}
          </Button>
        </div>
      ),
    })
  }, [openModal, closeModal])

  const alert = useCallback(({
    title = "Alert",
    description,
    buttonText = "OK",
    onClose,
  }: {
    title?: string
    description: string
    buttonText?: string
    onClose?: () => void
  }) => {
    openModal({
      title,
      description,
      content: (
        <div className="flex justify-end pt-4">
          <Button onClick={() => {
            onClose?.()
            closeModal()
          }}>
            {buttonText}
          </Button>
        </div>
      ),
    })
  }, [openModal, closeModal])

  return {
    confirm,
    alert,
    openModal,
    closeModal,
  }
}