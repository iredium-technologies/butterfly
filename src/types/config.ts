import { Class } from '~/src/types/class';

export interface EventListener {
  event: Function;
  listeners: Function[];
}

export interface ConfigInterface {
  routes: Function;
  databases: Function;
  userServiceClass: Class;
  useViewEngine?: boolean;
  viewEngine?: string;
  viewsPaths?: string[];
<<<<<<< Updated upstream
=======
  modules?: Function[];
  eventListenerMap?: EventListener[];
>>>>>>> Stashed changes
}
