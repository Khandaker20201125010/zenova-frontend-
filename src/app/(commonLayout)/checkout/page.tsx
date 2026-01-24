/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
// app/checkout/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { motion } from "framer-motion"
import {
  CreditCard,
  Truck,
  Shield,
  Lock,
  ArrowRight,
  CheckCircle,
} from "lucide-react"

import Link from "next/link"
import { useToast } from "../../hooks/use-toast"
import { useCartStore } from "../../store/cart-store"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { OrderSummary } from "../../components/checkout/order-summary"
import { ShippingAddressForm } from "../../components/checkout/shipping-address-form"
import { CheckoutForm } from "../../components/checkout/checkout-form"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "")

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const cartItems = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const [step, setStep] = useState(1)
  const [shippingAddress, setShippingAddress] = useState<any>(null)
  const [paymentIntent, setPaymentIntent] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  if (!session) {
    router.push("/login?callbackUrl=/checkout")
    return null
  }

  if (cartItems.length === 0) {
    router.push("/cart")
    return null
  }

  const handleShippingSubmit = async (address: any) => {
    setShippingAddress(address)
    setStep(2)
    
    // Create payment intent
    try {
      setLoading(true)
      const response = await fetch("/api/v1/payments/intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          amount: useCartStore.getState().getTotal() * 100, // Convert to cents
          currency: "usd",
        }),
      })
      
      const data = await response.json()
      if (data.success) {
        setPaymentIntent(data.data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize payment",
        variant: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = async () => {
    // Create order
    try {
      const response = await fetch("/api/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          items: cartItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress,
          paymentMethod: "card",
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        clearCart()
        setStep(3)
        
        toast({
          title: "Order Placed!",
          description: "Your order has been successfully placed",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "error",
      })
    }
  }

  const steps = [
    { id: 1, name: "Shipping", icon: Truck },
    { id: 2, name: "Payment", icon: CreditCard },
    { id: 3, name: "Confirmation", icon: CheckCircle },
  ]

  return (
    <div className="container py-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((stepItem, index) => {
            const Icon = stepItem.icon
            const isActive = step === stepItem.id
            const isCompleted = step > stepItem.id
            
            return (
              <div key={stepItem.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      isActive || isCompleted
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      isActive || isCompleted ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {stepItem.name}
                  </span>
                </div>
                
                {index < steps.length - 1 && (
                  <div
                    className={`w-24 h-1 mx-4 ${
                      step > stepItem.id ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-8">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ShippingAddressForm
                    onSubmit={handleShippingSubmit}
                    loading={loading}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && paymentIntent && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Elements stripe={stripePromise} options={{
                    clientSecret: paymentIntent.client_secret,
                    appearance: {
                      theme: 'stripe',
                    },
                  }}>
                    <CheckoutForm
                      paymentIntent={paymentIntent}
                      onSuccess={handlePaymentSuccess}
                    />
                  </Elements>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="text-center">
                <CardContent className="pt-12 pb-8">
                  <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                  
                  <h2 className="text-3xl font-bold mb-4">Order Confirmed!</h2>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Thank you for your purchase. We've sent a confirmation email with your order details.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild>
                      <a href="/dashboard/orders">
                        View Order Status
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/products">
                        Continue Shopping
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Security Badges */}
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4" />
              <span>Money Back Guarantee</span>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderSummary />
              
              {step === 1 && (
                <Button
                  className="w-full mt-6 gap-2"
                  size="lg"
                  onClick={() => setStep(2)}
                  disabled={!shippingAddress}
                >
                  Continue to Payment
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}