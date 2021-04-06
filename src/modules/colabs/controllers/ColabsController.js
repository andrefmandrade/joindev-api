const ColabsRepository = require('../repositories/ColabsRepository');
const CreateColabService = require('../services/CreateColabService');
const CreateColabCommentService = require('../services/CreateColabCommentService');
const GetColabsService = require('../services/GetColabsService');
const GetTagsColabService = require('../services/GetTagsColabService');
const AppError = require('../../../shared/errors/AppError');
const { isEmpty } = require('../../../shared/utils');

const colabsRepository = new ColabsRepository();

class ColabsController {
  async createColab(req, res) {
    const { title, text, tags } = req.body;
    const idUser = req.idUser;

    if (isEmpty(title, text, tags))
      throw new AppError(
        'Os campos título, texto e tags são obrigatórios, por favor insira-os e tente novamente'
      );

    const createColabService = new CreateColabService(colabsRepository);
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
      colabsRepository
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
