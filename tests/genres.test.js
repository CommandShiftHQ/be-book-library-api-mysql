/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const { Genre } = require('../src/models');
const app = require('../src/app');

describe('/genres', () => {
  afterEach(async () => {
    await Genre.destroy({ where: {} });
  });

  describe('with no records in the database', () => {
    describe('POST /genres', () => {
      it('creates a new genre in the database', async () => {
        const response = await request(app).post('/genres').send({
          genre: 'Science Fiction',
        });
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.genre).to.equal('Science Fiction');
        expect(newGenreRecord.genre).to.equal('Science Fiction');
      });

      it('cannot create a genre if there is no genre', async () => {
        const response = await request(app).post('/genres').send({});
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(newGenreRecord).to.equal(null);
      });

      it('cannot create a genre if it is not unique', async () => {
        const response1 = await request(app)
          .post('/genres')
          .send({ genre: 'Sci fi' });

        const response2 = await request(app)
          .post('/genres')
          .send({ genre: 'Sci fi' });

        const newGenreRecordOnFirstCall = await Genre.findByPk(
          response1.body.id,
          {
            raw: true,
          }
        );

        const newGenreRecordOnSecondCall = await Genre.findByPk(
          response2.body.id,
          {
            raw: true,
          }
        );

        expect(response1.status).to.equal(201);
        expect(response2.status).to.equal(400);

        expect(response1.body.errors).to.equal(undefined);
        expect(response2.body.errors.length).to.equal(1);

        expect(newGenreRecordOnFirstCall.genre).to.equal('Sci fi');
        expect(newGenreRecordOnSecondCall).to.equal(null);
      });
    });
  });

  describe('with records in the database', () => {
    let genres;

    beforeEach(async () => {
      await Genre.destroy({ where: {} });

      genres = await Promise.all([
        Genre.create({
          genre: 'Science Fiction',
        }),
        Genre.create({
          genre: 'Dystopian',
        }),
        Genre.create({ genre: 'Fantasy' }),
      ]);
    });

    describe('GET /genres', () => {
      it('gets all genre records', async () => {
        const response = await request(app).get('/genres');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((genre) => {
          const expected = genres.find((a) => a.id === genre.id);

          expect(genre.genre).to.equal(expected.genre);
        });
      });
    });

    describe('GET /genres/:id', () => {
      it('gets genres record by id', async () => {
        const genre = genres[0];
        const response = await request(app).get(`/genres/${genre.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.genre).to.equal(genre.genre);
      });

      it('returns a 404 if the genre does not exist', async () => {
        const response = await request(app).get('/genres/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });

    describe('PATCH /genres/:id', () => {
      it('updates genres details by id', async () => {
        const genre = genres[0];
        const response = await request(app)
          .patch(`/genres/${genre.id}`)
          .send({ genre: 'Sci-Fi' });
        const updatedGenreRecord = await Genre.findByPk(genre.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedGenreRecord.genre).to.equal('Sci-Fi');
      });

      it('returns a 404 if the genre does not exist', async () => {
        const response = await request(app)
          .patch('/genres/12345')
          .send({ genre: 'Romance' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });

    describe('DELETE /genres/:id', () => {
      it('deletes a genre record by id', async () => {
        const genre = genres[0];
        const response = await request(app).delete(`/genres/${genre.id}`);
        const deletedGenre = await Genre.findByPk(genre.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedGenre).to.equal(null);
      });

      it('returns a 404 if the genre does not exist', async () => {
        const response = await request(app).delete('/genres/12345');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });
  });
});
