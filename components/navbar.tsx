"use client"

import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStatus, useLogout } from "@/hooks/useAuth"

interface NavbarProps {
  activeLink?: string
}

export default function Navbar({ activeLink }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  
  // Use auth hooks
  const { isAuthenticated, user } = useAuthStatus()
  const { logout, isLoading: isLoggingOut } = useLogout()

  const isActive = (href: string) => activeLink === href

  const handleLogout = async () => {
    const success = await logout()
    if (success) {
      router.push('/login')
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered flex container for logo and nav */}
        <div className="flex flex-col md:flex-row md:justify-center md:items-center h-auto md:h-20 py-2">
          {/* Logo */}
          <div className="flex justify-center md:justify-start w-full md:w-auto mb-2 md:mb-0">
            <Link href="/" className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold text-gray-900">EvoluFlow</span>
                <span className="block text-sm text-gray-500">Plateforme de gestion</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-baseline space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Accueil
              </Link>
              <Link
                href="#"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive("services") 
                    ? "text-blue-600 bg-blue-50 rounded" 
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Nos Services
              </Link>
              <Link
                href="#"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive("solutions") 
                    ? "text-blue-600 bg-blue-50 rounded" 
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Solutions Digitales
              </Link>
              <Link 
                href="/about" 
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive("about") 
                    ? "text-blue-600 bg-blue-50 rounded" 
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                À Propos
              </Link>
              <Link
                href="/contactus"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive("contact") 
                    ? "text-blue-600 bg-blue-50 rounded" 
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Nous Contacter
              </Link>
              {/* Conditional rendering based on auth status */}
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Bonjour, {user.name}
                  </span>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    {isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/login")}
                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                  >
                    Connexion
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/login/prospect")}
                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                    title="Espace Prospect"
                  >
                    <span>Espace Prospect</span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex justify-center md:hidden w-full mt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t flex flex-col items-center">
              <Link 
                href="#" 
                className={`block px-3 py-2 text-base font-medium ${
                  isActive("services") 
                    ? "text-blue-600 bg-blue-50 rounded" 
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Nos Services
              </Link>
              
              {isAuthenticated && user ? (
                <div className="px-3 py-2 w-full flex justify-center">
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    {isLoggingOut ? 'Déconnexion...' : 'Se Déconnecter'}
                  </Button>
                </div>
              ) : (
                <div className="px-3 py-2 space-y-2 w-full flex flex-col items-center">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/login")}
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                  >
                    Connexion
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 