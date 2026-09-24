export interface Visitor {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  fonction: string;
  entreprise: string;
  secteur: string;
  secteurAutre?: string;
  besoins?: string[];
  interet: 'chaud' | 'moyen' | 'contact';
  recontact: boolean;
  notes?: string;
  dateVisite: string; // ISO string
}

export interface StandConfig {
  nomSociete: string;
  sousTitreSociete: string;
  logoUrl?: string;
  nomStand: string;
  nomSalon: string;
  autoExportOnChange: boolean;
  autoExportFormat: 'xlsx' | 'csv';
  remerciementMessage: string;
}

export const SECTEURS_ACTIVITE = [
  'Hydraulique, Mécanique & Composants',
  'Industrie & Ingénierie',
  'BTP, Construction & Engins',
  'Agriculture & Machinisme Agricole',
  'Transport, Logistique & Flottes',
  'Énergie, Climat & Environnement',
  'Informatique, Digital & Tech',
  'Santé, Pharma & Médical',
  'Commerce & Distribution B2B',
  'Conseil, Audit & Services B2B',
  'Autre'
] as const;

export const BESOINS_OPTIONS = [
  'Demande de devis',
  'Démonstration produit',
  'Partenariat commercial',
  'Documentation technique',
  'Recrutement / RH',
  'Prise de contact générale'
] as const;
