import { BadRequestException, Injectable } from "@nestjs/common";
import { appendFile } from "fs";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class NotificationsService {
  constructor(private configService: ConfigService) {
    const newSenderEmail = this.configService.get("customConfig.senderEmail");
    const newSMSGateway = this.configService.get("customConfig.smsGateway");

    console.log(newSenderEmail, newSMSGateway);
  }

  sendEmail(to: string, subject: string, message: string): void {
    if (!to || !subject || !message) {
      throw new BadRequestException(
        "Отсутствуют данные для отправки Email-уведомления",
      );
    }

    const sentEmailLog = `Email sent to ${to}: [${subject}] ${message}`;

    this.sentLogToFile(sentEmailLog);

    return console.log(sentEmailLog);
  }

  sendSMS(to: string, message: string): void {
    if (!to || !message) {
      throw new BadRequestException(
        "Отсутствуют данные для отправки SMS-уведомления",
      );
    }

    const sentSMSLog = `SMS sent to ${to}: ${message}`;

    this.sentLogToFile(sentSMSLog);

    return console.log(sentSMSLog);
  }

  sentLogToFile(log: string) {
    return appendFile("file-log.txt", log + `\n`, () => {});
  }
}
