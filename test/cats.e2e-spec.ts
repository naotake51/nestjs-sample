import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { Prisma } from '../src/generated/prisma/client';

const CAT_BREEDS: Prisma.CatBreedCreateManyInput[] = [
  { id: 1, name: 'Tabby', description: 'Striped or patterned coat.' },
  { id: 2, name: 'Persian', description: 'Long-haired and calm.' },
  { id: 3, name: 'Munchkin', description: 'Short legs and playful.' },
] as const;

const CATS: Prisma.CatCreateManyInput[] = [
  { id: 1, name: 'Whiskers', age: 2, breedId: 1 },
  { id: 2, name: 'Fluffy', age: 5, breedId: 2 },
] as const;

describe('Cats (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.catBreed.createMany({
      data: CAT_BREEDS,
    });
    await prisma.cat.createMany({
      data: CATS,
    });
    await prisma.$executeRaw`
      SELECT setval(pg_get_serial_sequence('"Cat"', 'id'), 2, true)
    `;
  });

  afterEach(async () => {
    await prisma.cat.deleteMany();
    await prisma.catBreed.deleteMany();
  });

  it('GET /cats returns', async () => {
    const response = await request(app.getHttpServer())
      .get('/cats')
      .expect(200);

    expect(response.body).toEqual([
      {
        ...CATS[0],
        breed: CAT_BREEDS[0],
      },
      {
        ...CATS[1],
        breed: CAT_BREEDS[1],
      },
    ]);
  });

  it('GET /cats/:id returns the cat', async () => {
    const response = await request(app.getHttpServer())
      .get(`/cats/${CATS[0].id}`)
      .expect(200);

    expect(response.body).toEqual({
      ...CATS[0],
      breed: CAT_BREEDS[0],
    });
  });

  it('GET /cats/:id returns 404 when not found', async () => {
    await request(app.getHttpServer()).get('/cats/999').expect(404);
  });

  it('GET /cats/:id returns 400 for invalid id', async () => {
    await request(app.getHttpServer()).get('/cats/abc').expect(400);
  });

  it('POST /cats creates a cat', async () => {
    const createPayload = {
      name: 'Mochi',
      age: 1,
      breedId: CAT_BREEDS[2].id,
    };

    const response = await request(app.getHttpServer())
      .post('/cats')
      .send(createPayload)
      .expect(201);

    expect(response.body).toEqual({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      id: expect.any(Number),
      ...createPayload,
      breed: {
        ...CAT_BREEDS[2],
      },
    });
  });

  it('POST /cats returns 400 for invalid payload', async () => {
    const createPayload = {
      name: '',
      age: 1,
      breedId: CAT_BREEDS[2].id,
    };

    const response = await request(app.getHttpServer())
      .post('/cats')
      .send(createPayload)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: ['name must be longer than or equal to 1 characters'],
      error: 'Bad Request',
    });
  });

  it('PUT /cats/:id updates the cat', async () => {
    const updatePayload = {
      name: 'Poppy',
      age: 5,
      breedId: CAT_BREEDS[2].id,
    };

    const response = await request(app.getHttpServer())
      .put(`/cats/${CATS[0].id}`)
      .send(updatePayload)
      .expect(200);

    expect(response.body).toEqual({
      id: CATS[0].id,
      ...updatePayload,
      breed: { ...CAT_BREEDS[2] },
    });
  });

  it('PUT /cats/:id returns 404 when not found', async () => {
    await request(app.getHttpServer())
      .put('/cats/999')
      .send({
        name: 'Shadow',
        age: 6,
        breedId: CAT_BREEDS[0].id,
      })
      .expect(404);
  });

  it('PUT /cats/:id returns 400 for invalid id', async () => {
    await request(app.getHttpServer())
      .put('/cats/abc')
      .send({
        name: 'Shadow',
        age: 6,
        breedId: CAT_BREEDS[0].id,
      })
      .expect(400);
  });

  it('DELETE /cats/:id removes the cat', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/cats/${CATS[0].id}`)
      .expect(200);

    expect(response.body).toEqual({
      id: CATS[0].id,
      name: 'Whiskers',
      age: 2,
      breedId: CAT_BREEDS[0].id,
      breed: {
        ...CAT_BREEDS[0],
      },
    });

    const cat = await prisma.cat.findUnique({ where: { id: CATS[0].id } });
    expect(cat).toBeNull();
  });

  it('DELETE /cats/:id returns 404 when not found', async () => {
    await request(app.getHttpServer()).delete('/cats/999').expect(404);
  });

  it('DELETE /cats/:id returns 400 for invalid id', async () => {
    await request(app.getHttpServer()).delete('/cats/abc').expect(400);
  });
});
