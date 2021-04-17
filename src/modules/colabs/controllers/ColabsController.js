const ColabsRepository = require('../repositories/ColabsRepository');
const UsersRepository = require('../../users/repositories/UsersRepository');
const CreateColabService = require('../services/CreateColabService');
const CreateColabCommentService = require('../services/CreateColabCommentService');
const GetColabsService = require('../services/GetColabsService');
const GetTagsColabService = require('../services/GetTagsColabService');
const AppError = require('../../../shared/errors/AppError');
const { isEmpty } = require('../../../shared/utils');

const colabsRepository = new ColabsRepository();
const usersRepository = new UsersRepository();

class ColabsController {
  async createColab(req, res) {
    const { title, text, tags } = req.body;
    const idUser = req.idUser;

    if (isEmpty(title, text, tags))
      throw new AppError(
        'Os campos título, texto e tags são obrigatórios, por favor insira-os e tente novamente'
      );

    const createColabService = new CreateColabService(
      colabsRepository,
      usersRepository
    );
    const colab = await createColabService.execute({
      title,
      text,
      tags,
      idUser,
    });

    return res.json({
      success: true,
      message: 'Colab criada com sucesso',
      colab,
    });
  }

  async getColabs(req, res) {
    const page = req.query.page || 1;
    const search = req.query.search || '';

    const getColabsService = new GetColabsService(colabsRepository);
    const colabs = await getColabsService.executeGetAll({
      page,
      search,
    });

    for (let index = 0; index < colabs.colabs.length; index++) {
      const element = colabs.colabs[index];

      const comments = await getColabsService.executeGetComments({
        id: element.id,
      });

      colabs.colabs[index].comments = comments.comments;
    }

    return res.json({
      success: true,
      message: 'Busca de colab realizada com sucesso',
      ...colabs,
    });
  }

  async getColab(req, res) {
    const { id } = req.params;
    const idUser = req.idUser;

    const getColabsService = new GetColabsService(colabsRepository);
    const colab = await getColabsService.executeGet({
      id,
      idUser,
    });

    for (let index = 0; index < colab.colab.length; index++) {
      const element = colab.colab[index];

      const comments = await getColabsService.executeGetComments({
        id: element.id,
      });

      colab.colab[index].comments = comments.comments;
    }

    console.log(colab);

    return res.json({
      success: true,
      message: 'Busca de colab realizada com sucesso',
      ...colab,
    });
  }

  async getTagsColab(req, res) {
    const getTagsColabService = new GetTagsColabService(colabsRepository);
    const tags = await getTagsColabService.execute();

    return res.json({
      success: true,
      message: 'Busca de tags colab realizada com sucesso',
      tags,
    });
  }

  async createColabComment(req, res) {
    const { text, idColab } = req.body;
    const idUser = req.idUser;

    if (isEmpty(text, idColab))
      throw new AppError(
        'Os campos texto e idColab são obrigatórios, por favor insira-os e tente novamente'
      );

    const createColabCommentService = new CreateColabCommentService(
      colabsRepository,
      usersRepository
    );
    const comment = await createColabCommentService.execute({
      text,
      idColab,
      idUser,
    });

    return res.json({
      success: true,
      message: 'Comentário criado com sucesso',
      comment,
    });
  }
}

module.exports = ColabsController;
