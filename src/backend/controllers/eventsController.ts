var connection = require('../database');
/**
 * Controller for handling events
 */
class eventController {
    /**
     * Gets all events stored in DB
     * @param req nothing
     * @param res 
     * @returns http status code and error or list of events
     */
    static async getAllEvents(req, res){
        connection.query(
         `db.events.find()`,
         function(error, results, fields) {
             if (error) {
                 res.status(500).json({ error });
             } else {
                 res.status(200).json({ results });
             }
         }
        );
    }
}

export default eventController;