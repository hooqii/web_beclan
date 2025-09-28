import { BASE_URL } from "@/lib/constants"
import { getRequest } from "@/lib/utils"
import { Users } from "lucide-react"
import User, { userFromJson } from "./user"
import UsersBodyPage from "./users_body_page"

export default async function UsersPage() {
  const users = await fetchUsers()
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <div className="bg-primary rounded-lg p-2">
              <Users className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Kelola Users</h1>
              <p className="text-sm text-muted-foreground">Tambah, edit, dan hapus users sistem</p>
            </div>
          </div>
        </div>
      </div>
      <UsersBodyPage users={users} />
    </div>
  )
}

async function fetchUsers() {
  const endpoint = `${BASE_URL}/user`
  const response = await getRequest<User[]>(endpoint)
  const users = response.data.map(userFromJson)
  return users
}