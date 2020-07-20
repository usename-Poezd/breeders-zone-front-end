import {Message} from "react-chat-ui";

export default class UpgradedMassage{
    constructor(data) {
        this.id = data.id;
        this.message = data.message;
        this.senderName = data.senderName || undefined;
        this.product = data.product;
        this.status = data.status;
        this.messageId = data.messageId;
        this.checked = data.checked;
        this.newMessageKey = data.newMessageKey;
    }
}
