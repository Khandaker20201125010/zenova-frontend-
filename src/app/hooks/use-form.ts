/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/use-form.ts
"use client"

import { useState, useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm as useReactHookForm, UseFormProps } from "react-hook-form"
import { z } from "zod"

export function useForm<T extends z.ZodTypeAny>(
  schema: T,
  defaultValues?: Partial<z.infer<T> & Record<string, any>>,
  options?: UseFormProps<z.infer<T> & Record<string, any>>
) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const form = useReactHookForm<z.infer<T> & Record<string, any>>({
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues as any,
    mode: "onChange",
    ...options,
  })

  const handleSubmit = useCallback(
    (onSubmit: (data: z.infer<T>) => Promise<any>) => {
      return form.handleSubmit(async (data) => {
        setIsSubmitting(true)
        setSubmitError(null)
        setSubmitSuccess(false)

        try {
          await onSubmit(data)
          setSubmitSuccess(true)
        } catch (error: any) {
          setSubmitError(error.message || "An error occurred")
          throw error
        } finally {
          setIsSubmitting(false)
        }
      })
    },
    [form]
  )

  const resetForm = useCallback(() => {
    form.reset()
    setSubmitError(null)
    setSubmitSuccess(false)
    setIsSubmitting(false)
  }, [form])

  const setFormError = useCallback((field: string, message: string) => {
    form.setError(field as any, { type: "manual", message })
  }, [form])

  const clearFormError = useCallback((field?: string) => {
    if (field) {
      form.clearErrors(field as any)
    } else {
      form.clearErrors()
    }
  }, [form])

  return {
    ...form,
    isSubmitting,
    submitError,
    submitSuccess,
    handleSubmit,
    resetForm,
    setFormError,
    clearFormError,
    setIsSubmitting,
    setSubmitError,
    setSubmitSuccess,
  }
}