const connection = require('../../../infra/database/connection');

class AdminRepository {
  async dropTableInfo(tableName) {
    const infoDeleted = await connection(tableName).del();

    return infoDeleted;
  }
}

module.exports = AdminRepository;
