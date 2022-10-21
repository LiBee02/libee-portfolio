const bcrypt = require('bcrypt')
let saltRounds = 10

const myPlaintextPassword = "abc123"

const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds)


console.log(hash)