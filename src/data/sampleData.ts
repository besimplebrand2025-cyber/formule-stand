import { Visitor } from '../types/visitor';

export const INITIAL_VISITORS: Visitor[] = [
  {
    id: 'demo-1',
    nom: 'Dubois',
    prenom: 'Claire',
    email: 'claire.dubois@meca-equip.fr',
    telephone: '+33 6 12 34 56 78',
    fonction: 'Directrice des Achats Industriels',
    entreprise: 'MécaEquip France',
    secteur: 'Hydraulique, Mécanique & Composants',
    besoins: ['Demande de devis', 'Documentation technique'],
    interet: 'chaud',
    recontact: true,
    notes: 'Recherche un fournisseur fiable de distributeurs et centrales hydrauliques. Besoin urgent pour 2 nouveaux bancs d\'essais.',
    dateVisite: new Date(Date.now() - 1000 * 60 * 42).toISOString()
  },
  {
    id: 'demo-2',
    nom: 'Benali',
    prenom: 'Karim',
    email: 'k.benali@batipro-engins.com',
    telephone: '+33 6 98 76 54 32',
    fonction: 'Responsable Maintenance & Parc Engins',
    entreprise: 'BâtiPro Engins TP',
    secteur: 'BTP, Construction & Engins',
    besoins: ['Partenariat commercial', 'Démonstration produit'],
    interet: 'chaud',
    recontact: true,
    notes: 'Flotte de 60 pelles et chargeuses. Très intéressé par notre gamme de vérins renforcés et flexibles haute pression.',
    dateVisite: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: 'demo-3',
    nom: 'Martin',
    prenom: 'Sophie',
    email: 'sophie.martin@agri-tech-systems.eu',
    telephone: '+33 7 45 67 89 01',
    fonction: 'Ingénieure Bureau d\'Études Hydraulique',
    entreprise: 'AgriTech Systems',
    secteur: 'Agriculture & Machinisme Agricole',
    besoins: ['Documentation technique'],
    interet: 'moyen',
    recontact: true,
    notes: 'Développement d\'une nouvelle gamme de pulvérisateurs avec assistance hydraulique proportionnelle.',
    dateVisite: new Date(Date.now() - 1000 * 60 * 210).toISOString()
  }
];
