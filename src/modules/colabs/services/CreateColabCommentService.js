const AppError = require('../../../shared/errors/AppError');

class CreateColabCommentService {
  constructor(repository) {
    this.repository = repository;
  }

  async execute({ text, idColab, idUser }) {
    const commentCreated = await this.repository.createColabComment({
      text,
      idColab,
      idUser,
    });

    if (!commentCreated)
      throw new AppError('Ocorreu um erro ao criar um novo comentário');

    return commentCreated;
  }
}

module.exports = CreateColabCommentService;
