const AppError = require('../../../shared/errors/AppError');

class GetColabsService {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    const getTagsColabResult = await this.repository.getTagsColab();
    return getTagsColabResult;
  }
}

module.exports = GetColabsService;
