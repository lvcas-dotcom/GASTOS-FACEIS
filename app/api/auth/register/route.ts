import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { hashPassword, generateToken } from "@/lib/auth"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Nome, email e senha são obrigatórios" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "A senha deve ter pelo menos 6 caracteres" }, { status: 400 })
    }

    // Verificar se usuário já existe
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", email.toLowerCase()).single()

    if (existingUser) {
      return NextResponse.json({ message: "Este email já está em uso" }, { status: 409 })
    }

    // Hash da senha
    const hashedPassword = await hashPassword(password)

    // Criar usuário
    const userId = uuidv4()
    const { data: user, error } = await supabase
      .from("users")
      .insert({
        id: userId,
        name: name.trim(),
        email: email.toLowerCase(),
        password_hash: hashedPassword,
      })
      .select("id, name, email")
      .single()

    if (error) {
      console.error("Erro ao criar usuário:", error)
      return NextResponse.json({ message: "Erro ao criar conta" }, { status: 500 })
    }

    // Gerar token
    const token = generateToken(user.id)

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Erro no registro:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
