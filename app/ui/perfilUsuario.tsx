'use client'

import { useUser, UserButton } from "@clerk/nextjs"

export default function Navbar() {
  const { user, isSignedIn } = useUser()

  return (
    <div className="fixed top-4 right-4 z-50">
      {isSignedIn ? (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">{user?.firstName}</span>
          <UserButton />
        </div>
      ) : (
        <p className="text-sm">No logueado</p>
      )}
    </div>
  )
}