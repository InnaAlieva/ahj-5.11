import { fork } from 'child_process';

const puppeteer = require('puppeteer');

jest.setTimeout(30000);

describe('name/price form', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';

  beforeAll(async () => {   
    server = fork(`${__dirname}/e2e.server.js`); 
    const serverReady = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Server did not respond in time'));
      }, 10000); // 10 сек таймаут

      server.on('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });

      server.on('message', (message) => {
        if (message === 'ok') {
          clearTimeout(timeout);
          resolve();
        }
      });
    });

    await serverReady;
   
    browser = await puppeteer.launch({
      headless: true, // Всегда true в CI
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process', 
      ],
      timeout: 30000,
    });

    page = await browser.newPage();
    
    await page.setViewport({ width: 1280, height: 720 });
  }, 30000);

  afterAll(async () => {
    try {
      if (browser) await browser.close();
    } catch (err) {
      
    }

    if (server) {
      server.kill();
      
    }
  });

  test('click on the toggler should show popover', async () => {
    await page.goto(baseUrl, {
      waitUntil: 'domcontentloaded', 
      timeout: 10000,
    });
    
    const toggler = await page.$('#toggler');
    if (!toggler) {
      throw new Error('Element #toggler not found on the page');
    }
    
    await toggler.click();
    
    await page.waitForSelector('div.popover', {
      visible: true,
      timeout: 5000,
    });

    await toggler.click();
    
    await page.waitForFunction(() => !document.querySelector('div.popover'), { timeout: 5000 });
  }, 20000);
});
