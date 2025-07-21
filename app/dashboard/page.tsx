"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, DollarSign, TrendingUp, Settings, History, UserPlus, PieChart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  paidBy: string
  date: string
  groupId: string
}

interface Group {
  id: string
  name: string
  memberCount: number
  totalExpenses: number
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null)
  const [balance, setBalance] = useState({ owes: 0, owed: 0 })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      loadDashboardData()
    }
  }, [user, loading, router])

  const loadDashboardData = async () => {
    try {
      // Carregar grupos do usuário
      const groupsResponse = await fetch("/api/groups", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (groupsResponse.ok) {
        const groupsData = await groupsResponse.json()
        setGroups(groupsData.groups || [])

        if (groupsData.groups && groupsData.groups.length > 0) {
          setCurrentGroup(groupsData.groups[0])
        }
      }

      // Carregar gastos
      const expensesResponse = await fetch("/api/expenses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (expensesResponse.ok) {
        const expensesData = await expensesResponse.json()
        setExpenses(expensesData.expenses || [])

        // Calcular saldo
        const userExpenses = expensesData.expenses || []
        const owes = userExpenses
          .filter((exp: Expense) => exp.paidBy !== user?.id)
          .reduce((sum: number, exp: Expense) => sum + exp.amount, 0)

        const owed = userExpenses
          .filter((exp: Expense) => exp.paidBy === user?.id)
          .reduce((sum: number, exp: Expense) => sum + exp.amount, 0)

        setBalance({ owes, owed })
      }
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const recentExpenses = expenses.slice(0, 3)
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const netBalance = balance.owed - balance.owes

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Image src="/logo.png" alt="Logo" width={24} height={24} className="w-6 h-6 object-contain" />
            </div>
            <div>
              <h1 className="font-semibold">Olá, {user.name.split(" ")[0]}!</h1>
              <p className="text-purple-100 text-sm">Bem-vindo de volta</p>
            </div>
          </div>
          <Link href="/configuracoes">
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0 text-white hover:bg-white/20">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Balance Card */}
        <Card className="border-0 bg-white/10 backdrop-blur-sm text-white">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-purple-100 text-sm mb-1">Saldo Total</p>
              <p className={`text-2xl font-bold ${netBalance >= 0 ? "text-green-300" : "text-red-300"}`}>
                {netBalance >= 0 ? "+" : ""}R$ {netBalance.toFixed(2)}
              </p>
              <div className="flex justify-between mt-4 text-sm">
                <div className="text-center">
                  <p className="text-purple-100">Você deve</p>
                  <p className="font-semibold text-red-300">R$ {balance.owes.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-purple-100">Devem a você</p>
                  <p className="font-semibold text-green-300">R$ {balance.owed.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-4 -mt-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Link href="/gastos">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <p className="font-semibold text-gray-900">Novo Gasto</p>
                <p className="text-xs text-gray-600">Adicionar despesa</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/convites">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
                <p className="font-semibold text-gray-900">Convidar</p>
                <p className="text-xs text-gray-600">Adicionar amigos</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Current Group */}
      {currentGroup && (
        <div className="px-4 mb-6">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{currentGroup.name}</h3>
                    <p className="text-sm text-gray-600">{currentGroup.memberCount} membros</p>
                  </div>
                </div>
                <Link href="/meus-grupos">
                  <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 bg-transparent">
                    Gerenciar
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-3 text-center">
              <DollarSign className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">R$ {totalExpenses.toFixed(0)}</p>
              <p className="text-xs text-gray-600">Total gasto</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-3 text-center">
              <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">{expenses.length}</p>
              <p className="text-xs text-gray-600">Transações</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-3 text-center">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">{groups.length}</p>
              <p className="text-xs text-gray-600">Grupos</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Gastos Recentes</h2>
          <Link href="/historico">
            <Button variant="ghost" size="sm" className="text-purple-600">
              Ver todos
            </Button>
          </Link>
        </div>

        {recentExpenses.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <PieChart className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Nenhum gasto ainda</h3>
              <p className="text-sm text-gray-600 mb-4">Comece adicionando sua primeira despesa</p>
              <Link href="/gastos">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Gasto
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentExpenses.map((expense) => (
              <Card key={expense.id} className="border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{expense.description}</h3>
                        <p className="text-sm text-gray-600">{expense.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">R$ {expense.amount.toFixed(2)}</p>
                      <p className="text-xs text-gray-600">{new Date(expense.date).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-4 gap-2">
          <Link href="/historico">
            <Button variant="outline" className="h-12 flex-col gap-1 border-gray-200 bg-transparent">
              <History className="h-4 w-4" />
              <span className="text-xs">Histórico</span>
            </Button>
          </Link>

          <Link href="/divida">
            <Button variant="outline" className="h-12 flex-col gap-1 border-gray-200 bg-transparent">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Dívidas</span>
            </Button>
          </Link>

          <Link href="/meus-grupos">
            <Button variant="outline" className="h-12 flex-col gap-1 border-gray-200 bg-transparent">
              <Users className="h-4 w-4" />
              <span className="text-xs">Grupos</span>
            </Button>
          </Link>

          <Link href="/configuracoes">
            <Button variant="outline" className="h-12 flex-col gap-1 border-gray-200 bg-transparent">
              <Settings className="h-4 w-4" />
              <span className="text-xs">Config</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
