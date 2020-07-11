import {Message} from "react-chat-ui";

export default class UpgradedMassage extends Message{
    constructor(data) {
        super(data);
        this.product = data.product;
        this.status = data.status;
        this.messageId = data.messageId;
        this.checked = data.checked;
        this.newMessageKey = data.newMessageKey;
    }
}
