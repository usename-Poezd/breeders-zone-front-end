import moment from "moment";

function parseDate(str: string, format:string, locale:string):  Date|void {
    const parsed = moment(str, format);
    console.log(parsed.toString());
    if (parsed.isValid()) {
        return parsed.toDate();
    }
    return undefined;
}

function formatDate(date: Date, format: string, locale:string): string {
    return moment(date).format(format).toString();
}

export {
    parseDate,
    formatDate
}
