const { Message, Client, MessageEmbed } = require(`discord.js`)

module.exports = {
  name: `send6`,
  cooldown: 5,
  desc: `Send 6`,
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
      .setTitle(`__Guides__`)
      .setDescription(`
**BESTBUY BUSINESS ACCOUNT:** - Business accounts allow you to order higher quanitites compared to a regular account. All you need to do is come up with a name for your business and it should be good to go!

> Register for Bestbuy business account: https://www.bestbuy.com/identity/newAccount/businessCreate

**TARGET REDCARD:** - RedCard gives you a 5% discount on every purchase. If you would like to purchase a *Team Member* code (an extra 10% off on top of the RedCard discount) DM me.

> Register for a debit card: https://www.target.com/redcard/debit-card-application
> Register for a credit card: https://www.target.com/redcard/credit-card-application?lnk=Applyforcredito

**__TAX EXEMPT:__** 

In order to apply for tax exempt at **Walmart** & **Bestbuy**, you must first have a registered Business License/Seller's Permit. It's a long and tedious process so make sure all the information is correct.

> You can register for a permit here: https://onlineservices.cdtfa.ca.gov/_/

Once you have the permit number,

> Register for Bestbuy: https://www.bestbuy.com/tax/exempt/registration
> 
> Register for Walmart: https://www.walmart.com/taxexempt/

Now enjoy not paying taxes on any electronics ever again!


**Take advantage to maximize your profits!**
      `)

    message.channel.send({ embeds: [embed] });
    await message.delete();
  }
}