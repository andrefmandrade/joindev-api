const JobsRepository = require('../repositories/JobsRepository');
const UsersRepository = require('../../users/repositories/UsersRepository');
const CreateJobService = require('../services/CreateJobService');
const AppError = require('../../../shared/errors/AppError');
const { isEmpty } = require('../../../shared/utils');

const jobsRepository = new JobsRepository();
const usersRepository = new UsersRepository();

class JobsController {
  async createJob(req, res) {
    const { title, company, city, contact, details } = req.body;
    const idUser = req.idUser;

    if (isEmpty(title, company, city, contact, details))
      throw new AppError(
        'Os campos título, empresa, cidade, contato e detalhes são obrigatórios, por favor insira-os e tente novamente'
      );

    const createJobService = new CreateJobService(
      jobsRepository,
      usersRepository
    );

    const job = await createJobService.execute({
      title,
      company,
      city,
      contact,
      details,
      idUser,
    });

    return res.json({
      success: true,
      message: 'Vaga criada com sucesso',
      job,
    });
  }
}

module.exports = JobsController;
