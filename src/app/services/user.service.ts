import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface User {
  id?: number;
  username: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://rmarket-backend.onrender.com/api/users';

  constructor(private http: HttpClient) {}

  // ✅ GET ALL USERS
  getUsers(): Observable<User[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => res.data.map((u: any) => ({
        id: u.UserID, // 🔥 IMPORTANT FIX
        username: u.username,
        email: u.email,
        role: u.role
      })))
    );
  }

  // ✅ DELETE USER
  deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}