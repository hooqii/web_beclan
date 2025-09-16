"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck, Leaf, Users, Shield } from "lucide-react"

export default function LoginPage() {
  const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" })
  const [operatorCredentials, setOperatorCredentials] = useState({ username: "", password: "" })

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Dummy login - hardcoded credentials
    if (adminCredentials.username === "admin" && adminCredentials.password === "admin123") {
      window.location.href = "/admin/dashboard"
    } else {
      alert("Username atau password salah!")
    }
  }

  const handleOperatorLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Dummy login - hardcoded credentials
    if (operatorCredentials.username === "operator" && operatorCredentials.password === "operator123") {
      window.location.href = "/operator/dashboard"
    } else {
      alert("Username atau password salah!")
    }
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
            <CardTitle>Login</CardTitle>
            <CardDescription>Pilih jenis akun untuk masuk ke sistem</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="admin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Admin
                </TabsTrigger>
                <TabsTrigger value="operator" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Operator
                </TabsTrigger>
              </TabsList>

              <TabsContent value="admin">
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-username">Username</Label>
                    <Input
                      id="admin-username"
                      type="text"
                      placeholder="Masukkan username admin"
                      value={adminCredentials.username}
                      onChange={(e) => setAdminCredentials({ ...adminCredentials, username: e.target.value })}
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
                  <p className="text-xs text-muted-foreground text-center">Demo: admin / admin123</p>
                </form>
              </TabsContent>

              <TabsContent value="operator">
                <form onSubmit={handleOperatorLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="operator-username">Username</Label>
                    <Input
                      id="operator-username"
                      type="text"
                      placeholder="Masukkan username operator"
                      value={operatorCredentials.username}
                      onChange={(e) => setOperatorCredentials({ ...operatorCredentials, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="operator-password">Password</Label>
                    <Input
                      id="operator-password"
                      type="password"
                      placeholder="Masukkan password"
                      value={operatorCredentials.password}
                      onChange={(e) => setOperatorCredentials({ ...operatorCredentials, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Masuk sebagai Operator
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">Demo: operator / operator123</p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
