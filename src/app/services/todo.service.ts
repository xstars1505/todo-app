import { Injectable } from '@angular/core';
import {TodoItem} from "../models/todo";

@Injectable()
export class TodoService {

  // todos= [
  //   { _id: 1, title: 'Install Angular CLI', isDone: true },
  //   { _id: 2, title: 'Style app', isDone: true },
  //   { _id: 3, title: 'Finish service functionality', isDone: false },
  //   { _id: 4, title: 'Setup API', isDone: false }
  // ];

 todos: TodoItem[] = [];
  constructor() { }

  get(query = ''){
    return new Promise(resolve => {
      var data;

      if(query === 'completed' || query === 'active'){
        var isCompleted = query === 'completed';
        data = this.todos.filter(todo => todo.isDone === isCompleted);
      } else {
        data = this.todos;
      }

      resolve(data);
    });
  }

  add(data) {
    return new Promise(resolve => {
     // this.todos.push(new TodoItem(data._id, data.title, data.isDone));
      this.todos.push(data);
      resolve(data);
    });
  }

  put(data) {
    return new Promise(resolve => {
      let index = this.todos.findIndex(todo => todo._id === data._id);
      this.todos[index].title = data.title;
      resolve(data);
    });
  }

  markDone(data) {
    return new Promise(resolve => {
      let index = this.todos.findIndex(todo => todo._id === data._id);
      this.todos[index].isDone = data.isDone;
      resolve(data);
    })
  }

  delete(id) {
    return new Promise(resolve => {
      let index = this.todos.findIndex(todo => todo._id === id);
      this.todos.splice(index, 1);
      resolve(true);
    });
  }

  deleteCompleted() {
    return new Promise(resolve => {
      this.todos = this.todos.filter(todo => !todo.isDone);
      resolve(this.todos);
    });
  }
}