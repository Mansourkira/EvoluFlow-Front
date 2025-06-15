"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, BarChart3, Shield, Zap, CheckCircle, ArrowRight } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F6F6F6]" style={{ fontFamily: "Cairo, sans-serif" }}>
      {/* Navigation */}
      <Navbar activeLink="home" />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#3A90DA] to-[#62ace1] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-[#b5d3ef] text-[#3A90DA] hover:bg-[#b5d3ef] mb-6">Solution RH Innovante</Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Révolutionnez votre
                <span className="block text-[#b5d3ef]">Gestion d'Admission</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                Optimisez vos processus d'admission, gestion des candidats, cours de langue et examens avec notre
                plateforme éducative avancée. De la prospection à la certification.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-[#3A90DA] hover:bg-gray-100 font-semibold">
                  Commencer Gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#3A90DA]"
                >
                  Voir la Démo
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">1,200+</div>
                    <div className="text-sm text-blue-100">Étudiants Admis</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Target className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-sm text-blue-100">Taux de Réussite</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">50%</div>
                    <div className="text-sm text-blue-100">Processus Automatisés</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Shield className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-sm text-blue-100">Sécurisé</div>
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
            <Badge className="bg-[#b5d3ef] text-[#3A90DA] hover:bg-[#b5d3ef] mb-4">Fonctionnalités</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin pour réussir
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Notre plateforme intègre tous les outils essentiels pour une gestion RH efficace et moderne.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-[#3A90DA] transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-[#3A90DA] rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-[#3A90DA]">Gestion des Prospects et Candidats</CardTitle>
                <CardDescription>
                  Centralisez et organisez tous vos candidats avec un système de suivi avancé et des outils d'évaluation
                  intégrés.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#3A90DA] transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-[#62ace1] rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-[#3A90DA]">Gestion des Cours de Langue</CardTitle>
                <CardDescription>
                  Identifiez, suivez et convertissez vos prospects avec des outils de CRM spécialisés pour le
                  recrutement.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#3A90DA] transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-[#3A90DA] rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-[#3A90DA]">Gestion des Examens</CardTitle>
                <CardDescription>
                  Analysez vos performances RH avec des tableaux de bord détaillés et des rapports personnalisables.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#3A90DA] transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-[#62ace1] rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-[#3A90DA]">E-learning Platform</CardTitle>
                <CardDescription>
                  Automatisez vos processus répétitifs et concentrez-vous sur les tâches à haute valeur ajoutée.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#3A90DA] transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-[#3A90DA] rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-[#3A90DA]">Gestion des Produits (Product Sales)</CardTitle>
                <CardDescription>
                  Protégez vos données sensibles avec un chiffrement de niveau entreprise et des contrôles d'accès
                  granulaires.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#3A90DA] transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-[#62ace1] rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-[#3A90DA]">Marketing & Réclamations</CardTitle>
                <CardDescription>
                  Connectez facilement vos outils existants grâce à nos nombreuses intégrations et API ouvertes.
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un processus d'admission simplifié en 4 étapes pour une expérience optimale
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
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Inscription Prospect</h3>
              <p className="text-gray-600">
                Le candidat s'inscrit en ligne et remplit son dossier de candidature avec toutes les informations
                nécessaires.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Évaluation & Test</h3>
              <p className="text-gray-600">
                Évaluation du niveau linguistique et passage des examens d'admission selon les critères du centre.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Validation & Admission</h3>
              <p className="text-gray-600">
                Traitement du dossier par l'équipe administrative et validation de l'admission selon les résultats.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-[#62ace1] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">4</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Formation & Suivi</h3>
              <p className="text-gray-600">
                Accès aux cours de langue, plateforme e-learning et suivi personnalisé tout au long de la formation.
              </p>
            </div>
          </div>

          {/* Process Stats */}
          <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-[#3A90DA] mb-2">72h</div>
                <div className="text-gray-600">Temps moyen de traitement des dossiers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#3A90DA] mb-2">95%</div>
                <div className="text-gray-600">Taux de satisfaction des candidats</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#3A90DA] mb-2">24/7</div>
                <div className="text-gray-600">Support et assistance disponible</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#3A90DA] to-[#62ace1] text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prét à lancer votre carrière ?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Rejoignez des centaines d'étudiants qui ont déjà choisi notre centre pour maîtriser la langue allemande.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#3A90DA] hover:bg-gray-100 font-semibold">
              Inscription Rapide
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#3A90DA]">
              Demander un Rendez-vous
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
