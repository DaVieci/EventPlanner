import event from '../controllers/eventsController';

/**
 * Route for everything that has something im common with events
 */

module.exports = function(api) {
    api.get(
        'api/event',
        event.getAllEvents
    );
}