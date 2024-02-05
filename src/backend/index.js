import fastify from 'fastify';
import { chromium } from 'playwright';
// Статичный сервер от fastify
const server = fastify();
const testOBJ = {
    hello: 'world',
    nikita: 'damir',
    tom: 'program',
};
server.get('/index.html', async (request, reply) => {
    return request;
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
    const browser = await chromium.launch({
        headless: false,
        channel: 'msedge',
    });
    const context = await browser.newContext();
    const page = await context.newPage();
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
        const arrayObjWords = {};
        resultArrayWords.forEach((item, i) => {
            arrayObjWords[item] ? arrayObjWords[item]++ : (arrayObjWords[item] = 1);
        });
        const result = Object.entries(arrayObjWords).sort((a, b) => {
            return b[1] - a[1];
        });
        return result;
    });
    console.log({ textOfPage });
    await context.close();
    await browser.close();
})();
