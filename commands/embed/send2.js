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

__**Forms of payment:**__

>>> **Ach Transfer/Wire Transfer** (preferred) - *No limit*
**Echecks/Checks** (preferred) - *No limit (mobile deposit or deposit at the bank)*
**Chase Transfer** (preferred) - *No limit (must have Chase)*
**Paypal FnF/QR** - *No limit*
**Zelle** - *$25k per week*
**Cashapp** - *$10k per week*
**Venmo** - *$5k per week*
**Apple Pay** - *$10k per week*
      `)

    message.channel.send({ embeds: [embed] });
    await message.delete();
  }
}