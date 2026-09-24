import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Building2, 
  Compass, 
  CheckCircle2, 
  Flame, 
  Zap, 
  MessageSquare, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { Visitor, SECTEURS_ACTIVITE, BESOINS_OPTIONS, StandConfig } from '../types/visitor';
import { FirstImexLogo } from './FirstImexLogo';

interface VisitorFormProps {
  onSubmit: (visitor: Omit<Visitor, 'id' | 'dateVisite'>) => void;
  config: StandConfig;
  isKioskMode?: boolean;
}

export const VisitorForm: React.FC<VisitorFormProps> = ({ 
  onSubmit, 
  config,
  isKioskMode = false 
}) => {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [fonction, setFonction] = useState('');
  const [entreprise, setEntreprise] = useState('');
  const [secteur, setSecteur] = useState<string>('Hydraulique, Mécanique & Composants');
  const [secteurAutre, setSecteurAutre] = useState('');
  const [besoins, setBesoins] = useState<string[]>([]);
  const [interet, setInteret] = useState<'chaud' | 'moyen' | 'contact'>('moyen');
  const [recontact, setRecontact] = useState(true);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleBesoin = (besoin: string) => {
    setBesoins(prev => 
      prev.includes(besoin) 
        ? prev.filter(b => b !== besoin)
        : [...prev, besoin]
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!nom.trim()) newErrors.nom = 'Le nom est obligatoire';
    if (!prenom.trim()) newErrors.prenom = 'Le prénom est obligatoire';
    
    if (!email.trim()) {
      newErrors.email = 'L\'adresse email est obligatoire';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!telephone.trim()) {
      newErrors.telephone = 'Le numéro de téléphone est obligatoire';
    }

    if (!entreprise.trim()) {
      newErrors.entreprise = 'L\'entreprise est obligatoire';
    }

    if (!fonction.trim()) {
      newErrors.fonction = 'La fonction / poste est obligatoire';
    }

    if (secteur === 'Autre' && !secteurAutre.trim()) {
      newErrors.secteurAutre = 'Veuillez préciser le secteur d\'activité';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      const firstError = document.querySelector('.has-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    onSubmit({
      nom: nom.trim(),
      prenom: prenom.trim(),
      email: email.trim().toLowerCase(),
      telephone: telephone.trim(),
      fonction: fonction.trim(),
      entreprise: entreprise.trim(),
      secteur,
      secteurAutre: secteur === 'Autre' ? secteurAutre.trim() : undefined,
      besoins,
      interet,
      recontact,
      notes: notes.trim()
    });
  };

  const resetForm = () => {
    setNom('');
    setPrenom('');
    setEmail('');
    setTelephone('');
    setFonction('');
    setEntreprise('');
    setSecteur('Hydraulique, Mécanique & Composants');
    setSecteurAutre('');
    setBesoins([]);
    setInteret('moyen');
    setRecontact(true);
    setNotes('');
    setErrors({});
  };

  return (
    <div className="space-y-4">
      {/* Official FIRST IMEX Brand Banner */}
      <FirstImexLogo variant="banner" customLogoUrl={config.logoUrl} />

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-7">
        {/* Stand greeting header */}
        <div className="border-b border-slate-100 pb-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-widest text-[#17436b] uppercase">
                  {config.nomSociete || 'FIRST IMEX'}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 font-medium">
                  {config.sousTitreSociete || 'Composants & Systèmes Hydrauliques'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
                {config.nomStand ? `Bienvenue sur le stand : ${config.nomStand}` : 'Bienvenue sur notre stand'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {config.nomSalon ? `Événement : ${config.nomSalon} — ` : ''}Merci de renseigner vos coordonnées pour faciliter nos futurs échanges.
              </p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shrink-0"
              title="Effacer les champs du formulaire"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Réinitialiser</span>
            </button>
          </div>
        </div>

      {/* Section: Identité du visiteur */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Identité & Coordonnées
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Prénom */}
          <div className={errors.prenom ? 'has-error' : ''}>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Prénom <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={prenom}
                onChange={e => {
                  setPrenom(e.target.value);
                  if (errors.prenom) setErrors(prev => ({ ...prev, prenom: '' }));
                }}
                placeholder="ex. Jean"
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50/50 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.prenom 
                    ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-200' 
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
            </div>
            {errors.prenom && <p className="text-xs text-rose-500 mt-1">{errors.prenom}</p>}
          </div>

          {/* Nom */}
          <div className={errors.nom ? 'has-error' : ''}>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Nom <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={nom}
                onChange={e => {
                  setNom(e.target.value);
                  if (errors.nom) setErrors(prev => ({ ...prev, nom: '' }));
                }}
                placeholder="ex. Dupont"
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50/50 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.nom 
                    ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-200' 
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
            </div>
            {errors.nom && <p className="text-xs text-rose-500 mt-1">{errors.nom}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div className={errors.email ? 'has-error' : ''}>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Email professionnel ou personnel <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                placeholder="ex. j.dupont@entreprise.com"
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50/50 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.email 
                    ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-200' 
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
            </div>
            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
          </div>

          {/* Téléphone */}
          <div className={errors.telephone ? 'has-error' : ''}>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Numéro de téléphone <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={telephone}
                onChange={e => {
                  setTelephone(e.target.value);
                  if (errors.telephone) setErrors(prev => ({ ...prev, telephone: '' }));
                }}
                placeholder="ex. 06 12 34 56 78"
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50/50 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.telephone 
                    ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-200' 
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
            </div>
            {errors.telephone && <p className="text-xs text-rose-500 mt-1">{errors.telephone}</p>}
          </div>
        </div>
      </div>

      {/* Section: Entreprise & Activité */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Entreprise & Secteur d'activité
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Entreprise */}
          <div className={errors.entreprise ? 'has-error' : ''}>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Entreprise / Organisation <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={entreprise}
                onChange={e => {
                  setEntreprise(e.target.value);
                  if (errors.entreprise) setErrors(prev => ({ ...prev, entreprise: '' }));
                }}
                placeholder="ex. Acme Corp / Société SAS"
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50/50 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.entreprise 
                    ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-200' 
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
            </div>
            {errors.entreprise && <p className="text-xs text-rose-500 mt-1">{errors.entreprise}</p>}
          </div>

          {/* Fonction */}
          <div className={errors.fonction ? 'has-error' : ''}>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Fonction / Poste <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fonction}
                onChange={e => {
                  setFonction(e.target.value);
                  if (errors.fonction) setErrors(prev => ({ ...prev, fonction: '' }));
                }}
                placeholder="ex. Responsable Achats, Dirigeant, Ingénieur..."
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50/50 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.fonction 
                    ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-200' 
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
            </div>
            {errors.fonction && <p className="text-xs text-rose-500 mt-1">{errors.fonction}</p>}
          </div>
        </div>

        {/* Secteur d'activité */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Secteur d'activité <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Compass className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={secteur}
              onChange={e => setSecteur(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all appearance-none cursor-pointer"
            >
              {SECTEURS_ACTIVITE.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              ▼
            </div>
          </div>

          {secteur === 'Autre' && (
            <div className={`mt-3 ${errors.secteurAutre ? 'has-error' : ''}`}>
              <input
                type="text"
                value={secteurAutre}
                onChange={e => {
                  setSecteurAutre(e.target.value);
                  if (errors.secteurAutre) setErrors(prev => ({ ...prev, secteurAutre: '' }));
                }}
                placeholder="Veuillez préciser votre secteur d'activité..."
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
              />
              {errors.secteurAutre && <p className="text-xs text-rose-500 mt-1">{errors.secteurAutre}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Section: Qualification & Besoins de la visite */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Objet de la visite / Besoins du visiteur (optionnel)
          </label>
          <div className="flex flex-wrap gap-2">
            {BESOINS_OPTIONS.map(opt => {
              const selected = besoins.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleBesoin(opt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all text-left flex items-center gap-1.5 ${
                    selected
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${selected ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Évaluation d'intérêt (Visible surtout pour l'hôte ou paramétrable) */}
        {!isKioskMode && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Qualification prospect / Degré d'intérêt
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setInteret('chaud')}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                    interet === 'chaud'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 font-semibold ring-1 ring-amber-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  <span>Chaud 🔥</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInteret('moyen')}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                    interet === 'moyen'
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-900 font-semibold ring-1 ring-blue-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tiède ⚡</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInteret('contact')}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                    interet === 'contact'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 font-semibold ring-1 ring-emerald-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>Contact</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Notes de l'échange au stand
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Points clés discutés, rappel à prévoir..."
                  className="w-full pl-10 pr-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Checkbox recontact */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer group select-none">
            <input
              type="checkbox"
              checked={recontact}
              onChange={e => setRecontact(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
            />
            <span className="text-xs text-slate-700 leading-relaxed">
              Le visiteur souhaite être recontacté après l'événement pour un échange ou un suivi commercial.
            </span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Sauvegarde instantanée & export automatique disponible</span>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#17436b] hover:bg-[#123656] active:bg-[#0e2c47] text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-[#17436b] focus:ring-offset-2 cursor-pointer"
        >
          <span>Enregistrer le visiteur</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  </div>
  );
};
