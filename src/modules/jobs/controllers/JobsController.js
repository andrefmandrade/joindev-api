const JobsRepository = require('../repositories/JobsRepository');
const UsersRepository = require('../../users/repositories/UsersRepository');
const CreateJobService = require('../services/CreateJobService');
const GetJobsService = require('../services/GetJobsService');
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

  async getJobs(req, res) {
    const page = req.query.page || 1;
    const search = req.query.search || '';
    const userIdFilter = req.query.userId;
    const idUser = req.idUser;

    const getJobsService = new GetJobsService(jobsRepository);
    const jobs = await getJobsService.executeGetAll({
      page,
      search,
      userId: !!userIdFilter && userIdFilter === 'true' ? idUser : null,
    });

    return res.json({
      success: true,
      message: 'Busca de vagas realizada com sucesso',
      ...jobs,
    });
  }

  async getJob(req, res) {
    const { id } = req.params;
    const idUser = req.idUser;

    const getJobsService = new GetJobsService(jobsRepository);
    const job = await getJobsService.executeGet({
      id,
      idUser,
    });

    return res.json({
      success: true,
      message: 'Busca de vaga realizada com sucesso',
      ...job,
    });
  }
}

module.exports = JobsController;
