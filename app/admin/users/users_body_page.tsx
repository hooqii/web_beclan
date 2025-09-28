"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Search, Mail, Phone, MapPin } from "lucide-react"
import User, { userFromJson } from "./user"
import { formatDate, getRequest } from "@/lib/utils"
import { BASE_URL } from "@/lib/constants"
import { getToken } from "@/app/_actions/auth"

interface UsersBodyPageProps {
  users: User[]
}
export default function UsersBodyPage({ users: defaultUsers }: UsersBodyPageProps) {
  const [users, setUsers] = useState(defaultUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const filteredUsers = users.filter(
    (user) =>
      user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.noHp.includes(searchTerm),
  )

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      const token = await getToken()
      const response = await fetch(`${BASE_URL}/user/remove/${id}`, {
        method: "DELETE",
        headers: {"Authorization": `Bearer ${token}`}
      })
      if (response.status === 200) refreshUsers()
    }
  }

  const refreshUsers = async () => {
    const newUsers = await fetchUsers()
    setUsers(newUsers)
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daftar Users</CardTitle>
              <CardDescription>Kelola semua pengguna sistem</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama, email, atau telepon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-80"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Tanggal Dafatr</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.nama}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                        {user.noHp}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span className="max-w-xs truncate">{user.alamat}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(user.tanggalDaftar)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

async function fetchUsers() {
  const endpoint = `${BASE_URL}/user`
  const response = await getRequest<User[]>(endpoint)
  const users = response.data.map(userFromJson)
  return users
}