// event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../services/environment';
import { AppEvent } from '../services/event.model';


@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiBaseUrl}/Events`;

  constructor(private http: HttpClient) {}

  getEvents(): Observable<AppEvent[]> {
    return this.http.get<AppEvent[]>(this.apiUrl);
  }

  createEvent(event: AppEvent): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.apiUrl, event, {headers, responseType: 'text'})
    .pipe(
      catchError(error => {
        console.error('Error en la petición:', error);
        throw new Error('Failed to create event');
      })
    );;
  }

  updateEvent(id: string, event: AppEvent): Observable<AppEvent> {
    return this.http.put<AppEvent>(`${this.apiUrl}/${id}`, event);
  }

  
  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}