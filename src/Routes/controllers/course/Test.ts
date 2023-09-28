import { Controller, Get, Req, Res, StreamableFile, UseGuards } from "@nestjs/common";
import { join } from "path";
import * as express from "express"
import { createReadStream } from "fs";
import { TestGuardGuard } from "src/test-guard/test-guard.guard";

@Controller("/api/v1/test")
export class TestSendFile{

    @Get()
    @UseGuards( TestGuardGuard )
    sendFile( @Req() req , @Res() res ){
    }

}