import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat-dto';
import { UpdateCatDto } from './dto/update-cat-dto';
import { CatResponseDto } from './dto/cat-response-dto';
import { CatsService } from './cats.service';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/error-response';
import { plainToInstance } from 'class-transformer';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto): Promise<void> {
    await this.catsService.create(createCatDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Cat found', type: [CatResponseDto] })
  async findAll(): Promise<CatResponseDto[]> {
    const cats = await this.catsService.findAll();

    return plainToInstance(CatResponseDto, cats, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  @ApiNotFoundResponse({
    description: 'Cat not found',
    type: ErrorResponseDto,
  })
  @ApiOkResponse({ description: 'Cat found', type: CatResponseDto })
  async findOne(@Param('id') id: string): Promise<CatResponseDto | null> {
    const cat = await this.catsService.findOne(id);

    if (!cat) {
      throw new NotFoundException('Cat not found');
    }

    return plainToInstance(CatResponseDto, cat, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCatDto: UpdateCatDto,
  ): Promise<void> {
    await this.catsService.update({ id, ...updateCatDto });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.catsService.delete(id);
  }
}
