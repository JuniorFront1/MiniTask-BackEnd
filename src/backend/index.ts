import fastify from 'fastify';
import path from 'path';
import { chromium } from 'playwright';
import { fastifyStatic } from '@fastify/static';
// Статичный сервер от fastify
const server = fastify({ trustProxy: true });

server.register(fastifyStatic, {
    root: path.join(process.cwd(), 'src', 'frontend'),
    prefix: '/src/frontend/',
});

server.get('/', (request, reply) => {
    return reply.sendFile('index.html');
});

server.get('/getPopularWord', async (request, reply) => {
    const q = request.query as { url?: string };
    if (q.url == null) {
        return 'WTF';
    }
    return takeWordsSite(q.url);
});

server.listen({ port: 5500, host: '127.0.0.1' }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});

// Работа с playwright
export const takeWordsSite = async (url: string) => {
    const browser = await chromium.launch({
        headless: false,
        channel: 'msedge',
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(url, {
        waitUntil: 'domcontentloaded',
    });
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
        const arrayObjWords: Record<string, number> = {};
        resultArrayWords.forEach((item: string, i: number): void => {
            arrayObjWords[item] ? arrayObjWords[item]++ : (arrayObjWords[item] = 1);
        });

        const sortedArrayObjWords = Object.entries(arrayObjWords).sort((a, b) => {
            return b[1] - a[1];
        });

        return sortedArrayObjWords;
    });
    await context.close();
    await browser.close();
    return textOfPage;
};
