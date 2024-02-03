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
    // Работа с playwright
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
    await page.goto('https://habr.com/ru/hubs/javascript/articles/');

    const textOfPage = await page.evaluate(() => {
        const arrayProposal = Array.from(document.querySelectorAll('body'))
            .map((x) => x.textContent)
            .join()
            .toLowerCase()
            .split('\n');

        const arrayWords = arrayProposal
            .join()
            .replace(/[&\/\s\#,+()$~%.'":*?<>{}·]/g, ' ')
            .replace(/[^a-zA-Zа-яА-Яё -]/g, '')
            .split(' ');

        const resultArrayWords = arrayWords.filter((el) => {
            return el != '' && el.length >= 2;
        });

        const objWords = {} as any;

        resultArrayWords.forEach((item: string) => {
            objWords[item] ? objWords[item]++ : (objWords[item] = 1);
        });

        return objWords;
    });

    console.log({ textOfPage });

    await context.close();
    await browser.close();
})();
