const { checkDefaultBody } = require('../user');
const { app } = require('../index');
const request = require('supertest');

describe('api endpoints', () => {
  it("should return 200 for correct credentials", async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: "test@example.com",
        password: "password123"
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true,
      token: "JWT_TOKEN"
    });
  });

  it("should return 400 for invalid credentials", async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: "notUser@example.com",
        password: "secPass12"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Invalid credentials" });
  });

  it("should return 400 for missing credentials", async () => {
    const response = await request(app)
      .post('/login')
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  it("should enforce rate limiting after 5 attempts", async () => {
    // Make 5 failed attempts
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/login')
        .send({
          email: "test@example.com",
          password: "wrongPassword"
        });
    }

    // 6th attempt should be rate limited
    const response = await request(app)
      .post('/login')
      .send({
        email: "test@example.com",
        password: "password123" // correct password
      });

    expect(response.statusCode).toBe(429);
    expect(response.body).toEqual({
      error: "Too many login attempts. Try again later."
    });
  });
});