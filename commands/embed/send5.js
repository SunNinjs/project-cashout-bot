const { Message, Client, MessageEmbed } = require(`discord.js`)

module.exports = {
  name: `send5`,
  cooldown: 5,
  desc: `Send 5`,
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
      .setTitle(`__Welcome to Project Cashout!__`)
      .setDescription(`
\`\`\`
Here we provide the best customer service along with the best prices for electronic cashout. You will no longer have to deal with high fees or scams like you would on other selling platforms. 

At Project Cashout, you won’t have to worry about any problems or late payments. We have staffs working to ensure that everything goes smoothly from A-Z. Fast payments and labels will be provided at our own cost. We hope to provide you with an easy and quick selling experience. 

Quantity is not an issue, we are able to take unlimited amounts. We have been buying consoles for years now from across the country, and have built relationships with multiple distributers and clients. We are here to stay. Allow us to help you make money more convenient!
\`\`\`
      `)
      .addField(`__**Instructions:**__`, `
\u200B
> To ship, open <#872365247451762698> for a label.
> 
> To get paid, open <#872366770898477086> when packages deliver.
> 
> To drop off in person, open <#872363894448996393>.
> 
> To see how much payouts are, check <#872356512989843526>.
> 
> Make sure to read <#872358893727150171>, <#872361890133712917>, and <#872363854078812160> to understand the process.

Invite your friends, you will be rewarded <#872373309822627870>
[Invite Link](https://discord.gg/bGbkTpkChY)
      `)

    await message.delete(); 
    await message.channel.send({ embeds: [embed] });
    await message.channel.send(`Invite Link: https://discord.gg/bGbkTpkChY`)
  }
}