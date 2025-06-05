import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { ChatService } from "./chat.service";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;

    if (!token) {
      client.disconnect(true);
      return false;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      client.data.user = payload;

      client.broadcast.emit("message", {
        username: "System",
        text: `User ${client.data.user.username} joined the chat.`,
        date: new Date(),
      });
      return true;
    } catch (error) {
      client.disconnect(true);
      return false;
    }
  }

  @SubscribeMessage("chatMessage")
  async chatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { text: string },
  ) {
    const message = await this.chatService.create({
      username: client.data.user.username,
      text: body.text,
    });

    this.server.emit("message", message);
  }
}
