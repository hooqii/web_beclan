"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck, Leaf, Users, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { BASE_URL } from "@/lib/constants"
import { getRole, setToken } from "../_actions/auth"

export default function LoginPage() {
  const router = useRouter()
  const [adminCredentials, setAdminCredentials] = useState({ email: "", password: "" })
  const [operatorCredentials, setOperatorCredentials] = useState({ email: "", password: "" })

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("1")
    const { email, password } = adminCredentials
    const endpoint = `${BASE_URL}/admin/login`
    const response = await fetch(endpoint, {
      method: "post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, password })
    })
    console.log("2")
    const jsonData = await response.json()
    if (response.status !== 200) {
      alert(jsonData.message)
      return
    }
    
    const data = jsonData.data
    const token = data.token
    const role = data.role
    await setToken(token, role)
    console.log(await getRole())
    router.push(`/${role}/dashboard`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Leaf className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Sistem Manajemen Beclean</h1>
          <p className="text-muted-foreground">Masuk ke sistem administrasi</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">Login Admin / Operator</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="text"
                  placeholder="Masukkan email admin / operator"
                  value={adminCredentials.email}
                  onChange={(e) => setAdminCredentials({ ...adminCredentials, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Masukkan password"
                  value={adminCredentials.password}
                  onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Masuk sebagai Admin
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
