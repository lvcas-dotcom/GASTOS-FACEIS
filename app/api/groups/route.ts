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

    // Buscar grupos do usuário
    const { data: groupMembers, error } = await supabase
      .from("group_members")
      .select(`
        groups (
          id,
          name,
          description,
          created_at,
          created_by
        )
      `)
      .eq("user_id", decoded.userId)

    if (error) {
      console.error("Erro ao buscar grupos:", error)
      return NextResponse.json({ message: "Erro ao buscar grupos" }, { status: 500 })
    }

    const groups =
      groupMembers?.map((member) => ({
        ...member.groups,
        memberCount: 1, // Será calculado depois
      })) || []

    return NextResponse.json({ groups })
  } catch (error) {
    console.error("Erro na API de grupos:", error)
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

    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json({ message: "Nome do grupo é obrigatório" }, { status: 400 })
    }

    // Criar grupo
    const groupId = uuidv4()
    const { data: group, error: groupError } = await supabase
      .from("groups")
      .insert({
        id: groupId,
        name: name.trim(),
        description: description?.trim() || null,
        created_by: decoded.userId,
      })
      .select()
      .single()

    if (groupError) {
      console.error("Erro ao criar grupo:", groupError)
      return NextResponse.json({ message: "Erro ao criar grupo" }, { status: 500 })
    }

    // Adicionar criador como membro admin
    const { error: memberError } = await supabase.from("group_members").insert({
      group_id: groupId,
      user_id: decoded.userId,
      role: "admin",
    })

    if (memberError) {
      console.error("Erro ao adicionar membro:", memberError)
      return NextResponse.json({ message: "Erro ao adicionar membro ao grupo" }, { status: 500 })
    }

    return NextResponse.json({ group })
  } catch (error) {
    console.error("Erro na criação de grupo:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
