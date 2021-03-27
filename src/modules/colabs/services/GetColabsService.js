const AppError = require('../../../shared/errors/AppError');

class GetColabsService {
  constructor(repository) {
    this.repository = repository;
  }

  async executeGetAll({ page, search }) {
    const getColabsResult = await this.repository.getColabs({
      page,
      search,
    });

    return getColabsResult;
  }

  async executeGet({ id, idUser }) {
    const getColabResult = await this.repository.getColab({
      id,
      idUser,
    });

    return getColabResult;
  }
}

module.exports = GetColabsService;
