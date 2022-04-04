const { Client, Intents, Collection, Permissions, MessageActionRow, MessageButton, MessageEmbed } = require(`discord.js`);
const fs = require(`fs`);
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS], presence: { activities: [{ name: `Project Cashout`, type: `COMPETING` }], status: `dnd` } });
const Settings = require(`./schemas/settings.js`);
const mongoose = require(`mongoose`);
const { Util } = require("./util/util.js");
require(`dotenv`).config();
require(`./util/functions.js`).Addons(client)
const path = require(`path`);
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

client.on(`ready`, async () => {
  console.log(`Logged into ${client.user.tag}\nBot Invite: https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`);

  mongoose.connect(process.env.MONGO_PATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log(`Mongoose Connection Established`))

  let guild = client.guilds.cache.get(`866951718726139924`);

  let faq = client.channels.cache.get(`872358893727150171`); //872358893727150171
  let payments = client.channels.cache.get(`872361890133712917`); //872361890133712917
  let ship = client.channels.cache.get(`872363854078812160`); //872363854078812160
  let guides = client.channels.cache.get(`872369971307618304`); //872369971307618304
  let welcome = client.channels.cache.get(`872358723581009970`); //872358723581009970
  let test = client.channels.cache.get(`896630033886613517`);

  //let channel = client.channels.cache.get(`902011893743505468`);

  client.util = new Util(client);
  //guides.send({ embeds: [client.embeds.Guides()] })
  //welcome.send({ embeds: [client.embeds.WelcomeMessage()] })
  //welcome.send({ content: `Invite Link: https://discord.gg/bGbkTpkChY` })
  //ship.send({ embeds: [client.embeds.Shipping()] })
  //payments.send({ embeds: [client.embeds.Payments()] })
  //faq.send({ embeds: [client.embeds.FAQ()] })
  //channel.send({ embeds: [client.embeds.AppleProducts()] })
})

client.logs = new Collection();
client.commands = new Collection();
client.aliases = new Collection();
client.messageSettings = {
  lockship: true,
  delivery: true,
  lockprices: true
}
client.lockship = true;
fs.readdirSync(path.resolve(__dirname, `./commands`)).forEach(dir => {
  const commands = fs.readdirSync(path.resolve(__dirname, `./commands/${dir}`)).filter(file => file.endsWith(".js"))
  for (let file of commands) {
    let command = require(`./commands/${dir}/${file}`)
    const name = command?.name
    if (!name) {if (!command?.names) name = file; name = command.names[0]}
    client.commands.set(name, command)
    if (command.aliases) {command.aliases.forEach(alias => { client.aliases.set(alias, command.name) })}
  }
})
const cooldowns = new Collection();

client.on(`messageCreate`, async message => {
  if (message.author.bot) return;
  let settings = await Settings.find({GuildID: message.guild.id})
  if (settings[0] == undefined) {
    await new Settings({
      dev: `221403951700901888`,
      GuildID: message.guild.id,
      prefix: process.env.PREFIX2,
    }).save()
    settings = {
      dev: `221403951700901888`,
      prefix: process.env.PREFIX2,
    }
  } else {
    settings = settings[0]
  }
  client.settings = settings;

  if (!message.content.startsWith(settings.prefix)) return;
	const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  let color = message.guild.me.displayHexColor;
  color !== `#000000` ? client.allInfo.color = color : client.allInfo.color = `#36393F`

  const command = client.commands.get(commandName) || client.commands.find(cmd => (cmd.names && cmd.names.includes(commandName)) || (cmd.aliases && cmd.aliases.includes(commandName)))
  if (!command) return;
  if (command.guildOnly && message.channel.type === `dm`) {
    return message.channel.send(`This command is not accessible in dms`)
  }
  if (command.dmOnly && message.channel.type !== `dm`) {
    return message.channel.send(`This command is only accessible in dms`)
  }

  if ((command.permissions || command.perms) && message.author.id !== client.settings.dev) {
    const authorPerms = message.channel.permissionsFor(message.author);
    if (!authorPerms || !authorPerms.has(command.permissions || command.perms)) {
      return message.channel.send(`You do not have permissions to run ${commandName}`)
    }
  }

  if (command.roles && command.guildOnly) { // && message.author.id !== client.settings.dev
    const member = message.member
    const guild = command.roles.filter(arr => arr.guild === message.guild.id || arr.guild === message.guild.name || arr.guild === message.guild.nameAcronym)
    if (!guild[0] && !command.defaultperms) return message.channel.send( `You do not have permissions to run ${commandName}`)
    if (guild[0]) {
      if (!member.roles.cache.some(role => guild[0].roles.includes(role.name) || guild[0].roles.includes(role.id)))
      return message.channel.send(`You do not have permissions to run ${commandName}`)
    } else if (command.defaultperms) {
      if (!member.roles.cache.some(role => command.defaultperms.includes(role.name) || command.defaultperms.includes(role.id)))
      return message.channel.send(`You do not have permissions to run ${commandName}`)
    }
  }

  if (command.sRoles && message.author.id != settings.dev) {
    const member = message.member;
    let memberroles = member.roles.cache;
    let roles = command.sRoles;
    if (!(roles.some(r => memberroles.has(r)))) {
      if (!(roles.some(r => memberroles.map(s => s.name.toLowerCase()).includes(r.toLowerCase())))) return message.channel.send(`You do not have permissions to run ${commandName}`) 
    }
  }

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;
		if (command.usage) {
			reply += `\nThe proper usage would be: \`${settings.prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
	}

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection())
  }

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || command.time || 3) * 1000;
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.channel.send(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    if (command.execute) {
      command.execute(message, args, client);
    } else if (command.run) {
      command.run(message, args, client)
    }
	} catch (error) {
		console.error(error);
		message.channel.send('there was an error trying to execute that command!');
	}
})

client.login(process.env.TOKEN2) //ODMxNzk2MjIxNjM4NjA2ODY4.YHacmQ.y8eP88-M1Dy3yNSgUe7jL-Qsv0s