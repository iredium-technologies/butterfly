import { BaseModelInterface } from '~/src/models/base_model_interface'
import mongoose = require('mongoose')

export interface UserInterface extends BaseModelInterface {
  user: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  complete: boolean;
}
