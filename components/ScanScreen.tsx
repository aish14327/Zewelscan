import React, { useState, useEffect, useCallback, useRef } from 'react';
import { JewelryItem } from '../types';
import rfidService from '../services/rfidService';
import Header from './common/Header';
import { ScanIcon } from './icons/ScanIcon';

interface ScanScreenProps {
  onScanComplete: (scannedItems: JewelryItem[]) => void;
  onBack: () => void;
  masterInventory: JewelryItem[];
}

const ScanScreen: React.FC<ScanScreenProps> = ({ onScanComplete, onBack, masterInventory }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItems, setScannedItems] = useState<Map<string, JewelryItem>>(new Map());
  const listRef = useRef<HTMLDivElement>(null);

  const handleScan = useCallback((item: JewelryItem) => {
    setScannedItems(prev => {
      if (!prev.has(item.epc)) {
        const newMap = new Map(prev);
        newMap.set(item.epc, item);
        return newMap;
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    // Scroll to bottom when new items are added
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [scannedItems]);

  const startScan = () => {
    setScannedItems(new Map());
    rfidService.updateMasterInventory(masterInventory); // Ensure service has latest inventory
    rfidService.startScan(handleScan);
    setIsScanning(true);
  };

  const stopScan = () => {
    rfidService.stopScan();
    setIsScanning(false);
  };

  const handleFinishScan = () => {
    stopScan();
    onScanComplete(Array.from(scannedItems.values()));
  };

  // Ensure scan is stopped on component unmount
  useEffect(() => {
    return () => {
      rfidService.stopScan();
    };
  }, []);

  const itemsArray = Array.from(scannedItems.values());

  return (
    <div className="flex flex-col h-screen">
      <Header title="Inventory Scan" onBack={onBack} />

      <div className="p-4 flex-shrink-0 bg-zinc-900 shadow-sm flex justify-between items-center border-b border-purple-500/20">
        <div className="text-lg font-semibold tracking-wider">
          Total Scanned: <span className="text-purple-400 font-bold">{scannedItems.size}</span>
        </div>
        {isScanning && (
          <div className="flex items-center text-green-400 font-semibold">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Scanning...
          </div>
        )}
      </div>

      <main ref={listRef} className="flex-grow overflow-y-auto p-4">
        {itemsArray.length === 0 ? (
          <div className="text-center text-gray-400 pt-20 flex flex-col items-center justify-center h-full">
            <ScanIcon className="w-16 h-16 mx-auto text-zinc-700" />
            <p className="mt-4 text-lg">Press "Start" to begin scanning.</p>
            <p className="text-sm text-gray-500 mt-1">Waiting for RFID hardware...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {itemsArray.map((item) => (
              <div key={item.epc} className="bg-zinc-900 p-3 rounded-lg shadow-md flex items-center border border-purple-500/10">
                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-md object-cover mr-4" />
                <div className="flex-grow">
                  <p className="font-semibold text-slate-200">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.epc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="p-4 bg-zinc-900/80 backdrop-blur-sm border-t border-purple-500/20">
        <div className="grid grid-cols-2 gap-4">
          {!isScanning ? (
            <button
              onClick={startScan}
              className="w-full bg-purple-600 text-white font-bold py-4 px-4 rounded-lg shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition duration-150 shadow-purple-500/20 hover:shadow-purple-500/40"
            >
              Start
            </button>
          ) : (
            <button
              onClick={stopScan}
              className="w-full bg-red-600 text-white font-bold py-4 px-4 rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/50 transition duration-150"
            >
              Stop
            </button>
          )}

          <button
            onClick={handleFinishScan}
            disabled={isScanning}
            className="w-full bg-zinc-600 text-white font-bold py-4 px-4 rounded-lg shadow-lg hover:bg-zinc-700 focus:outline-none focus:ring-4 focus:ring-zinc-500/50 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Finish
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ScanScreen;