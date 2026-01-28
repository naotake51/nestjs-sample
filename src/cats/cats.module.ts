import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BreedSelectionRule } from './breed-selection.rule';
import { CreateCatUsecase } from './usecases/create-cat.usecase';
import { UpdateCatUsecase } from './usecases/update-cat.usecase';
import { DeleteCatUsecase } from './usecases/delete-cat.usecase';
import { FindAllCatsUsecase } from './usecases/find-all-cats.usecase';
import { FindCatUsecase } from './usecases/find-cat.usecase';
import { FindBreedOptionsForCreateUsecase } from './usecases/find-breed-options-for-create.usecase';
import { FindBreedOptionsForUpdateUsecase } from './usecases/find-breed-options-for-update.usecase';

@Module({
  imports: [PrismaModule],
  controllers: [CatsController],
  providers: [
    BreedSelectionRule,
    CreateCatUsecase,
    UpdateCatUsecase,
    DeleteCatUsecase,
    FindAllCatsUsecase,
    FindCatUsecase,
    FindBreedOptionsForCreateUsecase,
    FindBreedOptionsForUpdateUsecase,
  ],
})
export class CatsModule {}
