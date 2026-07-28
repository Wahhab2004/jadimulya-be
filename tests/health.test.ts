import request from 'supertest';
import { createApp } from '../src/app';

// Contoh test paling dasar — pola ini yang diikuti untuk menambah test
// modul lain (mis. tests/potensi.test.ts, tests/auth.test.ts).
describe('GET /health', () => {
  it('mengembalikan status ok', async () => {
    const app = createApp();
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
