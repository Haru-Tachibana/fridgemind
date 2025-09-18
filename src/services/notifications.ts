import { GroceryItem, ShoppingListItem } from '../types';
import { isExpiringSoon, isExpired } from '../utils/helpers';

export class NotificationService {
  private static instance: NotificationService;
  private permissionGranted = false;

  private constructor() {
    this.requestPermission();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async requestPermission(): Promise<void> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === 'granted';
    }
  }

  public checkExpiringItems(items: GroceryItem[], warningDays: number = 3): void {
    const expiringItems = items.filter(item => 
      isExpiringSoon(item.expiryDate, warningDays) && !isExpired(item.expiryDate)
    );

    if (expiringItems.length > 0 && this.permissionGranted) {
      const itemNames = expiringItems.map(item => item.name).join(', ');
      new Notification('Items Expiring Soon', {
        body: `${itemNames} will expire within ${warningDays} days`,
        icon: '/favicon.ico',
        tag: 'expiring-items'
      });
    }
  }

  public checkLowStock(items: GroceryItem[], shoppingList: ShoppingListItem[], threshold: number = 1): void {
    const lowStockItems = items.filter(item => item.quantity <= threshold);
    const mustHaveItems = shoppingList.filter(item => item.isMustHave);
    
    const missingMustHaves = mustHaveItems.filter(mustHave => 
      !items.some(item => 
        item.name.toLowerCase().includes(mustHave.name.toLowerCase()) ||
        mustHave.name.toLowerCase().includes(item.name.toLowerCase())
      )
    );

    if (lowStockItems.length > 0 && this.permissionGranted) {
      const itemNames = lowStockItems.map(item => item.name).join(', ');
      new Notification('Low Stock Alert', {
        body: `${itemNames} are running low`,
        icon: '/favicon.ico',
        tag: 'low-stock'
      });
    }

    if (missingMustHaves.length > 0 && this.permissionGranted) {
      const itemNames = missingMustHaves.map(item => item.name).join(', ');
      new Notification('Must-Have Items Missing', {
        body: `${itemNames} are not in your fridge`,
        icon: '/favicon.ico',
        tag: 'missing-must-haves'
      });
    }
  }

  public showNotification(title: string, body: string, tag?: string): void {
    if (this.permissionGranted) {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag
      });
    }
  }

  public isPermissionGranted(): boolean {
    return this.permissionGranted;
  }
}
