
import { JewelryItem } from '../types';

// Extend the Window interface to declare our custom function
declare global {
  interface Window {
    onRfidScan: (epc: string) => void;
  }
}

class RFIDService {
  private masterInventory: JewelryItem[] = [];
  private isScanning = false;

  public updateMasterInventory(newInventory: JewelryItem[]): void {
    this.masterInventory = [...newInventory];
    console.log('RFID Service master inventory updated.');
  }

  public startScan(onItemScanned: (item: JewelryItem) => void): void {
    if (this.isScanning) {
      console.warn('Scan listener is already active.');
      return;
    }

    console.log('Starting RFID scan listener...');
    this.isScanning = true;

    // This function will be called by the native Android wrapper
    window.onRfidScan = (epc: string) => {
      if (!this.isScanning) return;
      
      console.log(`Received EPC from native: ${epc}`);
      
      // Find the item in the master inventory
      let foundItem = this.masterInventory.find(item => item.epc === epc);

      if (foundItem) {
        onItemScanned(foundItem);
      } else {
        // If the item is not in the master list, create a new item record
        const newItem: JewelryItem = {
          epc: epc,
          name: 'Uncatalogued Item',
          category: 'Unknown',
          price: 0,
          imageUrl: `https://picsum.photos/seed/${epc}/200`,
          showroomArea: 'Unknown',
          counterName: 'Unknown',
        };
        onItemScanned(newItem);
      }
    };
  }

  public stopScan(): void {
    if (!this.isScanning) {
      return;
    }
    console.log('Stopping RFID scan listener.');
    this.isScanning = false;
    // Clean up the global function to prevent memory leaks
    if (window.onRfidScan) {
      // @ts-ignore
      delete window.onRfidScan;
    }
  }
}

const rfidService = new RFIDService();
export default rfidService;
