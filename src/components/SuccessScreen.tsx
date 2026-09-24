import React, { useEffect, useState } from 'react';
import { CheckCircle2, UserPlus, FileSpreadsheet, ArrowRight, Building2, Briefcase, Mail } from 'lucide-react';
import { Visitor, StandConfig } from '../types/visitor';
import { exportToExcel, exportToCSV } from '../utils/exportUtils';
import { FirstImexLogo } from './FirstImexLogo';

interface SuccessScreenProps {
  visitor: Visitor;
  allVisitors: Visitor[];
  config: StandConfig;
  onNextVisitor: () => void;
  onViewList: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  visitor,
  allVisitors,
  config,
  onNextVisitor,
  onViewList
}) => {
  const [countdown, setCountdown] = useState<number>(5);

  useEffect(() => {
    if (countdown <= 0) {
      onNextVisitor();
      return;
    }
    const timer = setInterval(() => {
      setCountdown(c => c - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, onNextVisitor]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-10 max-w-2xl mx-auto text-center animate-in fade-in zoom-in-95 duration-200">
      {/* Brand logo at top */}
      <div className="mb-4">
        <FirstImexLogo variant="navbar" customLogoUrl={config.logoUrl} className="justify-center" />
      </div>

      {/* Icon checkmark */}
      <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
        <CheckCircle2 className="w-7 h-7" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
        Merci pour votre visite !
      </h2>
      <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
        {config.remerciementMessage || "Vos coordonnées ont bien été enregistrées sur notre stand. Notre équipe FIRST IMEX reprendra contact avec vous."}
      </p>

      {/* Visitor recap card */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 sm:p-5 text-left mb-6 max-w-md mx-auto">
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 mb-3">
          <div>
            <div className="font-semibold text-slate-900 text-base">
              {visitor.prenom} {visitor.nom}
            </div>
            <div className="text-xs text-slate-500">
              Inscrit à {new Date(visitor.dateVisite).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700">
            #{allVisitors.length} sur le stand
          </span>
        </div>

        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-800">{visitor.entreprise}</span>
            <span className="text-slate-400">·</span>
            <span>{visitor.secteur === 'Autre' && visitor.secteurAutre ? visitor.secteurAutre : visitor.secteur}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{visitor.fonction}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{visitor.email}</span>
          </div>
        </div>
      </div>

      {/* Auto-export notification if enabled */}
      {config.autoExportOnChange && (
        <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg py-2 px-3 mb-6 inline-flex items-center gap-2 max-w-md mx-auto">
          <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Fichier {config.autoExportFormat.toUpperCase()} exporté automatiquement avec succès !</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onNextVisitor}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#17436b] hover:bg-[#123656] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Visiteur suivant ({countdown}s)</span>
        </button>

        <button
          onClick={onViewList}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl transition-colors cursor-pointer"
        >
          <span>Voir les {allVisitors.length} inscrits</span>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Quick export shortcuts */}
      <div className="mt-8 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
        <span>Export rapide :</span>
        <button
          onClick={() => exportToExcel(allVisitors, config.nomStand || config.nomSociete)}
          className="text-[#17436b] hover:underline font-medium inline-flex items-center gap-1"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Télécharger Excel (.xlsx)</span>
        </button>
        <span>·</span>
        <button
          onClick={() => exportToCSV(allVisitors, config.nomStand || config.nomSociete)}
          className="text-[#17436b] hover:underline font-medium inline-flex items-center gap-1"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Télécharger CSV (.csv)</span>
        </button>
      </div>
    </div>
  );
};
