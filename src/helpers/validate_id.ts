function validateID (id): boolean {
  return id.match(/^[0-9a-fA-F]{24}$/)
}

export default validateID
