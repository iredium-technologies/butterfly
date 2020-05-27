import { Class } from '~/src/types/class';

export interface EventListener {
  event: Function;
  listeners: Function[];
}

export interface ConfigInterface {
  env: object;
  routes: Function;
  databases: Function;
  userServiceClass: Class;
  useViewEngine?: boolean;
  useDefaultLogger?: boolean;
  viewEngine?: string;
  viewsPaths?: string[];
  errorView?: string;
  modules?: Function[];
  eventListenerMap?: EventListener[];
}
