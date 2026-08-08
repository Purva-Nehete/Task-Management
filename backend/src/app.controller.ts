import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class AppController {
  @Get()
  checkHealth() {
    return {
      status: 'ok',
      message: 'AbleSpace backend is running',
    };
  }
}