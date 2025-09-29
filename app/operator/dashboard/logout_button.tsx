"use client"

import { removeToken } from "@/app/_actions/auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter()
  
  const logout = async () => {
    await removeToken()
    router.push("/login")
  }
  
  return (
    <Button onClick={logout} variant="outline" asChild>
      <p className="cursor-pointer">Logout</p>
    </Button>
  )
}
