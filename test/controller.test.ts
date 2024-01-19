import { expect, test, describe } from 'bun:test';
import {
  app, host,
  initialControllerMessage,
  testController
} from "./controller-creation.ts";
import supertest from "supertest"



describe('Controller GET', () => {
  test('Get object', async () => {
    const response = await supertest(host).get('/test')
    expect(response.status).toEqual(200)
    expect(response.body.message).toEqual(initialControllerMessage.message)
  });
  test('Get string', async () => {
    const response = await supertest(host).get('/test/string').set('Accept', 'application/json')
    expect(response.status).toEqual(200)
    expect(response.text).toEqual(initialControllerMessage.message)
  });

});

describe('Controller POST', () => {
  test('Controller POST', async () => {
    const response = await supertest(host).post('/test')
    expect(response.status).toEqual(200)
    expect(response.body.message).toEqual(initialControllerMessage.message)
  });
})
