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
            console.log('Changes committed');
            t.commit();
          })
          .catch(t.rollback);
      });
    }).catch(function (error) {
      console.error(error);
      return error;
    });
  }
}

module.exports = ColabsRepository;
