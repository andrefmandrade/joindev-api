const connection = require('../../../infra/database/connection');

class ResetPasswordRepository {
  async expireRequest(idRequest) {
    await connection('reset_passwords')
      .where({
        id: idRequest,
      })
      .update({
        expired: true,
      });
  }

  async getActiveResetRequest({ resetToken, userToken }) {
    const requestReset = await connection('reset_passwords')
      .where({
        reset_token: resetToken,
        user_token: userToken,
        expired: false,
      })
      .column([
        'id',
        'reset_token as resetToken',
        'user_token as userToken',
        'created_at as createdAt',
      ])
      .select()
      .first();
    return requestReset;
  }

  async createResetPassword({ resetToken, userToken, userId }) {
    const created = await connection('reset_passwords')
      .insert({
        reset_token: resetToken,
        user_token: userToken,
        id_user: userId,
      })
      .returning(['id']);

    if (!!created.length)
      return {
        id: created[0].id,
        resetToken,
        userToken,
      };

    return null;
  }
}

module.exports = ResetPasswordRepository;
