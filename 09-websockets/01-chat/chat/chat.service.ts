import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Message } from "./entities/message.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  find() {
    return this.messageRepository.find();
  }

  async create(body: Partial<Message>) {
    const message = new Message();
    message.username = body.username;
    message.text = body.text;
    message.date = new Date();
    return this.messageRepository.save(message);
  }
}
