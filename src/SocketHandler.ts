import { Socket, Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { SocketEvents } from './types';
import { Message, QA } from './classes';
import { LoggingService, QAService } from './services';
import { ElasticSearchService, OpenAIService } from './dataServices';
import { CHATBOT_NAME } from './constants';

export const socketHandler = async (socket: Socket, io: Server, elasticSearch: ElasticSearchService, loggingService: LoggingService) => {
    socket.on(SocketEvents.sendMessage, async (message: Message, callback) => {
        socket.broadcast.emit(SocketEvents.newMessage, message);
        callback(message);
        try {
            const openAIService = new OpenAIService();
            const questionEmbedding = await openAIService.getEmbedding(message.content);
            if (message.isReplyTo) {
                await saveAnswer(message, questionEmbedding);
            } else {
                await getBotReply(message, questionEmbedding);
            }
        }
        catch (error) {
            console.error(error);
        }
    });

    const saveAnswer = async (message: Message, questionEmbedding: number[]) => {
        const qaService = new QAService(elasticSearch);
        await qaService.init();
        const qa = new QA(message.isReplyTo!.content, message.content, questionEmbedding);
        await qaService.saveQA(qa);
    };

    const getBotReply = async (message: Message, questionEmbedding: number[]) => {
        const qaService = new QAService(elasticSearch);
        await qaService.init();
        const answer = await qaService.checkForAnswer(questionEmbedding);
        if (answer) {
            const botMessage = new Message(uuidv4(), 'CHATBOT', CHATBOT_NAME, new Date(), answer, message);
            io.emit(SocketEvents.newMessage, botMessage);
        }
    }
}

