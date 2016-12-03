# MEAN Stack using Angular 2 and Universal

Used external mongoDB server but the same way you can use local one.
Just change in `/routes/tosos.js` to local MongoDB server
```js
var db = mongojs('mongodb://admin:admin123@ds037827.mongolab.com:37827/ng2todoapp', ['todos']);
```
This project now in stage of part two
To start project after `git clone` use
```
npm install
bower install
ung serve
```
For production 
```
ung build --prod
node ./dist/server.bundle.js
```

## Part One
1) Install packages
```console
npm install -g angular-cli
ng new todoApp --skip-git true
ng set defaults.styleExt scss
```
test ng2 app is working
```
ng serve
```
Navigate to http://localhost:4200/
 
should see `app works!`  
Install packages for server side:
```
npm install --save body-parser cookie-parser ejs express mongojs morgan path
```
2) Create Express server with routes
```js
//server.js

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var todos = require('./routes/todos');

var app = express();

app.set('views', path.join(__dirname, './public/'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public/')));
app.use('/', index);
app.use('/api/v1/', todos);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

var server = app.listen(3000, function() {
    var host = 'localhost';
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});

module.exports = app;
```
```js
//routes/index.js

var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index.html');
});
module.exports = router;
```
```js
//routes/todos.js

var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://admin:admin123@ds037827.mongolab.com:37827/ng2todoapp', ['todos']);
/* GET All Todos */
router.get('/todos', function(req, res, next) {
    db.todos.find(function(err, todos) {
        if (err) {
            res.send(err);
        } else {
            res.json(todos);
        }
    });
});
/* GET One Todo with the provided ID */
router.get('/todo/:id', function(req, res, next) {
    db.todos.findOne({
        _id: mongojs.ObjectId(req.params.id)
    }, function(err, todos) {
        if (err) {
            res.send(err);
        } else {
            res.json(todos);
        }
    });
});
/* POST/SAVE a Todo */
router.post('/todo', function(req, res, next) {
    var todo = req.body;
    if (!todo.text || !(todo.isCompleted + '')) {
        res.status(400);
        res.json({
            "error": "Invalid Data"
        });
    } else {
        db.todos.save(todo, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        })
    }
});
/* PUT/UPDATE a Todo */
router.put('/todo/:id', function(req, res, next) {
    var todo = req.body;
    var updObj = {};
    if (todo.isCompleted) {
        updObj.isCompleted = todo.isCompleted;
    }
    if (todo.text) {
        updObj.text = todo.text;
    }
    if (!updObj) {
        res.status(400);
        res.json({
            "error": "Invalid Data"
        });
    } else {
        db.todos.update({
            _id: mongojs.ObjectId(req.params.id)
        }, updObj, {}, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        });
    }
});
/* DELETE a Todo */
router.delete('/todo/:id', function(req, res) {
    db.todos.remove({
        _id: mongojs.ObjectId(req.params.id)
    }, '', function(err, result) {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    });
});
module.exports = router;
```

3) Angular 2 build command for production
```console
ng build -prod --output-path ./public
```
4) Install Bower in root of project
 ```console
 touch .bowerrc
 npm install -g bower
 bower init
 ```
 to bower.json
 ```js
//...
   "dependencies": {
     "bootstrap": "^3.3.6"
   }
//...
 ```
