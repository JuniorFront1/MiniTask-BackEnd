import { playWrightFunc } from '../backend/index';

window.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.btn');

    btn.addEventListener('click', async () => {
        // Получение ссылки и тела таблицы
        const url = document.querySelector('.inpt').value;
        console.log(playWrightFunc(url));
        const tableBody = document.querySelector('.table__body');
        // Рендеринг HTML структуры таблицы
        let htmlTable = ``;
        for (let i = 0; i < 10; i++) {
            htmlTable += `<tr class="table__row">
        <td class="table__row-item table__row-word">Слово</td>
        <td class="table__row-item table__body-count">233</td>
        </tr>`;
        }
        tableBody.innerHTML = htmlTable;
    });
});
