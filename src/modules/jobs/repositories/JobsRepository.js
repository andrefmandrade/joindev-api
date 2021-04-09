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

  async getJobs({ page, search }) {
    const jobs = await connection('jobs')
      .where(function () {
        this.where('title', 'ilike', `%${search}%`).orWhere(
          'details',
          'ilike',
          `%${search}%`
        );
      })
      .leftJoin('users', {
        'users.id': 'jobs.id_user',
      })
      .select([
        'jobs.id',
        'jobs.title',
        'jobs.company',
        'jobs.city',
        'jobs.details',
        'jobs.contact',
        'users.name',
        'jobs.created_at as createdAt',
      ])
      .orderBy('jobs.created_at', 'desc')
      .offset((page - 1) * 15)
      .limit(15);

    const count = await connection('jobs')
      .where(function () {
        this.where('title', 'ilike', `%${search}%`).orWhere(
          'details',
          'ilike',
          `%${search}%`
        );
      })
      .count('id')
      .first();

    return {
      count: parseInt(count.count),
      totalPages: Math.ceil(count.count / 15),
      jobs,
    };
  }

  async getJob({ id, idUser }) {
    const job = await connection('jobs')
      .where('jobs.id', id)
      .andWhere('id_user', idUser)
      .leftJoin('users', {
        'users.id': 'jobs.id_user',
      })
      .select([
        'jobs.id',
        'jobs.title',
        'jobs.company',
        'jobs.city',
        'users.name',
        'users.photo',
      ]);

    return {
      job,
    };
  }
}

module.exports = JobsRepository;
