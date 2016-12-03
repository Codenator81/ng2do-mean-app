import { TrAppPage } from './app.po';

describe('tr-app App', function() {
  let page: TrAppPage;

  beforeEach(() => {
    page = new TrAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
