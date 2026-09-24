/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  FileSpreadsheet, 
  Download, 
  Settings2, 
  Maximize2, 
  Minimize2, 
  Wifi, 
  WifiOff, 
  ShieldCheck,
  CheckCircle,
  Building2
} from 'lucide-react';
import { Visitor, StandConfig } from './types/visitor';
import { INITIAL_VISITORS } from './data/sampleData';
import { VisitorForm } from './components/VisitorForm';
import { SuccessScreen } from './components/SuccessScreen';
import { VisitorTable } from './components/VisitorTable';
import { VisitorDetailModal } from './components/VisitorDetailModal';
import { StandSettingsModal } from './components/StandSettingsModal';
import { FirstImexLogo } from './components/FirstImexLogo';
import { exportToExcel, exportToCSV } from './utils/exportUtils';

const STORAGE_KEY_VISITORS = 'stand_pass_visitors_v2';
const STORAGE_KEY_CONFIG = 'stand_pass_config_v2';

const DEFAULT_CONFIG: StandConfig = {
  nomSociete: 'FIRST IMEX',
  sousTitreSociete: 'Composants & Systèmes Hydrauliques',
  nomStand: 'Stand FIRST IMEX',
  nomSalon: 'Salon Professionnel & Industriel',
  autoExportOnChange: false,
  autoExportFormat: 'xlsx',
  remerciementMessage: 'Vos coordonnées ont bien été enregistrées sur le stand FIRST IMEX. Notre équipe technique et commerciale reprendra contact avec vous.'
};

