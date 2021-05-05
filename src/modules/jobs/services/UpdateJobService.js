const AppError = require('../../../shared/errors/AppError');

class UpdateJobService {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(job) {
    const jobUpdated = await this.repository.updateJob(job);

    if (!jobUpdated) throw new AppError('Ocorreu um erro ao atualizar a vaga');

    return jobUpdated;
  }
}

module.exports = UpdateJobService;
