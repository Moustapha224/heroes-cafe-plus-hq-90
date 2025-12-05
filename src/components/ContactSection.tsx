import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ContactSection = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Adresse',
      content: '123 Avenue de la Gastronomie\n75001 Paris, France'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      content: '+33 1 23 45 67 89\nWhatsApp: +33 6 78 90 12 34'
    },
    {
      icon: Clock,
      title: 'Horaires',
      content: 'Lun-Dim: 11h30 - 23h00\nService continu'
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'contact@heroescafeplus.com\nreservation@heroescafeplus.com'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-gradient-hero">
            Contactez-nous
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Réservez votre table ou contactez-nous pour toute question
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6 slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <Card key={info.title} className="card-restaurant hover-scale">
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <h3 className="font-heading font-bold text-lg mb-2 text-foreground">
                        {info.title}
                      </h3>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {info.content}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Google Maps */}
            <Card className="card-restaurant overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13912.349031469446!2d-13.6015468!3d9.59716855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xf1cd5b1f533c77b%3A0x39b71a6593689bc5!2sMikhiforeya!5e1!3m2!1sfr!2s!4v1764947814588!5m2!1sfr!2s"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                  title="Localisation du restaurant Délices"
                />
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="card-restaurant slide-up">
            <CardContent className="p-8">
              <h3 className="text-2xl font-heading font-bold mb-6 text-center">
                Formulaire de Réservation
              </h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom *</label>
                    <Input placeholder="Votre nom" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Prénom *</label>
                    <Input placeholder="Votre prénom" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input type="email" placeholder="votre@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Téléphone</label>
                    <Input placeholder="+33 1 23 45 67 89" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date *</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Heure *</label>
                    <Input type="time" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Nombre de personnes *</label>
                  <Input type="number" min="1" max="20" placeholder="2" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message (optionnel)</label>
                  <Textarea 
                    placeholder="Demandes spéciales, allergies, préférences..."
                    className="min-h-[100px]"
                  />
                </div>

                <Button className="btn-hero w-full text-lg">
                  Réserver maintenant
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-muted-foreground text-sm mb-4">
                  Ou contactez-nous directement via WhatsApp
                </p>
                <Button className="btn-accent">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.087z"/>
                  </svg>
                  Contacter via WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;