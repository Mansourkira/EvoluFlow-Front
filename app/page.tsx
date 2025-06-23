"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, BarChart3, Shield, Zap, CheckCircle, ArrowRight, Globe, Award, BookOpen, MapPin } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"

export default function Component() {
  return (
    <div className="min-h-screen bg-[#F6F6F6]" style={{ fontFamily: "Cairo, sans-serif" }}>
      {/* Navigation */}
      <Navbar activeLink="home" />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#3A90DA] to-[#62ace1] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-[#b5d3ef] text-[#3A90DA] hover:bg-[#b5d3ef] mb-6">Centre de Langue Allemande</Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Apprenez l'allemand avec
                <span className="block text-[#b5d3ef]">Admission</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                Centre de formation tuniso-allemand spécialisé dans l'enseignement de l'allemand langue étrangère. 
                Certifications ALTE dans un environnement moderne à Sfax et Tunis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-[#3A90DA] hover:bg-gray-100 font-semibold">
                  <Link href="/login">
                    Commencer Gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#3A90DA]"
                >
                  <Link href="/contactus">
                    Nous Contacter
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">1,200+</div>
                    <div className="text-sm text-blue-100">Étudiants Formés</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Award className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">ALTE</div>
                    <div className="text-sm text-blue-100">Certifications</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <MapPin className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">2</div>
                    <div className="text-sm text-blue-100">Centres (Sfax & Tunis)</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Globe className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">CECRL</div>
                    <div className="text-sm text-blue-100">Standards Européens</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-[#b5d3ef] text-[#3A90DA] hover:bg-[#b5d3ef] mb-4">Nos Services</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tout pour maîtriser l'allemand
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une approche communicative, interactive et didactique alignée sur le Cadre européen commun de référence pour les langues (CECRL).
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-[#3A90DA] transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-[#3A90DA] rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-[#3A90DA]">Cours d'Allemand</CardTitle>
                <CardDescription>
                  Cours interactifs et communicatifs dans des salles modernes et lumineuses, adaptés à tous les niveaux selon le CECRL.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#3A90DA] transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-[#62ace1] rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-[#3A90DA]">Certifications ALTE</CardTitle>
                <CardDescription>
                  Certifications officielles élaborées selon les niveaux et critères de l'Association des organismes certificateurs en Europe.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#3A90DA] transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-[#3A90DA] rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-[#3A90DA]">Équipe Expérimentée</CardTitle>
                <CardDescription>
                  Éducateurs et spécialistes expérimentés dans l'enseignement de l'allemand comme langue étrangère.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#3A90DA] transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-[#62ace1] rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-[#3A90DA]">Centres Modernes</CardTitle>
                <CardDescription>
                  Salles de classe modernes et lumineuses situées en plein cœur de Sfax et de Tunis pour un apprentissage optimal.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#3A90DA] transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-[#3A90DA] rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-[#3A90DA]">Standards Européens</CardTitle>
                <CardDescription>
                  Formation alignée sur le Cadre européen commun de référence pour les langues (CECRL) pour une reconnaissance internationale.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#3A90DA] transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-[#62ace1] rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-[#3A90DA]">Formation & Consulting</CardTitle>
                <CardDescription>
                  Services complets de formation et de consulting pour particuliers et entreprises avec expertise tuniso-allemande.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[#F6F6F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-[#b5d3ef] text-[#3A90DA] hover:bg-[#b5d3ef] mb-4">Processus</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Votre parcours d'apprentissage</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un processus d'apprentissage structuré en 4 étapes pour maîtriser l'allemand efficacement
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-[#3A90DA] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-[#b5d3ef] -translate-x-8"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Évaluation Initiale</h3>
              <p className="text-gray-600">
                Test de niveau pour déterminer votre niveau actuel en allemand selon les standards CECRL.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-[#62ace1] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-[#b5d3ef] -translate-x-8"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Formation Personnalisée</h3>
              <p className="text-gray-600">
                Cours adaptés à votre niveau avec une approche communicative et interactive dans nos centres modernes.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-[#3A90DA] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-[#b5d3ef] -translate-x-8"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Suivi & Progression</h3>
              <p className="text-gray-600">
                Accompagnement personnalisé par nos spécialistes expérimentés avec suivi régulier de vos progrès.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-[#62ace1] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">4</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Certification ALTE</h3>
              <p className="text-gray-600">
                Obtenez votre certification officielle ALTE reconnue en Europe pour valider votre niveau d'allemand.
              </p>
            </div>
          </div>

          {/* Process Stats */}
          <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-[#3A90DA] mb-2">A1-C2</div>
                <div className="text-gray-600">Tous niveaux CECRL disponibles</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#3A90DA] mb-2">95%</div>
                <div className="text-gray-600">Taux de réussite aux certifications</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#3A90DA] mb-2">Tuniso-Allemand</div>
                <div className="text-gray-600">Expertise biculturelle unique</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-[#b5d3ef] text-[#3A90DA] hover:bg-[#b5d3ef] mb-4">Nos Centres</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Deux centres à votre service</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Retrouvez-nous dans nos centres modernes à Sfax et Tunis
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
                    Rue Ahmed Aloulou, Imm. Essia, 6ème étage bur N° 2<br />
                    3079 Sfax - Tunisie
                  </p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>📞 +216 70 032 533</p>
                    <p>📱 +216 95 585 904</p>
                    <p>📱 +216 95 585 642</p>
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
                    Av. du Roi El-Saoud, impasse 2, villa n°2, El-Manar 2<br />
                    2092 Tunis - Tunisie
                  </p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>📱 +216 98 184 880</p>
                    <p>📱 +216 98 184 882</p>
                    <p>✉️ office@admission.tn</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#3A90DA] to-[#62ace1] text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à apprendre l'allemand ?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Rejoignez des centaines d'étudiants qui ont choisi Admission pour maîtriser l'allemand avec des certifications reconnues en Europe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-[#3A90DA] hover:bg-gray-100 font-semibold">
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src="/logo1.png" 
                  alt="Admission Logo" 
                  className="w-20 h-20 object-contain mr-3"
                />
              </div>
              <p className="text-gray-400">
                Centre de formation tuniso-allemand spécialisé dans l'enseignement de l'allemand langue étrangère 
                avec certifications ALTE reconnues en Europe.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Nos Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/services" className="hover:text-white transition-colors">
                    Cours d'Allemand
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-white transition-colors">
                    Certifications ALTE
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-white transition-colors">
                    Formation Entreprises
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-white transition-colors">
                    Consulting
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    À Propos
                  </Link>
                </li>
                <li>
                  <Link href="/contactus" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-white transition-colors">
                    Nos Services
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>✉️ office@admission.tn</li>
                <li>📍 Sfax: Rue Ahmed Aloulou</li>
                <li>📞 +216 70 032 533</li>
                <li>📍 Tunis: Av. du Roi El-Saoud</li>
                <li>📞 +216 98 184 880</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Admission - Centre de Langue Allemande. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
