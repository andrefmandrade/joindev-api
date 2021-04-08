const connection = require('../../../infra/database/connection');

class JobsRepository {
  async createJob({ title, company, city, contact, details, idUser }) {
    const userSaved = await connection('jobs')
      .insert({ title, company, city, contact, details, id_user: idUser })
      .returning([
        'id',
        'title',
        'company',
        'city',
        'contact',
        'details',
        'created_at',
      ]);

    if (!!userSaved.length) return userSaved[0];
    return null;
  }
}

module.exports = JobsRepository;
