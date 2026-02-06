import { ChefHat, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-restaurant.jpg';

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 via-secondary/60 to-primary/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto fade-in">
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
            Délices
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-white/90 font-light">
            Une expérience culinaire exceptionnelle
          </p>
          <p className="text-lg md:text-xl mb-8 text-white/80 max-w-2xl mx-auto">
            Découvrez notre fusion unique de saveurs internationales dans un cadre moderne et chaleureux
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/menu">
              <Button className="btn-hero text-lg px-8 py-4 hover-scale">
                Commander en ligne
              </Button>
            </Link>
            <Link to="/#contact">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-lg px-8 py-4 hover-scale backdrop-blur-sm"
              >
                Réserver une table
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <ChefHat className="w-8 h-8 mb-2 text-accent" />
              <h3 className="text-2xl font-bold">15+</h3>
              <p className="text-white/80">Chefs Expérimentés</p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="w-8 h-8 mb-2 text-accent" />
              <h3 className="text-2xl font-bold">4.9</h3>
              <p className="text-white/80">Note Moyenne</p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 mb-2 text-accent" />
              <h3 className="text-2xl font-bold">10</h3>
              <p className="text-white/80">Ans d'Excellence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60">
        <div className="flex flex-col items-center">
          <p className="text-sm mb-2">Découvrir</p>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;