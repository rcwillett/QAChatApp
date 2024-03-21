export class Message {
    id: string;
    senderUserId: string;
    senderUsername: string;
    sent: Date;
    content: string;
    isReplyTo?: Message;

    constructor(id: string, senderUserId: string, senderUsername: string, sent: Date, content: string, isReplyTo?: Message) {
        this.id = id;
        this.senderUserId = senderUserId;
        this.senderUsername = senderUsername;
        this.sent = sent;
        this.content = content;
        this.isReplyTo = isReplyTo;
    }
}