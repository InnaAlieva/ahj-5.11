import { fork } from 'child_process';

const puppeteer = require('puppeteer');


jest.setTimeout(30000);

describe('name/price form', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000'; // Проверьте порт!

  beforeAll(async () => {
    // 1. Запускаем сервер
    server = fork(`${__dirname}/e2e.server.js`);

    // 2. Ждём сообщения от сервера с таймаутом
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

    // 3. Запускаем Puppeteer с флагами для CI/CD
    browser = await puppeteer.launch({
      headless: true, // Всегда true в CI
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process', // Дополнительно для стабильности в CI
      ],
      timeout: 30000,
    });

    page = await browser.newPage();
    // Устанавливаем размер окна (важно для тестов UI)
    await page.setViewport({ width: 1280, height: 720 });
  }, 30000);

  afterAll(async () => {
    try {
      if (browser) await browser.close();
    } catch (err) {
      console.error('Error closing browser:', err);
    }

    if (server) {
      server.kill();
      // Дополнительно: ждём завершения процесса
      server.on('exit', () => console.log('Server process terminated'));
    }
  });

  test('click on the toggler should show popover', async () => {
    await page.goto(baseUrl, {
      waitUntil: 'domcontentloaded', // Более надёжный вариант
      timeout: 10000,
    });

    // Проверяем, что элемент существует
    const toggler = await page.$('#toggler');
    if (!toggler) {
      throw new Error('Element #toggler not found on the page');
    }

    // Кликаем
    await toggler.click();

    // Ждём появления попавера
    await page.waitForSelector('div.popover', {
      visible: true,
      timeout: 5000,
    });

    // Повторный клик для скрытия
    await toggler.click();

    // Ждём исчезновения попавера
    await page.waitForFunction(
      (() => !document.querySelector('div.popover')),
      { timeout: 5000 }
    );
  }, 20000);
});
