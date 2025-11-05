import { Building, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-blue-900 to-green-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img src="/CampusLogo.jpg" alt="LogeÉtudiantGN" className="h-16 w-16 rounded-2xl shadow-lg" />
              <div>
                <h2 className="text-2xl font-bold">LogeÉtudiantGN</h2>
                <p className="text-blue-200 text-sm">Logement étudiant en Guinée</p>
              </div>
            </div>
            <p className="text-blue-100 mb-6 text-lg leading-relaxed">
              La plateforme de référence pour les logements étudiants en Guinée. 
              Trouvez facilement votre chambre idéale dans nos 9 villes universitaires.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-white">📞 Contact</h3>
            <div className="space-y-4 text-blue-100">
              <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-xl">
                <Phone className="h-5 w-5 text-green-400" />
                <span>+224 XXX XX XX XX</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-xl">
                <Mail className="h-5 w-5 text-blue-400" />
                <span>contact@logeetudiantgn.com</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-xl">
                <MapPin className="h-5 w-5 text-yellow-400" />
                <span>Guinée, Afrique de l'Ouest</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-white">🔗 Liens utiles</h3>
            <div className="space-y-3 text-blue-100">
              <div className="hover:text-white cursor-pointer transition-colors p-2 hover:bg-white/10 rounded-lg">À propos</div>
              <div className="hover:text-white cursor-pointer transition-colors p-2 hover:bg-white/10 rounded-lg">Conditions d'utilisation</div>
              <div className="hover:text-white cursor-pointer transition-colors p-2 hover:bg-white/10 rounded-lg">Politique de confidentialité</div>
              <div className="hover:text-white cursor-pointer transition-colors p-2 hover:bg-white/10 rounded-lg">Support client</div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-200 text-center md:text-left">
              &copy; 2024 LogeÉtudiantGN. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <span className="text-blue-200">Développé avec</span>
              <span className="text-red-400 text-xl">❤️</span>
              <span className="text-blue-200">en Guinée</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;