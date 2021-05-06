const AppError = require('../../../shared/errors/AppError');

class GetTagsColabsService {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    const getTagsColabResult = await this.repository.getTagsColab();
    return getTagsColabResult;
  }

  async executeTag(id_colab) {
    const getTagColabResult = await this.repository.getTagColab(id_colab);
    return getTagColabResult;
  }
}

module.exports = GetTagsColabsService;
