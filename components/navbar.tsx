"use client"

import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuthStatus, useLogout } from "@/hooks/useAuth"
import { getCompanyConfig } from "@/config/company"

interface NavbarProps {
  activeLink?: string
}

export default function Navbar({ activeLink }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const config = getCompanyConfig()
  
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
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex-shrink-0">
              <Image
                src={config.logo}
                alt={`${config.name} Logo`}
                width={60}
                height={50}
                className="rounded-lg"
              />
            </div>
            <div className="ml-3">
              <span className="text-xl font-bold text-gray-900">{config.name}</span>
              <span className="block text-sm text-gray-500">{config.description}</span>
            </div>
          </Link>
          

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" className="text-gray-700 hover:text-[var(--primary-color)] px-3 py-2 text-sm font-medium transition-colors">
                Accueil
              </Link>
            
              <Link
                href="#"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive("services") 
                    ? "text-[var(--primary-color)] bg-[var(--primary-color)]/10 rounded" 
                    : "text-gray-700 hover:text-[var(--primary-color)]"
                }`}
              >
                {config.industry === 'Santé' ? 'Nos Services Médicaux' :
                 config.industry === 'Immobilier' ? 'Nos Propriétés' :
                 config.industry === 'Ressources Humaines' ? 'Nos Solutions RH' :
                 'Nos Services'}
              </Link>
              <Link
                href="#"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive("solutions") 
                    ? "text-[var(--primary-color)] bg-[var(--primary-color)]/10 rounded" 
                    : "text-gray-700 hover:text-[var(--primary-color)]"
                }`}
              >
                {config.industry === 'Éducation et Formation' ? 'E-learning' :
                 config.industry === 'Santé' ? 'Télémédecine' :
                 config.industry === 'Immobilier' ? 'Visite Virtuelle' :
                 'Solutions Digitales'}
              </Link>
              <Link 
                href="/about" 
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive("about") 
                    ? "text-[var(--primary-color)] bg-[var(--primary-color)]/10 rounded" 
                    : "text-gray-700 hover:text-[var(--primary-color)]"
                }`}
              >
                À Propos
              </Link>
              <Link
                href="#"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive("contact") 
                    ? "text-[var(--primary-color)] bg-[var(--primary-color)]/10 rounded" 
                    : "text-gray-700 hover:text-[var(--primary-color)]"
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
                  className="border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white"
                >
                  Connexion
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/login/prospect")}
                  className="border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white"
                  title={
                    config.industry === 'Santé' ? 'Espace Patient' :
                    config.industry === 'Ressources Humaines' ? 'Espace Candidat' :
                    'Espace Prospect'
                  }
                >
                  <span>
                    {config.industry === 'Santé' ? 'Espace Patient' :
                     config.industry === 'Ressources Humaines' ? 'Espace Candidat' :
                     'Espace Prospect'}
                  </span>
                </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link 
                href="#" 
                className={`block px-3 py-2 text-base font-medium ${
                  isActive("services") 
                    ? "text-[var(--primary-color)] bg-[var(--primary-color)]/10 rounded" 
                    : "text-gray-700 hover:text-[var(--primary-color)]"
                }`}
              >
                {config.industry === 'Santé' ? 'Services Médicaux' :
                 config.industry === 'Immobilier' ? 'Gestion Immobilière' :
                 config.industry === 'Ressources Humaines' ? 'Gestion RH' :
                 'Nos Services'}
              </Link>
              
              {isAuthenticated && user ? (
                <div className="px-3 py-2">
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
                <div className="px-3 py-2 space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/login")}
                    className="w-full border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white"
                  >
                    Connexion
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        :root {
          --primary-color: ${config.primaryColor};
          --secondary-color: ${config.secondaryColor};
        }
      `}</style>
    </nav>
  )
} 