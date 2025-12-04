import burgerImage from '@/assets/burger-hero.jpg';
import pizzaImage from '@/assets/pizza-specialty.jpg';
import africanImage from '@/assets/african-dish.jpg';
import heroImage from '@/assets/hero-restaurant.jpg';

const GallerySection = () => {
  const galleryImages = [
    { src: heroImage, alt: 'Intérieur du restaurant Délices', category: 'Ambiance' },
    { src: burgerImage, alt: 'Burger gourmet premium', category: 'Burgers' },
    { src: pizzaImage, alt: 'Pizza artisanale', category: 'Pizzas' },
    { src: africanImage, alt: 'Plat africain traditionnel', category: 'Africain' },
    { src: heroImage, alt: 'Terrasse du restaurant', category: 'Ambiance' },
    { src: burgerImage, alt: 'Burger signature', category: 'Burgers' },
  ];

  return (
    <section id="gallery" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-gradient-hero">
            Notre Galerie
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez l'atmosphère chaleureuse de Délices et nos créations culinaires
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className={`relative overflow-hidden rounded-xl group cursor-pointer slide-up ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img 
                src={image.src} 
                alt={image.alt}
                className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                  index === 0 ? 'h-64 md:h-full' : 'h-48 md:h-64'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block px-3 py-1 bg-primary/90 text-primary-foreground text-sm rounded-full font-medium">
                  {image.category}
                </span>
                <p className="text-white mt-2 font-medium">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
