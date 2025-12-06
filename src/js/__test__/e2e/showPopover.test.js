import { fork } from 'child_process';

const puppeteer = require('puppeteer');

jest.setTimeout(30000); // default puppeteer timeout

describe('name/price form', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppeteer.launch({
      // this should be commented for CI?
      // headless: false, // show gui
      // slowMo: 250,
      // devtools: true, // show devTools
    });

    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test('click on the toggler should show popover', async () => {
    await page.goto(baseUrl);
    const toggler = await page.$('#toggler');
    await toggler.click();
    await page.waitForSelector('div.popover', { visible: true });
    await toggler.click();
    await page.waitForFunction(() => !document.querySelector('div.popover'));
  });
});
