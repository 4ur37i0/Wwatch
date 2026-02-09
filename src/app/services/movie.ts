import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovieService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get token dynamically from window or environment
  private getToken(): string {
    return (window as any).__TMDB_API_TOKEN__ || environment.apiToken || '';
  }

  // Create headers with dynamic token
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    });
  }

  searchMovie(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search/movie`, {
      headers: this.getHeaders(),
      params: {
        query,
        language: 'es-MX',
        page: 1,
      },
    });
  }

  getWatchProviders(movieId: number) {
    return this.http.get<any>(
      `${this.apiUrl}/movie/${movieId}/watch/providers`,
      {
        headers: this.getHeaders(),
      }
    );
  }
}