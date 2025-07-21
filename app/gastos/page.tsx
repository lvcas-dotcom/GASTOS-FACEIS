"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, DollarSign, Tag, Users, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

const categories = [
  { value: "comida", label: "🍽️ Comida" },
  { value: "transporte", label: "🚗 Transporte" },
  { value: "lazer", label: "🎮 Lazer" },
  { value: "compras", label: "🛍️ Compras" },
  { value: "saude", label: "🏥 Saúde" },
  { value: "educacao", label: "📚 Educação" },
  { value: "outros", label: "📦 Outros" },
]

interface Group {
  id: string
  name: string
}

export default function GastosPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [groups, setGroups] = useState<Group[]>([])
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    groupId: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    loadGroups()
  }, [user, router])

  const loadGroups = async () => {
    try {
      const response = await fetch("/api/groups", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setGroups(data.groups || [])

        // Selecionar primeiro grupo por padrão
        if (data.groups && data.groups.length > 0) {
          setFormData((prev) => ({ ...prev, groupId: data.groups[0].id }))
        }
      }
    } catch (error) {
      console.error("Erro ao carregar grupos:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.description || !formData.amount || !formData.category || !formData.groupId) {
      setError("Todos os campos são obrigatórios")
      return
    }

    if (Number.parseFloat(formData.amount) <= 0) {
      setError("O valor deve ser maior que zero")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          group_id: formData.groupId,
          description: formData.description,
          amount: Number.parseFloat(formData.amount),
          category: formData.category,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar gasto")
      }

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Erro ao criar gasto")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard")}
          className="h-10 w-10 p-0 text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-semibold text-gray-900">Novo Gasto</h1>
        <div className="w-10" />
      </div>

      {/* Form */}
      <div className="p-4">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <DollarSign className="h-5 w-5" />
              Adicionar Despesa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700 font-medium">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  placeholder="Ex: Almoço no restaurante, Uber para casa..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="min-h-[80px] border-2 border-gray-200 focus:border-purple-500 rounded-xl resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-gray-700 font-medium">
                  Valor (R$)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  className="h-12 border-2 border-gray-200 focus:border-purple-500 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Categoria
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-purple-500 rounded-xl">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Grupo
                </Label>
                <Select value={formData.groupId} onValueChange={(value) => handleInputChange("groupId", value)}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-purple-500 rounded-xl">
                    <SelectValue placeholder="Selecione um grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Adicionar Gasto
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
