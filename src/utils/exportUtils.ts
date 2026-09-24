import * as XLSX from 'xlsx';
import { Visitor } from '../types/visitor';

/**
 * Format a visitor row for spreadsheet exports
 */
export function formatVisitorForExport(v: Visitor) {
  const dateObj = new Date(v.dateVisite);
  const formattedDate = dateObj.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const formattedTime = dateObj.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const secteurFinal = v.secteur === 'Autre' && v.secteurAutre ? `Autre (${v.secteurAutre})` : v.secteur;

  const prioriteLabel = {
    chaud: 'Prioritaire / Chaud 🔥',
    moyen: 'Intérêt Moyen ⚡',
    contact: 'Prise de contact'
  }[v.interet] || v.interet;

  return {
    'Date de visite': formattedDate,
    'Heure': formattedTime,
    'Nom': v.nom,
    'Prénom': v.prenom,
    'Email': v.email,
    'Téléphone': v.telephone,
    'Fonction / Poste': v.fonction,
    'Entreprise': v.entreprise,
    'Secteur d\'activité': secteurFinal,
    'Intérêt / Priorité': prioriteLabel,
    'Souhaite être recontacté': v.recontact ? 'OUI' : 'NON',
    'Besoins / Objet': (v.besoins || []).join(', '),
    'Notes stand': v.notes || ''
  };
}

/**
 * Generates and triggers download of Excel (.xlsx) file
 */
export function exportToExcel(visitors: Visitor[], standName: string = 'Stand') {
  if (visitors.length === 0) return false;

  const data = visitors.map(formatVisitorForExport);
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Auto-fit column widths
  const colWidths = [
    { wch: 14 }, // Date
    { wch: 10 }, // Heure
    { wch: 18 }, // Nom
    { wch: 18 }, // Prénom
    { wch: 28 }, // Email
    { wch: 18 }, // Téléphone
    { wch: 24 }, // Fonction
    { wch: 24 }, // Entreprise
    { wch: 28 }, // Secteur
    { wch: 22 }, // Priorité
    { wch: 16 }, // Recontact
    { wch: 30 }, // Besoins
    { wch: 35 }  // Notes
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Visiteurs Stand');

  const cleanStandName = standName.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 20) || 'Visiteurs_Stand';
  const now = new Date();
  const dateSuffix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}h${String(now.getMinutes()).padStart(2, '0')}`;
  const filename = `${cleanStandName}_${dateSuffix}.xlsx`;

  XLSX.writeFile(workbook, filename);
  return true;
}

/**
 * Generates and triggers download of CSV file with UTF-8 BOM and ';' delimiter
 */
export function exportToCSV(visitors: Visitor[], standName: string = 'Stand') {
  if (visitors.length === 0) return false;

  const data = visitors.map(formatVisitorForExport);
  const headers = Object.keys(data[0]);

  const escapeCSV = (val: string) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvRows = [
    headers.map(escapeCSV).join(';'),
    ...data.map(row => headers.map(header => escapeCSV((row as Record<string, string>)[header] || '')).join(';'))
  ];

  // UTF-8 BOM ensures Excel opens accents correctly
  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const cleanStandName = standName.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 20) || 'Visiteurs_Stand';
  const now = new Date();
  const dateSuffix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}h${String(now.getMinutes()).padStart(2, '0')}`;
  const filename = `${cleanStandName}_${dateSuffix}.csv`;

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

/**
 * Copies the visitors data to clipboard in TSV format
 * Allows instant pasting into Google Sheets or Excel with Ctrl+V
 */
export async function copyVisitorsToClipboard(visitors: Visitor[]): Promise<boolean> {
  if (visitors.length === 0) return false;

  const data = visitors.map(formatVisitorForExport);
  const headers = Object.keys(data[0]);

  const tsvRows = [
    headers.join('\t'),
    ...data.map(row => headers.map(header => ((row as Record<string, string>)[header] || '').replace(/\t|\n/g, ' ')).join('\t'))
  ];

  const tsvText = tsvRows.join('\n');
  try {
    await navigator.clipboard.writeText(tsvText);
    return true;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}
