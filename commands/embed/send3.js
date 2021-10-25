const { Message, Client, MessageEmbed } = require(`discord.js`)

module.exports = {
  name: `send3`,
  cooldown: 5,
  desc: `Send 3`,
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
      .setTitle(`__Shipping and Packaging__`)
      .setDescription(`
**__PACKAGING:__** 

> Please make sure your products are properly packaged and taped to prevent any damage. 
> 
> Any box that you use to ship is acceptable, we recommend to ship 2 consoles per box.

If you don’t have any boxes that fit, [here are some recommendations](https://docs.google.com/document/d/1F2NWHaN6usiIax5jAyARRUTbgUNfRWnWlpALQkFJxj4/edit?usp=sharing)

**__SHIPPING:__**

**Labels will be provided for you after you open a ticket to ship.**

**Factors to keep in mind,**
> 1. The weight on the label will not have to match the actual weight. UPS will charge our account the right amount for each package after.
> 2. The return address on the label will be our address instead of your home address. This helps to quicken the process of label generating.
> **3. Please use the smallest box you have that can fit the consoles, to prevent any damages.**
      `)

    message.channel.send({ embeds: [embed] });
    await message.delete();
  }
}