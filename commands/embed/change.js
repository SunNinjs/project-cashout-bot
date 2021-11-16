const { Message, Client, MessageEmbed } = require(`discord.js`)
const Prices = require(`../../schemas/prices.js`);

module.exports = {
  name: `change`,
  cooldown: 0,
  desc: `Changes the prices for different items`,
  sRoles: [`A`, `ADMIN`, `owner`],
    /**
   * Sends an custom Embed
   * @param {Message} message 
   * @param {Array<String>} args 
   * @param {Client} client 
   * @returns {void} void
   */
  async execute(message, args, client) {

    if (!args[0]) return message.channel.send({ embeds: [client.embeds.NoArgument()] })
    if (!args[1]) return message.channel.send({ embeds: [client.embeds.NoArgument()] })

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
      ov_xboxs: `400`
    }

    let temp = await Prices.find();
    if (!temp.length) {
      await new Prices(prices).save()
    } else prices = temp[0]

    let old = Object.assign({}, prices._doc)

    function embed(type, price, temp) {
      let change = {
        digi: `PS5 Digital`,
        disc: `PS5 Disc`,
        xbox: `XBOX`,
        oled: `Nitendo OLED`,
        ps4: `PS4 Slim`,
        xboxs: `XBOX S`,
        xboxhalo: `XBOX Halo`,
        ov_digi: `Overnight PS5 Digital`,
        ov_disc: `Overnight PS5 Disc`,
        ov_xbox: `Overnight XBOX`,
        ov_oled: `Overnight Nitendo OLED`,
        ov_xboxs: `XBOX S`,
      }

      let newt = temp ? change[`ov_${temp}`] : change[type]

      let updateEmbed = new MessageEmbed()
      .setColor(client.info.color)
      .setFooter(client.info.footer)
      .setTimestamp()
      .setTitle(`${newt}'s price has been changed to $${price}`)
      .setDescription(`Old price was $${temp ? old[`ov_${temp}`] : old[type]}`)
    
      return updateEmbed
    }

    //console.log(prices)

    let action = args[0].toLowerCase();
    let price = args[1].toLowerCase();
    
    let number = action != `next` ? Number.parseInt(price) : 0;
    if (number == NaN) return message.channel.send(`Invalid Prices\nGot '${price}', need a number`);

    let temp2 = undefined;
    let price2;

    if (action == `disc`) {
      prices.disc = price;
    } else if (action == `digi`) {
      prices.digi = price;
    } else if (action == `xbox`) {
      prices.xbox = price;
    } else if (action == `ps4`) {
      prices.ps4 = price;
    } else if (action == `oled`) {
      prices.oled = price;
    } else if (action == `xboxs`) {
      prices.xboxs = price;
    } else if (action == `xboxhalo`) {
      prices.xboxhalo = price;
    } else if (action == `next`) {

      if (!args[2]) return message.channel.send({ embeds: [client.embeds.NoArgument()] });
      let secondaction = args[1].toLowerCase();
      price2 = Number.parseInt(args[2]);
      if (price2 == NaN) return message.channel.send(`Invalid Prices\nGot '${price2}', need a number`);

      switch (secondaction) {
        case "disc":
          temp2 = `disc`
          prices.ov_disc = price2;
          break;
        case "digi":
          temp2 = `digi`
          prices.ov_digi = price2;
          break;
        case "xbox":
          temp2 = `xbox`
          prices.ov_xbox = price2;
          break;
        case "oled":
          temp2 = `oled`
          prices.ov_oled = price2
          break;
        case "xboxs":
          temp2 = `xboxs`
          prices.ov_xboxs = prices2
      }

    } else {
      return message.channel.send(`Invalid type, types are\ndisc\ndigi\nxbox\nps4\noled\nxboxs\nnext`)
    }

    //console.log(old, prices)

    message.channel.send({ embeds: [embed(action, (temp2 ? price2 : price), temp2)] })
    await Prices.findOneAndUpdate({ digi: old.digi }, prices);
  }
}