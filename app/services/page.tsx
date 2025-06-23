"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Target, 
  BarChart3, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  Globe,
  Award,
  Clock,
  Star,
  MapPin,
  Languages
} from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#F6F6F6]" style={{ fontFamily: "Cairo, sans-serif" }}>
      {/* Navigation */}
      <Navbar activeLink="services" />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#3A90DA] to-[#62ace1] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Badge className="bg-[#b5d3ef] text-[#3A90DA] hover:bg-[#b5d3ef] mb-6">
              Centre de Langue Allemande
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Services Complets pour
              <span className="block text-[#b5d3ef]">Apprendre l'Allemand</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed max-w-3xl mx-auto">
              Découvrez notre gamme complète de services d'apprentissage de l'allemand, 
              conçus selon les standards européens CECRL avec certifications ALTE reconnues.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1: Cours d'Allemand */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#3A90DA] to-[#62ace1] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Languages className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Cours d'Allemand</CardTitle>
                <CardDescription className="text-gray-600">
                  Apprentissage complet de A1 à C2 selon le CECRL
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Tous niveaux CECRL (A1 à C2)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Approche communicative et interactive
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Salles modernes et lumineuses
                  </li>
                </ul>
                <Button asChild className="w-full bg-[#3A90DA] hover:bg-[#2980c9] text-white">
                  <Link href="/contactus">
                    En savoir plus
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Service 2: Certifications ALTE */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#3A90DA] to-[#62ace1] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Certifications ALTE</CardTitle>
                <CardDescription className="text-gray-600">
                  Certifications reconnues en Europe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Standards ALTE officiels
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Reconnaissance européenne
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Examens réguliers organisés
                  </li>
                </ul>
                <Button asChild className="w-full bg-[#3A90DA] hover:bg-[#2980c9] text-white">
                  <Link href="/contactus">
                    En savoir plus
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Service 3: Formation Entreprises */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#3A90DA] to-[#62ace1] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Formation Entreprises</CardTitle>
                <CardDescription className="text-gray-600">
                  Solutions sur mesure pour entreprises
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Programmes personnalisés
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Formation en entreprise
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Allemand professionnel
                  </li>
                </ul>
                <Button asChild className="w-full bg-[#3A90DA] hover:bg-[#2980c9] text-white">
                  <Link href="/contactus">
                    En savoir plus
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Service 4: Consulting Tuniso-Allemand */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#3A90DA] to-[#62ace1] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Consulting Tuniso-Allemand</CardTitle>
                <CardDescription className="text-gray-600">
                  Expertise biculturelle unique
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Accompagnement interculturel
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Relations Tunisie-Allemagne
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Support aux entreprises
                  </li>
                </ul>
                <Button asChild className="w-full bg-[#3A90DA] hover:bg-[#2980c9] text-white">
                  <Link href="/contactus">
                    En savoir plus
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Service 5: Préparation aux Examens */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#3A90DA] to-[#62ace1] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Préparation aux Examens</CardTitle>
                <CardDescription className="text-gray-600">
                  Préparation intensive aux certifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Préparation ALTE ciblée
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Tests blancs réguliers
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Stratégies d'examen
                  </li>
                </ul>
                <Button asChild className="w-full bg-[#3A90DA] hover:bg-[#2980c9] text-white">
                  <Link href="/contactus">
                    En savoir plus
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Service 6: Accompagnement Personnalisé */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#3A90DA] to-[#62ace1] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Accompagnement Personnalisé</CardTitle>
                <CardDescription className="text-gray-600">
                  Suivi individuel de votre progression
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Éducateurs expérimentés
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Suivi individualisé
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Méthodes didactiques modernes
                  </li>
                </ul>
                <Button asChild className="w-full bg-[#3A90DA] hover:bg-[#2980c9] text-white">
                  <Link href="/contactus">
                    En savoir plus
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-[#b5d3ef] text-[#3A90DA] hover:bg-[#b5d3ef] mb-6">
              Nos Centres
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Deux Centres à Votre Service
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Environnement chaleureux et convivial dans des salles de classe modernes et lumineuses, 
              situées en plein cœur de Sfax et de Tunis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Sfax Center */}
            <Card className="border-2 hover:border-[#3A90DA] transition-colors p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#3A90DA] rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#3A90DA] mb-2">Centre de Sfax</h3>
                  <p className="text-gray-600 mb-4">
                    Rue Ahmed Aloulou, Imm. Essia<br />
                    6ème étage bur N° 2<br />
                    3079 Sfax - Tunisie
                  </p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center">
                      <span className="mr-2">📞</span> +216 70 032 533
                    </p>
                    <p className="flex items-center">
                      <span className="mr-2">📱</span> +216 95 585 904
                    </p>
                    <p className="flex items-center">
                      <span className="mr-2">📱</span> +216 95 585 642
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tunis Center */}
            <Card className="border-2 hover:border-[#3A90DA] transition-colors p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#62ace1] rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#3A90DA] mb-2">Centre de Tunis</h3>
                  <p className="text-gray-600 mb-4">
                    Av. du Roi El-Saoud, impasse 2<br />
                    villa n°2, El-Manar 2<br />
                    2092 Tunis - Tunisie
                  </p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center">
                      <span className="mr-2">📱</span> +216 98 184 880
                    </p>
                    <p className="flex items-center">
                      <span className="mr-2">📱</span> +216 98 184 882
                    </p>
                    <p className="flex items-center">
                      <span className="mr-2">✉️</span> office@admission.tn
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#F6F6F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-[#b5d3ef] text-[#3A90DA] hover:bg-[#b5d3ef] mb-6">
              Pourquoi Nous Choisir
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              L'Excellence Tuniso-Allemande
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Notre expertise biculturelle et notre engagement envers la qualité font de nous 
              le leader de l'enseignement de l'allemand en Tunisie.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3A90DA] to-[#62ace1] rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Certifications ALTE</h3>
              <p className="text-gray-600">
                Seul centre en Tunisie offrant des certifications ALTE officielles reconnues en Europe.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3A90DA] to-[#62ace1] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Équipe Expérimentée</h3>
              <p className="text-gray-600">
                Éducateurs et spécialistes expérimentés dans l'enseignement de l'allemand langue étrangère.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3A90DA] to-[#62ace1] rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Standards CECRL</h3>
              <p className="text-gray-600">
                Formation alignée sur le Cadre européen commun de référence pour les langues.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3A90DA] to-[#62ace1] rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expertise Biculturelle</h3>
              <p className="text-gray-600">
                Société tuniso-allemande avec une compréhension unique des deux cultures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-[#b5d3ef] text-[#3A90DA] hover:bg-[#b5d3ef] mb-6">
              Témoignages
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ce Que Disent Nos Étudiants
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "L'approche communicative d'Admission m'a permis de progresser rapidement. 
                  J'ai obtenu ma certification ALTE B2 en seulement 8 mois !"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#3A90DA] to-[#62ace1] rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">MN</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Mariem Nasri</p>
                    <p className="text-sm text-gray-600">Étudiante - Certification B2</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Les salles modernes et l'environnement convivial créent une atmosphère 
                  parfaite pour apprendre. Les professeurs sont excellents !"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#3A90DA] to-[#62ace1] rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">AD</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Ahmed Dali</p>
                    <p className="text-sm text-gray-600">Étudiant - Niveau A2</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Grâce à leur formation entreprise personnalisée, notre équipe maîtrise 
                  maintenant l'allemand professionnel. Service exceptionnel !"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#3A90DA] to-[#62ace1] rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">SB</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Sophie Bernard</p>
                    <p className="text-sm text-gray-600">Responsable RH</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#3A90DA] to-[#62ace1] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à Commencer Votre Apprentissage ?
          </h2>
          <p className="text-xl mb-8 text-blue-100 leading-relaxed">
            Rejoignez des centaines d'étudiants qui ont choisi Admission pour 
            maîtriser l'allemand avec des certifications reconnues en Europe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-[#3A90DA] hover:bg-gray-100">
              <Link href="/login">
                Commencer Maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#3A90DA]">
              <Link href="/contactus">
                Nous Contacter
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
