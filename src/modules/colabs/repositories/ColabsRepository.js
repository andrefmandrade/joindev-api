const { andWhere } = require('../../../infra/database/connection');
const connection = require('../../../infra/database/connection');

class ColabsRepository {
  async createColab({ title, text, tags, idUser }) {
    return new Promise(async (resolve, reject) => {
      await connection.transaction((t) => {
        connection('colabs')
          .insert({ title, text, id_user: idUser })
          .transacting(t)
          .returning(['id', 'title', 'text', 'created_at'])
          .then(async (colabInsert) => {
            const colab = colabInsert[0];

            const colabsRel = tags.map((tag) => ({
              id_colab: colab.id,
              id_tag: tag.id,
            }));

            const relInsert = await t
              .insert(colabsRel)
              .into('colabs_rel_tags')
              .returning(['*']);

            if (!!relInsert.length) return resolve(colab);
            return reject(null);
          })
          .then(() => {
            t.commit();
          })
          .catch(t.rollback);
      });
    }).catch(function (error) {
      console.error(error);
      return error;
    });
  }

  async getColabs({ page, search, userId }) {
    const colabs = await connection('colabs')
      .where(function () {
        this.where('title', 'ilike', `%${search}%`).orWhere(
          'text',
          'ilike',
          `%${search}%`
        );
      })
      .andWhere((builder) => {
        if (!!userId) {
          builder.andWhere('id_user', userId);
        }
      })
      .andWhere('deleted', false)
      .leftJoin('users', {
        'users.id': 'colabs.id_user',
      })
      .select([
        'colabs.id',
        'colabs.title',
        'colabs.text',
        'users.name',
        'users.photo',
        'colabs.created_at as createdAt',
      ])
      .orderBy('colabs.created_at', 'desc')
      .offset((page - 1) * 15)
      .limit(15);

    const count = await connection('colabs')
      .where(function () {
        this.where('title', 'ilike', `%${search}%`).orWhere(
          'text',
          'ilike',
          `%${search}%`
        );
      })
      .andWhere('deleted', false)
      .count('id')
      .first();

    return {
      count: parseInt(count.count),
      totalPages: Math.ceil(count.count / 15),
      colabs,
    };
  }

  async getColab({ id, idUser }) {
    const colab = await connection('colabs')
      .where('colabs.id', id)
      .andWhere('deleted', false)
      .andWhere('id_user', idUser)
      .leftJoin('users', {
        'users.id': 'colabs.id_user',
      })
      .select([
        'colabs.id',
        'colabs.title',
        'colabs.text',
        'users.name',
        'users.photo',
      ]);

    return {
      colab,
    };
  }

  async getComments({ id }) {
    const comments = await connection('comments_colabs')
      .where('comments_colabs.id_colab', id)
      .andWhere('deleted', false)
      .leftJoin('users', {
        'users.id': 'comments_colabs.id_user',
      })
      .select([
        'comments_colabs.id',
        'comments_colabs.text',
        'comments_colabs.created_at as createdAt',
        'users.name',
        'users.photo',
      ]);

    return {
      comments,
    };
  }

  async getTagsColab() {
    const tags = await connection('tags_colabs')
      .where('deleted', false)
      .select(['id as value', 'title as label']);

    return tags;
  }

  async createColabComment({ text, idColab, idUser }) {
    const userSaved = await connection('comments_colabs')
      .insert({ text, id_colab: idColab, id_user: idUser })
      .returning(['id', 'text', 'created_at']);

    if (!!userSaved.length) return userSaved[0];
    return null;
  }
}

module.exports = ColabsRepository;
