import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller("chat")
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get("history")
  getChatHistory() {
    return this.chatService.find();
  }
}
