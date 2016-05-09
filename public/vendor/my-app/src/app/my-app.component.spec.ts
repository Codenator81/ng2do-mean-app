import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { MyAppAppComponent } from '../app/my-app.component';

beforeEachProviders(() => [MyAppAppComponent]);

describe('App: MyApp', () => {
  it('should create the app',
      inject([MyAppAppComponent], (app: MyAppAppComponent) => {
    expect(app).toBeTruthy();
  }));

  it('should have as title \'my-app works!\'',
      inject([MyAppAppComponent], (app: MyAppAppComponent) => {
    expect(app.title).toEqual('my-app works!');
  }));
});
