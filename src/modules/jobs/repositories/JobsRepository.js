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

  async getJobs({ page, search, userId }) {
    const showTotalOf = 20;

    const jobs = await connection('jobs')
      .where(function () {
        this.where('title', 'ilike', `%${search}%`).orWhere(
          'details',
          'ilike',
          `%${search}%`
        );
      })
      .andWhere((builder) => {
        if (!!userId) {
          builder.andWhere('id_user', userId);
        }
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
      .offset((page - 1) * showTotalOf)
      .limit(showTotalOf);

    const count = await connection('jobs')
      .where(function () {
        this.where('title', 'ilike', `%${search}%`).orWhere(
          'details',
          'ilike',
          `%${search}%`
        );
      })
      .andWhere((builder) => {
        if (!!userId) {
          builder.andWhere('id_user', userId);
        }
      })
      .count('id')
      .first();

    return {
      count: parseInt(count.count),
      totalPages: Math.ceil(count.count / showTotalOf),
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
