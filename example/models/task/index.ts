import { UserInterface as Interface } from '~/example/models/task/interface'
import { Schema } from '~/example/models/task/schema'
import mongoose = require('mongoose')

export const Task: mongoose.Model<Interface> = mongoose.model<Interface>('Task', Schema)

export interface TaskType extends mongoose.Model<Interface> {}
