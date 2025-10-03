
import { JewelryItem } from '../types';
import { UhfReader } from '../capacitor-uhf-reader';

// Extend the Window interface to declare our custom function
declare global {
  interface Window {
    onRfidScan: (epc: string) => void;
  }
}

class RFIDService {
  private masterInventory: JewelryItem[] = [];
  private isScanning = false;
  private plugin = UhfReader;

  public updateMasterInventory(newInventory: JewelryItem[]): void {
    this.masterInventory = [...newInventory];
    console.log('RFID Service master inventory updated.');
  }

  public async startScan(onItemScanned: (item: JewelryItem) => void): Promise<void> {
    if (this.isScanning) {
      console.warn('Scan listener is already active.');
      return;
    }

    console.log('Starting RFID scan listener...');
    this.isScanning = true;

    if (this.plugin) {
      await this.plugin.initReader();
      await this.plugin.startScan();
      await this.plugin.addListener('onTagScanned', (data: { epc: string; rssi: number }) => {
        if (!this.isScanning) return;
        const epc = data.epc;
        let foundItem = this.masterInventory.find(item => item.epc === epc);
        if (foundItem) {
          onItemScanned(foundItem);
        } else {
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
      });
    }
  }

  public async stopScan(): Promise<void> {
    if (!this.isScanning) {
      return;
    }
    console.log('Stopping RFID scan listener.');
    this.isScanning = false;
    if (this.plugin) {
      await this.plugin.stopScan();
    }
  }
}

const rfidService = new RFIDService();
export default rfidService;
