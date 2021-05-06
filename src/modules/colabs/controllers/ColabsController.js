const ColabsRepository = require('../repositories/ColabsRepository');
const UsersRepository = require('../../users/repositories/UsersRepository');
const CreateColabService = require('../services/CreateColabService');
const CreateColabCommentService = require('../services/CreateColabCommentService');
const GetColabsService = require('../services/GetColabsService');
const GetTagsColabService = require('../services/GetTagsColabService');
const DeleteColabService = require('../services/DeleteColabService');
const UpdateColabService = require('../services/UpdateColabService');
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
    const userIdFilter = req.query.userId;
    const idUser = req.idUser;

    const getColabsService = new GetColabsService(colabsRepository);
    const colabs = await getColabsService.executeGetAll({
      page,
      search,
      userId: !!userIdFilter && userIdFilter === 'true' ? idUser : null,
    });

    for (let index = 0; index < colabs.colabs.length; index++) {
      const element = colabs.colabs[index];

      const comments = await getColabsService.executeGetComments({
        id: element.id,
      });

      const tags = await getColabsService.executeGetTags(element.id);
      colabs.colabs[index].tags = tags;

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

      const tags = await getColabsService.executeGetTags(element.id);
      colab.colab[index].tags = tags;

      colab.colab[index].comments = comments.comments;
    }

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

  async deleteColab(req, res) {
    const { id } = req.params;
    const idUser = req.idUser;

    let affectedRows = 0;

    const getColabsService = new GetColabsService(colabsRepository);
    const colab = await getColabsService.executeGet({
      id,
      idUser,
    });

    if (!colab.colab.length) throw new AppError('Colab inexistente!');

    for (let index = 0; index < colab.colab.length; index++) {
      const element = colab.colab[index];

      const comments = await getColabsService.executeGetComments({
        id: element.id,
      });

      colab.colab[index].comments = comments.comments;
    }

    if (!!colab.colab.length) {
      if (colab.colab[0].owner !== idUser) {
        throw new AppError('Você não é dono desse colab!');
      }
    }

    const deleteColabService = new DeleteColabService(colabsRepository);

    if (!!colab.colab[0].comments.length) {
      for (let index = 0; index < colab.colab[0].comments.length; index++) {
        const comment = colab.colab[0].comments[index];

        const deletedComments = await deleteColabService.execute({
          id: comment.id,
          idUser,
          table: 'comments_colabs',
        });

        if (deletedComments) {
          affectedRows += 1;
        }
      }
    }

    const deletedColab = await deleteColabService.execute({
      id,
      idUser,
      table: 'colabs',
    });

    if (deletedColab) {
      affectedRows += 1;
    }

    return res.json({
      success: affectedRows > 0,
      message:
        affectedRows > 0
          ? 'Colab deletado com sucesso'
          : 'Nenhum colab foi deletado',
      affectedRows,
    });
  }

  async editColab(req, res) {
    const { id } = req.params;
    const { title, text, tags } = req.body;
    const idUser = req.idUser;

    const colabUpdate = {};
    colabUpdate.idUser = idUser;

    if (isEmpty(title, text, tags))
      throw new AppError(
        'Os campos título, texto e tags são obrigatórios, por favor insira-os e tente novamente'
      );

    const getColabsService = new GetColabsService(colabsRepository);
    const colabGet = await getColabsService.executeGet({
      id,
      idUser,
    });

    if (!colabGet.colab.length) throw new AppError('Colab inexistente!');

    const getTagsColabsService = new GetTagsColabService(colabsRepository);
    const tagGet = await getTagsColabsService.executeTag(id);

    if (!!colabGet.colab.length) {
      if (colabGet.colab[0].owner !== idUser) {
        throw new AppError('Você não é dono dessa colab!');
      }
    }

    const deleteColabService = new DeleteColabService(colabsRepository);

    for (let index = 0; index < tagGet.length; index++) {
      const tag = tagGet[index];
      const deletedTag = await deleteColabService.executeTag(tag);
    }

    const updateColabService = new UpdateColabService(colabsRepository);

    for (let index = 0; index < tags.length; index++) {
      const tag = tags[index];
      const newTags = await updateColabService.executeTag({
        id_tag: tag.id,
        id_colab: id,
      });
    }

    colabUpdate.id = id;
    colabUpdate.title = title;
    colabUpdate.text = text;

    const colab = await updateColabService.execute(colabUpdate);

    return res.json({
      success: true,
      message: 'Colab atualizada com sucesso',
      colab,
    });
  }
}

module.exports = ColabsController;
