import { Class } from '~/src/types/class';

export interface EventListener {
  event: Function;
  listeners: Function[];
}

export type ButterflyModule = (Function | (Function | object)[])[]

export interface ConfigInterface {
  routes: Function;
  databases: Function;
  userServiceClass: Class;
  useViewEngine?: boolean;
  useDefaultLogger?: boolean;
  viewEngine?: string;
  viewsPaths?: string[];
  modules?: ButterflyModule;
  eventListenerMap?: EventListener[];
}
