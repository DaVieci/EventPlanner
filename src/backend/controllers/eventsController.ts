var connection = require('../database');
const dbCollection = 'events';
/**
 * Dummy Data
 */
const testDocument = ({
    title: 'ACV release',
    body: 'Beste Spiel, maybe?!',
    date: Date(),
    user: {
        name: 'Viet'
    }
})

/**
 * Controller for handling events
 */
class eventController {
        static async getAllEvents(dbCollection) {
            connection.query(
                'db.' + dbCollection + '.find().pretty()'
            )
        }
    }

export default eventController;