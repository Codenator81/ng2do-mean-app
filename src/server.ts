/**
 * the polyfills must be the first thing imported
 */
import './polyfills.ts';
import * as path from 'path';
import * as express from 'express';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { createEngine } from 'angular2-express-engine';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/app.node.module';
import { environment } from './environments/environment';
import { routes } from './server.routes';

// App

const app  = express();
const ROOT = path.join(path.resolve(__dirname, '..'));
const port = process.env.PORT || 4200;

/**
 * enable prod mode for production environments
 */
if (environment.production) {
  enableProdMode();
}

/**
 * Express View
 */
app.engine('.html', createEngine({}));
app.set('views', __dirname);
app.set('view engine', 'html');

/**
 * Enable compression
 */
app.use(compression());
app.use(cookieParser());

/**
 * serve static files
 */
app.use(express.static(path.join(ROOT, 'dist'), {index: false}));

/**
 * place your api routes here
 */
// ** API
import { createTodoApi } from './backend/api';
app.use('/api/v1/', createTodoApi());

/**
 * bootstrap universal app
 * @param req
 * @param res
 */
function ngApp(req: any, res: any) {
  res.render('index', {
    req,
    res,
    ngModule: AppModule,
    preboot: false,
    baseUrl: '/',
    requestUrl: req.originalUrl,
    originUrl: req.hostname
  });
}

/**
 * use universal for specific routes
 */
app.get('/', ngApp);
routes.forEach(route => {
  app.get(`/${route}`, ngApp);
  app.get(`/${route}/*`, ngApp);
});

/**
 * if you want to use universal for all routes, you can use the '*' wildcard
 */

app.get('*', function (req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  const pojo = {status: 404, message: 'No Content'};
  const json = JSON.stringify(pojo, null, 2);
  res.status(404).send(json);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
