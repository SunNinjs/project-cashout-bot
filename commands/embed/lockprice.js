const { Message, Client, MessageEmbed } = require(`discord.js`)

module.exports = {
  name: `lockprices`,
  cooldown: 5,
  desc: `Shows a part of the real message`,
  sRoles: [`A`],
    /**
   * Sends an custom Embed
   * @param {Message} message 
   * @param {Array<String>} args 
   * @param {Client} client 
   * @returns {void} void
   */
  async execute(message, args, client) {
    let stat = client.messageSettings.lockprices;
    let newstat = !stat;
    client.messageSettings.lockprices = newstat;
    let mes = new MessageEmbed()
        .setColor(`#0fffbf`)
        .setFooter(`Project Cashout`, `https://cdn.discordapp.com/icons/866951718726139924/e440829b1404d110b7f2195d3d6a0917.webp?size=128`)
        .setTimestamp()
        .setTitle(`Lockprices has been changed`)
        .setDescription(`Lockprices has changed from **${stat}** to **${newstat}**`)

    message.channel.send({ embeds: [mes] })
  }
}