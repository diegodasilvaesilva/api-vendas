export default {
  jwt: {
    secret: process.env.APP_SECRET,
    //secret: '5bfd88083b060eedb6a06bbd58130e6d',
    expiresIn: '1d'
  }
}
