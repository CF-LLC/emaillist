"use client"

import type React from "react"

import { useState, useEffect, useTransition } from "react"
import { joinWaitlist } from "../actions/waitlist"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WaitlistFormProps {
  onSuccess: (count: number) => void
}

export function WaitlistForm({ onSuccess }: WaitlistFormProps) {
  const [isPending, startTransition] = useTransition()
  const [formState, setFormState] = useState<any>(null)
  const [email, setEmail] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (formState?.success) {
      toast({
        title: "Success!",
        description: formState.message,
        duration: 5000,
      })
      if (formState.count) {
        onSuccess(formState.count)
      }
      setEmail("")
    } else if (formState?.success === false) {
      toast({
        title: "Error",
        description: formState.message,
        variant: "destructive",
        duration: 5000,
      })
    }
  }, [formState, toast, onSuccess])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("email", email)

    startTransition(async () => {
      // Pass null as the first argument (prevState)
      const result = await joinWaitlist(null, formData)
      setFormState(result)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4 mb-8">
      <div className="flex overflow-hidden rounded-xl bg-white/5 p-1 ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-blue-500">
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby="email-error"
          className="w-full border-0 bg-transparent text-white placeholder:text-gray-400 focus:ring-0 focus:border-transparent focus-visible:border-transparent focus:outline-none active:ring-0 active:outline-none focus-visible:ring-0 focus-visible:outline-none active:border-transparent focus-visible:ring-offset-0"
        />
        <Button
          type="submit"
          disabled={isPending}
          className="bg-black hover:bg-gray-800 text-white font-semibold px-4 rounded-xl transition-all duration-300 ease-in-out focus:outline-none w-[120px]"
        >
          {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Get Notified"}
        </Button>
      </div>
    </form>
  )
}
