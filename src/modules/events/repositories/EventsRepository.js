const connection = require('../../../infra/database/connection');
const { serverUrl } = require('../../../shared/config/server');

class EventsRepository {
  async createEvent({ title, address, date, url, details, image, idUser }) {
    const eventSaved = await connection('events')
      .insert({
        title,
        address,
        date,
        url,
        details,
        image: `${serverUrl}/images/${image}`,
        id_user: idUser,
      })
      .returning([
        'id',
        'title',
        'address',
        'date',
        'url',
        'details',
        'image',
        'created_at',
      ]);

    if (!!eventSaved.length) return eventSaved[0];
    return null;
  }

  async getEvents({ page, search }) {
    const showTotalOf = 21;

    const events = await connection('events')
      .where(function () {
        this.where('title', 'ilike', `%${search}%`).orWhere(
          'details',
          'ilike',
          `%${search}%`
        );
      })
      .leftJoin('users', {
        'users.id': 'events.id_user',
      })
      .select([
        'events.id',
        'events.title',
        'events.address',
        'events.date',
        'events.url',
        'events.details',
        'events.image',
        'users.name',
        'events.created_at as createdAt',
      ])
      .orderBy('events.created_at', 'desc')
      .offset((page - 1) * showTotalOf)
      .limit(showTotalOf);

    const count = await connection('events')
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
      totalPages: Math.ceil(count.count / showTotalOf),
      events,
    };
  }

  async getEvent({ id, idUser }) {
    const event = await connection('events')
      .where('events.id', id)
      .andWhere('id_user', idUser)
      .leftJoin('users', {
        'users.id': 'events.id_user',
      })
      .select([
        'events.id',
        'events.title',
        'events.address',
        'events.date',
        'events.url',
        'events.details',
        'events.image',
        'users.name',
        'users.photo',
      ]);

    return {
      event,
    };
  }
}

module.exports = EventsRepository;
