import { App } from './app.interface';

export * from './app.interface';
export * from './create-app';

export type AppPlugin = (app: App) => void;
