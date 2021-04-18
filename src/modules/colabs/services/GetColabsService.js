const AppError = require('../../../shared/errors/AppError');

class GetColabsService {
  constructor(repository) {
    this.repository = repository;
  }

  async executeGetAll({ page, search, userId }) {
    const getColabsResult = await this.repository.getColabs({
      page,
      search,
      userId,
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

  async executeGetComments({ id }) {
    const getCommentsColabsResult = await this.repository.getComments({
      id,
    });

    return getCommentsColabsResult;
  }
}

module.exports = GetColabsService;
