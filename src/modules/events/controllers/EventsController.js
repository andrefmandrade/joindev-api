const EventsRepository = require('../repositories/EventsRepository');
const UsersRepository = require('../../users/repositories/UsersRepository');
const CreateEventService = require('../services/CreateEventService');
const GetEventsService = require('../services/GetEventsService');
const DeleteEventService = require('../services/DeleteEventService');
const UpdateEventService = require('../services/UpdateEventService');
const AppError = require('../../../shared/errors/AppError');
const { isEmpty } = require('../../../shared/utils');

const eventsRepository = new EventsRepository();
const usersRepository = new UsersRepository();

class EventsController {
  async createEvent(req, res) {
    const { title, address, date, url, details } = JSON.parse(
      JSON.stringify(req.body)
    );
    const idUser = req.idUser;

    if (isEmpty(title, address, date, details))
      throw new AppError(
        'Os campos título, endereço, data, detalhes e imagem são obrigatórios, por favor insira-os e tente novamente'
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
      image: req.file.filename,
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
    const userIdFilter = req.query.userId;
    const idUser = req.idUser;

    const getEventsService = new GetEventsService(eventsRepository);
    const events = await getEventsService.executeGetAll({
      page,
      search,
      userId: !!userIdFilter && userIdFilter === 'true' ? idUser : null,
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
    const event = await getEventsService.executeGet({
      id,
      idUser,
    });

    return res.json({
      success: true,
      message: 'Busca de evento realizada com sucesso',
      ...event,
    });
  }

  async deleteEvent(req, res) {
    const { id } = req.params;
    const idUser = req.idUser;

    const getEventsService = new GetEventsService(eventsRepository);
    const event = await getEventsService.executeGet({
      id,
      idUser,
    });

    if (!event.event.length) throw new AppError('Evento inexistente!');

    if (!!event.event.length) {
      if (event.event[0].owner !== idUser) {
        throw new AppError('Você não é dono desse evento!');
      }
    }

    const deleteEventService = new DeleteEventService(eventsRepository);
    const deleted = await deleteEventService.execute({
      id,
      idUser,
    });

    return res.json({
      success: deleted > 0,
      message:
        deleted > 0
          ? 'Evento deletado com sucesso'
          : 'Nenhum evento foi deletado',
    });
  }

  async editEvent(req, res) {
    const { id } = req.params;
    const { title, address, date, url, details } = req.body;
    const idUser = req.idUser;

    const eventUpdate = {};
    eventUpdate.idUser = idUser;

    if (isEmpty(title, address, date, details))
      throw new AppError(
        'Os campos titulo, endereço, data e detalhes são obrigatórios, por favor insira-os e tente novamente'
      );

    const getEventsService = new GetEventsService(eventsRepository);
    const eventGet = await getEventsService.executeGet({
      id,
      idUser,
    });

    if (!eventGet.event.length) throw new AppError('Evento inexistente!');

    if (!!eventGet.event.length) {
      if (eventGet.event[0].owner !== idUser) {
        throw new AppError('Você não é dono desse evento!');
      }
    }

    const updateEventService = new UpdateEventService(eventsRepository);

    if (req.file) eventUpdate.image = req.file.filename;

    eventUpdate.id = id;
    eventUpdate.title = title;
    eventUpdate.address = address;
    eventUpdate.date = date;
    eventUpdate.url = url;
    eventUpdate.details = details;

    const event = await updateEventService.execute(eventUpdate);

    return res.json({
      success: true,
      message: 'Evento atualizado com sucesso',
      event,
    });
  }
}

module.exports = EventsController;
