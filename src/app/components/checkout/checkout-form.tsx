/* eslint-disable @typescript-eslint/no-explicit-any */
// components/checkout/checkout-form.tsx
"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"

export function CheckoutForm({ paymentIntent, onSuccess }: { paymentIntent: any; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false)
      onSuccess()
    }, 2000)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted">
            <p className="text-sm font-medium">Payment Amount</p>
            <p className="text-2xl font-bold">${(paymentIntent.amount / 100).toFixed(2)}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">CVC</label>
              <input
                type="text"
                placeholder="123"
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing Payment..." : "Pay Now"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}