var Client = require('node-rest-client').Client,
	Promise = require('bluebird'),
	config = require('config');

var client = new Client();

var args = {
	headers: {
		"X-Octopus-ApiKey": config.get('octopus.key')
	}
};

module.exports = {
	api: {
		dashboard: function() {
		return new Promise(function(fulfill, reject) {
			client.get(config.get('octopus.url') + 'dashboard', args, function(data, response) {
				if (response.statusCode === 200) {
					fulfill(JSON.parse(data.toString('utf8')));
				} else {
					reject(response);
				}
			});
		});
	},

	releases: function(projectName) {
		return new Promise(function(fulfill, reject) {
			client.get(config.get('octopus.url') + 'projects/all', args, function(data, response) {
				var project;

				if (response.statusCode !== 200) {
					return reject(response);
				}

				project = JSON.parse(data.toString('utf8')).find(function(proj) {
					return proj.Name === projectName;
				});

				if (!project) {
					return reject('Could not find project', projectName);
				}

				client.get(config.get('octopus.url') + 'projects/' + project.Id + '/releases', args, function(data, response) {
					if (response.statusCode !== 200) {
						return reject(response);
					}

					fulfill(JSON.parse(data.toString('utf8')));
				});
			});
		});

	},
},

	helpers: {
		validEnvironment: function(vars, name) {
			if (vars.every) {
				return true;
			}

			name = name.toUpperCase();

			return vars.env.some(function(envName) {
				return envName.trim() === name || name.indexOf(envName.trim() + '-') === 0;
			}) && name.indexOf('-A') < 0 && name.indexOf('-B') < 0 && name.indexOf('-INT') < 0;
		}
	}
};