export default function App() {
  // Visitors state with localStorage
  const [visitors, setVisitors] = useState<Visitor[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VISITORS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading visitors from storage:', e);
    }
    return INITIAL_VISITORS;
  });

  // Stand configuration state
  const [config, setConfig] = useState<StandConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error loading config from storage:', e);
    }
    return DEFAULT_CONFIG;
  });

  // UI state
  const [currentView, setCurrentView] = useState<'form' | 'success' | 'table'>('form');
  const [lastRegisteredVisitor, setLastRegisteredVisitor] = useState<Visitor | null>(null);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isKioskMode, setIsKioskMode] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VISITORS, JSON.stringify(visitors));
    } catch (e) {
      console.error('Failed to persist visitors:', e);
    }
  }, [visitors]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to persist config:', e);
    }
  }, [config]);

  // Online / Offline monitor
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Registration handler
  const handleRegisterVisitor = (data: Omit<Visitor, 'id' | 'dateVisite'>) => {
    const newVisitor: Visitor = {
      ...data,
      id: 'vis-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      dateVisite: new Date().toISOString()
    };

    const updatedVisitors = [newVisitor, ...visitors];
    setVisitors(updatedVisitors);
    setLastRegisteredVisitor(newVisitor);
    setCurrentView('success');

    // Automatic export if configured
    const exportPrefix = `${config.nomSociete || 'FIRST_IMEX'}_${config.nomStand || 'Stand'}`;
    if (config.autoExportOnChange) {
      if (config.autoExportFormat === 'xlsx') {
        exportToExcel(updatedVisitors, exportPrefix);
      } else {
        exportToCSV(updatedVisitors, exportPrefix);
      }
      showToast(`Export automatique ${config.autoExportFormat.toUpperCase()} téléchargé !`);
    } else {
      showToast(`${newVisitor.prenom} ${newVisitor.nom} inscrit avec succès !`);
    }
  };

  // Update existing visitor
  const handleUpdateVisitor = (updated: Visitor) => {
    setVisitors(prev => prev.map(v => v.id === updated.id ? updated : v));
    setSelectedVisitor(updated);
    showToast('Fiche visiteur mise à jour');
  };

  // Delete visitor
  const handleDeleteVisitor = (id: string) => {
    setVisitors(prev => prev.filter(v => v.id !== id));
    showToast('Visiteur supprimé de la liste');
  };

  // Clear all
  const handleClearAll = () => {
    setVisitors([]);
    showToast('Liste des visiteurs réinitialisée');
  };

  // Restore samples
  const handleLoadSamples = () => {
    setVisitors(INITIAL_VISITORS);
    showToast('3 exemples types chargés');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-[#17436b] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#17436b] text-white px-4 py-3 rounded-xl shadow-lg border border-blue-400/30 flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Bar */}
      {!isKioskMode && (
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
            {/* Logo & Company Identity */}
            <div className="flex items-center gap-3 min-w-0">
              <FirstImexLogo variant="navbar" customLogoUrl={config.logoUrl} />

              <div className="h-6 w-px bg-slate-200 hidden md:block" />

              <div className="min-w-0 hidden md:block">
                <div className="text-xs text-slate-600 font-medium truncate">
                  {config.nomStand}
                </div>
                <div className="text-[10.5px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Enregistrement local actif</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (Functional Segmented Control) */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setCurrentView('form')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  currentView === 'form' || currentView === 'success'
                    ? 'bg-white text-[#17436b] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Formulaire Stand</span>
              </button>

              <button
                onClick={() => setCurrentView('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  currentView === 'table'
                    ? 'bg-white text-[#17436b] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Inscrits</span>
                <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-slate-200/80 text-slate-700">
                  {visitors.length}
                </span>
              </button>
            </div>

            {/* Utility buttons */}
            <div className="flex items-center gap-1.5">
              {/* Quick Excel download shortcut */}
              <button
                onClick={() => {
                  exportToExcel(visitors, `${config.nomSociete || 'FIRST_IMEX'}_${config.nomStand || 'Stand'}`);
                  showToast('Export Excel (.xlsx) téléchargé !');
                }}
                disabled={visitors.length === 0}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-semibold text-xs rounded-xl transition-colors disabled:opacity-40 cursor-pointer"
                title="Exporter tous les visiteurs en fichier Excel .xlsx"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Excel</span>
              </button>

              {/* Enter Fullscreen Kiosk Mode */}
              <button
                onClick={() => setIsKioskMode(true)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title="Activer le mode Kiosque Visiteur tablette / plein écran"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Settings modal */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title="Configurer le nom de la société, le logo et les exports"
              >
                <Settings2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Kiosk Mode Top Exit Banner */}
      {isKioskMode && (
        <div 
          className="text-white px-4 py-2.5 flex items-center justify-between text-xs sticky top-0 z-40 shadow-sm"
          style={{ backgroundColor: '#13395c' }}
        >
          <div className="flex items-center gap-2.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              {config.nomSociete || 'FIRST IMEX'}
            </span>
            <span className="text-blue-200">·</span>
            <span className="text-blue-100">{config.nomStand || 'Mode Kiosque Stand'}</span>
          </div>
          <button
            onClick={() => setIsKioskMode(false)}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs transition-colors cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Quitter le mode Kiosque</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentView === 'form' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <VisitorForm
              onSubmit={handleRegisterVisitor}
              config={config}
              isKioskMode={isKioskMode}
            />
          </div>
        )}

        {currentView === 'success' && lastRegisteredVisitor && (
          <SuccessScreen
            visitor={lastRegisteredVisitor}
            allVisitors={visitors}
            config={config}
            onNextVisitor={() => setCurrentView('form')}
            onViewList={() => setCurrentView('table')}
          />
        )}

        {currentView === 'table' && (
          <VisitorTable
            visitors={visitors}
            config={config}
            onUpdateConfig={setConfig}
            onSelectVisitor={setSelectedVisitor}
            onDeleteVisitor={handleDeleteVisitor}
            onClearAll={handleClearAll}
            onLoadSamples={handleLoadSamples}
            onNewVisitorClick={() => setCurrentView('form')}
          />
        )}
      </main>

      {/* Footer */}
      {!isKioskMode && (
        <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">{config.nomSociete || 'FIRST IMEX'}</span>
              <span>·</span>
              <span>{config.sousTitreSociete || 'Composants & Systèmes Hydrauliques'}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-slate-600">
                {isOnline ? (
                  <>
                    <Wifi className="w-3 h-3 text-emerald-600" />
                    <span>En ligne</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-amber-600" />
                    <span>Hors-ligne (Sauvegarde locale)</span>
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => exportToExcel(visitors, `${config.nomSociete || 'FIRST_IMEX'}_${config.nomStand || 'Stand'}`)}
                className="hover:text-slate-800 hover:underline"
              >
                Télécharger Excel
              </button>
              <span>·</span>
              <button
                onClick={() => exportToCSV(visitors, `${config.nomSociete || 'FIRST_IMEX'}_${config.nomStand || 'Stand'}`)}
                className="hover:text-slate-800 hover:underline"
              >
                Télécharger CSV
              </button>
              <span>·</span>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="hover:text-slate-800 hover:underline"
              >
                Paramètres Stand
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* Detail / Edit Modal */}
      <VisitorDetailModal
        visitor={selectedVisitor}
        onClose={() => setSelectedVisitor(null)}
        onSave={handleUpdateVisitor}
        onDelete={handleDeleteVisitor}
      />

      {/* Settings Modal */}
      <StandSettingsModal
        config={config}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={setConfig}
      />
    </div>
  );
}
