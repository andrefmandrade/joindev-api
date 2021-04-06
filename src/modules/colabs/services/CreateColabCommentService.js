const AppError = require('../../../shared/errors/AppError');

class CreateColabCommentService {
  constructor(repository, userRepository) {
    this.repository = repository;
    this.userRepository = userRepository;
  }

  async execute({ text, idColab, idUser }) {
    const commentCreated = await this.repository.createColabComment({
      text,
      idColab,
      idUser,
    });

    const user = await this.userRepository.findUserById(idUser);
    commentCreated.user = user;

    if (!commentCreated)
      throw new AppError('Ocorreu um erro ao criar um novo comentário');

    return commentCreated;
  }
}

module.exports = CreateColabCommentService;
