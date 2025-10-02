import { JewelryItem } from './types';

export const INITIAL_MASTER_INVENTORY: JewelryItem[] = [
  { epc: '300833B2DDD9014000000000', name: 'Diamond Solitaire Ring', category: 'Rings', price: 2500, imageUrl: 'https://picsum.photos/seed/ring1/200', showroomArea: 'Main Floor', counterName: 'Bridal A' },
  { epc: '300833B2DDD9014000000001', name: 'Sapphire Pendant', category: 'Necklaces', price: 1800, imageUrl: 'https://picsum.photos/seed/necklace1/200', showroomArea: 'Main Floor', counterName: 'Gemstones' },
  { epc: '300833B2DDD9014000000002', name: 'Gold Bangle', category: 'Bracelets', price: 1200, imageUrl: 'https://picsum.photos/seed/bracelet1/200', showroomArea: 'West Wing', counterName: 'Gold Section' },
  { epc: '300833B2DDD9014000000003', name: 'Pearl Earrings', category: 'Earrings', price: 750, imageUrl: 'https://picsum.photos/seed/earrings1/200', showroomArea: 'Main Floor', counterName: 'Classic Pearls' },
  { epc: '300833B2DDD9014000000004', name: 'Emerald Cut Necklace', category: 'Necklaces', price: 3200, imageUrl: 'https://picsum.photos/seed/necklace2/200', showroomArea: 'Main Floor', counterName: 'Gemstones' },
  { epc: '300833B2DDD9014000000005', name: 'Ruby Tennis Bracelet', category: 'Bracelets', price: 4500, imageUrl: 'https://picsum.photos/seed/bracelet2/200', showroomArea: 'VIP Lounge', counterName: 'High Value' },
  { epc: '300833B2DDD9014000000006', name: 'Platinum Wedding Band', category: 'Rings', price: 1500, imageUrl: 'https://picsum.photos/seed/ring2/200', showroomArea: 'Main Floor', counterName: 'Bridal B' },
  { epc: '300833B2DDD9014000000007', name: 'Diamond Studs', category: 'Earrings', price: 1900, imageUrl: 'https://picsum.photos/seed/earrings2/200', showroomArea: 'Main Floor', counterName: 'Bridal A' },
  { epc: '300833B2DDD9014000000008', name: 'Silver Charm Bracelet', category: 'Bracelets', price: 450, imageUrl: 'https://picsum.photos/seed/bracelet3/200', showroomArea: 'West Wing', counterName: 'Fashion' },
  { epc: '300833B2DDD9014000000009', name: 'Opal Ring', category: 'Rings', price: 950, imageUrl: 'https://picsum.photos/seed/ring3/200', showroomArea: 'Main Floor', counterName: 'Gemstones' },
  { epc: '300833B2DDD9014000000010', name: 'Heart Locket', category: 'Necklaces', price: 600, imageUrl: 'https://picsum.photos/seed/necklace3/200', showroomArea: 'West Wing', counterName: 'Fashion' },
  { epc: '300833B2DDD9014000000011', name: 'Hoop Earrings', category: 'Earrings', price: 300, imageUrl: 'https://picsum.photos/seed/earrings3/200', showroomArea: 'West Wing', counterName: 'Fashion' },
  { epc: '300833B2DDD9014000000012', name: 'Vintage Cameo Ring', category: 'Rings', price: 1100, imageUrl: 'https://picsum.photos/seed/ring4/200', showroomArea: 'East Wing', counterName: 'Estate Jewelry' },
  { epc: '300833B2DDD9014000000013', name: 'Turquoise Cuff', category: 'Bracelets', price: 850, imageUrl: 'https://picsum.photos/seed/bracelet4/200', showroomArea: 'West Wing', counterName: 'Fashion' },
  { epc: '300833B2DDD9014000000014', name: 'Garnet Teardrop Necklace', category: 'Necklaces', price: 1350, imageUrl: 'https://picsum.photos/seed/necklace4/200', showroomArea: 'Main Floor', counterName: 'Gemstones' },
];

export const MOCK_NEW_ITEMS: JewelryItem[] = [
    { epc: 'NEW_EPC_001', name: 'Uncatalogued Gold Chain', category: 'Unknown', price: 0, imageUrl: 'https://picsum.photos/seed/new1/200', showroomArea: 'Unknown', counterName: 'Unknown' },
    { epc: 'NEW_EPC_002', name: 'Uncatalogued Silver Ring', category: 'Unknown', price: 0, imageUrl: 'https://picsum.photos/seed/new2/200', showroomArea: 'Unknown', counterName: 'Unknown' },
];

export const MOCK_IMPORT_INVENTORY: JewelryItem[] = [
    ...INITIAL_MASTER_INVENTORY.slice(0, 10), // Keep some of the old items
    { epc: '300833B2DDD9014000000015', name: 'Rose Gold Watch', category: 'Watches', price: 3800, imageUrl: 'https://picsum.photos/seed/watch1/200', showroomArea: 'VIP Lounge', counterName: 'Timepieces' },
    { epc: '300833B2DDD9014000000016', name: 'Amethyst Brooch', category: 'Brooches', price: 980, imageUrl: 'https://picsum.photos/seed/brooch1/200', showroomArea: 'East Wing', counterName: 'Estate Jewelry' },
    { epc: '300833B2DDD9014000000017', name: 'Cufflinks', category: 'Mens', price: 550, imageUrl: 'https://picsum.photos/seed/cufflinks1/200', showroomArea: 'East Wing', counterName: 'Mens Accessories' },
];
