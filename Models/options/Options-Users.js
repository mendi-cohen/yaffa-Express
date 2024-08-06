import User from '../DataBase/Data-Users.js';

class Users{

  async getUsers(){
    const result = await User.findAll();
    return result
  }


  async save(data) {
    try {
      const result = await User.create(data);
      return result;
    } catch (error) {
      console.error(error.stack);
      return error;
    }
  }
  async fineByEmail(email) {
    return await User.findOne({
      where: {
        email: email,
      },
      attributes: { exclude: ['password'] } 
    });
  }

  async findByPassword(password) {
    return await User.findOne({
      where: {
        password: password
      }
    });
  }
}

export default new Users();