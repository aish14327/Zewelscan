import React from 'react';
import { ScanHistoryEntry, ScanResult } from '../types';
import Header from './common/Header';
import { HistoryIcon } from './icons/HistoryIcon';
import { ExportIcon } from './icons/ExportIcon';
import { exportItemsToCsv } from '../utils/exportUtils';

interface ScanHistoryScreenProps {
  history: ScanHistoryEntry[];
  onBack: () => void;
  onViewDetail: (result: ScanResult) => void;
}

const ScanHistoryScreen: React.FC<ScanHistoryScreenProps> = ({ history, onBack, onViewDetail }) => {
  const Stat: React.FC<{ label: string; value: number; colorClass: string }> = ({ label, value, colorClass }) => (
    <div className="text-center">
      <p className={`text-xl font-bold ${colorClass}`}>{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );

  const handleExportMissing = (e: React.MouseEvent, entry: ScanHistoryEntry) => {
    e.stopPropagation(); // Prevent navigation to detail view
    const date = entry.date.toISOString().split('T')[0];
    const filename = `missing_items_${date}_${entry.id}.csv`;
    exportItemsToCsv(entry.result.missing, filename);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header title="Scan History" onBack={onBack} />
      <main className="flex-grow overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          {history.length === 0 ? (
            <div className="text-center text-gray-400 pt-20">
              <HistoryIcon className="w-16 h-16 mx-auto text-zinc-700" />
              <p className="mt-4 text-lg">No past scans found.</p>
              <p className="text-sm">Complete a scan to see its results here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-zinc-900 rounded-xl shadow-md overflow-hidden border border-purple-500/20"
                >
                  <button
                    onClick={() => onViewDetail(entry.result)}
                    className="w-full text-left p-4 hover:bg-zinc-800/50 transition-colors duration-200 focus:outline-none"
                    aria-label={`View details for scan on ${entry.date.toLocaleDateString()}`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <p className="font-semibold text-slate-200">
                        {entry.date.toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-gray-500">{entry.date.toLocaleTimeString()}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-3 border-t border-zinc-700">
                      <Stat label="Found" value={entry.result.scanned.length} colorClass="text-green-400" />
                      <Stat label="Missing" value={entry.result.missing.length} colorClass="text-red-400" />
                      <Stat label="New" value={entry.result.new.length} colorClass="text-yellow-400" />
                    </div>
                  </button>
                  <div className="bg-zinc-900/50 px-4 py-2 border-t border-zinc-700/50 flex justify-end">
                      <button
                          onClick={(e) => handleExportMissing(e, entry)}
                          disabled={entry.result.missing.length === 0}
                          className="flex items-center text-sm font-semibold text-purple-400 hover:text-purple-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                          aria-label={`Export ${entry.result.missing.length} missing items`}
                      >
                          <ExportIcon className="w-4 h-4 mr-2" />
                          Export Missing ({entry.result.missing.length})
                      </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ScanHistoryScreen;