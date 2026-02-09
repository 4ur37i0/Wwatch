import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-input-search',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './input-search.component.html',
})
export class InputSearchComponent {

  search: string = '';
  movies: any[] = [];
  selectedMovie: any = null;
  providers: any = null;
  showModal = false;
  loadingProviders = false;

  constructor(
    private movieService: MovieService,
    private cdr: ChangeDetectorRef
  ) {}

  fetchmovies() {
    if (!this.search.trim()) return;

    this.movieService.searchMovie(this.search).subscribe({
      next: (response: any) => {
        this.movies = response.results;
        this.cdr.detectChanges();
        console.log(this.movies);
      },
      error: (err: any) => {
        console.error('Error al buscar películas', err);
        this.cdr.detectChanges();
      },
    });
  }

  openProviders(movie: any) {
    this.selectedMovie = movie;
    this.showModal = true;
    this.loadingProviders = true;
    this.providers = null;

    this.movieService.getWatchProviders(movie.id).subscribe({
      next: (response: any) => {
        this.providers = response.results?.MX || null;
        this.loadingProviders = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error obteniendo plataformas', err);
        this.loadingProviders = false;
        this.cdr.detectChanges();
      }
    });
  }
}