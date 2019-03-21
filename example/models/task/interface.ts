import { BaseModelInterface } from '~/src/models/base_model_interface'

export interface UserInterface extends BaseModelInterface {
  title: string;
  description: string;
  complete: boolean;
}
