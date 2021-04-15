const fs = require('fs');
const path = require('path');
const bcryptjs = require('bcryptjs');
const connection = require('../../../infra/database/connection');
const { serverUrl } = require('../../../shared/config/server');

class UsersRepository {
  async createUser({ name, email, password, isCompany }) {
    const userSaved = await connection('users')
      .insert({ name, email, password, is_company: isCompany })
      .returning(['*']);

    if (!!userSaved.length) return userSaved[0];
    return null;
  }

  async updateUser(user) {
    if (user.image) {
      const { photo } = await connection('users')
        .select('photo')
        .where({ id: user.idUser })
        .first();

      if (!!photo) {
        const fileName = photo.split('/')[photo.split('/').length - 1];
        const imageToRemovePath = `${path.resolve(
          'src',
          'shared',
          'resources',
          'uploads'
        )}\\${fileName}`;

        const fileExists = fs.existsSync(imageToRemovePath);

        if (!!fileExists) {
          fs.unlink(imageToRemovePath, (error) => {
            if (error) console.log(error);
            console.log('File deleted successfully');
          });
        }
      }
    }

    const userUpdated = await connection('users')
      .where({
        id: user.idUser,
      })
      .update({
        name: user.name,
        // isCompany: user.isCompany,
        // password: user.password,
        photo: `${serverUrl}/images/${user.image}`,
      })
      .returning('*');

    if (!!userUpdated.length) return userUpdated[0];
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

  async findUserById(idUser) {
    const user = await connection('users')
      .where({
        id: idUser,
      })
      .first(['id', 'name', 'email']);
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

  async matchPassword(userData) {
    const { password } = await connection('users')
      .select('password')
      .where({ id: userData.idUser })
      .first();

    const passwordMatch = bcryptjs.compareSync(userData.oldPassword, password);

    return passwordMatch;
  }
}

module.exports = UsersRepository;
