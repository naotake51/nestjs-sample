import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat-dto';
import { UpdateCatDto } from './dto/update-cat-dto';
import { CatResponseDto } from './dto/cat-response-dto';
import { CatsService } from './cats.service';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/error-response';
import { plainToInstance } from 'class-transformer';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  @ApiBadRequestResponse({
    description: 'Invalid input',
    type: ErrorResponseDto,
  })
  @ApiOkResponse({ description: 'Cat created', type: CatResponseDto })
  async create(@Body() createCatDto: CreateCatDto): Promise<CatResponseDto> {
    console.log('createCatDto:', createCatDto);
    const cat = await this.catsService.create(createCatDto);

    return plainToInstance(CatResponseDto, cat, {
      excludeExtraneousValues: true,
    });
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
    const cat = await this.catsService.findOne(id);

    if (!cat) {
      throw new NotFoundException('Cat not found');
    }

    return plainToInstance(CatResponseDto, cat, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id')
  @ApiBadRequestResponse({
    description: 'Invalid ID supplied',
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
    const cat = await this.catsService.update({ id, ...updateCatDto });

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
    const cat = await this.catsService.delete(id);

    if (!cat) {
      throw new NotFoundException('Cat not found');
    }

    return plainToInstance(CatResponseDto, cat, {
      excludeExtraneousValues: true,
    });
  }
}
