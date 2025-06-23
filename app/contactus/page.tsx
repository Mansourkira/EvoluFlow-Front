"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Users, Headphones, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import Footer from "@/components/footer"

export default function ContactUsPage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    serviceType: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle form submission
    console.log("Form submitted:", formData)
    // You could show a success message or redirect
  }

  return (
    <div className="min-h-screen bg-[#F6F6F6]" style={{ fontFamily: "Cairo, sans-serif" }}>
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img 
                  src="/Admission.jpg" 
                  alt="Logo" 
                  className="w-20 h-20 object-contain"
                />
              </div>
             
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-[#3A90DA] px-3 py-2 text-sm font-medium transition-colors"
                >
                  Accueil
                </Link>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-[#3A90DA] px-3 py-2 text-sm font-medium transition-colors"
                >
                  À Propos
                </Link>
                <Link
                  href="/contactus"
                  className="text-gray-700 hover:text-[#3A90DA] px-3 py-2 text-sm font-medium transition-colors"
                >
                  Nous Contacter
                </Link>
                <Link
                  href="#"
                  className="text-gray-700 hover:text-[#3A90DA] px-3 py-2 text-sm font-medium transition-colors"
                >
                  E-learning
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#3A90DA] text-[#3A90DA] hover:bg-[#3A90DA] hover:text-white px-3 py-1 text-sm"
                >
                  <Link href="/login">Connexion</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#3A90DA] text-[#3A90DA] hover:bg-[#3A90DA] hover:text-white px-3 py-1 text-sm"
                >
                  <Link href="/login/prospect">Espace Prospect</Link>
                </Button>
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
                <Link href="/" className="text-gray-700 hover:text-[#3A90DA] block px-3 py-2 text-base font-medium">
                  Accueil
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-[#3A90DA] block px-3 py-2 text-base font-medium">
                  À Propos
                </Link>
                <Link href="/contactus" className="text-gray-700 hover:text-[#3A90DA] block px-3 py-2 text-base font-medium">
                  Nous Contacter
                </Link>
                <Link href="#" className="text-gray-700 hover:text-[#3A90DA] block px-3 py-2 text-base font-medium">
                  E-learning
                </Link>
                <div className="px-3 py-2">
                  <Button
                    variant="outline"
                    className="w-full border-[#3A90DA] text-[#3A90DA] hover:bg-[#3A90DA] hover:text-white"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#3A90DA] to-[#62ace1] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <Badge className="bg-[#b5d3ef] text-[#3A90DA] hover:bg-[#b5d3ef] mb-6">Contactez-Nous</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Parlons de Votre
              <span className="block text-[#b5d3ef]">Projet Éducatif</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed max-w-3xl mx-auto">
              Notre équipe d'experts est là pour vous accompagner dans votre parcours d'admission et de formation. 
              Contactez-nous pour obtenir des informations personnalisées.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-[#b5d3ef] text-[#3A90DA] hover:bg-[#b5d3ef] mb-4">Moyens de Contact</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Plusieurs Façons de Nous Joindre
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choisissez le moyen de communication qui vous convient le mieux. Notre équipe est disponible pour répondre à toutes vos questions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 hover:border-[#3A90DA] transition-colors text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-[#3A90DA] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-[#3A90DA]">Téléphone</CardTitle>
                <CardDescription>
                  <div className="space-y-2">
                    <div>+216 71 123 456</div>
                    <div>+216 71 123 457</div>
                    <div className="text-sm text-gray-500">Lun-Ven: 8h-17h</div>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#3A90DA] transition-colors text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-[#62ace1] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-[#3A90DA]">Email</CardTitle>
                <CardDescription>
                  <div className="space-y-2">
                    <div>info@centreallemeng.tn</div>
                    <div>admission@centreallemeng.tn</div>
                    <div className="text-sm text-gray-500">Réponse sous 24h</div>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#3A90DA] transition-colors text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-[#3A90DA] rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-[#3A90DA]">Adresse</CardTitle>
                <CardDescription>
                  <div className="space-y-2">
                    <div>123 Avenue de la République</div>
                    <div>1001 Tunis, Tunisie</div>
                    <div className="text-sm text-gray-500">Rendez-vous sur place</div>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#3A90DA] transition-colors text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-[#62ace1] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-[#3A90DA]">Horaires</CardTitle>
                <CardDescription>
                  <div className="space-y-2">
                    <div>Lun-Ven: 8h00 - 17h00</div>
                    <div>Sam: 9h00 - 13h00</div>
                    <div className="text-sm text-gray-500">Fermé le dimanche</div>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-[#F6F6F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <Badge className="bg-[#b5d3ef] text-[#3A90DA] hover:bg-[#b5d3ef] mb-4">Formulaire de Contact</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Envoyez-nous un Message
              </h2>
              <p className="text-gray-600 mb-8">
                Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
              </p>

              <Card className="border-2">
                <CardHeader>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1"
                          placeholder="Votre nom complet"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="mt-1"
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1"
                          placeholder="+216 XX XXX XXX"
                        />
                      </div>
                      <div>
                        <Label htmlFor="serviceType">Type de service</Label>
                        <Select onValueChange={(value) => handleSelectChange(value, "serviceType")}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Choisissez un service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admission">Gestion d'Admission</SelectItem>
                            <SelectItem value="language">Cours de Langue</SelectItem>
                            <SelectItem value="elearning">E-learning</SelectItem>
                            <SelectItem value="exams">Gestion d'Examens</SelectItem>
                            <SelectItem value="prospects">Gestion des Prospects</SelectItem>
                            <SelectItem value="other">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Sujet *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Objet de votre demande"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        className="mt-1"
                        rows={6}
                        placeholder="Décrivez votre demande en détail..."
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-[#3A90DA] hover:bg-[#62ace1] text-white font-semibold"
                    >
                      <Send className="mr-2 h-5 w-5" />
                      Envoyer le Message
                    </Button>
                  </form>
                </CardHeader>
              </Card>
            </div>

            {/* Map & Additional Info */}
            <div>
              <Badge className="bg-[#b5d3ef] text-[#3A90DA] hover:bg-[#b5d3ef] mb-4">Notre Emplacement</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Venez Nous Rencontrer
              </h2>
              <p className="text-gray-600 mb-8">
                Situé au cœur de Tunis, notre centre est facilement accessible en transport en commun.
              </p>

              {/* Map placeholder - you would replace this with an actual map component */}
              <div className="bg-gray-200 rounded-lg h-64 mb-8 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p>Carte Google Maps</p>
                  <p className="text-sm">123 Avenue de la République, Tunis</p>
                </div>
              </div>

              {/* Services rapides */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Services Rapides</h3>
                
                <Card className="border border-[#3A90DA]/20">
                  <CardHeader className="py-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-[#3A90DA] rounded-lg flex items-center justify-center mr-4">
                        <MessageSquare className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-[#3A90DA]">Chat en Direct</CardTitle>
                        <CardDescription>Support instantané en ligne</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <Card className="border border-[#3A90DA]/20">
                  <CardHeader className="py-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-[#62ace1] rounded-lg flex items-center justify-center mr-4">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-[#3A90DA]">Consultation Gratuite</CardTitle>
                        <CardDescription>Rendez-vous d'orientation personnalisé</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <Card className="border border-[#3A90DA]/20">
                  <CardHeader className="py-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-[#3A90DA] rounded-lg flex items-center justify-center mr-4">
                        <Headphones className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-[#3A90DA]">Support Technique</CardTitle>
                        <CardDescription>Assistance pour la plateforme</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-[#b5d3ef] text-[#3A90DA] hover:bg-[#b5d3ef] mb-4">Questions Fréquentes</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Vous Avez des Questions ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Voici les réponses aux questions les plus couramment posées par nos candidats.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 hover:border-[#3A90DA] transition-colors">
              <CardHeader>
                <CardTitle className="text-[#3A90DA]">Comment s'inscrire à nos formations ?</CardTitle>
                <CardDescription>
                  L'inscription se fait en ligne via notre plateforme. Après création de votre compte prospect, 
                  vous pourrez compléter votre dossier et choisir vos formations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#3A90DA] transition-colors">
              <CardHeader>
                <CardTitle className="text-[#3A90DA]">Quels sont les délais d'admission ?</CardTitle>
                <CardDescription>
                  Le traitement des dossiers prend généralement 72h ouvrées. Vous recevrez une notification 
                  par email dès que votre dossier sera validé.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#3A90DA] transition-colors">
              <CardHeader>
                <CardTitle className="text-[#3A90DA]">Peut-on visiter le centre avant l'inscription ?</CardTitle>
                <CardDescription>
                  Absolument ! Nous organisons des journées portes ouvertes chaque samedi matin. 
                  Vous pouvez aussi prendre rendez-vous pour une visite personnalisée.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#3A90DA] transition-colors">
              <CardHeader>
                <CardTitle className="text-[#3A90DA]">Quels modes de paiement acceptez-vous ?</CardTitle>
                <CardDescription>
                  Nous acceptons les virements bancaires, les chèques, et les paiements en ligne sécurisés. 
                  Des facilités de paiement sont également possibles.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#3A90DA] to-[#62ace1] text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à Commencer Votre Parcours ?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Nos conseillers sont disponibles pour vous guider dans le choix de vos formations et vous accompagner dans vos démarches.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-[#3A90DA] hover:bg-gray-100 font-semibold"
              onClick={() => router.push("/login/prospect")}
            >
              Créer Mon Compte Prospect
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-[#3A90DA]"
              onClick={() => router.push("/")}
            >
              Découvrir Nos Services
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
} 