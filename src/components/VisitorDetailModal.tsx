import React, { useState } from 'react';
import { 
  X, 
  User, 
  Building2, 
  Briefcase, 
  Mail, 
  Phone, 
  Compass, 
  Flame, 
  Zap, 
  Calendar, 
  Printer, 
  Save,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Visitor, BESOINS_OPTIONS, SECTEURS_ACTIVITE } from '../types/visitor';

interface VisitorDetailModalProps {
  visitor: Visitor | null;
  onClose: () => void;
  onSave: (updated: Visitor) => void;
  onDelete?: (id: string) => void;
}

export const VisitorDetailModal: React.FC<VisitorDetailModalProps> = ({
  visitor,
  onClose,
  onSave,
  onDelete
}) => {
  if (!visitor) return null;

  const [notes, setNotes] = useState(visitor.notes || '');
  const [interet, setInteret] = useState(visitor.interet);
  const [recontact, setRecontact] = useState(visitor.recontact);
  const [isSaved, setIsSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    onSave({
      ...visitor,
      notes,
      interet,
      recontact
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(visitor.id);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const dateObj = new Date(visitor.dateVisite);
  const dateStr = dateObj.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const timeStr = dateObj.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-150 relative">
        {/* Delete confirmation sub-modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-xs flex items-center justify-center p-6 animate-in fade-in duration-150">
            <div className="max-w-sm text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Supprimer ce contact ?
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Êtes-vous sûr de vouloir supprimer définitivement la fiche de <strong>{visitor.prenom} {visitor.nom}</strong> ({visitor.entreprise}) ?
                </p>
              </div>
              <div className="flex items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  Oui, supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              Fiche visiteur stand
            </h3>
            <div className="text-xs text-slate-500">
              Visite enregistrée le {dateStr} à {timeStr}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Identity & Contact Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xl font-bold text-slate-900">
                  {visitor.prenom} {visitor.nom}
                </div>
                <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mt-0.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>{visitor.fonction}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-900 font-bold">{visitor.entreprise}</span>
                </div>
              </div>

              {/* Status pill in modal */}
              <div className="text-right">
                {interet === 'chaud' && (
                  <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" /> Prioritaire 🔥
                  </span>
                )}
                {interet === 'moyen' && (
                  <span className="text-xs font-medium text-blue-700 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-blue-500" /> Intérêt moyen ⚡
                  </span>
                )}
                {interet === 'contact' && (
                  <span className="text-xs text-slate-600">Contact exploratoire</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
              <a 
                href={`mailto:${visitor.email}`}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 hover:underline p-1"
              >
                <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>{visitor.email}</span>
              </a>
              <a 
                href={`tel:${visitor.telephone}`}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 hover:underline p-1"
              >
                <Phone className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>{visitor.telephone}</span>
              </a>
            </div>

            <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-600 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Secteur : <strong>{visitor.secteur === 'Autre' && visitor.secteurAutre ? visitor.secteurAutre : visitor.secteur}</strong></span>
            </div>
          </div>

          {/* Besoins du visiteur */}
          {visitor.besoins && visitor.besoins.length > 0 && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Besoins exprimés
              </label>
              <div className="flex flex-wrap gap-1.5">
                {visitor.besoins.map(b => (
                  <span key={b} className="text-xs font-medium px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-md">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Edit Qualification & Follow-up */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Niveau d'intérêt commercial
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setInteret('chaud')}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    interet === 'chaud'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 font-semibold ring-1 ring-amber-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Chaud 🔥</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInteret('moyen')}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    interet === 'moyen'
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-900 font-semibold ring-1 ring-blue-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-blue-500" />
                  <span>Tiède ⚡</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInteret('contact')}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
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
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recontact}
                  onChange={e => setRecontact(e.target.checked)}
                  className="w-4 h-4 rounded text-[#17436b] border-slate-300 focus:ring-[#17436b]"
                />
                <span>À recontacter après le salon</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Notes & Compte-rendu de discussion
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="Ajoutez des précisions discutées sur le stand..."
                className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#17436b] focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Imprimer</span>
            </button>
            {onDelete && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-2 rounded-lg border border-rose-200 bg-white transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Fermer
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#17436b] hover:bg-[#123656] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Modifications enregistrées !' : 'Mettre à jour'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
