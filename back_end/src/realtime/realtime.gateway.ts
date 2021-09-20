import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
   
  @WebSocketGateway()
  export class RealtimeGateway {
    @WebSocketServer()
    server: Server;

    async handleConnection(socket: Socket) {
    
    }

    @SubscribeMessage('send_message')
    listenForMessages(@MessageBody() data: string) {
      this.server.sockets.emit('receive_message', data);
    }
  }