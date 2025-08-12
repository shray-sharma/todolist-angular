import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { StorageService } from './services/storage.service';
import { LanguageService } from './services/language.service';
import { AppStorage } from './models/todo.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  storage!: AppStorage;
  lang: any = {};

  constructor(
    private storageService: StorageService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    // Subscribe to storage changes
    this.storageService.storage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(storage => {
        this.storage = storage;
        this.loadLanguage();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadLanguage(): void {
    this.languageService.load(this.storage.settings.language)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.lang = data;
          console.log('Loaded language ' + this.storage.settings.language);
        },
        error: (error) => {
          console.error('Cannot load language \'' + this.storage.settings.language + '\'. Error:', error);
        }
      });
  }
}