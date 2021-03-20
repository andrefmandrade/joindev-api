const AppError = require('../../../shared/errors/AppError');

class GetColabService {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    const getTagsColabResult = await this.repository.getTagsColab();
    return getTagsColabResult;
  }
}

module.exports = GetColabService;
