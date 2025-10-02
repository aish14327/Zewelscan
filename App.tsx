import React, { useState, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import ScanScreen from './components/ScanScreen';
import ReportScreen from './components/ReportScreen';
import InventoryListView from './components/InventoryListView';
import ScanHistoryScreen from './components/ScanHistoryScreen';
import { JewelryItem, ScanResult, View, ScanHistoryEntry } from './types';
import { INITIAL_MASTER_INVENTORY } from './constants';
import rfidService from './services/rfidService';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Dashboard);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [masterInventory, setMasterInventory] = useState<JewelryItem[]>(INITIAL_MASTER_INVENTORY);
  const [scanHistory, setScanHistory] = useState<ScanHistoryEntry[]>([]);
  const [reportBackTarget, setReportBackTarget] = useState<View>(View.Dashboard);

  const handleScanComplete = useCallback((scannedItems: JewelryItem[]) => {
    const masterEpcSet = new Set(masterInventory.map(item => item.epc));
    const scannedEpcSet = new Set(scannedItems.map(item => item.epc));

    const foundItems = masterInventory.filter(item => scannedEpcSet.has(item.epc));
    const missingItems = masterInventory.filter(item => !scannedEpcSet.has(item.epc));
    const newItems = scannedItems.filter(item => !masterEpcSet.has(item.epc));

    const result: ScanResult = {
      scanned: foundItems,
      missing: missingItems,
      new: newItems,
    };
    
    // Create and save history entry
    const newHistoryEntry: ScanHistoryEntry = {
      id: Date.now(),
      date: new Date(),
      result: result,
    };
    setScanHistory(prev => [newHistoryEntry, ...prev]);

    setScanResult(result);
    setReportBackTarget(View.Dashboard);
    setView(View.Report);
  }, [masterInventory]);
  
  const handleImportInventory = useCallback((newInventory: JewelryItem[]) => {
      setMasterInventory(newInventory);
      rfidService.updateMasterInventory(newInventory); // Ensure scanner uses the new list
      setScanResult(null); 
      setScanHistory([]); // Clear history as inventory has changed
      alert(`Inventory updated successfully! Total stock is now ${newInventory.length}. Scan history has been cleared.`);
  }, []);

  const navigateToDashboard = () => setView(View.Dashboard);
  const navigateToInventoryList = () => setView(View.InventoryList);
  const navigateToHistory = () => setView(View.History);
  
  const handleViewHistoryDetail = (result: ScanResult) => {
    setScanResult(result);
    setReportBackTarget(View.History);
    setView(View.Report);
  };

  const renderContent = () => {
    switch (view) {
      case View.Scanning:
        return <ScanScreen onScanComplete={handleScanComplete} onBack={navigateToDashboard} masterInventory={masterInventory} />;
      case View.Report:
        return scanResult ? <ReportScreen scanResult={scanResult} onBack={() => setView(reportBackTarget)} /> : <Dashboard onStartScan={() => setView(View.Scanning)} masterInventory={masterInventory} onImportInventory={handleImportInventory} onViewInventory={navigateToInventoryList} onViewHistory={navigateToHistory} />;
      case View.InventoryList:
        return <InventoryListView inventory={masterInventory} onBack={navigateToDashboard} />;
      case View.History:
        return <ScanHistoryScreen history={scanHistory} onBack={navigateToDashboard} onViewDetail={handleViewHistoryDetail} />;
      case View.Dashboard:
      default:
        return <Dashboard onStartScan={() => setView(View.Scanning)} lastScanResult={scanResult} masterInventory={masterInventory} onImportInventory={handleImportInventory} onViewInventory={navigateToInventoryList} onViewHistory={navigateToHistory} />;
    }
  };

  return (
    <div className="h-screen w-screen font-sans flex flex-col antialiased">
      <div className="flex-grow overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;