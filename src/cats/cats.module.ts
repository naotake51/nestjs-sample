import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { PrismaModule } from '../prisma/prisma.module';
import { BreedSelectionRule } from './breed-selection.rule';

@Module({
  imports: [PrismaModule],
  controllers: [CatsController],
  providers: [CatsService, BreedSelectionRule],
})
export class CatsModule {}
