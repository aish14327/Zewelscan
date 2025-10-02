import React from 'react';
import { JewelryItem } from '../types';
import { CloseIcon } from './icons/CloseIcon';

interface ItemDetailModalProps {
  item: JewelryItem;
  onClose: () => void;
}

const DetailRow: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => {
    if (value === null || value === undefined || value === '') return null;
    return (
        <div className="flex justify-between py-2 border-b border-zinc-700">
            <dt className="text-sm font-medium text-gray-400">{label}</dt>
            <dd className="text-sm text-slate-200 text-right">{String(value)}</dd>
        </div>
    );
};


const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md m-auto flex flex-col max-h-[90vh] transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale border border-purple-500/20"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'fade-in-scale 0.3s forwards' }}
      >
        <header className="p-4 border-b border-zinc-700 flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg font-bold text-slate-100">Item Details</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-300"
            aria-label="Close"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        
        <main className="p-6 overflow-y-auto">
          <div className="text-center mb-4">
              <img src={item.imageUrl} alt={item.name} className="w-40 h-40 rounded-lg object-cover mx-auto shadow-lg mb-4" />
              <h3 className="text-xl font-bold text-slate-100">{item.name}</h3>
              <p className="text-sm text-gray-400 font-mono">{item.epc}</p>
          </div>
          
          <dl className="space-y-1">
            <div className="bg-purple-900/40 p-3 rounded-lg text-center my-4 border border-purple-500/30">
                <dt className="text-sm font-medium text-purple-300">Price</dt>
                <dd className="text-3xl font-extrabold text-purple-200">${item.price.toLocaleString()}</dd>
            </div>
            <DetailRow label="Category" value={item.category} />
            <DetailRow label="Showroom Area" value={item.showroomArea} />
            <DetailRow label="Counter Name" value={item.counterName} />
            <DetailRow label="Design" value={item.design} />
            <DetailRow label="Remarks" value={item.remarks} />
            <DetailRow label="Supplier" value={item.supplier} />
            <DetailRow label="Gross Wt." value={item.grWt} />
            <DetailRow label="Net Wt." value={item.netWt} />
            <DetailRow label="Gold Wt." value={item.goldWt} />
            <DetailRow label="Diamond Wt." value={item.diaWt} />
            <DetailRow label="Color" value={item.colour} />
            <DetailRow label="Clarity" value={item.clarity} />
            <DetailRow label="Size" value={item.size} />
          </dl>
        </main>
      </div>
       <style>{`
        @keyframes fade-in-scale {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default ItemDetailModal;