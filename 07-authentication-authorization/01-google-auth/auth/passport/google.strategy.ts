import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { UsersService } from "../../users/users.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get("GOOGLE_CLIENT_ID"),
      clientSecret: configService.get("GOOGLE_CLIENT_SECRET"),
      callbackURL: "http://localhost:3000/auth/google/callback",
      scope: ["profile"],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    let user = await this.usersService.findOne(profile.id);

    if (!user) {
      const payload = {
        id: profile.id,
        displayName: profile.displayName,
        avatar: profile.photos[0].value,
      };

      user = await this.usersService.create(payload);
    }

    return user;
  }
}
