const { Message, Client, MessageEmbed } = require(`discord.js`)

module.exports = {
  name: `groundshipping`,
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
    let stat = client.messageSettings.groundshipping;
    let newstat = !stat;
    client.messageSettings.groundshipping = newstat;
    let mes = new MessageEmbed()
        .setColor(`#0fffbf`)
        .setFooter(`Project Cashout`, `https://cdn.discordapp.com/icons/866951718726139924/e440829b1404d110b7f2195d3d6a0917.webp?size=128`)
        .setTimestamp()
        .setTitle(`Groundshipping has been changed`)
        .setDescription(`Groundshipping has changed from **${stat}** to **${newstat}**`)

    message.channel.send({ embeds: [mes] })
  }
}