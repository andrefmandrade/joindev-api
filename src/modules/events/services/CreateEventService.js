const AppError = require('../../../shared/errors/AppError');
class CreateEventService {
  constructor(repository, userRepository) {
    this.repository = repository;
    this.userRepository = userRepository;
  }

  async execute({ title, address, date, url, details, image, idUser }) {
    const eventCreated = await this.repository.createEvent({
      title,
      address,
      date,
      url,
      details,
      image,
      idUser,
    });

    const user = await this.userRepository.findUserById(idUser);
    eventCreated.user = user;

    if (!eventCreated)
      throw new AppError('Ocorreu um erro ao criar um novo evento');

    return eventCreated;
  }
}

module.exports = CreateEventService;
