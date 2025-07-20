import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) { }

  @Get('all-tables')
  async testPrisma() {
    const users = await this.prisma.user.findMany();
    const userInfo = await this.prisma.userInfo.findMany();
    return { message: 'Prisma is working', users, userInfo };
  }

  @Get()
  getRoot(): string {
    return 'Root path working!';
  }
}
