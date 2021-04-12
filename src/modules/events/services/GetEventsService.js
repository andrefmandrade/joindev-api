const AppError = require('../../../shared/errors/AppError');

class GetEventsService {
  constructor(repository) {
    this.repository = repository;
  }

  async executeGetAll({ page, search }) {
    const getEventsResult = await this.repository.getEvents({
      page,
      search,
    });

    return getEventsResult;
  }

  async executeGet({ id, idUser }) {
    const getEventResult = await this.repository.getEvent({
      id,
      idUser,
    });

    return getEventResult;
  }
}

module.exports = GetEventsService;
