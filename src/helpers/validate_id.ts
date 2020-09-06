import { validate } from 'uuid'

function validateID (id): boolean {
  return validate(id)
}

export default validateID
