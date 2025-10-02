import { JewelryItem } from '../types';

export const exportItemsToCsv = (items: JewelryItem[], filename: string): void => {
  if (items.length === 0) {
    alert(`No items to export.`);
    return;
  }

  // Define headers based on JewelryItem and user request
  const headers = [
    'Image', 'Tag No', 'Item Name', 'Date', 'Pc', 'Gr.Wt', 'N.Wt', 'Gold Wt', 'Design',
    'HM', 'Certif', 'Remarks', 'Colour', 'Clarity', 'Size', 'Mrp', 'Costing', 'Supplier',
    'Dia Item', 'Dia Size', 'Dia Pc', 'Dia Wt', 'Rate', 'Dia Value', 'Showroom Area', 'Counter Name'
  ];
  
  const csvRows = [
    headers.join(','),
    ...items.map(item => [
      item.imageUrl,
      `"${item.epc}"`,
      `"${(item.name || '').replace(/"/g, '""')}"`,
      item.date ?? '',
      item.pc ?? '',
      item.grWt ?? '',
      item.netWt ?? '',
      item.goldWt ?? '',
      item.design ?? '',
      item.hm ?? '',
      item.certif ?? '',
      `"${(item.remarks ?? '').replace(/"/g, '""')}"`,
      item.colour ?? '',
      item.clarity ?? '',
      item.size ?? '',
      item.price ?? '',
      item.costing ?? '',
      item.supplier ?? '',
      item.diaItem ?? '',
      item.diaSize ?? '',
      item.diaPc ?? '',
      item.diaWt ?? '',
      item.rate ?? '',
      item.diaValue ?? '',
      item.showroomArea,
      item.counterName
    ].join(','))
  ];
  
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
