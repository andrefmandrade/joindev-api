const AppError = require('../../../shared/errors/AppError');

class DeleteJobService {
  constructor(repository) {
    this.repository = repository;
  }

  async execute({ id, idUser }) {
    const deleteJobResult = await this.repository.deleteJob({
      id,
      idUser,
    });

    return deleteJobResult.job;
  }
}

module.exports = DeleteJobService;
