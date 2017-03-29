import { MGTPage } from './app.po';

describe('mgt App', () => {
  let page: MGTPage;

  beforeEach(() => {
    page = new MGTPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
