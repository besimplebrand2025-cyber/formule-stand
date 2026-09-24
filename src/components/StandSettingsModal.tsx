import React, { useState } from 'react';
import { X, Settings2, Building, Calendar, FileSpreadsheet, Image as ImageIcon, Upload, RotateCcw } from 'lucide-react';
import { StandConfig } from '../types/visitor';
import { FirstImexLogo } from './FirstImexLogo';

interface StandSettingsModalProps {
  config: StandConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: StandConfig) => void;
}

export const StandSettingsModal: React.FC<StandSettingsModalProps> = ({
  config,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const [nomSociete, setNomSociete] = useState(config.nomSociete || 'FIRST IMEX');
  const [sousTitreSociete, setSousTitreSociete] = useState(config.sousTitreSociete || 'Composants & Systèmes Hydrauliques');
  const [nomStand, setNomStand] = useState(config.nomStand);
  const [nomSalon, setNomSalon] = useState(config.nomSalon);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(config.logoUrl);
  const [autoExportOnChange, setAutoExportOnChange] = useState(config.autoExportOnChange);
  const [autoExportFormat, setAutoExportFormat] = useState(config.autoExportFormat);
  const [remerciementMessage, setRemerciementMessage] = useState(config.remerciementMessage);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetToDefaultLogo = () => {
    setLogoUrl(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      nomSociete: nomSociete.trim(),
      sousTitreSociete: sousTitreSociete.trim(),
      nomStand: nomStand.trim(),
      nomSalon: nomSalon.trim(),
      logoUrl,
      autoExportOnChange,
      autoExportFormat,
      remerciementMessage: remerciementMessage.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-[#17436b]" />
            <h3 className="font-bold text-slate-900 text-base">
              Identité Société, Stand & Exports
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Company & Logo Section */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#17436b]" />
                Logo & Société
              </span>
              {logoUrl && (
                <button
                  type="button"
                  onClick={handleResetToDefaultLogo}
                  className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Logo FIRST IMEX officiel
                </button>
              )}
            </div>

            {/* Logo Preview */}
            <div className="rounded-xl overflow-hidden shadow-xs">
              <FirstImexLogo variant="banner" customLogoUrl={logoUrl} className="max-w-none" />
            </div>

            {/* Custom file upload button */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Changer le logo :</span>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 cursor-pointer shadow-xs">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Importer un fichier image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/70">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Nom de la société
                </label>
                <input
                  type="text"
                  value={nomSociete}
                  onChange={e => setNomSociete(e.target.value)}
                  placeholder="FIRST IMEX"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#17436b]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Sous-titre / Spécialité
                </label>
                <input
                  type="text"
                  value={sousTitreSociete}
                  onChange={e => setSousTitreSociete(e.target.value)}
                  placeholder="Composants & Systèmes Hydrauliques"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#17436b]"
                />
              </div>
            </div>
          </div>

          {/* Stand & Salon Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Numéro ou Nom du Stand
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={nomStand}
                  onChange={e => setNomStand(e.target.value)}
                  placeholder="ex. Stand FIRST IMEX - Hall 3"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#17436b] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Nom du Salon / Événement
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={nomSalon}
                  onChange={e => setNomSalon(e.target.value)}
                  placeholder="ex. Salon SIMA / Intermat 2026"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#17436b] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Auto Export Configuration */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={autoExportOnChange}
                onChange={e => setAutoExportOnChange(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#17436b] border-slate-300 focus:ring-[#17436b]"
              />
              <div>
                <span className="text-xs font-semibold text-slate-900 block">
                  Export automatique à chaque nouvel enregistrement
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Génère et télécharge immédiatement la liste à jour sur l'appareil dès qu'un visiteur valide son formulaire.
                </span>
              </div>
            </label>

            {autoExportOnChange && (
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Format d'export :</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAutoExportFormat('xlsx')}
                    className={`px-3 py-1 rounded-lg border text-xs font-medium transition-colors ${
                      autoExportFormat === 'xlsx'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Excel (.xlsx)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAutoExportFormat('csv')}
                    className={`px-3 py-1 rounded-lg border text-xs font-medium transition-colors ${
                      autoExportFormat === 'csv'
                        ? 'bg-blue-50 border-blue-300 text-[#17436b]'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    CSV (.csv)
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Message de remerciement au visiteur
            </label>
            <textarea
              value={remerciementMessage}
              onChange={e => setRemerciementMessage(e.target.value)}
              rows={2}
              placeholder="Vos coordonnées ont bien été enregistrées..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#17436b] focus:bg-white resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#17436b] hover:bg-[#123656] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
            >
              Enregistrer les paramètres
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
