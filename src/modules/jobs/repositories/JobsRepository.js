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
        'jobs.id_user as owner',
        'users.name',
        'users.photo',
      ]);

    return {
      job,
    };
  }

  async deleteJob({ id }) {
    const job = await connection('jobs').where('jobs.id', id).del();

    return {
      job,
    };
  }

  async updateJob(job) {
    const jobUpdate = {
      title: job.title,
      company: job.company,
      city: job.city,
      contact: job.contact,
      details: job.details,
    };

    const jobUpdated = await connection('jobs')
      .where({
        id: job.id,
      })
      .update(jobUpdate)
      .returning(['*']);

    if (!!jobUpdated.length) return jobUpdated[0];
    return null;
  }
}

module.exports = JobsRepository;
