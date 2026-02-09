import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovieService {

  private apiUrl = environment.apiUrl;
  private token = environment.apiToken;

  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  searchMovie(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search/movie`, {
      headers: this.headers,
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
        headers: this.headers,
      }
    );
  }
}