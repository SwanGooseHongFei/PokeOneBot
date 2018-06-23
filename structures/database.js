const Sequelize = require('sequelize');

module.exports = class Database {
	constructor() {
		this.connection = new Sequelize('pokeone', null, null, {
			dialect: 'sqlite',
			storage: './pokeone.sqlite3'
		});

		this.player = this.connection.define('player', {
			userId: {
				type: Sequelize.TEXT,
				unique: true,
				allowNull: false,
				primaryKey: true
			},
			gamename: Sequelize.TEXT,
			guild: Sequelize.TEXT
		});

		this.connection.sync();
	}
};

