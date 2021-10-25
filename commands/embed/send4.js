const { Message, Client, MessageEmbed } = require(`discord.js`)

module.exports = {
  name: `send4`,
  cooldown: 5,
  desc: `Send 4`,
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
      .setTitle(`__FAQ__`)
      .setDescription(`
**1. What do I need to know first?**
> Please go over <#872358723581009970>, <#872361890133712917>, <#872363854078812160> for instructions, and <#872365247451762698>, <#872366770898477086> to familiarize yourself with the whole process.

**2. Who will cover shipping?**
> Sellers will be provided with our own labels at our expense. 

**3. When will I get the shipping labels?**
> Labels will be given within the hour of opening a ticket.

**4. What are prices for today?**
> Check <#872356512989843526>, prices change daily depending on market. Your prices are locked in for that day once shipped.

**5. When will I get paid?**
> Payouts will be sent the day your packages are delivered. It will take us a few hours to unbox, organize, and send out payments

**6. How will I receive payments?**
> Check <#872361890133712917> for preferred method of payment. There are daily limits, so please have 3 preffered methods to receive payments.

**7. Do we price match?**
> Yes, we do offer to price match with other buyers, only if they provide the same service as we do.
> DM Owner to price match.

**8. When do I need to ship packages out?**
> It is best to ship the same day or the day after you receive labels, the sooner the better to lock in your price.

**9. What if market changes after I have already shipped?**
> Prices are locked in for the day you ship, no matter if prices go up or down.

**10. What box can be used to ship?**
> Check <#872363854078812160> for dimensions and other information. 

**11. Can we drop off or meet up in person rather than shipping?**
> Yes, we offer dropoffs/local meet ups in the Los Angeles and Orange County area, prices will be higher accordingly. Check <#872363894448996393> for additional information.

**12. Will my packages get mixed up with others?** 
> The info that you provide in your boxes will keep your package from being mixed up.  
> We have an organized system to keep track of inventory that comes in and out. 

**13. Do you accept damaged box consoles?**
> Yes, small rips and tears are acceptable, as long as everything is still brand new. By no means will we accept used products.

**14. Anything else I need to do before shipping?**
> Nope, after you ship, leave the rest up to us!


For any other concerns, feel free to ask in <#872358063636619285>
      `)

    message.channel.send({ embeds: [embed] });
    await message.delete();
  }
}