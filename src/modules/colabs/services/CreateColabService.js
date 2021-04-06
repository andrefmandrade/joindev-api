const AppError = require('../../../shared/errors/AppError');
class CreateColabService {
  constructor(repository, userRepository) {
    this.repository = repository;
    this.userRepository = userRepository;
  }

  async execute({ title, text, tags, idUser }) {
    const colabCreated = await this.repository.createColab({
      title,
      text,
      tags,
      idUser,
    });

    const user = await this.userRepository.findUserById(idUser);
    colabCreated.user = user;

    if (!colabCreated)
      throw new AppError('Ocorreu um erro ao criar uma nova colab');

    return colabCreated;
  }
}

module.exports = CreateColabService;
