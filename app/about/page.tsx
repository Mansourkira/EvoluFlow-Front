"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Award, Globe, Heart, Zap, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#F6F6F6]" style={{ fontFamily: "Cairo, sans-serif" }}>
      {/* Navigation */}
      <Navbar activeLink="about" />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#3A90DA] to-[#62ace1] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <Badge className="bg-[#b5d3ef] text-[#3A90DA] hover:bg-[#b5d3ef] mb-6">À Propos de Nous</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Centre de Formation de Langue Allemande
              <span className="block text-[#b5d3ef]">L'Excellence</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed max-w-3xl mx-auto">
              Depuis plus de 10 ans, nous accompagnons les candidats dans leur parcours d'admission et de formation linguistique avec passion et expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Notre Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-[#b5d3ef] text-[#3A90DA] hover:bg-[#b5d3ef] mb-4">Notre Mission</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transformer l'Éducation Moderne
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nous nous engageons à fournir une plateforme éducative innovante qui simplifie l'admission, 
              améliore l'apprentissage et garantit la réussite de chaque candidat.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-[#3A90DA] transition-colors text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-[#3A90DA] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-[#3A90DA]">Excellence Pédagogique</CardTitle>
                <CardDescription>
                  Nous offrons des programmes de formation de haute qualité adaptés aux besoins de chaque candidat,
                  avec un suivi personnalisé tout au long du parcours.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#3A90DA] transition-colors text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-[#62ace1] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-[#3A90DA]">Ouverture Internationale</CardTitle>
                <CardDescription>
                  Notre centre prépare les candidats aux défis internationaux avec des programmes linguistiques
                  reconnus et des certifications de renommée mondiale.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#3A90DA] transition-colors text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-[#3A90DA] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-[#3A90DA]">Accompagnement Humain</CardTitle>
                <CardDescription>
                  Une équipe dédiée et passionnée qui place l'humain au cœur de notre approche pédagogique
                  pour garantir la réussite de chaque apprenant.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-20 bg-[#F6F6F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-[#b5d3ef] text-[#3A90DA] hover:bg-[#b5d3ef] mb-4">Nos Valeurs</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ce Qui Nous Guide
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#3A90DA] to-[#62ace1] rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600">
                Nous visons l'excellence dans tous nos programmes et services pour garantir la meilleure formation possible.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#3A90DA] to-[#62ace1] rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Collaboration</h3>
              <p className="text-gray-600">
                Nous croyons en la force du travail d'équipe et de la collaboration pour atteindre les objectifs communs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#3A90DA] to-[#62ace1] rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                Nous adoptons les dernières technologies et méthodes pédagogiques pour rester à la pointe de l'éducation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#3A90DA] to-[#62ace1] rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Intégrité</h3>
              <p className="text-gray-600">
                Nous agissons avec transparence et honnêteté dans toutes nos relations avec les candidats et partenaires.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="bg-[#b5d3ef] text-[#3A90DA] hover:bg-[#b5d3ef] mb-4">Notre Histoire</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Plus de 10 Ans d'Expérience
              </h2>
              <div className="space-y-6 text-gray-600">
                <p>
                  Fondé en 2013, le Centre Allmeng a débuté avec une vision claire : démocratiser l'accès à l'éducation 
                  de qualité et accompagner chaque candidat vers la réussite.
                </p>
                <p>
                  Au fil des années, nous avons développé une expertise unique dans la gestion des admissions, 
                  l'enseignement des langues et la préparation aux examens internationaux.
                </p>
                <p>
                  Aujourd'hui, nous sommes fiers d'avoir accompagné plus de 1200 candidats vers leurs objectifs 
                  éducatifs et professionnels, avec un taux de réussite de 98%.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#3A90DA] to-[#62ace1] rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Nos Chiffres Clés</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">1200+</div>
                  <div className="text-blue-100">Candidats Formés</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">98%</div>
                  <div className="text-blue-100">Taux de Réussite</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">15</div>
                  <div className="text-blue-100">Programmes Offerts</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">24/7</div>
                  <div className="text-blue-100">Support Disponible</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#3A90DA] to-[#62ace1] text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Rejoignez Notre Communauté</h2>
          <p className="text-xl mb-8 text-blue-100">
            Découvrez comment Centre Allmeng peut vous accompagner dans votre parcours éducatif et professionnel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-[#3A90DA] hover:bg-gray-100 font-semibold"
              onClick={() => router.push("/")}
            >
              Découvrir Nos Programmes
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-[#3A90DA]"
              onClick={() => router.push("/login")}
            >
              Nous Contacter
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
