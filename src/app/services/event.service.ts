// event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../services/environment';
import { AppEvent } from '../services/event.model';


@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiBaseUrl}/Events`;

  constructor(private http: HttpClient) {}

  // Obtener todos los eventos
  getEvents(): Observable<AppEvent[]> {
    return this.http.get<AppEvent[]>(this.apiUrl);
  }

  // Crear un nuevo evento
  createEvent(event: Event): Observable<AppEvent> {
    return this.http.post<AppEvent>(this.apiUrl, event);
  }

  // Actualizar un evento existente
  updateEvent(id: string, event: AppEvent): Observable<AppEvent> {
    return this.http.put<AppEvent>(`${this.apiUrl}/${id}`, event);
  }

  // Eliminar un evento
  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}