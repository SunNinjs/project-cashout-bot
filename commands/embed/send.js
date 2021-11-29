const { MessageEmbed } = require(`discord.js`);
const Prices = require(`../../schemas/prices.js`);

/**
 * @param {Message} message 
 */
 function channelCheck(message, string) {
  let guild = message.guild;
  let channels = guild.channels.cache.filter(c => c.type == `GUILD_TEXT`);
  let channel = channels.get(string);
  if (channel != undefined) return channel;
  channel = channels.find(c => c.name.toLowerCase() == string.toLowerCase())
  if (channel != undefined) return channel;
  channel = channels.find(c => `<#${c.id}>` == string);
  if (channel != undefined) return channel
  return undefined
}

module.exports = {
  name: `send`,
  cooldown: 5,
  sRoles: [`A`, `owner`, `ADMIN`, `staff`],
  desc: `Sends the embed`,
  async execute(message, args, client) {

    if (!args[0]) return message.channel.send({ embeds: [client.embeds.NoArgument()] })

    let check = channelCheck(message, args[0])

    if (!check) return message.channel.send(`Channel could not be found`)

    let prices = {
      digi: `670`,
      disc: `730`,
      xbox: `705`,
      oled: `385`,
      ps4: `360`,
      xboxs: `405`,
      xboxhalo: `860`,
      ov_digi: `680`,
      ov_disc: `755`,
      ov_xbox: `715`,
      ov_oled: `385`,
      ov_xboxs: `400`,
      ov_xboxhalo: `700`,
    }

    let temp = await Prices.find();
    if (temp.length > 0) prices = temp[0]

    const Emb = new MessageEmbed()
      .setColor(`#0fffbf`)
      .setFooter(`Project Cashout`, `https://cdn.discordapp.com/icons/866951718726139924/5115e54925a361fe03832435e6598596.webp?size=128`)
      .setTimestamp()
      .setTitle(`TODAY'S PRICES`)
      //.setThumbnail(`https://cdn.discordapp.com/attachments/896630033886613517/899866069777416222/unknown.png`)
      .setDescription(`__Payments will be received the same day packages are delivered.__\n\n🏷 **LABELS WILL BE PROVIDED! OVERNIGHT & GROUND SHIPPING!**\n\u200B`)
      .addField(`**__Consoles:__**`, `
> PS5 Disc - **$${prices.disc}**
> PS5 Digital - **$${prices.digi}**
> Xbox X - **$${prices.xbox}**
> Xbox X Halo - **$${prices.xboxhalo}**
> Switch OLED - **$${prices.oled}** (3 Minimum or with a console)
> Ps4 Slim - **$${prices.ps4}**
> \u200B
> **__Overnight Labels:__**
> PS5 Disc - **$${prices.ov_disc}**
> PS5 Digital - **$${prices.ov_digi}**
> Xbox X - **$${prices.ov_xbox}**
> Xbox X Halo - **$${prices.ov_xboxhalo}**
\u200B
      `)
      .addField(`**Other Electronics:**`, `
> Mario Kart 8 Switch - **$325** (3 minimum or with a console)
> Pokémon Switch Lite - **$215** (minimum 3 or with a console)
> Xbox S - **$${prices.xboxs}**
> Xbox Halo Elite Controller - **$250**
> Ps5/Xbox Controllers - **$30**
> Ps5/Xbox Games - **$15**
> Ps5 Headsets - **$50**
> Neon/ Grey Switch - **$250**
> Fortnite Wildcat Switch - **$250**
> Animal Crossing Switch - **$250**
> Media Remote - **$15**
> Airpods Pro - **$140**
> Airpods Wireless Charging - **$75**
> Airpods Wired Charging - **$90**

**Open a ticket in <#872365247451762698> for a label. Prices are guaranteed once shipped!**
      `, false)

    await check.send({ embeds: [Emb], content: `@everyone` });
    await message.delete();
  }
}