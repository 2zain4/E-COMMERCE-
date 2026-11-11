import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Request, Response } from 'express';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(@Res() res: Response) {
    const message = this.appService.getHello();
    res.status(200).json({ message: 'done', data: message });
  }

  @Get('/users')
  getAllUsers() {
    return 'Get all users API';
  }

  @Post('addUser')
  addUser(@Body() data: any) {
    console.log(data);
    return 'Add user API';
  }
}
