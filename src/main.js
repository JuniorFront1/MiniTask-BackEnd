window.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.btn');

    btn.addEventListener('click', async () => {
        // // Получение ссылки и тела таблицы
        // const url = document.querySelector('.inpt').value;
        // const tableBody = document.querySelector('.table__body');
        // // Получение данных через запрос
        // const promise = await fetch(url);
        // if (promise.ok) {
        //     const parsedJSON = await promise.json();
        // } else {
        //     alert('Ошибка HTTP: ' + promise.status);
        // }
        // // Рендеринг HTML структуры таблицы
        // let htmlTable = ``;
        // for (let i = 0; i < 10; i++) {
        //     htmlTable += `<tr class="table__row">
        // <td class="table__row-item table__row-word">Слово</td>
        // <td class="table__row-item table__body-count">233</td>
        // </tr>`;
        // }
        // tableBody.innerHTML = htmlTable;
    });
});
