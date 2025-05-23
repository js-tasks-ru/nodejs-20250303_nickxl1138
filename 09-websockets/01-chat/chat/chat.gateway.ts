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
      return client.disconnect(true);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      client.data.user = payload;

      const message = this.messageAssembly(
        "System",
        `User ${client.data.user.username} joined the chat.`,
      );

      client.broadcast.emit("message", message);
    } catch (error) {
      return client.disconnect(true);
    }
  }

  @SubscribeMessage("chatMessage")
  async chatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { text: string },
  ) {
    const message = this.messageAssembly(client.data.user.username, body.text);

    this.server.emit("message", message);
    await this.chatService.create(message);
  }

  private messageAssembly(username: string, text: string) {
    return {
      username: username,
      text: text,
      date: new Date(),
    };
  }
}
