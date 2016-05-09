import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class TodoService {

  constructor(public http: Http) { }
  getAll() {
    return this.http.get('/api/v1/todos');
  }

  save(todo) {
    return this.http.post('/api/v1/todo', todo);
  }

  update(todo) {
    return this.http.put('/api/v1/todo/' + todo._id, todo);
  }

  delete (id) {
    return this.http.delete('/api/v1/todo/' + id);
  }

}
