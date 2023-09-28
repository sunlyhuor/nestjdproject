import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from "express"
import { join } from 'path';
import { CheckToken } from './JWT/jwt';
import * as cors from "cors"
import * as cookie_parser from "cookie-parser"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use( cors({
      origin:[ 
        "*"
    ],
      credentials:true
    }
  ) )

  app.use( cookie_parser() )
  app.use( express.urlencoded({ extended:false }) ) 
  app.use( express.json() )
  app.use("/api/v1/profile/" , express.static( join("src" , "pictures" , "profiles/") ) )
  app.use("/api/v1/medias/" , express.static( join("src" , "pictures" , "medias/") ) )
  app.use("/api/v1/videos/", express.static( join("src" , "pictures" , "videos/") ) )
  app.use("/api/v1/thumbnails/" , express.static( join("src" , "pictures" , "thumbnails/") ) )
  await app.listen(3030)
}
bootstrap();
