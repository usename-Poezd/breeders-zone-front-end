import moment from "moment";

export default class Pipes {
    transformCb = (cb) => {
        return moment(cb).format('YY');
    };

    transformBirthDay = (date = '') => {
        const [ year, mounth, day] = date.split(/-+/);
        let mounthText = '';

        switch (mounth) {
            case '01':
                mounthText = 'январь';
                break;

            case '02':
                mounthText = 'февраль';
                break;

            case '03':
                mounthText = 'март';
                break;

            case '04':
                mounthText = 'аперль';
                break;

            case '05':
                mounthText = 'май';
                break;

            case '06':
                mounthText = 'июнь';
                break;

            case '07':
                mounthText = 'июль';
                break;

            case '08':
                mounthText = 'август';
                break;

            case '09':
                mounthText = 'сентябрь';
                break;

            case '10':
                mounthText = 'октябрь';
                break;

            case '11':
                mounthText = 'ноябрь';
                break;

            case '12':
                mounthText = 'декабрь';
                break;

            default:
                break;
        }

        return `${day} ${mounthText} ${year}`;
    };

    toUrl = (name = '') => {
        const nameUrl = name
            .replace(/%+/gi, "%25")   // Процент
            .replace(/\s+/gi, "-")   // Пробел
            .replace(/\t+/gi, "%20")  // Табуляция (заменяем на пробел)
            .replace(/\n+/gi, "%20")  // Переход строки (заменяем на пробел)
            .replace(/\r+/gi, "%20")  // Возврат каретки (заменяем на пробел)
            .replace(/!+/gi, "%21")   // Восклицательный знак
            .replace(/\\+/gi, "%22")  // Двойная кавычка
            .replace(/#+/gi, "%23")   // Октоторп, решетка
            .replace(/\$+/gi, "%24") // Знак доллара
            .replace(/&+/gi, "%26")   // Амперсанд
            .replace(/'+/gi, "%27")   // Одиночная кавычка
            .replace(/\(+/gi, "%28") // Открывающаяся скобка
            .replace(/\)+/gi, "%29") // Закрывающаяся скобка
            .replace(/\*+/gi, "%2a") // Звездочка
            .replace(/\++/gi, "%2b") // Знак плюс
            .replace(/,+/gi, "%2c")   // Запятая
            .replace(/\.+/gi, "%2e") // Точка
            .replace(/\/+/gi, "%2f")   // Слеш, косая черта
            .replace(/:+/gi, "%3a")   // Двоеточие
            .replace(/;+/gi, "%3b")   // Точка с запятой
            .replace(/<+/gi, "%3c")   // Открывающаяся угловая скобка
            .replace(/=+/gi, "%3d")   // Знак равно
            .replace(/>+/gi, "%3e")   // Закрывающаяся угловая скобка
            .replace(/\?+/gi, "%3f") // Вопросительный знак
            .replace(/@+/gi, "%40")   // At sign, по цене, собачка
            .replace(/\[+/gi, "%5b") // Открывающаяся квадратная скобка
            .replace(/\\+/gi, "%5c") // Одиночный обратный слеш '\'
            .replace(/\]+/gi, "%5d") // Закрывающаяся квадратная скобка
            .replace(/\^+/gi, "%5e") // Циркумфлекс
            .replace(/_+/gi, "%5f")   // Нижнее подчеркивание
            .replace(/`+/gi, "%60")   // Гравис
            .replace(/{+/gi, "%7b") // Открывающаяся фигурная скобка
            .replace(/\|+/gi, "%7c") // Вертикальная черта
            .replace(/}+/gi, "%7d") // Закрывающаяся фигурная скобка
            .replace(/~+/gi, "%7e") // Тильда
            .toLowerCase();

        return `${nameUrl}`;
    };

    toTraitClass = (trait = '') => trait.replace(/\s+/, '-').toLowerCase();
}
