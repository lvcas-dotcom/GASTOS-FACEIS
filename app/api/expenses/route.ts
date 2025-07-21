import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { verifyToken } from "@/lib/auth"
import { v4 as uuidv4 } from "uuid"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ message: "Token não fornecido" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 })
    }

    // Buscar gastos dos grupos do usuário
    const { data: expenses, error } = await supabase
      .from("expenses")
      .select(`
        *,
        groups (name),
        users (name)
      `)
      .in("group_id", supabase.from("group_members").select("group_id").eq("user_id", decoded.userId))
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar gastos:", error)
      return NextResponse.json({ message: "Erro ao buscar gastos" }, { status: 500 })
    }

    return NextResponse.json({ expenses: expenses || [] })
  } catch (error) {
    console.error("Erro na API de gastos:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ message: "Token não fornecido" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 })
    }

    const { group_id, description, amount, category } = await request.json()

    if (!group_id || !description || !amount) {
      return NextResponse.json({ message: "Grupo, descrição e valor são obrigatórios" }, { status: 400 })
    }

    // Verificar se usuário é membro do grupo
    const { data: membership } = await supabase
      .from("group_members")
      .select("id")
      .eq("group_id", group_id)
      .eq("user_id", decoded.userId)
      .single()

    if (!membership) {
      return NextResponse.json({ message: "Você não é membro deste grupo" }, { status: 403 })
    }

    // Criar gasto
    const expenseId = uuidv4()
    const { data: expense, error } = await supabase
      .from("expenses")
      .insert({
        id: expenseId,
        group_id,
        paid_by: decoded.userId,
        description: description.trim(),
        amount: Number.parseFloat(amount),
        category: category || "outros",
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar gasto:", error)
      return NextResponse.json({ message: "Erro ao criar gasto" }, { status: 500 })
    }

    return NextResponse.json({ expense })
  } catch (error) {
    console.error("Erro na criação de gasto:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
