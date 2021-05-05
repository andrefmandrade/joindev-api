const JobsRepository = require('../repositories/JobsRepository');
const UsersRepository = require('../../users/repositories/UsersRepository');
const CreateJobService = require('../services/CreateJobService');
const GetJobsService = require('../services/GetJobsService');
const DeleteJobService = require('../services/DeleteJobService');
const UpdateJobService = require('../services/UpdateJobService');
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

  async deleteJob(req, res) {
    const { id } = req.params;
    const idUser = req.idUser;

    const getJobsService = new GetJobsService(jobsRepository);
    const job = await getJobsService.executeGet({
      id,
      idUser,
    });

    if (!job.job.length) throw new AppError('Vaga inexistente!');

    if (!!job.job.length) {
      if (job.job[0].owner !== idUser) {
        throw new AppError('Você não é dono dessa vaga!');
      }
    }

    const deleteJobService = new DeleteJobService(jobsRepository);
    const deleted = await deleteJobService.execute({
      id,
      idUser,
    });

    return res.json({
      success: deleted > 0,
      message:
        deleted > 0 ? 'Vaga deletada com sucesso' : 'Nenhuma vaga foi deletada',
    });
  }

  async editJob(req, res) {
    const { id } = req.params;
    const { title, company, city, contact, details } = req.body;
    const idUser = req.idUser;

    console.log(req.body);

    const jobUpdate = {};
    jobUpdate.idUser = idUser;

    if (isEmpty(title, company, city, contact, details))
      throw new AppError(
        'Os campos título, empresa, cidade, contato e detalhes são obrigatórios, por favor insira-os e tente novamente'
      );

    const getJobsService = new GetJobsService(jobsRepository);
    const jobGet = await getJobsService.executeGet({
      id,
      idUser,
    });

    if (!jobGet.job.length) throw new AppError('Vaga inexistente!');

    if (!!jobGet.job.length) {
      if (jobGet.job[0].owner !== idUser) {
        throw new AppError('Você não é dono dessa vaga!');
      }
    }

    const updateJobService = new UpdateJobService(jobsRepository);

    jobUpdate.id = id;
    jobUpdate.title = title;
    jobUpdate.company = company;
    jobUpdate.city = city;
    jobUpdate.contact = contact;
    jobUpdate.details = details;

    const job = await updateJobService.execute(jobUpdate);

    return res.json({
      success: true,
      message: 'Vaga atualizado com sucesso',
      job,
    });
  }
}

module.exports = JobsController;
