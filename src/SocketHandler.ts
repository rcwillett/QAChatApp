import { Socket } from 'socket.io';
import { SocketEvents } from './types';
import { Message } from './classes';

export const socketHandler = (socket: Socket) => {
    socket.on(SocketEvents.sendMessage, (message: Message, callback) => {
        socket.broadcast.emit(SocketEvents.newMessage, message);
        callback(message);
    });
}
