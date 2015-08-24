/*
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

//import mongoose from  'mongoose';
import User from '../models/User'

let env = process.env.NODE_ENV || 'development';

/*
// Insert some data needed to bootstrap or init the application

if ('production' === env) {
	// Insert some data needed to init the production instance only, update a version info ...
}
*/

/*
 * Insert dummy data to test the application
 */
const users = [
  {
    'username': 'root',
    'password': 'root0Demo',
    'name': 'root demo',
    'provider': 'local',
    'email': 'root@gmail.com',
    'roles': ['admin','user']
  },
  {
    'username': 'sumo1',
    'password': 'sumo1Demo',
    'name': 'sumo1 demo',
    'provider': 'local',
    'email': 'sumo1@gmail.com',
    'roles': ['user']
  },
  {
    'username': 'sumo2',
    'password': 'sumo2Demo',
    'name': 'sumo2 demo',
    'provider': 'local',
    'email': 'sumo2@gmail.com',
    'roles': ['user']
  }
];

if ('development' === env) {
	console.log('Populating test and development data ...');

	User.find({}).remove( () => {
		User.create(users, function (err) {
			if (err) {
				console.error('Error while populating users: %s', err);
			} else {
				console.log('finished populating users');
			}
		});
	});
}
