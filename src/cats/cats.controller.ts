import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat-dto';
import { UpdateCatDto } from './dto/update-cat-dto';
import { CatResponseDto } from './dto/cat-response-dto';
import { CatBreedOptionResponseDto } from './dto/cat-breed-option-response-dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/error-response';
import { plainToInstance } from 'class-transformer';
import { CreateCatUsecase } from './usecases/create-cat.usecase';
import { UpdateCatUsecase } from './usecases/update-cat.usecase';
import { DeleteCatUsecase } from './usecases/delete-cat.usecase';
import { FindAllCatsUsecase } from './usecases/find-all-cats.usecase';
import { FindCatUsecase } from './usecases/find-cat.usecase';
import { FindBreedOptionsForCreateUsecase } from './usecases/find-breed-options-for-create.usecase';
import { FindBreedOptionsForUpdateUsecase } from './usecases/find-breed-options-for-update.usecase';

@Controller('cats')
export class CatsController {
  constructor(
    private createCatUsecase: CreateCatUsecase,
    private updateCatUsecase: UpdateCatUsecase,
    private deleteCatUsecase: DeleteCatUsecase,
    private findAllCatsUsecase: FindAllCatsUsecase,
    private findCatUsecase: FindCatUsecase,
    private findBreedOptionsForCreateUsecase: FindBreedOptionsForCreateUsecase,
    private findBreedOptionsForUpdateUsecase: FindBreedOptionsForUpdateUsecase,
  ) {}

  @Get()
  @ApiOkResponse({ description: 'Cat found', type: [CatResponseDto] })
  async findAll(): Promise<CatResponseDto[]> {
    const cats = await this.findAllCatsUsecase.execute();

    return plainToInstance(CatResponseDto, cats, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  @ApiBadRequestResponse({
    description: 'Invalid ID supplied',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Cat not found',
    type: ErrorResponseDto,
  })
  @ApiOkResponse({ description: 'Cat found', type: CatResponseDto })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CatResponseDto | null> {
    const cat = await this.findCatUsecase.execute(id);

    if (!cat) {
      throw new NotFoundException('Cat not found');
    }

    return plainToInstance(CatResponseDto, cat, {
      excludeExtraneousValues: true,
    });
  }

  @Post()
  @ApiBadRequestResponse({
    description: 'Invalid input',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid breed selection',
    type: ErrorResponseDto,
  })
  @ApiOkResponse({ description: 'Cat created', type: CatResponseDto })
  async create(@Body() createCatDto: CreateCatDto): Promise<CatResponseDto> {
    const cat = await this.createCatUsecase.execute(createCatDto);

    return plainToInstance(CatResponseDto, cat, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id')
  @ApiBadRequestResponse({
    description: 'Invalid ID supplied',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid breed selection',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Cat not found',
    type: ErrorResponseDto,
  })
  @ApiOkResponse({ description: 'Cat updated', type: CatResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCatDto: UpdateCatDto,
  ): Promise<CatResponseDto> {
    const cat = await this.updateCatUsecase.execute({ id, ...updateCatDto });

    if (!cat) {
      throw new NotFoundException('Cat not found');
    }

    return plainToInstance(CatResponseDto, cat, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @ApiBadRequestResponse({
    description: 'Invalid ID supplied',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Cat not found',
    type: ErrorResponseDto,
  })
  @ApiOkResponse({ description: 'Cat deleted', type: CatResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<CatResponseDto> {
    const cat = await this.deleteCatUsecase.execute(id);

    if (!cat) {
      throw new NotFoundException('Cat not found');
    }

    return plainToInstance(CatResponseDto, cat, {
      excludeExtraneousValues: true,
    });
  }

  @Get('breed-options')
  @ApiOkResponse({
    description: 'Cat breed options for create',
    type: [CatBreedOptionResponseDto],
  })
  async findCreateBreedOptions(): Promise<CatBreedOptionResponseDto[]> {
    const breeds = await this.findBreedOptionsForCreateUsecase.execute();

    return plainToInstance(CatBreedOptionResponseDto, breeds, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id/breed-options')
  @ApiBadRequestResponse({
    description: 'Invalid ID supplied',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Cat not found',
    type: ErrorResponseDto,
  })
  @ApiOkResponse({
    description: 'Cat breed options for update',
    type: [CatBreedOptionResponseDto],
  })
  async findUpdateBreedOptions(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CatBreedOptionResponseDto[]> {
    const breeds = await this.findBreedOptionsForUpdateUsecase.execute(id);

    return plainToInstance(CatBreedOptionResponseDto, breeds, {
      excludeExtraneousValues: true,
    });
  }
}
