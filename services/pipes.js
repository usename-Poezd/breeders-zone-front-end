export default class Pipes {
    transformCb = (cb) => {
        const year = cb.split(/-+/)[0];
        return year.replace(/\d{2}/, '');
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
        const nameUrl = name.replace(/\s+/gi, '-').toLowerCase();

        return `${nameUrl}`;
    };

    toTraitClass = (trait = '') => trait.replace(/\s+/, '-').toLowerCase();
}
