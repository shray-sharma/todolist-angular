import { Routes } from '@angular/router';
import { TodoListComponent } from './components/todo-list/todo-list';
import { SettingsComponent } from './components/settings/settings';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/list/0',
    pathMatch: 'full'
  },
  {
    path: 'list/:id',
    component: TodoListComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: '**',
    redirectTo: '/list/0'
  }
];
