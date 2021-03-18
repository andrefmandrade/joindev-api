const AppError = require('../../../shared/errors/AppError');

class DropTableInfoService {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    const tables = ['reset_passwords', 'users'];
    let affectedRows = [];

    for (let index = 0; index < tables.length; index++) {
      const tableName = tables[index];

      let infoDeleted = await this.repository.dropTableInfo(tableName);

      let objResponse = {
        table: tableName,
        rows: infoDeleted
      }

      affectedRows.push(objResponse);
    }

    return affectedRows;
  }
}

module.exports = DropTableInfoService;
