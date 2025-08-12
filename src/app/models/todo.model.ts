export interface Todo {
  id: number;
  name: string;
  priority: number;
  notice: string;
  done: boolean;
  date: number;
}

export interface TodoList {
  id: number;
  title: string;
  todos: Todo[];
}

export interface Settings {
  title: string;
  language: string;
  dateformat: string;
  timezone: string;
}

export interface AppStorage {
  settings: Settings;
  lists: TodoList[];
}

export interface Language {
  short: string;
  full: string;
}
