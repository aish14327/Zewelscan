import React, { useRef } from 'react';
import Header from './common/Header';
import { ScanIcon } from './icons/ScanIcon';
import { ListIcon } from './icons/ListIcon';
import { ImportIcon } from './icons/ImportIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { HelpIcon } from './icons/HelpIcon';
import { ScanResult, JewelryItem } from '../types';
import { parseJewelryCsv } from '../utils/csvParser';
import AIAssistant from './AIAssistant';

interface DashboardProps {
  onStartScan: () => void;
  lastScanResult?: ScanResult | null;
  masterInventory: JewelryItem[];
  onImportInventory: (newInventory: JewelryItem[]) => void;
  onViewInventory: () => void;
  onViewHistory: () => void;
}

const StatCard: React.FC<{ title: string; value: string | number; glowColor: string }> = ({ title, value, glowColor }) => (
  <div className={`p-4 rounded-xl shadow-lg flex-1 text-center bg-zinc-900 border border-zinc-800 backdrop-blur-sm`} style={{boxShadow: `inset 0 0 10px ${glowColor}, 0 0 5px ${glowColor}`}}>
    <p className="text-sm text-gray-400 font-medium tracking-wider">{title}</p>
    <p className="text-3xl font-bold text-gray-100 mt-1">{value}</p>
  </div>
);

const ActionButton: React.FC<{ onClick: () => void; icon: React.ReactNode; label: string }> = ({ onClick, icon, label }) => (
    <button 
      onClick={onClick}
      className="bg-zinc-900 p-4 rounded-xl shadow-lg text-gray-300 font-semibold flex flex-col items-center justify-center hover:bg-zinc-800 transition-all duration-200 border border-purple-500/20 hover:border-purple-500/50 hover:shadow-purple-500/10 transform hover:-translate-y-1">
      {icon}
      {label}
    </button>
);

const Dashboard: React.FC<DashboardProps> = ({ onStartScan, lastScanResult, masterInventory, onImportInventory, onViewInventory, onViewHistory }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const totalStock = masterInventory.length;
  const scannedCount = lastScanResult?.scanned.length ?? 0;
  const missingCount = lastScanResult?.missing.length ?? 0;
  const newCount = lastScanResult?.new.length ?? 0;
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const newInventory = parseJewelryCsv(text);
        if (newInventory.length > 0) {
          onImportInventory(newInventory);
        } else {
          alert('No valid items found in the provided CSV file.');
        }
      } catch (error) {
        console.error("Error parsing CSV file:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        alert(`Failed to import inventory. Please check the file format. Error: ${errorMessage}`);
      } finally {
        if (event.target) {
          event.target.value = '';
        }
      }
    };
    reader.onerror = () => {
        alert("An error occurred while reading the file.");
        if (event.target) {
          event.target.value = '';
        }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="ZewelScan" />
      <main className="flex-grow p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <StatCard title="Total Stock" value={totalStock} glowColor="rgba(168, 85, 247, 0.2)" />
            <StatCard title="Scanned" value={scannedCount} glowColor="rgba(74, 222, 128, 0.2)" />
            <StatCard title="Missing" value={missingCount} glowColor="rgba(248, 113, 113, 0.2)" />
            <StatCard title="New Items" value={newCount} glowColor="rgba(250, 204, 21, 0.2)" />
          </div>

          <div className="text-center mb-8">
            <button
              onClick={onStartScan}
              className="w-full max-w-sm bg-purple-600 text-white font-bold py-6 px-4 rounded-2xl shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 ease-in-out flex items-center justify-center mx-auto ring-2 ring-purple-500/50 shadow-purple-500/20 hover:shadow-purple-500/40"
            >
              <ScanIcon className="w-8 h-8 mr-4" />
              <span className="text-2xl tracking-wider">Start Scan</span>
            </button>
          </div>
          
          <AIAssistant masterInventory={masterInventory} lastScanResult={lastScanResult ?? null} />
          
          <div className="grid grid-cols-3 gap-4 text-center mt-8">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept=".csv, text/csv"
            />
            <ActionButton onClick={handleImportClick} icon={<ImportIcon className="w-7 h-7 mb-2 text-purple-400" />} label="Import Data" />
            <ActionButton onClick={onViewInventory} icon={<ListIcon className="w-7 h-7 mb-2 text-purple-400" />} label="View Stock" />
            <ActionButton onClick={onViewHistory} icon={<HistoryIcon className="w-7 h-7 mb-2 text-purple-400" />} label="History" />
          </div>
        </div>
      </main>
      <footer className="p-4 text-center">
        <div className="flex justify-center items-center space-x-6">
           <button onClick={() => alert('Settings feature coming soon!')} className="text-gray-500 hover:text-purple-400 transition-colors flex flex-col items-center">
              <SettingsIcon className="w-6 h-6 mb-1"/>
              <span className="text-xs font-semibold">Settings</span>
           </button>
           <button onClick={() => alert('Help & Support coming soon!')} className="text-gray-500 hover:text-purple-400 transition-colors flex flex-col items-center">
              <HelpIcon className="w-6 h-6 mb-1"/>
              <span className="text-xs font-semibold">Help</span>
           </button>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;