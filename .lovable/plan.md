

## Plan d'amelioration du site Delices

### 1. Corriger l'erreur critique Leaflet (priorite haute)

La carte interactive `react-leaflet` cause une erreur fatale (`render2 is not a function`) a cause d'une incompatibilite React 18 / react-leaflet. La solution la plus fiable est de **supprimer react-leaflet** et le remplacer par un simple iframe Google Maps ou une saisie d'adresse manuelle. Cela eliminera l'erreur et rendra le site fonctionnel immediatement.

### 2. Gestion des reservations dans l'admin

Actuellement les reservations ne sont pas visibles dans le panneau admin. Ajouter une page `/admin/reservations` avec :
- Liste des reservations (date, heure, client, nombre de personnes, statut)
- Changement de statut (en attente, confirmee, annulee, terminee)
- Filtre par date et statut

### 3. Section avis clients

Ajouter une section "Temoignages" sur la page d'accueil avec :
- Affichage des avis clients depuis la base de donnees
- Formulaire pour laisser un avis (nom, note etoiles, commentaire)
- Moderation dans l'admin

### 4. Suivi de commande en temps reel

Permettre au client de suivre sa commande apres l'avoir passee :
- Page de suivi avec le numero de commande
- Statut en temps reel (en attente, acceptee, en preparation, terminee)
- Utilisation du temps reel pour les mises a jour instantanees

### 5. Notifications WhatsApp / SMS

Ajouter un bouton WhatsApp flottant sur toutes les pages et envoyer une notification WhatsApp au client quand sa commande change de statut.

### 6. Programme de fidelite simple

Un systeme de points pour les clients reguliers : chaque commande donne des points, avec des reductions apres un certain seuil.

### 7. Mode sombre / clair

Ajouter un toggle theme (deja installe : `next-themes`) pour basculer entre mode sombre et clair.

---

### Section technique

**Priorite 1 - Correction Leaflet :**
- Supprimer les dependances `react-leaflet`, `@react-leaflet/core`, `leaflet`, `@types/leaflet`
- Remplacer `LocationPicker.tsx` par un composant avec un champ texte + bouton geolocalisation (API `navigator.geolocation`) + iframe Google Maps statique
- Supprimer les configurations `optimizeDeps` et `cacheDir` devenues inutiles dans `vite.config.ts`

**Priorite 2 - Admin reservations :**
- Creer `src/pages/AdminReservations.tsx`
- Ajouter la route `/admin/reservations` dans `App.tsx`
- Ajouter le lien dans `AdminLayout.tsx` (icone `CalendarDays`)
- Reutiliser le hook `useReservations` existant + `useUpdateReservationStatus`

**Priorite 3 - Avis clients :**
- Creer une table `reviews` (id, customer_name, rating, comment, is_approved, created_at)
- Creer `src/components/ReviewsSection.tsx`
- Ajouter dans `Index.tsx` entre Galerie et Contact
- Ajouter une page admin pour moderer les avis

**Priorite 4 - Suivi de commande :**
- Creer `src/pages/OrderTracking.tsx` avec saisie du numero de commande
- Activer le realtime sur la table `orders`
- Afficher une timeline visuelle du statut

