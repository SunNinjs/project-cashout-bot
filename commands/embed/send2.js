const { Message, Client, MessageEmbed } = require(`discord.js`)

module.exports = {
  name: `send2`,
  cooldown: 5,
  desc: `Send 2`,
  dev: true,
  sRoles: [`A`],
  /**
   * Sends an custom Embed
   * @param {Message} message 
   * @param {Array<String>} args 
   * @param {Client} client 
   */
  async execute(message, args, client) {
    let embed = new MessageEmbed()
      .setColor(`#0fffbf`)
      .setFooter(`Project Cashout`, `https://cdn.discordapp.com/icons/866951718726139924/5115e54925a361fe03832435e6598596.webp?size=128`)
      .setTimestamp()
      .setTitle(`__Payments__`)
      .setDescription(`
\u200B
Payments will be received once the package has been delivered and approved.

Please be willing to accept multiple forms of payment due to daily limits for each method.

Open a ticket when your packages deliver. <#872366770898477086>

__**Forms of payment:**__ We cover all fees.
>>> **Paypal** (preferred)  - *No limit*
**Zelle** - *100k per month/5k per day*
**Venmo** - *5k per week*
**CashApp** - *10k per week*
**Apple Pay** - *10k per week*
**BoA Transfer** (preferred) - *No limit*
**Chase Transfer** (preferred) - *No limit*
**ACH Transfer** (preferred) - *No limit*
**Wire Transfer** (preferred) - *No limit*
**Checks** (deposit remotely with an image or mail it to you) - *No limit*
      `)

    message.channel.send({ embeds: [embed] });
    await message.delete();
  }
}