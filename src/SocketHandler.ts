import { Socket } from 'socket.io';
import { SocketEvents } from './types';
import { Message } from './classes';

interface IUserTypingBody {
    tempUserId: string;
    isTyping: boolean;
}

export const socketHandler = (socket: Socket) => {
    socket.on(SocketEvents.sendMessage, (message: Message) => {
        socket.broadcast.emit(SocketEvents.newMessage, message);
    });

    socket.on(SocketEvents.sendTyping, ({ isTyping }: IUserTypingBody) => {
        socket.broadcast.emit(SocketEvents.typing, isTyping);
    });
}
