import React, { useState, useMemo, useEffect } from 'react';
import { JewelryItem } from '../types';
import Header from './common/Header';
import { LocationIcon } from './icons/LocationIcon';
import ItemDetailModal from './ItemDetailModal';

interface InventoryListViewProps {
  inventory: JewelryItem[];
  onBack: () => void;
}

const InventoryListView: React.FC<InventoryListViewProps> = ({ inventory, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<JewelryItem | null>(null);

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

  const filteredInventory = useMemo(() => {
    if (!searchTerm) {
      return inventory;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return inventory.filter(item =>
      item.name.toLowerCase().includes(lowercasedFilter) ||
      item.epc.toLowerCase().includes(lowercasedFilter) ||
      item.showroomArea.toLowerCase().includes(lowercasedFilter) ||
      item.counterName.toLowerCase().includes(lowercasedFilter) ||
      item.category.toLowerCase().includes(lowercasedFilter)
    );
  }, [inventory, searchTerm]);

  return (
    <>
      <div className="flex flex-col h-screen">
        <Header title={`Master Inventory (${inventory.length})`} onBack={onBack} />
        
        <div className="p-4 bg-zinc-900/80 backdrop-blur-sm border-b border-purple-500/20 sticky top-16 z-10">
          <div className="max-w-4xl mx-auto">
            <input
              type="text"
              placeholder="Search by name, tag, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-zinc-800 text-slate-100"
            />
          </div>
        </div>

        <main className="flex-grow overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto">
            {filteredInventory.length === 0 ? (
              <div className="text-center text-gray-400 pt-10">
                <p>{searchTerm ? 'No items match your search.' : 'The inventory is empty.'}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredInventory.map((item) => (
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
      </div>
      {selectedItem && <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </>
  );
};

export default InventoryListView;