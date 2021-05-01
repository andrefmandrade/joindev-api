const AppError = require('../../../shared/errors/AppError');

class UpdateEventService {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(event) {
    const eventUpdated = await this.repository.updateEvent(event);

    if (!eventUpdated)
      throw new AppError('Ocorreu um erro ao atualizar o usuário');

    return eventUpdated;
  }
}

module.exports = UpdateEventService;
