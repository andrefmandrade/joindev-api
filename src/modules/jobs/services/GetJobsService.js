const AppError = require('../../../shared/errors/AppError');

class GetJobsService {
  constructor(repository) {
    this.repository = repository;
  }

  async executeGetAll({ page, search, userId }) {
    const getJobsResult = await this.repository.getJobs({
      page,
      search,
      userId,
    });

    return getJobsResult;
  }

  async executeGet({ id, idUser }) {
    const getJobResult = await this.repository.getJob({
      id,
      idUser,
    });

    return getJobResult;
  }
}

module.exports = GetJobsService;
