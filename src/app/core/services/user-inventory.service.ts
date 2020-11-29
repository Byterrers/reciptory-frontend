import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

// Entities.
import { UserInventoryDto } from '../entities/dtos/user-inventory.dto';

@Injectable({
  providedIn: 'root'
})
export class UserInventoryService {
  constructor(private httpService: HttpService) {}

  getUsersInventories(): Observable<any> {
    return this.httpService.get('/users-inventory');
  }

  getUsersInventoryById(inventoryId: string): Observable<any> {
    return this.httpService.get(`/users-inventory/${inventoryId}`);
  }

  getUsersInventoryByUserId(userId: string): Observable<any> {
    return this.httpService.get(`/users-inventory/${userId}/user-inventory`);
  }

  insertUsersInventory(invetory: UserInventoryDto): Observable<any> {
    return this.httpService.post('/users-inventory/', invetory);
  }

  updateUsersInventory(invetory: UserInventoryDto): Observable<any> {
    return this.httpService.put('/users-inventory', invetory);
  }

  deleteUsersInventory(userId: string): Observable<any> {
    return this.httpService.delete(`/users-inventory/${userId}`);
  }

  moveProduct(userId: string, productId: string, locationId: string) {
    return this.httpService.put(
      `/users-inventory/${userId}/user-inventory/move-product/${productId}/to/${locationId}`,
      null
    );
  }
}
