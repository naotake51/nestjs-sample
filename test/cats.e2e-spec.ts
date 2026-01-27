import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Cats (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.cat.createMany({
      data: [
        { id: 1, name: 'Whiskers', age: 2, breed: 'Tabby' },
        { id: 2, name: 'Fluffy', age: 5, breed: 'Persian' },
      ],
    });
  });

  afterEach(async () => {
    await prisma.cat.deleteMany();
  });

  it('GET /cats returns', async () => {
    const response = await request(app.getHttpServer())
      .get('/cats')
      .expect(200);

    expect(response.body).toEqual([
      { id: 1, name: 'Whiskers', age: 2, breed: 'Tabby' },
      { id: 2, name: 'Fluffy', age: 5, breed: 'Persian' },
    ]);
  });

  it('GET /cats/:id returns the cat', async () => {
    const response = await request(app.getHttpServer())
      .get(`/cats/1`)
      .expect(200);

    expect(response.body).toEqual({
      id: 1,
      name: 'Whiskers',
      age: 2,
      breed: 'Tabby',
    });
  });

  it('GET /cats/:id returns 404 when not found', async () => {
    await request(app.getHttpServer()).get('/cats/999').expect(404);
  });

  it('GET /cats/:id returns 400 for invalid id', async () => {
    await request(app.getHttpServer()).get('/cats/abc').expect(400);
  });

  it('POST /cats creates a cat', async () => {
    const payload = {
      name: 'Mochi',
      age: 1,
      breed: 'Munchkin',
    };

    const response = await request(app.getHttpServer())
      .post('/cats')
      .send(payload)
      .expect(201);

    expect(response.body).toEqual({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      id: expect.any(Number),
      ...payload,
    });
  });

  it('PUT /cats/:id updates the cat', async () => {
    const updatePayload = {
      name: 'Poppy',
      age: 5,
      breed: 'Siberian',
    };

    const response = await request(app.getHttpServer())
      .put(`/cats/1`)
      .send(updatePayload)
      .expect(200);

    expect(response.body).toEqual({
      id: 1,
      ...updatePayload,
    });
  });

  it('PUT /cats/:id returns 404 when not found', async () => {
    await request(app.getHttpServer())
      .put('/cats/999')
      .send({
        name: 'Shadow',
        age: 6,
        breed: 'Bombay',
      })
      .expect(404);
  });

  it('PUT /cats/:id returns 400 for invalid id', async () => {
    await request(app.getHttpServer())
      .put('/cats/abc')
      .send({
        name: 'Shadow',
        age: 6,
        breed: 'Bombay',
      })
      .expect(400);
  });

  it('DELETE /cats/:id removes the cat', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/cats/1`)
      .expect(200);

    expect(response.body).toEqual({
      id: 1,
      name: 'Whiskers',
      age: 2,
      breed: 'Tabby',
    });

    const cat = await prisma.cat.findUnique({ where: { id: 1 } });
    expect(cat).toBeNull();
  });

  it('DELETE /cats/:id returns 404 when not found', async () => {
    await request(app.getHttpServer()).delete('/cats/999').expect(404);
  });

  it('DELETE /cats/:id returns 400 for invalid id', async () => {
    await request(app.getHttpServer()).delete('/cats/abc').expect(400);
  });
});
