import { registerAs } from "@nestjs/config";

export default registerAs("customConfig", () => ({
  senderEmail: "test@gggmail.com",
  smsGateway: "txt.ggg.net",
}));
