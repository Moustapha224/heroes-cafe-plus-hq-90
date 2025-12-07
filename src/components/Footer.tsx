import { MapPin, Phone, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Restaurant Info */}
          <div>
            <h3 className="text-2xl font-heading font-bold mb-4 text-accent">
              Délices
            </h3>
            <p className="text-secondary-foreground/80 mb-4">
              Une expérience culinaire exceptionnelle qui unit les saveurs du monde 
              dans un cadre moderne et chaleureux.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6 hover:text-accent cursor-pointer transition-colors" />
              <Instagram className="w-6 h-6 hover:text-accent cursor-pointer transition-colors" />
              <Twitter className="w-6 h-6 hover:text-accent cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-heading font-bold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm">123 Avenue de la Gastronomie</p>
                  <p className="text-sm">75001 Paris, France</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <p className="text-sm">+33 1 23 45 67 89</p>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm">Lun-Dim: 11h30 - 23h00</p>
                  <p className="text-sm">Service continu</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-heading font-bold mb-4">Liens rapides</h4>
            <div className="space-y-2">
              <a href="#home" className="block text-sm hover:text-accent transition-colors">Accueil</a>
              <a href="#about" className="block text-sm hover:text-accent transition-colors">À propos</a>
              <a href="#menu" className="block text-sm hover:text-accent transition-colors">Menu</a>
              <a href="#gallery" className="block text-sm hover:text-accent transition-colors">Galerie</a>
              <a href="#contact" className="block text-sm hover:text-accent transition-colors">Contact</a>
              <Link to="/admin/auth" className="block text-sm hover:text-accent transition-colors">Administration</Link>
              <a href="#" className="block text-sm hover:text-accent transition-colors">Mentions légales</a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xl font-heading font-bold mb-4">Newsletter</h4>
            <p className="text-sm text-secondary-foreground/80 mb-4">
              Restez informé de nos nouveautés, événements et offres spéciales.
            </p>
            <div className="space-y-3">
              <Input 
                placeholder="Votre email"
                className="bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/60"
              />
              <Button className="btn-accent w-full">
                S'abonner
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-secondary-foreground/60">
            © 2024 Délices. Tous droits réservés.
          </p>
          <p className="text-sm text-secondary-foreground/60 mt-2 md:mt-0">
            Créé avec ❤️ pour une expérience culinaire exceptionnelle
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;