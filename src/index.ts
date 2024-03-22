import express, { Express } from 'express';
import httpServer from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { socketHandler } from './SocketHandler';
import { ElasticSearchService } from './dataServices';
import { LoggingService } from './services';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 80;
const validOrigins: string[] = [
  `${process.env.CLIENT_ORIGIN}`,
];

app.use(cors({
  origin: validOrigins,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));

const http =  httpServer.createServer(app);

http.listen(port, () => {
    console.log(`listening on port ${port}`);
});

const elasticSearch = new ElasticSearchService();
const loggingService = new LoggingService();

const io = new Server(http, {
    cors: {
        origin: `${process.env.CLIENT_ORIGIN}`,
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => socketHandler(socket, io, elasticSearch, loggingService));
