import jwt from 'jsonwebtoken'

function sign(id: string, name: string, password: string) {
  const payroad = {
    id: id,
    name: name
  }
  const key = password
  const token = jwt.sign(payroad, key)
  return token
}

export default {
  sign
} as const