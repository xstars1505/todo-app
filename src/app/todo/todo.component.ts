import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TodoService } from '../services/todo.service';
import {Subscription} from "rxjs/Rx";

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
  providers: [TodoService]
})
export class TodoComponent implements OnInit {
  private todos;
  private activeTasks;
  private newTodo;
  private path;
  private _subscriptions: Subscription[] = [];
  private _changeSubs: Subscription;

  constructor(private todoService: TodoService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.path = params['status'];
      this.getTodos(this.path);
    });
  }

  ngAfterContentInit() {
    this.initListener();
    this._changeSubs = this.todos && this.todos.subscribe(() => {
      this.clearListener();
      this.initListener();
    });
  }

  initListener() {
    if (this.todos && this.todos.length) {
      this.todos.foreach(todo => {
        let subscription = todo.isDone.subscribe(() => {
          this.getTodos(this.path);
        });
        this._subscriptions.push(subscription);
      });
    }
  }

  clearListener() {
    if (this._subscriptions && this._subscriptions.length) {
      this._subscriptions.forEach(sub => sub.unsubscribe());
    }
    this._subscriptions = [];
  }
  getTodos(query = ''){
    return this.todoService.get(query).then(todos => {
      this.todos = todos;
      this.activeTasks = this.todos.filter(todo => todo.isDone).length;
    });
  }

  addTodo() {
    if (this.newTodo) {
      this.todoService.add({
        _id: Math.floor(Math.random() * (999999 - 100000)) + 100000,
        title: this.newTodo,
        isDone: false
      }).then(() => {
        if (this.path === 'completed') {
          return this.getTodos('active');
        }
        return this.getTodos(this.path);
      }).then(() => {
        this.newTodo = ''; // clear input form value
      });
    }
  }

  updateTodo(todo, newValue) {
    todo.title = newValue;
    return this.todoService.put(todo).then(() => {
      todo.editing = false;
      return this.getTodos();
    });
  }

  destroyTodo(todo){
    this.todoService.delete(todo._id).then(() => {
      return this.getTodos();
    });
  }

  clearCompleted() {
    this.todoService.deleteCompleted().then(() => {
      return this.getTodos();
    });
  }

  markDone(todo) {
    return this.todoService.markDone(todo).then(() => {
      return this.getTodos(this.path);
    });
  }
}