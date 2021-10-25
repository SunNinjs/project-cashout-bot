const { Message, Client } = require(`discord.js`)

module.exports = {
  name: `ping`,
  cooldown: 5,
  desc: `Pong!`,
  sRoles: [`A`],
    /**
   * Sends an custom Embed
   * @param {Message} message 
   * @param {Array<String>} args 
   * @param {Client} client 
   * @returns {void} void
   */
  async execute(message, args, client) {
    let firstmes = await message.channel.send(`Pong!`)
    let time = firstmes.createdTimestamp - message.createdTimestamp
    firstmes.edit(`Pong! \`${time} ms\``)
  }
}