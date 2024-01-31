import fastify from 'fastify';
import { Browser, BrowserContext, Page, chromium } from 'playwright';

// Статичный сервер от fastify
const server = fastify();

const testOBJ = {
    hello: 'world',
    nikita: 'damir',
    tom: 'program',
};

server.get('/', async (request, reply) => {
    return '{ hello: world }';
});

server.get('/getPopularWord', async (request, reply) => {
    return testOBJ;
});

server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});

// Работа с playwright
(async () => {
    const browser: Browser = await chromium.launch({
        headless: false,
        channel: 'msedge',
    });
    const context: BrowserContext = await browser.newContext();
    const page: Page = await context.newPage();
    await page.goto('https://letcode.in/');

    await context.close();
    await browser.close();
})();
