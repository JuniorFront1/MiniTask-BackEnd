window.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.btn');

    btn.addEventListener('click', async () => {
        // Получение ссылки и тела таблицы
        const url = document.querySelector('.inpt').value;
        // Получение контейнера селектора и выбранного элемента
        const selectedContainer = document.querySelector('.choise__select');

        const selectedItem = selectedContainer.options[selectedContainer.selectedIndex].value;
        // Получение значения длины слов
        const lengthValue = parseInt(document.querySelector('.choise__inpt').value);
        if (lengthValue < 3) {
            alert('Длина слова должна быть 3 и более!');
            return;
        }
        ///getPopularWord - куда мы идём
        // ?url.... - это параметры, которые мы передаём в точку входа (getPopularWord)
        const res = await fetch(`/getPopularWord?url=${url}`);
        const result = await res.json();
        const tableBody = document.querySelector('.table__body');
        // Рендеринг HTML структуры таблицы
        let htmlTable = ``;

        const regExpRus = /^\p{Script=Cyrillic}+$/u;
        const regExpEng = /^[a-zA-Z]/g;

        let resultArrayWords = 0;

        if (selectedItem == 'english') {
            resultArrayWords = Object.entries(result).filter((el) => {
                const correctItem = regExpEng.test(el[1][0]);
                if (correctItem == true) {
                    el[1][0] = el[1][0].replace(/\s+/, '');
                    return el[1][0].length == lengthValue;
                }
            });
        }
        if (selectedItem == 'russian') {
            resultArrayWords = Object.entries(result).filter((el) => {
                const correctItem = regExpRus.test(el[1][0]);
                if (correctItem == true) {
                    el[1][0] = el[1][0].replace(/\s+/, '');
                    return el[1][0].length == lengthValue;
                }
            });
        }

        console.log(resultArrayWords);

        let count = 0;

        for (const [key, value] of Object.entries(resultArrayWords)) {
            htmlTable += `<tr class="table__row">
        <td class="table__row-item table__row-word">${value[1][0]}</td>
        <td class="table__row-item table__body-count">${value[1][1]}</td>
        </tr>`;
            count++;
            if (count == 10) {
                break;
            }
        }
        // for (let i = 0; i < resultArrayWords.length; i++) {
        //     const [word, count] = resultArrayWords[i];
        //     htmlTable += `<tr class="table__row">
        // <td class="table__row-item table__row-word">${word}</td>
        // <td class="table__row-item table__body-count">${count}</td>
        // </tr>`;
        // }
        tableBody.innerHTML = htmlTable;
    });
});
