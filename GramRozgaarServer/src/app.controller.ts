import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) { }

  @Get('test-prisma')
  async testPrisma() {
    const users = await this.prisma.user.findMany();
    console.log('✅ Users:', users);
    return { message: 'Prisma is working', users };
  }

  @Get()
  getRoot(): string {
    return 'Root path working!';
  }
}
