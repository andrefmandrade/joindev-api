const AppError = require('../../../shared/errors/AppError');

class UpdateColabService {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(colab) {
    const colabUpdated = await this.repository.updateColab(colab);

    if (!colabUpdated)
      throw new AppError('Ocorreu um erro ao atualizar a colab');

    return colabUpdated;
  }

  async executeTag(tag) {
    const createTagResult = await this.repository.createTagColab(tag);

    return createTagResult;
  }
}

module.exports = UpdateColabService;
