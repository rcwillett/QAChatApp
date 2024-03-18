import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { SocketEvents } from './types';
import { Message, QA } from './classes';
import { QAService } from './services';
import { ElasticSearchService } from './dataServices';

export const socketHandler = async (socket: Socket, elasticSearch: ElasticSearchService) => {
    socket.on(SocketEvents.sendMessage, (message: Message, callback) => {
        socket.broadcast.emit(SocketEvents.newMessage, message);
        callback(message);
        if (message.isReplyTo) {
            saveAnswer(message);
        } else {
            getBotReply(message);
        }
    });

    const saveAnswer = async (message: Message) => {
        try {
            const qaService = new QAService(elasticSearch);
            await qaService.init();
            const qa = new QA(message.id, message.isReplyTo!.content, message.content);
            await qaService.saveQA(qa);
        } catch (error) {
            console.error(error);
        }
    };

    const getBotReply = async (message: Message) => {
        try {
            const qaService = new QAService(elasticSearch);
            await qaService.init();
            const answer = await qaService.checkForAnswer(message.content);
            if (answer) {
                const botMessage = new Message(uuidv4(), 'CHATBOT', new Date(), answer, message);
                socket.emit(SocketEvents.newMessage, botMessage);
            }
        } catch (error) {
            console.log(error);
        }
    }
}

