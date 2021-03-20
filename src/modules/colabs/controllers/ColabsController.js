const ColabsRepository = require('../repositories/ColabsRepository');
const CreateColabService = require('../services/CreateColabService');
const GetColabService = require('../services/GetColabService');
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

  async getColab(req, res) {
    const page = req.query.page || 1;
    const search = req.query.search || '';

    const getColabService = new GetColabService(colabsRepository);
    const colab = await getColabService.execute({
      page,
      search,
    });

    return res.json({
      success: true,
      message: 'Buscar realizada com sucesso',
      colab,
    });
  }
}

module.exports = ColabsController;