```console
bower install
```
add bootstrap 3 to angular-cli.json for building with webpack
```json
//...
     "styles": [
        "../bower_components/bootstrap/dist/css/bootstrap.min.css",
        "styles.scss"        
      ],
//...      
```
5) Build ng2 app
Edit /src/app/app.component.html
```html
<div class="row col-md-12">
  <h1 class="text-center">M.E.A.N. Todo App with Angular 2.0</h1>
  <hr>
  <div class="row col-md-12">
    <div>
      <input class="form-control input-lg" placeholder="Add a Todo" autofocus #todotext (keyup)="addTodo($event, todotext)">
    </div>
  </div>
  <div class="row col-md-12 todos">
    <br>
    <div class="alert alert-info text-center" [hidden]="todos.length > 0">
      <h3>No Todos yet!</h3>
    </div>
    <div *ngFor="let todo of todos" class="col-md-12 col-sm-12 col-xs-12 todo" [class.strike]="todo.isCompleted">
      <div class="col-md-1 col-sm-1 col-xs-1">
        <input type="checkbox" [checked]="todo.isCompleted" (click)="updateStatus(todo)">
      </div>
      <div class="col-md-8 col-sm-8 col-xs-8">
        <span [class.hidden]="todo.isEditMode">{{todo.text}}</span>
        <input [class.hidden]="!todo.isEditMode" type="text" [value]="todo.text" (keypress)="updateTodoText($event, todo);">
        <input [class.hidden]="!todo.isEditMode" type="button" class="btn btn-warning" value="Cancel" (click)="setEditState(todo, false)" />
      </div>
      <div class="col-md-3 col-sm-3 col-xs-3">
        <input type="button" class="btn btn-info" [class.disabled]="todo.isCompleted" class="pull-right" value="Edit" (click)="setEditState(todo, true)" />
        <input type="button" class="btn btn-danger" class="pull-right" value="Delete" (click)="deleteTodo(todo)" />
      </div>
    </div>
  </div>
</div>
```
replace /src/app/app.component.ts
```ts
import {Component, OnInit} from '@angular/core';
import 'rxjs/add/operator/map'

import {TodoService} from "./todo.service";

@Component({
  moduleId: module.id,
  selector: 'my-app-app',
  templateUrl: 'my-app.component.html',
  providers: [TodoService]
})
export class MyAppAppComponent implements OnInit {
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
      var result;
      var _todo = {
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

  updateTodoText($event, todo) {
    if ($event.which === 13) {
      todo.text = $event.target.value;
      var _todo = {
        _id: todo._id,
        text: todo.text,
        isCompleted: todo.isCompleted
      };

      this._todoService.update(_todo)
        .map(res => res.json())
        .subscribe(data => {
          this.setEditState(todo, false);
        });
    }
  }

  updateStatus(todo) {
    var _todo = {
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
    var todos = this.todos;

    this._todoService.delete(todo._id)
      .map(res => res.json())
      .subscribe(data => {
        if (data.n == 1) {
          // save a n/w call by updating the local array
          // instead of making a GET call again to refresh the data
          for (var i = 0; i < todos.length; i++) {
            if (todos[i]._id == todo._id) {
              todos.splice(i, 1);
            }
          };
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
```
```
ng g service Todo
```
and update it
```ts
import { Injectable } from '@angular/core';
import { Http , Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TodoService {

  constructor(public http: Http) { }
  getAll() {
    return this.http.get('/api/v1/todos');
  }

  save(todo) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('/api/v1/todo', JSON.stringify(todo), {headers: headers})
      .map(res => res.json());
  }

  update(todo) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('/api/v1/todo/' + todo._id, JSON.stringify(todo), {headers: headers});
  }

  delete (id) {
    return this.http.delete('/api/v1/todo/' + id);
  }

}
```
and edit src/index.html
```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>M.E.A.N. Todo App with Angular 2.3</title>
  <base href="/">

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <div class="container">
    <app-root>
      <h2 class="text-center">Loading A M.E.A.N. Todo App...</h2>
    </app-root>
  </div>
</body>
</html>
```
and edit /src/styles.scss
```scss
* {
  -webkit-border-radius: 0 !important;
  -moz-border-radius: 0 !important;
  border-radius: 0 !important;
  font-family: calibri;
}
.strike span {
  text-decoration: line-through;
  color: #ccc;
}
.todos {
  padding: 20px;
}
.todo {
  padding: 10px;
  font-size: 21px;
  border-bottom: 1px solid;
}
.todo {
  .btn {
    margin-left: 5px;
    width: 72px;
  }
  &:hover {
    background: #e7e7e7;
  }
}
@media (max-width: 991px) {
  .todo {
    .btn {
      margin-bottom: 10px;
    }
    input[type=checkbox] {
      width: 25px;
      height: 25px;
    }
  }
}
@media (max-width: 991px) {
  .todo .btn-warning {
    margin-top: 10px;
    margin-left: 0px;
  }
}
@media (max-width: 450px) {
  .todo {
    .col-xs-8 {
      width: 85%;
    }
    .col-xs-3 {
      width: 100%;
      text-align: center;
      border-top: 1px dashed #aaa;
      padding-top: 10px;
      margin-top: 10px;
    }
  }
}
```
now in project root
```
ng build -prod --output-path ./public
node server
```
Navigate to http://localhost:3000
Finish of part One :)

## Part Two: Universal
Just check code
Shortest way use this https://github.com/devCrossNet/angular-cli#support-for-server-side-rendering
This project compatible with ung (Universal CLI)
To run after git clone  
```console
npm install 
bower install
ung serve
```

Will update README on request via GitHub issue
If you give me star I will be more happy to do work :)
