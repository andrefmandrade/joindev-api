const AppError = require('../../../shared/errors/AppError');

class GetColabService {
  constructor(repository) {
    this.repository = repository;
  }

  async execute({ page, search }) {
    const getColabResult = await this.repository.getColab({
      page,
      search,
    });

    return getColabResult;
  }
}

module.exports = GetColabService;
