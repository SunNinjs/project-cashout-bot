const Discord = require('discord.js');

module.exports = {
	name: 'purge',
	cooldown: 5,
  sRoles: [`A`, `staff`, `owner`],
	description: 'Purges messages',
	execute(message, args) {
		let number = Number.parseInt(args[0])
		if (isNaN(number)) {return message.channel.send(`Please enter a Number Greater than 0 or lower then 100`);} else if (number <= 0 || number >= 100) {
			return message.channel.send(`Please enter a Number Greater than 0 or lower then 100`);
		} else {
			message.channel.bulkDelete(number);
		}
	},
};