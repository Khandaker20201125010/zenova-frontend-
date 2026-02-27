/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(auth)/register/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { motion } from "framer-motion"
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  Loader2,
  ArrowRight,
  Facebook,
  Chrome,
  CheckCircle,
  AlertCircle
} from "lucide-react"

import { Input } from "../../components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Separator } from "../../components/ui/separator"
import { Checkbox } from "../../components/ui/checkbox"
import { Button } from "../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { useAuth } from "../../hooks/use-auth"
import { useToast } from "../../hooks/use-toast"
import { validationSchemas } from "../../lib/utils/validators"

interface PendingOAuth {
  provider: string;
  email?: string;
  name?: string;
}

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const error = searchParams.get("error")
  const { toast } = useToast()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [] as string[],
  })
  
  // State for terms agreement modal
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [pendingOAuth, setPendingOAuth] = useState<PendingOAuth | null>(null)
  const [termsAgreed, setTermsAgreed] = useState(false)

  useEffect(() => {
    if (error) {
      console.error("OAuth Error from URL:", error)
      
      // Handle specific OAuth errors
      if (error === "OAuthAccountNotLinked") {
        toast({
          title: "Account Already Exists",
          description: "This email is already registered with another provider. Please sign in using your original method.",
          variant: "destructive",
          duration: 6000,
        })
      } else {
        toast({
          title: "Authentication Error",
          description: getErrorMessage(error),
          variant: "destructive",
        })
      }
    }
  }, [error, toast])

  const getErrorMessage = (error: string) => {
    switch (error) {
      case "OAuthSignin":
        return "Error in building the authorization URL"
      case "OAuthCallback":
        return "Error in handling the response from OAuth provider"
      case "OAuthCreateAccount":
        return "Could not create OAuth user"
      case "EmailCreateAccount":
        return "Could not create email user"
      case "Callback":
        return "Error in the OAuth callback handler"
      case "OAuthAccountNotLinked":
        return "Email already exists with different provider"
      case "EmailSignin":
        return "Check your email address"
      case "CredentialsSignin":
        return "Invalid credentials"
      case "RefreshAccessTokenError":
        return "Your session has expired. Please sign in again."
      default:
        return "An error occurred during authentication"
    }
  }

  const handleSocialLogin = async (provider: string) => {
    // If terms are already agreed, proceed with OAuth
    if (formData.agreeToTerms) {
      await initiateSocialLogin(provider)
    } else {
      // Store provider info and show terms modal
      setPendingOAuth({ provider })
      setShowTermsModal(true)
    }
  }

  const initiateSocialLogin = async (provider: string) => {
    setIsLoading(true)
    console.log(`🔵 Attempting to sign in with ${provider} from register page...`)
    
    try {
      const result = await signIn(provider, { 
        callbackUrl: '/',
        redirect: false,
      })
      
      console.log("📡 SignIn result:", result)
      
      if (result?.error) {
        console.error("❌ SignIn error:", result.error)
        toast({
          title: "Login Failed",
          description: result.error,
          variant: "destructive",
        })
        setIsLoading(false)
      } else if (result?.url) {
        console.log("✅ SignIn successful, redirecting to:", result.url)
        router.push(result.url)
      } else {
        console.log("⚠️ No URL in result, pushing to callbackUrl")
        router.push(callbackUrl)
      }
    } catch (error) {
      console.error("💥 Social login exception:", error)
      setIsLoading(false)
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : `Failed to login with ${provider}`,
        variant: "destructive",
      })
    }
  }

  const handleTermsAccept = () => {
    if (!termsAgreed) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive",
      })
      return
    }

    // Update main form agreement
    setFormData(prev => ({ ...prev, agreeToTerms: true }))
    
    // Close modal and proceed with pending OAuth
    setShowTermsModal(false)
    if (pendingOAuth) {
      initiateSocialLogin(pendingOAuth.provider)
      setPendingOAuth(null)
    }
  }

  const handleTermsCancel = () => {
    setShowTermsModal(false)
    setPendingOAuth(null)
    setTermsAgreed(false)
  }

  const validateForm = () => {
    const result = validationSchemas.register.safeParse(formData)
    
    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error.issues.forEach((err) => {
        const path = err.path.join(".")
        newErrors[path] = err.message
      })
      setErrors(newErrors)
      return false
    }

    if (!formData.agreeToTerms) {
      setErrors({ ...errors, agreeToTerms: "You must agree to the terms and conditions" })
      return false
    }

    setErrors({})
    return true
  }

  const checkPasswordStrength = (password: string) => {
    const feedback: string[] = []
    let score = 0

    if (password.length >= 8) score += 1
    else feedback.push("At least 8 characters")

    if (/[A-Z]/.test(password)) score += 1
    else feedback.push("One uppercase letter")

    if (/[a-z]/.test(password)) score += 1
    else feedback.push("One lowercase letter")

    if (/\d/.test(password)) score += 1
    else feedback.push("One number")

    if (/[^A-Za-z0-9]/.test(password)) score += 1
    else feedback.push("One special character")

    setPasswordStrength({ score, feedback })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })

      if (result.success) {
        toast({
          title: "Registration Successful",
          description: "Welcome! Your account has been created.",
        })
        router.push("/")
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (field === "password") {
      checkPasswordStrength(value as string)
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/5 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="border-none shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Create Account
              </CardTitle>
              <CardDescription className="text-center">
                Enter your information to create an account
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              passwordStrength.score >= 4
                                ? "bg-green-500"
                                : passwordStrength.score >= 3
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${passwordStrength.score * 20}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {passwordStrength.score >= 4
                            ? "Strong"
                            : passwordStrength.score >= 3
                            ? "Good"
                            : "Weak"}
                        </span>
                      </div>
                      {passwordStrength.feedback.length > 0 && (
                        <div className="text-xs text-muted-foreground space-y-1">
                          {passwordStrength.feedback.map((msg, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <AlertCircle className="h-3 w-3" />
                              {msg}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => 
                      handleInputChange("agreeToTerms", checked as boolean)
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="terms" className="text-sm leading-none">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline" target="_blank">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline" target="_blank">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-sm text-destructive">{errors.agreeToTerms}</p>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Social Login Section */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin("google")}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <Chrome className="h-4 w-4" />
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin("facebook")}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Terms Agreement Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Terms and Conditions Required
            </DialogTitle>
            <DialogDescription>
              Please review and accept our terms and conditions to continue with {pendingOAuth?.provider} sign up.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-2">
              <p className="font-medium">By creating an account, you agree to:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Our <Link href="/terms" className="text-primary hover:underline" target="_blank">Terms of Service</Link></li>
                <li>Our <Link href="/privacy" className="text-primary hover:underline" target="_blank">Privacy Policy</Link></li>
                <li>Receive account-related emails</li>
                <li>Comply with our community guidelines</li>
              </ul>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox
                id="modal-terms"
                checked={termsAgreed}
                onCheckedChange={(checked) => setTermsAgreed(checked as boolean)}
              />
              <Label htmlFor="modal-terms" className="text-sm">
                I have read and agree to the Terms of Service and Privacy Policy
              </Label>
            </div>
          </div>

          <DialogFooter className="flex gap-4 sm:gap-2">
            <Button
              variant="outline"
              onClick={handleTermsCancel}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTermsAccept}
              disabled={!termsAgreed}
              className="gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Accept & Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}