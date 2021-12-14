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
      xboxs: `400`,
      xboxhalo: `860`,
      ov_digi: `680`,
      ov_disc: `755`,
      ov_xbox: `715`,
      ov_oled: `385`,
      ov_xboxs: `400`,
      ov_xboxhalo: `700`,
      marioswitch: `330`,
      pokeswitch: `215`,
      controller: `35`,
      halocontroller: `250`,
      games: `15`,
      headsets: `55`,
      neonswitch: `250`,
      fortniteswitch: `250`,
      animalswitch: `250`,
      remote: `15`,
      airpodspro: `140`,
      airpodswireless: `75`,
      airpodswired: `90`
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
> PS5 Disc - **${prices.disc}**
> PS5 Digital - **${prices.digi}**
> Xbox X - **${prices.xbox}**
> Xbox X Halo - **${prices.xboxhalo}**
> Switch OLED - **${prices.oled}** (3 Minimum or with a console)
> Ps4 Slim - **${prices.ps4}**
> \u200B
> **__Overnight Labels:__**
> PS5 Disc - **${prices.ov_disc}**
> PS5 Digital - **${prices.ov_digi}**
> Xbox X - **${prices.ov_xbox}**
> Xbox X Halo - **${prices.ov_xboxhalo}**
\u200B
      `)
      .addField(`**Other Electronics:**`, `
> Mario Kart 8 Switch - **${prices.marioswitch}** (3 Minimum or with a console)
> Pokémon Switch Lite - **${prices.pokeswitch}** (3 Minimum or with a console)
> Xbox S - **${prices.xboxs}**
> Xbox Halo Elite Controller - **${prices.halocontroller}**
> Ps5/Xbox Controllers - **${prices.controller}**
> Ps5/Xbox Games - **${prices.games}**
> Ps5 Headsets - **${prices.headsets}**
> Neon/ Grey Switch - **${prices.neonswitch}**
> Fortnite Wildcat Switch - **${prices.fortniteswitch}**
> Animal Crossing Switch - **${prices.animalswitch}**
> Media Remote - **${prices.remote}**
> Airpods Pro - **${prices.airpodspro}**
> Airpods Wireless Charging - **${prices.airpodswireless}**
> Airpods Wired Charging - **${prices.airpodswired}**

**Open a ticket in <#872365247451762698> for a label. Prices are guaranteed once shipped!**
      `, false)

    await check.send({ embeds: [Emb], content: `@everyone` });
    await message.delete();
  }
}