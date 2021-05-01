const connection = require('../../../infra/database/connection');
const { serverUrl } = require('../../../shared/config/server');
const fs = require('fs');
const path = require('path');

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

  async getEvents({ page, search, userId }) {
    const showTotalOf = 21;

    const events = await connection('events')
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
      .andWhere((builder) => {
        if (!!userId) {
          builder.andWhere('id_user', userId);
        }
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
        'events.id_user as owner',
        'users.name',
        'users.photo',
      ]);

    return {
      event,
    };
  }

  async deleteEvent({ id }) {
    const event = await connection('events').where('events.id', id).del();

    return {
      event,
    };
  }

  async updateEvent(event) {
    if (event.image) {
      const { image } = await connection('events')
        .select('image')
        .where({ id: event.id })
        .first();

      if (!!image) {
        const fileName = image.split('/')[image.split('/').length - 1];
        const imageToRemovePath = `${path.resolve(
          'src',
          'shared',
          'resources',
          'uploads'
        )}\\${fileName}`;

        const fileExists = fs.existsSync(imageToRemovePath);

        if (!!fileExists) {
          fs.unlink(imageToRemovePath, (error) => {
            if (error) console.log(error);
            console.log('File deleted successfully');
          });
        }
      }
    }

    const eventUpdate = {
      title: event.title,
      address: event.address,
      date: event.date,
      url: event.url,
      details: event.details,
    };

    if (!!event.image) {
      eventUpdate.image = `${serverUrl}/images/${event.image}`;
    }

    const eventUpdated = await connection('events')
      .where({
        id: event.id,
      })
      .update(eventUpdate)
      .returning(['*']);

    if (!!eventUpdated.length) return eventUpdated[0];
    return null;
  }
}

module.exports = EventsRepository;
