import { Class } from '~/src/types/class';

export interface ConfigInterface {
  routes: Function;
  databases: Function;
  userServiceClass: Class;
  useViewEngine?: boolean;
  viewEngine?: string;
  viewsPaths?: string[];
}
