import request from 'supertest';
import express from 'express';
import pacientRoutes from '../../src/routes/pacient.router.mjs';

jest.mock('../../src/controllers/pacient.controller.mjs', () => {
  return jest.fn().mockImplementation(() => {
    return {
      store: jest.fn((req, res) => {
        const pacient = req.body;
        const isValid = pacient.fullName && pacient.fullName.length > 0 && 
                        new Date(pacient.birthDate) >= new Date('1875-01-01') &&
                        new Date(pacient.birthDate) <= new Date();
        
        if (!isValid) {
          return res.status(400).send({ message: 'Validation error' });
        }
        return res.status(201).send({ id: 1, ...req.body });
      }),
    };
  });
});

const app = express();
app.use(express.json());
app.use(pacientRoutes);

describe('Pacient Routes', () => {
  it('should create a new pacient', async () => {
    const response = await request(app)
      .post('/api/pacient')
      .send({ fullName: 'Fulano de Tal', birthDate: '1994-06-16' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.fullName).toBe('Fulano de Tal');
    expect(response.body.birthDate).toBe('1994-06-16');
  });

  it('should return validation error for invalid data', async () => {
    const response = await request(app)
      .post('/api/pacient')
      .send({ fullName: '', birthDate: '' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation error');
  });

  it('should return validation error for invalid date', async () => {
    const response = await request(app)
      .post('/api/pacient')
      .send({ fullName: 'Fulano de Tal', birthDate: '1800-06-16' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation error');
  });

  it('should return validation error for invalid name', async () => {
    const response = await request(app)
      .post('/api/pacient')
      .send({ fullName: '', birthDate: '1994-06-16' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation error');
  });
});