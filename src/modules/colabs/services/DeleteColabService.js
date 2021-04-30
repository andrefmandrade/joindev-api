const AppError = require('../../../shared/errors/AppError');

class DeleteColabService {
  constructor(repository) {
    this.repository = repository;
  }

  async execute({ id, idUser, table }) {
    const deleteColabResult = await this.repository.deleteColabOrComments({
      id,
      idUser,
      table,
    });

    return deleteColabResult;
  }
}

module.exports = DeleteColabService;
