import { LoginForm } from "@/components/auth/login-form"
import { PulseLogo } from "@/components/icons";

export default function LoginPage() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <div className="flex items-center gap-2 mb-6">
        <PulseLogo className="size-8 text-primary" />
        <h1 className="text-2xl font-bold">PULSE</h1>
      </div>
      <LoginForm />
    </div>
  )
}
