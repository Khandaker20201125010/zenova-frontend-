/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/use-form.ts
"use client"

import { useState, useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm as useReactHookForm, UseFormProps } from "react-hook-form"
import { z } from "zod"

export function useForm<T extends z.ZodSchema>(
  schema: T,
  defaultValues?: z.infer<T>,
  options?: UseFormProps<z.infer<T>>
) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const form = useReactHookForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
    ...options,
  })

  const handleSubmit = useCallback(
    async (onSubmit: (data: z.infer<T>) => Promise<any>) => {
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

  const setFormError = useCallback((field: keyof z.infer<T>, message: string) => {
    form.setError(field as string, { type: "manual", message })
  }, [form])

  const clearFormError = useCallback((field?: keyof z.infer<T>) => {
    if (field) {
      form.clearErrors(field as string)
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