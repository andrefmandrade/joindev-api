const AppError = require('../../../shared/errors/AppError');
class CreateJobService {
  constructor(repository, userRepository) {
    this.repository = repository;
    this.userRepository = userRepository;
  }

  async execute({ title, company, city, contact, details, idUser }) {
    const jobCreated = await this.repository.createJob({
      title,
      company,
      city,
      contact,
      details,
      idUser,
    });

    const user = await this.userRepository.findUserById(idUser);
    jobCreated.user = user;

    if (!jobCreated)
      throw new AppError('Ocorreu um erro ao criar uma nova vaga');

    return jobCreated;
  }
}

module.exports = CreateJobService;
