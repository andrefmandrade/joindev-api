const connection = require('../../../infra/database/connection');

class UsersRepository {
  async createUser(user) {
    const userSaved = await connection('users').insert(user).returning(['*']);

    if (!!userSaved.length) return userSaved[0];
    return null;
  }

  async findUserByEmail(email) {
    const user = await connection('users')
      .where({
        email,
      })
      .first();
    return user;
  }

  async activateUser(email) {
    const activateUser = await connection('users')
      .where({
        email
      })
      .update({
        confirmated_at: new Date()
      },
        ['email', 'confirmated_at']
      );

    return activateUser;
  }
}

module.exports = UsersRepository;
