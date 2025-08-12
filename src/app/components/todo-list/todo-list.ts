import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { StorageService } from '../../services/storage.service';
import { LanguageService } from '../../services/language.service';
import { AppStorage, TodoList, Todo } from '../../models/todo.model';
import { DonePipe } from '../../pipes/done.pipe';

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, FormsModule, RouterModule, DatePipe, DonePipe],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css'
})
export class TodoListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  storage!: AppStorage;
  currentListId: number = 0;
  currentList!: TodoList;
  lang: any = {};
  
  addTodoForm = {
    name: '',
    notice: '',
    priority: 0
  };

  // TrackBy functions for ngFor
  trackByListId = (index: number, item: any): number => item.id;
  trackByTodoId = (index: number, item: any): number => item.id;

  constructor(
    private storageService: StorageService,
    private languageService: LanguageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to storage changes and route params
    combineLatest([
      this.storageService.storage$,
      this.route.params
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([storage, params]) => {
      this.storage = storage;
      this.currentListId = parseInt(params['id']) || 0;
      this.currentList = this.storage.lists[this.currentListId] || this.storage.lists[0];
      
      // Load language
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
          console.log('Loaded language', this.storage.settings.language);
        },
        error: (error) => {
          console.error('Cannot load language', this.storage.settings.language, error);
        }
      });
  }

  checkTodo(listId: number, todoId: number): void {
    this.storageService.toggleTodo(listId, todoId);
  }

  addTodo(): void {
    if (this.addTodoForm.name.trim()) {
      this.storageService.addTodo(this.currentListId, {
        name: this.addTodoForm.name,
        notice: this.addTodoForm.notice || '',
        priority: this.addTodoForm.priority
      });
      
      // Reset form
      this.addTodoForm = {
        name: '',
        notice: '',
        priority: 0
      };
    }
  }

  removeTickedTodos(listId: number): void {
    this.storageService.removeCompletedTodos(listId);
  }

  newList(): void {
    const title = prompt(this.lang.newlistprompt + ': ', 'New list');
    if (title && title.trim()) {
      const newList = this.storageService.addList(title.trim());
      this.router.navigate(['/list', newList.id]);
    }
  }

  deleteList(listId: number): void {
    const confirmed = confirm(this.lang.deleteconfirm);
    if (confirmed) {
      this.storageService.deleteList(listId);
      this.router.navigate(['/list/0']);
    }
  }

  navigateToSettings(): void {
    this.router.navigate(['/settings']);
  }

  navigateToList(listId: number): void {
    this.router.navigate(['/list', listId]);
  }
}
