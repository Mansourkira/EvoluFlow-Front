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
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img 
                src="/Admission.jpg" 
                alt="Logo" 
                className="w-12 h-12 object-contain"
              />
              <div className="ml-2">
                <span className="text-lg font-bold text-gray-900">EvoluFlow</span>
              </div>
            </Link>
          </div>

          {/* Centered Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center space-x-8 bg-gray-50 rounded-full px-6 py-2">
              <Link
                href="/"
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full ${
                  isActive("home") || (!activeLink && typeof window !== 'undefined' && window.location.pathname === '/') 
                    ? "bg-[#3A90DA] text-white shadow-md" 
                    : "text-gray-700 hover:text-[#3A90DA] hover:bg-white hover:shadow-sm"
                }`}
              >
                Accueil
              </Link>
              <Link
                href="/about"
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full ${
                  isActive("about") || (typeof window !== 'undefined' && window.location.pathname === '/about')
                    ? "bg-[#3A90DA] text-white shadow-md" 
                    : "text-gray-700 hover:text-[#3A90DA] hover:bg-white hover:shadow-sm"
                }`}
              >
                À Propos
              </Link>
              <Link
                href="/contactus"
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full ${
                  isActive("contact") || (typeof window !== 'undefined' && window.location.pathname === '/contactus')
                    ? "bg-[#3A90DA] text-white shadow-md" 
                    : "text-gray-700 hover:text-[#3A90DA] hover:bg-white hover:shadow-sm"
                }`}
              >
                Nous Contacter
              </Link>
              <Link
                href="#"
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full ${
                  isActive("elearning") 
                    ? "bg-[#3A90DA] text-white shadow-md" 
                    : "text-gray-700 hover:text-[#3A90DA] hover:bg-white hover:shadow-sm"
                }`}
              >
                E-learning
              </Link>
            </div>
          </div>

          {/* Right side - Auth buttons */}
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-600 hidden lg:block">
                  Bonjour, <span className="font-medium">{user.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                >
                  {isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/login")}
                  className="border-[#3A90DA] text-[#3A90DA] hover:bg-[#3A90DA] hover:text-white transition-colors"
                >
                  Connexion
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push("/login/prospect")}
                  className="bg-[#3A90DA] text-white hover:bg-[#62ace1] transition-colors"
                >
                  Espace Prospect
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-2">
              <Link 
                href="/"
                className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  isActive("home") || (typeof window !== 'undefined' && window.location.pathname === '/')
                    ? "bg-[#3A90DA] text-white" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-[#3A90DA]"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                href="/about"
                className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  isActive("about") || (typeof window !== 'undefined' && window.location.pathname === '/about')
                    ? "bg-[#3A90DA] text-white" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-[#3A90DA]"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                À Propos
              </Link>
              <Link 
                href="/contactus"
                className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  isActive("contact") || (typeof window !== 'undefined' && window.location.pathname === '/contactus')
                    ? "bg-[#3A90DA] text-white" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-[#3A90DA]"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Nous Contacter
              </Link>
              <Link 
                href="#"
                className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  isActive("elearning") 
                    ? "bg-[#3A90DA] text-white" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-[#3A90DA]"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                E-learning
              </Link>
              
              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                {isAuthenticated && user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-600">
                      Connecté en tant que <span className="font-medium">{user.name}</span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      {isLoggingOut ? 'Déconnexion...' : 'Se Déconnecter'}
                    </Button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        router.push("/login")
                        setIsMenuOpen(false)
                      }}
                      className="w-full border-[#3A90DA] text-[#3A90DA] hover:bg-[#3A90DA] hover:text-white"
                    >
                      Connexion
                    </Button>
                    <Button
                      onClick={() => {
                        router.push("/login/prospect")
                        setIsMenuOpen(false)
                      }}
                      className="w-full bg-[#3A90DA] text-white hover:bg-[#62ace1]"
                    >
                      Espace Prospect
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 