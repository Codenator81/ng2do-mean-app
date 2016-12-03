import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map'

import {TodoService} from "./todo.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [TodoService]
})
export class AppComponent implements OnInit {
  todos = [];

  constructor(private _todoService:TodoService) {
  }

  ngOnInit() {
    this.todos = [];
    this._todoService.getAll()
      .map(res => res.json())
      .subscribe(todos => this.todos = todos);
  }

  addTodo($event, todoText) {
    if ($event.which === 13) {
      let result;
      let _todo = {
        text: todoText.value,
        isCompleted: false
      };
      result = this._todoService.save(_todo);
      result.subscribe(x => {
        // keep things in sync
        this.todos.push(_todo)
        todoText.value = '';
      })
    }
  }

  updateStatus(todo) {
    let _todo = {
      _id: todo._id,
      text: todo.text,
      isCompleted: !todo.isCompleted
    };

    this._todoService.update(_todo)
      .map(res => res.json())
      .subscribe(data => {
        todo.isCompleted = !todo.isCompleted;
      });
  }

  deleteTodo(todo) {
    let todos = this.todos;

    this._todoService.delete(todo._id)
      .map(res => res.json())
      .subscribe(data => {
        if (data.n == 1) {
          // save a n/w call by updating the local array
          // instead of making a GET call again to refresh the data
          for (let i = 0; i < todos.length; i++) {
            if (todos[i]._id == todo._id) {
              todos.splice(i, 1);
            }
          }
        }
      });
  }

  setEditState(todo, state) {
    if (state) {
      todo.isEditMode = state;
    } else {
      // don't store unwanted presentation logic in DB :/
      delete todo.isEditMode;
    }
  }
}
