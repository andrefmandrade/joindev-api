const AppError = require('../../../shared/errors/AppError');

class CreateColabService {
  constructor(repository) {
    this.repository = repository;
  }

  async execute({ title, text, tags, idUser }) {
    const colabCreated = await this.repository.createColab({
      title,
      text,
      tags,
      idUser,
    });

    if (!colabCreated)
      throw new AppError('Ocorreu um erro ao criar uma nova colab');

    return colabCreated;
  }
}

module.exports = CreateColabService;
