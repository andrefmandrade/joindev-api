const connection = require('../../../infra/database/connection');

class ColabsRepository {
  async createColab({ title, text, tags, idUser }) {
    return new Promise(async (resolve, reject) => {
      await connection.transaction((t) => {
        connection('colabs')
          .insert({ title, text, id_user: idUser })
          .transacting(t)
          .returning(['*'])
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

  async getColab({ page, search }) {
    const colabs = await connection('colabs')
      .where(function () {
        this.where('title', 'ilike', `%${search}%`).orWhere(
          'text',
          'ilike',
          `%${search}%`
        );
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
        'colabs.created_at as createdAt',
      ])
      .orderBy('created_at', 'desc')
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

  async getTagsColab() {
    const tags = await connection('tags_colabs')
      .where('deleted', false)
      .select(['id as value', 'title as label']);

    return tags;
  }
}

module.exports = ColabsRepository;
