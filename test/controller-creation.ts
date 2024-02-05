import { createApp } from "../src/app";
import { Controller, createController } from "../src/controller";
import {beforeAll} from "bun:test"
import { useBody } from "../src/middlewares";
export const app = createApp();


export const port = 3000
export const host = `http://localhost:${port}`
export let testController: Controller;
export const initialControllerMessage = {message: "Controller exists"}


app.listen(3000);

beforeAll(() => {
  testController = createController('/test')
  testController.get('/primitive').go((state) => {
    return initialControllerMessage.message
  })
  testController.get('/').go(() => {
    return initialControllerMessage
  })
  testController.post('/' ).use(useBody()).go((state) => {
    console.log("body", state.body)
    return {message: state.body}
  })
  app.useControllers([testController]);
})



