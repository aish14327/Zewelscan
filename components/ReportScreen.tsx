import React, { useState, useEffect } from 'react';
import { JewelryItem, ScanResult, ReportCategory } from '../types';
import Header from './common/Header';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';
import { PlusIcon } from './icons/PlusIcon';
import { LocationIcon } from './icons/LocationIcon';
import ItemDetailModal from './ItemDetailModal';
import { exportItemsToCsv } from '../utils/exportUtils';

interface ReportScreenProps {
  scanResult: ScanResult;
  onBack: () => void;
}

const ReportScreen: React.FC<ReportScreenProps> = ({ scanResult, onBack }) => {
  const [activeCategory, setActiveCategory] = useState<ReportCategory>('scanned');
  const [selectedItem, setSelectedItem] = useState<JewelryItem | null>(null);

  const { scanned, missing, new: newItems } = scanResult;

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedItem]);

  const categoryDetails = {
    scanned: { title: 'Found', data: scanned, icon: <CheckIcon className="w-5 h-5" />, color: 'green', glow: 'shadow-green-500/50' },
    missing: { title: 'Missing', data: missing, icon: <XIcon className="w-5 h-5" />, color: 'red', glow: 'shadow-red-500/50' },
    new: { title: 'New', data: newItems, icon: <PlusIcon className="w-5 h-5" />, color: 'yellow', glow: 'shadow-yellow-500/50' },
  };

  const activeData = categoryDetails[activeCategory].data;
  
  const handleExport = () => {
    if (activeCategory !== 'missing' && activeCategory !== 'new') return;
    const itemsToExport = categoryDetails[activeCategory].data;
    const filename = `${activeCategory}_items_report.csv`;
    exportItemsToCsv(itemsToExport, filename);
  };

  const renderCategoryButton = (category: ReportCategory) => {
    const details = categoryDetails[category];
    const isActive = activeCategory === category;
    const baseClasses = "flex-1 p-3 rounded-lg flex items-center justify-center transition-all duration-300 transform";
    const activeClasses = {
        scanned: 'bg-green-500/20 text-green-300 shadow-lg scale-105',
        missing: 'bg-red-500/20 text-red-300 shadow-lg scale-105',
        new: 'bg-yellow-500/20 text-yellow-300 shadow-lg scale-105'
    };
    const inactiveClasses = "bg-zinc-700 text-gray-400 hover:bg-zinc-600 hover:text-white";

    return (
        <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`${baseClasses} ${isActive ? activeClasses[category] + ` ${details.glow}` : inactiveClasses}`}
        >
            <div className="mr-2">{details.icon}</div>
            <span className="font-semibold">{details.title}</span>
            <span className={`ml-2 text-sm font-bold px-2 py-0.5 rounded-full ${isActive ? `bg-${details.color}-500/30 text-${details.color}-200` : 'bg-zinc-600 text-gray-200'}`}>
                {details.data.length}
            </span>
        </button>
    );
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        <Header title="Scan Report" onBack={onBack} />

        <div className="p-4 bg-zinc-900/80 backdrop-blur-sm border-b border-purple-500/20 sticky top-16 z-10">
          <div className="max-w-4xl mx-auto flex space-x-2">
              {(Object.keys(categoryDetails) as ReportCategory[]).map(cat => renderCategoryButton(cat))}
          </div>
        </div>

        <main className="flex-grow overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto">
              {(activeCategory === 'missing' || activeCategory === 'new') && activeData.length > 0 && (
                  <div className="mb-4 text-right">
                      <button
                          onClick={handleExport}
                          className="bg-zinc-700 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150"
                      >
                          Export {categoryDetails[activeCategory].title}
                      </button>
                  </div>
              )}
              
              {activeData.length === 0 ? (
              <div className="text-center text-gray-500 pt-10">
                  <p>No items in this category.</p>
              </div>
              ) : (
              <div className="space-y-3">
                  {activeData.map((item) => (
                  <button 
                      key={item.epc} 
                      className="w-full text-left bg-zinc-900 p-3 rounded-lg shadow-md flex items-start hover:shadow-lg hover:bg-zinc-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-purple-500/10"
                      onClick={() => setSelectedItem(item)}
                      aria-label={`View details for ${item.name}`}
                  >
                      <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover mr-4" />
                      <div className="flex-grow">
                      <p className="font-bold text-slate-200">{item.name}</p>
                      <p className="text-xs text-gray-500 font-mono mb-1">{item.epc}</p>
                      <div className="flex items-center text-sm text-gray-400">
                          <LocationIcon className="w-4 h-4 mr-1.5 text-gray-500" />
                          <span>{item.showroomArea} - {item.counterName}</span>
                      </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                      <p className="font-semibold text-lg text-slate-200">${item.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                  </button>
                  ))}
              </div>
              )}
          </div>
        </main>
        
        <footer className="p-4 bg-zinc-900/80 backdrop-blur-sm border-t border-purple-500/20 sticky bottom-0">
          <div className="max-w-4xl mx-auto">
              <button
              onClick={onBack}
              className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition duration-150 shadow-purple-500/20 hover:shadow-purple-500/40"
              >
              Done
              </button>
          </div>
        </footer>
      </div>
      {selectedItem && <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </>
  );
};

export default ReportScreen;