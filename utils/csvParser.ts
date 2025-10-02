import { JewelryItem } from '../types';

// A simple CSV row parser that handles quoted fields.
const parseCsvRow = (row: string): string[] => {
    const values = [];
    let currentVal = '';
    let inQuotes = false;
    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        
        if (char === '"') {
            // If we are in quotes and the next char is also a quote, it's an escaped quote
            if (inQuotes && row[i + 1] === '"') {
                currentVal += '"';
                i++; // Skip the next quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            values.push(currentVal);
            currentVal = '';
        } else {
            currentVal += char;
        }
    }
    values.push(currentVal);
    return values;
};

// Maps CSV header names to JewelryItem properties.
// Keys are lowercased and trimmed for flexible matching.
const headerMapping: { [key: string]: keyof JewelryItem } = {
    'tag no': 'epc',
    'item name': 'name',
    'image': 'imageUrl',
    'showroom area': 'showroomArea',
    'counter name': 'counterName',
    'mrp': 'price',
    'costing': 'costing',
    'category': 'category',
    'design': 'design',
    'remarks': 'remarks',
    'pc': 'pc',
    'gr.wt': 'grWt',
    'n.wt': 'netWt',
    'gold wt': 'goldWt',
    'dia wt': 'diaWt',
    'dia pc': 'diaPc',
    'dia size': 'diaSize',
    'dia item': 'diaItem',
    'dia value': 'diaValue',
    'rate': 'rate',
    'colour': 'colour',
    'clarity': 'clarity',
    'size': 'size',
    'date': 'date',
    'hm': 'hm',
    'certif': 'certif',
    'supplier': 'supplier',
};

const numericFields: (keyof JewelryItem)[] = ['price', 'costing', 'pc', 'grWt', 'netWt', 'goldWt', 'diaWt', 'diaPc', 'diaValue', 'rate'];

export const parseJewelryCsv = (csvText: string): JewelryItem[] => {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 2) {
        throw new Error("CSV file must have a header row and at least one data row.");
    }

    const headerRow = lines.shift()!;
    const headers = parseCsvRow(headerRow).map(h => h.trim().toLowerCase());
    
    const requiredHeaders = ['tag no', 'item name', 'mrp'];
    for(const required of requiredHeaders){
        if(!headers.includes(required)){
            throw new Error(`CSV is missing required header: "${required}"`);
        }
    }

    const items: JewelryItem[] = [];

    for (const line of lines) {
        if (!line.trim()) continue; // Skip empty lines

        const values = parseCsvRow(line);
        const item: Partial<JewelryItem> = {};

        headers.forEach((header, index) => {
            const propName = headerMapping[header];
            if (propName) {
                let value: string | number = values[index];
                
                if (numericFields.includes(propName)) {
                    value = parseFloat(value) || 0; // Default to 0 if parsing fails
                }

                (item as any)[propName] = value;
            }
        });

        // Add default values for required fields if they are missing after parsing
        const completeItem: JewelryItem = {
            epc: String(item.epc || ''),
            name: String(item.name || 'Unnamed Item'),
            price: Number(item.price || 0),
            imageUrl: String(item.imageUrl || `https://picsum.photos/seed/${item.epc || 'default'}/200`),
            category: String(item.category || 'Unknown'),
            showroomArea: String(item.showroomArea || 'Unknown'),
            counterName: String(item.counterName || 'Unknown'),
            ...item,
        };
        
        if(completeItem.epc){ // Only add items with an EPC
          items.push(completeItem);
        }
    }

    return items;
};