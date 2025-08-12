import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Import language files directly
import * as enLang from '../../assets/languages/en.json';
import * as deLang from '../../assets/languages/de.json';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private languages: { [key: string]: any } = {
    'en': enLang,
    'de': deLang
  };

  constructor() {}

  load(language: string): Observable<any> {
    const langData = this.languages[language] || this.languages['en'];
    return of(langData);
  }
}
