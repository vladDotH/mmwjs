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
  test('Get primitive', async () => {
    const response = await supertest(host).get('/test/primitive').set('Accept', 'application/json')
    expect(response.status).toEqual(200)
    expect(response.text).toEqual(initialControllerMessage.message)
  });

});

describe('Controller POST', () => {
  test('Post primitive', async () => {
    const message = "test"
    const response = await supertest(host).post('/test').send(message)
    expect(response.status).toEqual(200)
    expect(response.body.message).toEqual({message})
  });
})

describe('Controller PUT', () => {
  test('Post primitive', async () => {
    const message = "test"
    const response = await supertest(host).put('/test').send(message)
    expect(response.status).toEqual(200)
    expect(response.body.message).toEqual({message})
  });
})


describe('Controller HEAD ', () => {
  test('Post primitive', async () => {
    const message = "test"
    const response = await supertest(host).post('/test').send(message)
    expect(response.status).toEqual(200)
    expect(response.body.message).toEqual({message})
  });
})



describe('Controller DELETE', () => {
  test('Post primitive', async () => {
    const message = "test"
    const response = await supertest(host).post('/test').send(message)
    expect(response.status).toEqual(200)
    expect(response.body.message).toEqual({message})
  });
})

describe('Controller PATCH', () => {
  test('Post primitive', async () => {
    const message = "test"
    const response = await supertest(host).post('/test').send(message)
    expect(response.status).toEqual(200)
    expect(response.body.message).toEqual({message})
  });


})