import mongoose = require('mongoose')
import { BaseModelInterface } from '~/src/models/base_model_interface'

export interface UserInterface extends BaseModelInterface {
  user: mongoose.Schema.Types.Buffer;
  title: string;
  description: string;
  complete: boolean;
}
