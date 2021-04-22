const AppError = require('../../../shared/errors/AppError');

class DeleteEventsService {
  constructor(repository) {
    this.repository = repository;
  }

  async execute({ id, idUser }) {
    const deleteEventResult = await this.repository.deleteEvent({
      id,
      idUser,
    });

    return deleteEventResult.event;
  }
}

module.exports = DeleteEventsService;
