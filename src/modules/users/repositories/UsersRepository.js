const connection = require('../../../infra/database/connection');

class UsersRepository {
  async createUser({ name, email, password, isCompany }) {
    const userSaved = await connection('users')
      .insert({ name, email, password, is_company: isCompany })
      .returning(['*']);

    if (!!userSaved.length) return userSaved[0];
    return null;
  }

  async updateUser(user) {
    const userId = user.id;
    delete user.id;

    const updated = await connection('users')
      .where({
        id: userId,
      })
      .update(user)
      .returning('*');

    if (!!updated.length) return updated[0];
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
        email,
      })
      .update(
        {
          confirmated_at: new Date(),
        },
        ['email']
      );

    if (!!activateUser.length) return activateUser[0];
    return null;
  }
}

module.exports = UsersRepository;
