import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-[#3A90DA] rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold">CA</span>
              </div>
              <span className="text-lg font-bold">Admission</span>
            </div>
            <p className="text-gray-400">
              Centre Allmeng - Excellence en formation et accompagnement éducatif depuis 2013.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Solutions</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Gestion des Candidats
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Gestion des Prospects
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Cours de Langue
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  E-learning
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Centre d'Aide
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Formation
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  À Propos
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Carrières
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Presse
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Partenaires
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Centre Allmeng. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
} 