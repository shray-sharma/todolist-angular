import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { StorageService } from '../../services/storage.service';
import { LanguageService } from '../../services/language.service';
import { AppStorage, Settings, Language } from '../../models/todo.model';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class SettingsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  storage!: AppStorage;
  settings!: Settings;
  lang: any = {};
  showReload = false;
  
  languages: Language[] = [
    { short: 'en', full: 'English' },
    { short: 'de', full: 'Deutsch' }
  ];

  constructor(
    private storageService: StorageService,
    private languageService: LanguageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to storage changes
    this.storageService.storage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(storage => {
        this.storage = storage;
        this.settings = { ...storage.settings }; // Create a copy for editing
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
        next: (langData) => {
          this.lang = langData;
        },
        error: (error) => {
          console.error('Cannot load language', this.storage.settings.language, error);
        }
      });
  }

  onLanguageChange(): void {
    this.showReload = true;
  }

  saveSettings(): void {
    this.storageService.updateSettings(this.settings);
    this.router.navigate(['/list/0']);
  }

  goBack(): void {
    this.router.navigate(['/list/0']);
  }
}
