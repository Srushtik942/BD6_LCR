const user = {
    "email": "test@example.com",
    "password": "password123"
  }

  async function checkDefaultBody(newBody) {
   if(newBody.email === user.email && newBody.password === user.password){
    return "LoggedIn Successfully!"
   }
  }

  module.exports = {checkDefaultBody}