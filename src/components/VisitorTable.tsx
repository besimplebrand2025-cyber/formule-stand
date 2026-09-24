import React, { useState, useMemo } from 'react';
import { 
  Search, 
  FileSpreadsheet, 
  Download, 
  Copy, 
  Check, 
  Trash2, 
  Eye, 
  Settings2, 
  Flame, 
  Zap, 
  Phone, 
  Mail, 
  Building2, 
  Briefcase,
  Calendar,
  Layers,
  ArrowUpDown,
  AlertTriangle,
  X
} from 'lucide-react';
import { Visitor, SECTEURS_ACTIVITE, StandConfig } from '../types/visitor';
import { exportToExcel, exportToCSV, copyVisitorsToClipboard } from '../utils/exportUtils';
import { FirstImexLogo } from './FirstImexLogo';

interface VisitorTableProps {
  visitors: Visitor[];
  config: StandConfig;
  onUpdateConfig: (newConfig: StandConfig) => void;
  onSelectVisitor: (visitor: Visitor) => void;
  onDeleteVisitor: (id: string) => void;
  onClearAll: () => void;
  onLoadSamples: () => void;
  onNewVisitorClick: () => void;
}

export const VisitorTable: React.FC<VisitorTableProps> = ({
  visitors,
  config,
  onUpdateConfig,
  onSelectVisitor,
  onDeleteVisitor,
  onClearAll,
  onLoadSamples,
  onNewVisitorClick
}) => {
  const [search, setSearch] = useState('');
  const [secteurFilter, setSecteurFilter] = useState('ALL');
  const [interetFilter, setInteretFilter] = useState('ALL');
  const [recontactOnly, setRecontactOnly] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // In-App confirmation modals (replaces window.confirm which fails in iframe)
  const [visitorToDelete, setVisitorToDelete] = useState<Visitor | null>(null);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);

  // Stats computation
  const stats = useMemo(() => {
    const total = visitors.length;
    const chauds = visitors.filter(v => v.interet === 'chaud').length;
    const recontacts = visitors.filter(v => v.recontact).length;

    // Sector counts
    const sectorCounts: Record<string, number> = {};
    visitors.forEach(v => {
      const s = v.secteur === 'Autre' && v.secteurAutre ? v.secteurAutre : v.secteur;
      sectorCounts[s] = (sectorCounts[s] || 0) + 1;
    });

    let topSecteur = '-';
    let maxCount = 0;
    Object.entries(sectorCounts).forEach(([sec, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topSecteur = sec;
      }
    });

    return { total, chauds, recontacts, topSecteur, maxCount };
  }, [visitors]);

  // Filtering & Sorting
  const filteredVisitors = useMemo(() => {
    return visitors.filter(v => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesSearch = 
          v.nom.toLowerCase().includes(q) ||
          v.prenom.toLowerCase().includes(q) ||
          v.email.toLowerCase().includes(q) ||
          v.telephone.toLowerCase().includes(q) ||
          v.entreprise.toLowerCase().includes(q) ||
          v.fonction.toLowerCase().includes(q) ||
          v.secteur.toLowerCase().includes(q) ||
          (v.notes && v.notes.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      // Secteur filter
      if (secteurFilter !== 'ALL' && v.secteur !== secteurFilter) {
        return false;
      }

      // Interet filter
      if (interetFilter !== 'ALL' && v.interet !== interetFilter) {
        return false;
      }

      // Recontact only
      if (recontactOnly && !v.recontact) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const dateA = new Date(a.dateVisite).getTime();
      const dateB = new Date(b.dateVisite).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [visitors, search, secteurFilter, interetFilter, recontactOnly, sortOrder]);

  const handleCopyClipboard = async () => {
    const ok = await copyVisitorsToClipboard(filteredVisitors.length > 0 ? filteredVisitors : visitors);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const confirmDeleteVisitor = () => {
    if (visitorToDelete) {
      onDeleteVisitor(visitorToDelete.id);
      setVisitorToDelete(null);
    }
  };

  const confirmClearAll = () => {
    onClearAll();
    setIsClearAllModalOpen(false);
  };

  const exportFilename = `${config.nomSociete || 'FIRST_IMEX'}_${config.nomStand || 'Stand'}`;

  return (
    <div className="space-y-6">
      {/* Delete Single Visitor In-App Modal */}
      {visitorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-6 text-center animate-in zoom-in-95 duration-150 space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
              <Trash2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Supprimer ce contact ?
              </h3>
              <p className="text-xs text-slate-600 mt-1.5">
                Voulez-vous vraiment supprimer le contact de <strong className="text-slate-900">{visitorToDelete.prenom} {visitorToDelete.nom}</strong> ({visitorToDelete.entreprise}) ?
              </p>
              <div className="mt-2.5 p-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-500">
                {visitorToDelete.email} · {visitorToDelete.fonction}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setVisitorToDelete(null)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDeleteVisitor}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All In-App Modal */}
      {isClearAllModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 text-center animate-in zoom-in-95 duration-150 space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Réinitialiser toute la liste du stand ?
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Cette action va effacer les <strong>{visitors.length} contacts</strong> enregistrés. 
                <br />
                <span className="text-amber-700 font-medium">Assurez-vous d'avoir téléchargé votre export Excel ou CSV avant de continuer.</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsClearAllModalOpen(false)}
                className="w-full sm:w-auto flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-colors cursor-pointer"
              >
                Conserver les contacts
              </button>
              <button
                type="button"
                onClick={confirmClearAll}
                className="w-full sm:w-auto flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Tout effacer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top action bar: Stats & Exports */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#17436b] tracking-wider uppercase">
                {config.nomSociete || 'FIRST IMEX'}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">
                {config.nomStand || 'Stand Principal'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              Visiteurs enregistrés sur le stand
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>{visitors.length} contact{visitors.length > 1 ? 's' : ''} au total</span>
              <span>·</span>
              <span>Stockage local sécurisé</span>
              {config.nomSalon && (
                <>
                  <span>·</span>
                  <span>{config.nomSalon}</span>
                </>
              )}
            </div>
          </div>

          {/* Export Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Excel Export */}
            <button
              onClick={() => exportToExcel(visitors, exportFilename)}
              disabled={visitors.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-medium text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              title="Télécharger directement un classeur Excel propre (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exporter Excel (.xlsx)</span>
            </button>

            {/* CSV Export */}
            <button
              onClick={() => exportToCSV(visitors, exportFilename)}
              disabled={visitors.length === 0}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-700 font-medium text-xs rounded-xl transition-colors cursor-pointer"
              title="Télécharger au format CSV UTF-8 (compatible Excel et tous tableurs)"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Exporter CSV (.csv)</span>
            </button>

            {/* Copy for Sheets / Excel */}
            <button
              onClick={handleCopyClipboard}
              disabled={visitors.length === 0}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-700 font-medium text-xs rounded-xl transition-colors cursor-pointer"
              title="Copier les données pour les coller instantanément dans Google Sheets ou Excel avec Ctrl+V"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copié ! (Ctrl+V)</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copier pour Tableur</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Automatic Export Setting Banner */}
        <div className="mt-4 pt-1 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50/80 rounded-xl p-3 border border-slate-100">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={config.autoExportOnChange}
                onChange={e => onUpdateConfig({ ...config, autoExportOnChange: e.target.checked })}
                className="w-4 h-4 rounded text-[#17436b] border-slate-300 focus:ring-[#17436b]"
              />
              <span className="font-medium text-slate-800">
                Export automatique à chaque nouvelle inscription
              </span>
            </label>
            {config.autoExportOnChange && (
              <select
                value={config.autoExportFormat}
                onChange={e => onUpdateConfig({ ...config, autoExportFormat: e.target.value as 'xlsx' | 'csv' })}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-medium"
              >
                <option value="xlsx">Format .xlsx (Excel)</option>
                <option value="csv">Format .csv (Tableur)</option>
              </select>
            )}
          </div>
          <span className="text-slate-500">
            {config.autoExportOnChange 
              ? `Chaque inscription télécharge automatiquement le fichier ${config.autoExportFormat.toUpperCase()}`
              : 'Export manuel à tout moment en 1 clic'}
          </span>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-100">
          <div>
            <div className="text-xs font-medium text-slate-500">Total visiteurs stand</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{stats.total}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Prospects chauds 🔥</div>
            <div className="text-2xl font-bold text-amber-600 mt-0.5">{stats.chauds}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">À recontacter</div>
            <div className="text-2xl font-bold text-[#17436b] mt-0.5">{stats.recontacts}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Secteur majoritaire</div>
            <div className="text-sm font-semibold text-slate-800 mt-1 truncate" title={stats.topSecteur}>
              {stats.topSecteur}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher par nom, entreprise, email, téléphone, fonction..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#17436b] focus:ring-2 focus:ring-blue-100"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sector filter */}
          <div className="sm:w-64">
            <select
              value={secteurFilter}
              onChange={e => setSecteurFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#17436b] cursor-pointer"
            >
              <option value="ALL">Tous les secteurs ({visitors.length})</option>
              {SECTEURS_ACTIVITE.map(sec => {
                const count = visitors.filter(v => v.secteur === sec).length;
                if (count === 0) return null;
                return (
                  <option key={sec} value={sec}>
                    {sec} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Qualification filter */}
          <div className="sm:w-44">
            <select
              value={interetFilter}
              onChange={e => setInteretFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#17436b] cursor-pointer"
            >
              <option value="ALL">Tous les profils</option>
              <option value="chaud">Chaud 🔥</option>
              <option value="moyen">Tiède ⚡</option>
              <option value="contact">Contact</option>
            </select>
          </div>
        </div>

        {/* Quick check toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-600">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={recontactOnly}
                onChange={e => setRecontactOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-[#17436b] border-slate-300"
              />
              <span>Uniquement ceux à recontacter</span>
            </label>

            <button
              onClick={() => setSortOrder(s => s === 'desc' ? 'asc' : 'desc')}
              className="flex items-center gap-1 text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Tri : {sortOrder === 'desc' ? 'Plus récents en premier' : 'Plus anciens en premier'}</span>
            </button>
          </div>

          <div className="text-slate-500">
            {filteredVisitors.length} résultat{filteredVisitors.length > 1 ? 's' : ''} affiché{filteredVisitors.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {filteredVisitors.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              {visitors.length === 0 ? 'Aucun visiteur enregistré pour le moment' : 'Aucun résultat correspondant aux filtres'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
              {visitors.length === 0 
                ? 'Passez en mode formulaire pour inscrire les premiers visiteurs de votre stand ou chargez des données de test.'
                : 'Essayez de modifier votre recherche ou de réinitialiser les filtres sélectionnés.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={onNewVisitorClick}
                className="px-4 py-2 bg-[#17436b] hover:bg-[#123656] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Inscrire un visiteur
              </button>
              {visitors.length === 0 && (
                <button
                  onClick={onLoadSamples}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Charger 3 exemples de test
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/70 bg-slate-50/70 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Heure / Date</th>
                  <th className="py-3 px-4">Visiteur</th>
                  <th className="py-3 px-4">Entreprise & Fonction</th>
                  <th className="py-3 px-4">Secteur d'activité</th>
                  <th className="py-3 px-4">Intérêt</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredVisitors.map(v => {
                  const dateObj = new Date(v.dateVisite);
                  const timeStr = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                  const dateStr = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });

                  return (
                    <tr 
                      key={v.id} 
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => onSelectVisitor(v)}
                    >
                      {/* Date & Heure */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{timeStr}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{dateStr}</span>
                        </div>
                      </td>

                      {/* Nom, Prénom, Email, Tel */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 text-sm">
                          {v.prenom} {v.nom}
                        </div>
                        <div className="flex flex-col gap-0.5 mt-0.5 text-slate-500 text-[11px]">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="hover:underline">{v.email}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{v.telephone}</span>
                          </span>
                        </div>
                      </td>

                      {/* Entreprise & Fonction */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{v.entreprise}</span>
                        </div>
                        <div className="text-slate-500 text-[11px] flex items-center gap-1.5 mt-0.5">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{v.fonction}</span>
                        </div>
                      </td>

                      {/* Secteur */}
                      <td className="py-3 px-4">
                        <span className="text-slate-800 font-medium">
                          {v.secteur === 'Autre' && v.secteurAutre ? v.secteurAutre : v.secteur}
                        </span>
                        {v.besoins && v.besoins.length > 0 && (
                          <div className="text-[11px] text-slate-500 mt-1 truncate max-w-xs">
                            {v.besoins.join(' · ')}
                          </div>
                        )}
                      </td>

                      {/* Intérêt & Recontact */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {v.interet === 'chaud' && (
                            <span className="font-semibold text-amber-700 flex items-center gap-1">
                              <Flame className="w-3.5 h-3.5 text-amber-500" /> Chaud
                            </span>
                          )}
                          {v.interet === 'moyen' && (
                            <span className="font-medium text-blue-700 flex items-center gap-1">
                              <Zap className="w-3.5 h-3.5 text-blue-500" /> Tiède
                            </span>
                          )}
                          {v.interet === 'contact' && (
                            <span className="text-slate-600">Contact</span>
                          )}
                        </div>
                        <div className="text-[11px] mt-0.5">
                          {v.recontact ? (
                            <span className="text-emerald-700 font-medium">✓ À recontacter</span>
                          ) : (
                            <span className="text-slate-400">Sans suivi</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onSelectVisitor(v)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Voir la fiche détaillée"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setVisitorToDelete(v)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Supprimer cette entrée"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer controls: Clear or reset */}
      {visitors.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-2">
          <span>{visitors.length} contact{visitors.length > 1 ? 's' : ''} au total dans la base stand</span>
          <div className="flex items-center gap-4">
            <button
              onClick={onLoadSamples}
              className="text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
            >
              + Ajouter les exemples types
            </button>
            <span>·</span>
            <button
              onClick={() => setIsClearAllModalOpen(true)}
              className="text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
            >
              Réinitialiser la liste du stand
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
