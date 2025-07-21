"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Menu, Home, Users, Receipt, History, Settings, LogOut, Plus } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Grupos", href: "/meus-grupos", icon: Users },
  { name: "Gastos", href: "/gastos", icon: Receipt },
  { name: "Histórico", href: "/historico", icon: History },
]

export function Navigation() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  return (
    <>
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 relative">
                <Image src="/logo.png" alt="GastosFácil Logo" fill className="object-contain" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                GastosFácil
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`flex items-center space-x-2 ${
                        isActive
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                          : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                )
              })}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Add Button */}
              <Link href="/gastos">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Gasto
                </Button>
              </Link>

              {/* User Avatar */}
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-600">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-white">
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
                      <div className="w-10 h-10 relative">
                        <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 py-6">
                      <div className="space-y-2">
                        {navigation.map((item) => {
                          const Icon = item.icon
                          const isActive = pathname === item.href
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                isActive
                                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                                  : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                              <span className="font-medium">{item.name}</span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="space-y-2 pt-6 border-t border-gray-100">
                      <Link
                        href="/configuracoes"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200"
                      >
                        <Settings className="h-5 w-5" />
                        <span className="font-medium">Configurações</span>
                      </Link>
                      <button
                        onClick={() => {
                          setIsOpen(false)
                          logout()
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Sair</span>
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 shadow-lg">
        <div className="flex justify-around py-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive ? "text-purple-600" : "text-gray-500 hover:text-purple-600"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-purple-600" : ""}`} />
                <span className={`text-xs font-medium ${isActive ? "text-purple-600" : ""}`}>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
