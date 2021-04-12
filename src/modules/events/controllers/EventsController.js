const EventsRepository = require('../repositories/EventsRepository');
const UsersRepository = require('../../users/repositories/UsersRepository');
const CreateEventService = require('../services/CreateEventService');
const GetEventsService = require('../services/GetEventsService');
const AppError = require('../../../shared/errors/AppError');
const { isEmpty } = require('../../../shared/utils');

const eventsRepository = new EventsRepository();
const usersRepository = new UsersRepository();

class EventsController {
  async createEvent(req, res) {
    const { title, address, date, url, details, image } = req.body;
    const idUser = req.idUser;

    if (isEmpty(title, address, date, url, details, image))
      throw new AppError(
        'Os campos título, endereço, data, url, detalhes e imagem são obrigatórios, por favor insira-os e tente novamente'
      );

    const createEventService = new CreateEventService(
      eventsRepository,
      usersRepository
    );

    const event = await createEventService.execute({
      title,
      address,
      date,
      url,
      details,
      image,
      idUser,
    });

    return res.json({
      success: true,
      message: 'Evento criada com sucesso',
      event,
    });
  }

  async getEvents(req, res) {
    const page = req.query.page || 1;
    const search = req.query.search || '';

    const getEventsService = new GetEventsService(eventsRepository);
    const events = await getEventsService.executeGetAll({
      page,
      search,
    });

    return res.json({
      success: true,
      message: 'Busca de eventos realizada com sucesso',
      ...events,
    });
  }

  async getEvent(req, res) {
    const { id } = req.params;
    const idUser = req.idUser;

    const getEventsService = new GetEventsService(eventsRepository);
    const events = await getEventsService.executeGet({
      id,
      idUser,
    });

    return res.json({
      success: true,
      message: 'Busca de evento realizada com sucesso',
      ...events,
    });
  }
}

module.exports = EventsController;
