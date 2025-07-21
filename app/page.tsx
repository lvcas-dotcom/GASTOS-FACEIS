"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Users, DollarSign, PieChart, Shield, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!loading && user && mounted) {
      router.push("/dashboard")
    }
  }, [user, loading, mounted, router])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (user) {
    return null // Redirecionando...
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-4 py-8 text-center">
        <div className="w-24 h-24 mx-auto mb-6 relative">
          <Image src="/logo.png" alt="GastosFácil Logo" fill className="object-contain" priority />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
          GastosFácil
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed px-2">
          Organize e divida gastos com seus amigos de forma simples e inteligente
        </p>
      </div>

      {/* Features */}
      <div className="px-4 space-y-4 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Grupos Inteligentes</h3>
                <p className="text-sm text-gray-600">Crie grupos e convide amigos facilmente</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Divisão Automática</h3>
                <p className="text-sm text-gray-600">Registre e divida despesas automaticamente</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Relatórios Claros</h3>
                <p className="text-sm text-gray-600">Acompanhe saldos e dívidas em tempo real</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Buttons */}
      <div className="px-4 space-y-4 mb-8">
        <Link href="/cadastro">
          <Button className="w-full h-16 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg shadow-xl rounded-2xl transition-all duration-300 transform hover:scale-[1.02]">
            Começar Gratuitamente
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </Link>

        <Link href="/login">
          <Button
            variant="outline"
            className="w-full h-16 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 font-semibold text-lg rounded-2xl transition-all duration-300 bg-transparent hover:border-purple-300"
          >
            Já tenho conta
          </Button>
        </Link>
      </div>

      {/* Security Badge */}
      <div className="px-4 mb-8">
        <Card className="border-0 shadow-sm bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Seus dados estão seguros e protegidos</span>
              <Sparkles className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="px-4 py-6 text-center border-t border-gray-100">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 relative">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <span className="font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            GastosFácil
          </span>
        </div>
        <p className="text-xs text-gray-500">© 2024 GastosFácil. Feito com ❤️ no Brasil.</p>
      </div>
    </div>
  )
}
