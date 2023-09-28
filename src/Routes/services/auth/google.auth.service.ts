import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleAuthService extends PassportStrategy(Strategy, 'google') {

    constructor() {
        super({
          clientID: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRETE,
          callbackURL: process.env.CLIENT_CALLBACKEND,
          scope: ['email', 'profile' ],
        });
      }
    
      async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
        // You can perform additional validation or data processing here.
        // The "profile" object contains user information fetched from Google.
        // Call the "done" callback with the validated user object.
        const user = {
            code:profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            picture: profile.photos[0].value
          // Additional properties as needed
        };
        console.log( profile )
        done(null, user);
      }

}