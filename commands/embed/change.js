const { Message, Client, MessageEmbed } = require(`discord.js`)
const Prices = require(`../../schemas/prices.js`);

let change = {
  digi: `PS5 Digital`,
  disc: `PS5 Disc`,
  dischorizon: `Disc Horizon`,
  digihorizon: `Digital Horizon`,
  xbox: `XBOX`,
  oled: `Nitendo OLED`,
  ps4: `PS4 Slim`,
  xboxs: `XBOX S`,
  xboxhalo: `XBOX Halo`,
  ov_digi: `Overnight PS5 Digital`,
  ov_disc: `Overnight PS5 Disc`,
  ov_xbox: `Overnight XBOX`,
  ov_oled: `Overnight Nitendo OLED`,
  ov_xboxs: `Overnight XBOX S`,
  ov_xboxhalo: `Overnight XBOX X Halo`,
  la_digi: `LA DROP PS5 Digital`,
  la_disc: `LA DROP PS5 Disc`,
  la_xbox: `LA DROP XBOX`,
  la_xboxhalo: `LA DROP XBOX X Halo`,
  la_ps4: `LA DROP PS4`,
  marioswitch: `Mario Kart 8 Switch`,
  pokeswitch: `Pokémon Switch Lite`,
  controller: `PS5/Xbox Controllers`,
  halocontroller: `Xbox Halo Elite Controller`,
  games: `PS5/Xbox Games`,
  headsets: `PS5/Xbox Headsets`,
  neonswitch: `Neon/Grey Switch`,
  fortniteswitch: `Fortnite Wildcat Switch`,
  animalswitch: `Animal Crossing Switch`,
  remote: `Media Remote`,
  airpodspro: `Airpods Pro`,
  airpodswireless: `Airpods Wireless Charging`,
  airpodswired: `Airpods Wired Charging`
}

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
    if (args[0].toLowerCase() == `help`) {
      let helpembed = new MessageEmbed()
        .setColor(client.info.color).setFooter(client.info.footer).setTimestamp()
        .setTitle(`Price Changing Help`)
        .setDescription(`
**Items:**
${Object.entries(change).map(item => `**${item[0]}** - *${item[1]}*`).join(`\n`)}
        `)
      
      return message.channel.send({ embeds: [helpembed] });
    }
    if (!args[1]) return message.channel.send({ embeds: [client.embeds.NoArgument()] })

    let prices = {
      digi: `670`,
      disc: `730`,
      dischorizon: `730`,
      digihorizon: `670`,
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
      la_digi: `680`,
      la_disc: `695`,
      la_xbox: `580`,
      la_xboxhalo: `740`,
      la_ps4: `390`,
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
    if (!temp.length) {
      await new Prices(prices).save()
    } else prices = temp[0]

    let old = Object.assign({}, prices._doc)

    function embed(type, price, temp) {

      let newt = temp ? change[`ov_${temp}`] : change[type]

      let updateEmbed = new MessageEmbed()
      .setColor(client.info.color)
      .setFooter(`${client.info.footer}\n${new Date().toLocaleString()}`)
      .setTimestamp()
      .setTitle(`${newt}'s price has been changed to ${price}`)
      .setDescription(`Old price was ${temp ? old[`ov_${temp}`] : old[type]}`)
    
      return updateEmbed
    }

    //console.log(prices)

    let action = args[0].toLowerCase();
    let price = args[1].toLowerCase();
    
    let number = action != `next` ? price : 0;
    //if (number == NaN) return message.channel.send(`Invalid Prices\nGot '${price}', need a number`);

    let temp2 = undefined;
    let price2;

    if (price == `na`) {
      price = `Not Buying`
    } else {
      price = `$${price}`
    }

    switch (action) {
      case "help":
        break;
      case "disc":
        prices.disc = price;
        break;
      case "digi":
        prices.digi = price;
        break;
      case "dischorizon":
        prices.dischorizon = price;
        break;
      case "digihorizon":
        prices.digihorizon = price;
        break;
      case "xbox":
        prices.xbox = price;
        break;
      case "ps4":
        prices.ps4 = price;
        break;
      case "oled":
        prices.oled = price;
        break;
      case "xboxs":
        prices.xboxs = price;
        break;
      case "xboxhalo":
        prices.xboxhalo = price;
        break;
      case "marioswitch":
        prices.marioswitch = price;
        break;
      case "pokeswitch":
        prices.pokeswitch = price;
        break;
      case "controller":
        prices.controller = price;
        break;
      case "halocontroller":
        prices.halocontroller = price;
        break;
      case "games":
        prices.games = price;
        break;
      case "headsets":
        prices.headsets = price;
        break;
      case "neonswitch":
        prices.neonswitch = price;
        break;
      case "fortniteswitch":
        prices.fortniteswitch = price;
        break;
      case "animalswitch":
        prices.animalswitch = price;
        break;
      case "remote":
        prices.remote = price;
        break;
      case "airpodspro":
        prices.airpodspro = price;
        break;
      case "airpodswireless":
        prices.airpodswireless = price;
        break;
      case "airpodswired":
        prices.airpodswired = price;
        break;
      case "next":
        (async () => {
          if (!args[2]) return message.channel.send({ embeds: [client.embeds.NoArgument()] });
          let secondaction = args[1].toLowerCase();
          price2 = args[2].toLowerCase();
    
          if (price2 == `na`) {
            price2 = `Not Buying`
          } else {
            price2 = `$${price2}`
          }
          
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
              prices.ov_xboxs = price2
            case "xboxhalo":
              temp2 = `xboxhalo`
              prices.ov_xboxhalo = price2
          }
        })()
        break;
      case "la_disc":
        prices.la_disc = price;
        break;
      case "la_digi":
        prices.la_digi = price;
        break;
      case "la_xbox":
        prices.la_xbox = price;
        break;
      case "la_xboxhalo":
        prices.la_xboxhalo = price;
        break;
      case "la_ps4":
        prices.la_ps4 = price;
        break;
      default:
        message.channel.send(`Invalid type`);
        return message.channel.send(`**Types:**\n${Object.entries(change).map(item => `**${item[0]}** - *${item[1]}*`).join(`\n`)}`)
    }

    //console.log(old, prices)

    message.channel.send({ embeds: [embed(action, (temp2 ? price2 : price), temp2)] })
    await Prices.findOneAndUpdate({ digi: old.digi }, prices);
  }
}