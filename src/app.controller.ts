import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root(): object {
    return {
      status: 'ok',
      message: 'DermoQore API is running successfully 🚀',
      version: '1.0.0',
    };
  }
}
