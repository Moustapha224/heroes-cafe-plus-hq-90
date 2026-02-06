import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import burgerImage from '@/assets/burger-hero.jpg';
import pizzaImage from '@/assets/pizza-specialty.jpg';
import africanImage from '@/assets/african-dish.jpg';

const MenuSection = () => {
  const menuCategories = [
    {
      title: 'Burgers Premium',
      description: 'Nos burgers signatures avec des ingrédients de qualité',
      image: burgerImage,
      items: [
        { name: 'Heroes Classic', price: '12€', description: 'Bœuf, cheddar, salade, tomate, sauce maison' },
        { name: 'Spicy Hero', price: '14€', description: 'Bœuf épicé, jalapeños, fromage fumé, sauce piquante' },
        { name: 'Chicken Deluxe', price: '13€', description: 'Poulet grillé, avocat, bacon, sauce ranch' }
      ]
    },
    {
      title: 'Pizzas Artisanales', 
      description: 'Pâte fraîche et ingrédients authentiques',
      image: pizzaImage,
      items: [
        { name: 'Margherita Royale', price: '15€', description: 'Mozzarella di bufala, tomates, basilic frais' },
        { name: 'Quattro Stagioni', price: '18€', description: 'Jambon, champignons, artichauts, olives' },
        { name: 'Pizza du Chef', price: '20€', description: 'Saumon fumé, crème fraîche, aneth, câpres' }
      ]
    },
    {
      title: 'Plats Africains',
      description: 'Saveurs authentiques de l\'Afrique de l\'Ouest',
      image: africanImage,
      items: [
        { name: 'Thiéboudienne', price: '16€', description: 'Riz au poisson, légumes, sauce tomate épicée' },
        { name: 'Mafé Poulet', price: '14€', description: 'Poulet à la sauce d\'arachide, légumes, riz' },
        { name: 'Yassa Poisson', price: '17€', description: 'Poisson grillé aux oignons confits et citron' }
      ]
    }
  ];

  return (
    <section id="menu" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-gradient-hero">
            Notre Menu
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos spécialités préparées avec passion par nos chefs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {menuCategories.map((category, index) => (
            <Card key={category.title} className="card-restaurant hover-scale slide-up">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-2xl font-heading font-bold mb-2">{category.title}</h3>
                  <p className="text-white/90 text-sm">{category.description}</p>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <div key={item.name} className="flex justify-between items-start group">
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {item.name}
                          </h4>
                          <span className="text-primary font-bold text-lg ml-2">{item.price}</span>
                        </div>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/menu">
                  <Button className="btn-secondary w-full mt-6">
                    Commander cette catégorie
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/menu">
            <Button className="btn-hero text-lg px-8 py-4">
              Voir le menu complet
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;