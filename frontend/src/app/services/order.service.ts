import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, CreateOrderDto, UpdateOrderStatusDto } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = `${environment.apiUrl}/orders`;

    constructor(private http: HttpClient) { }

    /** Get orders (User: own orders, Admin: all orders) */
    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(this.apiUrl);
    }

    /** Get a single order by ID */
    getOrder(id: number): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/${id}`);
    }

    /** Create a new order */
    createOrder(order: CreateOrderDto): Observable<Order> {
        return this.http.post<Order>(this.apiUrl, order);
    }

    /** Update order status (Admin only) */
    updateOrderStatus(id: number, status: string): Observable<any> {
        const dto: UpdateOrderStatusDto = { status };
        return this.http.put(`${this.apiUrl}/${id}/status`, dto);
    }

    /** Cancel an order (Owner only, only if Pending) */
    cancelOrder(id: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/cancel`, {});
    }
}
