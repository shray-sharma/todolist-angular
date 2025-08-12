import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppStorage, TodoList, Todo, Settings } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storageKey = 'storage';
  private storageSubject = new BehaviorSubject<AppStorage>(this.getDefaultStorage());
  
  public storage$ = this.storageSubject.asObservable();

  constructor() {
    this.loadStorage();
  }

  private getDefaultStorage(): AppStorage {
    return {
      settings: {
        title: 'TodoList',
        language: 'en',
        dateformat: 'HH:mm dd.MM.yyyy',
        timezone: '+0000'
      },
      lists: [
        {
          id: 0,
          title: 'Default',
          todos: [
            {
              id: 0,
              name: 'Enjoy!',
              priority: 2,
              notice: 'Thanks for using!',
              done: false,
              date: Date.now()
            }
          ]
        }
      ]
    };
  }

  private loadStorage(): void {
    const savedStorage = localStorage.getItem(this.storageKey);
    
    if (savedStorage) {
      try {
        const parsedStorage = JSON.parse(savedStorage);
        this.storageSubject.next(parsedStorage);
        console.log('Loaded storage');
      } catch (error) {
        console.error('Error parsing stored data, using default storage');
        this.saveStorage(this.getDefaultStorage());
      }
    } else {
      console.log('Created new storage');
      this.saveStorage(this.getDefaultStorage());
    }
  }

  saveStorage(storage: AppStorage): void {
    localStorage.setItem(this.storageKey, JSON.stringify(storage));
    this.storageSubject.next(storage);
    console.log('Saved storage');
  }

  getCurrentStorage(): AppStorage {
    return this.storageSubject.value;
  }

  updateSettings(settings: Settings): void {
    const currentStorage = this.getCurrentStorage();
    currentStorage.settings = settings;
    this.saveStorage(currentStorage);
  }

  addList(title: string): TodoList {
    const currentStorage = this.getCurrentStorage();
    const newList: TodoList = {
      id: currentStorage.lists.length,
      title,
      todos: []
    };
    currentStorage.lists.push(newList);
    this.saveStorage(currentStorage);
    return newList;
  }

  deleteList(listId: number): void {
    const currentStorage = this.getCurrentStorage();
    currentStorage.lists.splice(listId, 1);
    
    // Reindex lists
    currentStorage.lists.forEach((list, index) => {
      list.id = index;
    });
    
    this.saveStorage(currentStorage);
  }

  addTodo(listId: number, todo: Omit<Todo, 'id' | 'done' | 'date'>): void {
    const currentStorage = this.getCurrentStorage();
    const list = currentStorage.lists[listId];
    
    if (list) {
      const newTodo: Todo = {
        ...todo,
        id: list.todos.length,
        done: false,
        date: Date.now()
      };
      
      list.todos.push(newTodo);
      this.saveStorage(currentStorage);
    }
  }

  toggleTodo(listId: number, todoId: number): void {
    const currentStorage = this.getCurrentStorage();
    const todo = currentStorage.lists[listId]?.todos[todoId];
    
    if (todo) {
      todo.done = !todo.done;
      this.saveStorage(currentStorage);
    }
  }

  removeCompletedTodos(listId: number): void {
    const currentStorage = this.getCurrentStorage();
    const list = currentStorage.lists[listId];
    
    if (list) {
      list.todos = list.todos.filter(todo => !todo.done);
      
      // Reindex todos
      list.todos.forEach((todo, index) => {
        todo.id = index;
      });
      
      this.saveStorage(currentStorage);
    }
  }
}
