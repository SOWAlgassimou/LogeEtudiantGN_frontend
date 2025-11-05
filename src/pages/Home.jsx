import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, Users, Shield, Star, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { VILLES_UNIVERSITAIRES } from '../utils/constants';
import VilleModal from '../components/common/VilleModal';

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedVille, setSelectedVille] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const images = [
    '/image-dortoir.jpg',
    '/image-dortoir1.png', 
    '/image-dortoir2.png',
    '/image-dortoir3.png'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const features = [
    {
      icon: Building,
      title: 'Chambres de qualité',
      description: 'Des logements étudiants confortables et bien équipés'
    },
    {
      icon: Users,
      title: 'Communauté étudiante',
      description: 'Rejoignez une communauté dynamique d\'étudiants'
    },
    {
      icon: Shield,
      title: 'Sécurisé et fiable',
      description: 'Plateforme sécurisée avec vérification des propriétaires'
    },
    {
      icon: Star,
      title: 'Service de qualité',
      description: 'Support client disponible et réactif'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-green-600 to-purple-600 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <img src="/CampusLogo.jpg" alt="LogeÉtudiantGN" className="h-16 w-16 rounded-2xl shadow-lg" />
              <h1 className="text-5xl md:text-6xl font-bold">
                LogeÉtudiantGN
              </h1>
            </div>
            <p className="text-2xl md:text-3xl mb-4 font-semibold">
              Trouvez votre logement étudiant en Guinée
            </p>
            <p className="text-lg md:text-xl mb-12 text-blue-100">
              Dans les 9 villes universitaires de Guinée - Plateforme moderne et sécurisée
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/chambres" className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl">
                🏠 Découvrir les chambres
              </Link>
              <Link to="/register" className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105 shadow-xl">
                🎓 Rejoindre la communauté
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Image Carousel Section */}
      <section className="relative w-full h-96 md:h-[500px] overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Background Images */}
        <div className="absolute inset-0">
          <img
            src={images[currentImage]}
            alt={`Dortoir ${currentImage + 1}`}
            className="w-full h-full object-cover transition-all duration-1000 transform hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              🏠 Nos résidences étudiantes
            </h2>
            <p className="text-xl md:text-2xl drop-shadow-lg text-blue-100">
              Découvrez nos espaces de vie modernes et confortables
            </p>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <button
          onClick={() => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 p-4 rounded-2xl backdrop-blur-sm transition-all hover:scale-110"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        
        <button
          onClick={() => setCurrentImage((prev) => (prev + 1) % images.length)}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 p-4 rounded-2xl backdrop-blur-sm transition-all hover:scale-110"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
        
        {/* Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentImage ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Villes Section */}
      <section className="py-20 bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white mb-8">
              <h2 className="text-4xl font-bold mb-4">
                🌍 Nos villes universitaires
              </h2>
              <p className="text-xl text-blue-100">
                Cliquez sur une ville pour découvrir ses universités et instituts
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {VILLES_UNIVERSITAIRES.map((ville) => (
              <button
                key={ville}
                onClick={() => {
                  setSelectedVille(ville);
                  setShowModal(true);
                }}
                className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-green-500 group-hover:from-blue-600 group-hover:to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-lg">
                    {ville}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Cliquer pour explorer</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              ✨ Pourquoi choisir LogeÉtudiantGN ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une plateforme moderne et sécurisée pour faciliter votre recherche de logement étudiant
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colors = [
                'from-blue-500 to-blue-600',
                'from-green-500 to-green-600', 
                'from-purple-500 to-purple-600',
                'from-yellow-500 to-orange-500'
              ];
              return (
                <div key={feature.title} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center">
                  <div className={`bg-gradient-to-r ${colors[index]} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              🏠 Prêt à trouver votre logement ?
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Rejoignez des centaines d'étudiants qui ont trouvé leur logement idéal sur LogeÉtudiantGN
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/chambres" className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl">
                🔍 Commencer la recherche
              </Link>
              <Link to="/register" className="border-2 border-white text-white px-10 py-4 rounded-2xl font-bold text-xl hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105 shadow-2xl">
                🎓 Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Modal */}
      <VilleModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        ville={selectedVille}
      />
    </div>
  );
};

export default Home;