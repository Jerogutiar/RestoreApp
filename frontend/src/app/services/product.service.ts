import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductRequest } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = `${environment.apiUrl}/products`;

    constructor(private http: HttpClient) { }

    /** Get active products (any authenticated user) */
    getActiveProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl);
    }

    /** Get ALL products including inactive (Admin only) */
    getAllProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/all`);
    }

    /** Get single product by ID */
    getProduct(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    /** Create a new product (Admin only) */
    createProduct(product: ProductRequest): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, product);
    }

    /** Update a product (Admin only) */
    updateProduct(id: number, product: ProductRequest): Observable<any> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, product);
    }

    /** Delete (logical deactivate) a product (Admin only) */
    deleteProduct(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
