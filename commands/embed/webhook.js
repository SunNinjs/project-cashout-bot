const { Message, Client, Webhook, WebhookClient, MessageEmbed } = require(`discord.js`)
const Webhooks = require(`../../schemas/webhooks.js`);
const Prices = require(`../../schemas/prices.js`);

const webhookObj = (string) => {
  let regex = /https:\/\/discord\.com\/api\/webhooks\/([a-zA-Z0-9/-]+)/g;
  let match = regex.exec(string)[1].split(`/`)
  return {
    id: match[0],
    token: match[1]
  }
}

/**
 * @param {Array<WebhookClient>} webhooks
 * @returns {Object}
 */
function testWebhook(webhooks) {
  let good = [];
  let bad = [];
  for (let i = 0; i < webhooks.length; i++) {
    let url = webhooks[i];
    let temp;
    try {
      temp = new WebhookClient({ url: url });
      temp.edit({ name: `Project Cashout Webhook` })
      good.push(temp)
    } catch (err) {
      bad.push(url);
    }
  }

  return { good, bad }
}

//let webhook = new WebhookClient({ url: `` }, )

module.exports = {
  name: `webhook`,
  cooldown: 5,
  desc: `Sends a message to all webhooks`,
  sRoles: [`A`, `owner`],
    /**
   * Sends an custom Embed
   * @param {Message} message 
   * @param {Array<String>} args 
   * @param {Client} client 
   * @returns {void} void
   */
  async execute(message, args, client) {
    if (!args[0]) return message.channel.send({ embeds: [client.embeds.NoArgument()] })

    let action = args[0];
    let webhook = await Webhooks.findOne({ GuildID: message.guildId });
    if (webhook == undefined) {
      webhook = await Webhooks({
        GuildID: message.guildId,
        webhooks: []
      }).save()
    }

    switch (action.toLowerCase()) {
      case "add":
        if (!args[1]) return message.channel.send({ embeds: [client.embeds.NoArgument()] })
        let test = testWebhook([args[1]]);
        if (test.bad.length > 0) return message.channel.send(`**Invalid Webhook**`)
        webhook.webhooks.push(args[1])
        await Webhooks.findOneAndUpdate({ GuildID: message.guildId }, { webhooks: webhook.webhooks })
        message.channel.send(`**Webhook Has Been Added**`)
        break;
      case "delete":
        if (!args[1]) return message.channel.send({ embeds: [client.embeds.NoArgument()] })
        if (!webhook.webhooks.includes(args[1])) return message.channel.send(`**Webhook Could not Be Found**`)
        webhook.webhooks.slice(webhook.webhooks.indexOf(args[1]) , 1)
        await Webhooks.findOneAndUpdate({ GuildID: message.guildId }, { webhooks: webhook.webhooks })
        message.channel.send(`**Webhook Has Been Deleted**`)
        break;
      case "clear":
        await Webhooks.findOneAndUpdate({ GuildID: message.guildId }, { webhooks: [] })
        message.channel.send(`**Webhooks Have Been Cleared**`)
        break;
      case "send":

        let prices = {
          digi: `670`,
          disc: `730`,
          xbox: `705`,
          oled: `385`,
          ps4: `360`,
          ov_digi: `680`,
          ov_disc: `755`,
          ov_xbox: `715`,
          ov_oled: `385`
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
> Switch OLED - **$${prices.oled}** (3 Minimum or with a console)
> \u200B
> **__Overnight Labels:__**
> PS5 Disc - **$${prices.ov_disc}**
> PS5 Digital - **$${prices.ov_digi}**
> Xbox X - **$${prices.ov_xbox}**
> Switch OLED - **$${prices.ov_oled}** (3 Minimum or with a console)
\u200B
          `)
          .addField(`**Other Electronics:**`, `
> Xbox S - **$300**
> Ps4 Slim - **$${prices.ps4}**
> Mario Kart 8 Switch - **$320**
> Neon/ Grey Switch - **$250**
> Fortnite Wildcat Switch - **$250**
> Animal Crossing Switch - **$250**
> Ps5/Xbox Controllers - **$30**
> Ps5/Xbox Games - **$15**
> Ps5 Headsets - **$50**
> Media Remote - **$15**
> Airpods Pro - **$140**
> Airpods Wireless Charging - **$75**
> Airpods Wired Charging - **$90**
> Apple Watch Ser 6 (40mm/44mm) - **$280/$310** (no red or blue)
> Apple Watch Ser 6 SE (40mm/44mm) - **$210/$240**
> Apple Watch Ser 5 (40mm/44mm) - **$210/$240**
> Apple Watch Ser 3 (40mm/44mm) - **$90/$120**
> iPad 8 (32gb/128gb) - **$120/$300**
> iPad Air 4 (64gb/256gb) - **$410/$510**
> iPad Mini 5 (64gb/256gb) - **$230/$330**
> iPad Pro 11’ V2 (128gb/256gb/512gb/1tb)  - **$400/$500/$600/$700**
> iPad Pro 12.9’ 4th Gen (128gb/256gb/512gb/1tb) - **$450/$550/$650/$750**
    
**Open a ticket in <#872365247451762698> for a label. Prices are guaranteed once shipped!**
          `, false)

        let deleted = [];
        for (let i = 0; i < webhook.webhooks.length; i++) {
          let web = webhook.webhooks[i];
          let webClient;
          try {
            webClient = new WebhookClient({ url: web });
            await webClient.send({ embeds: [Emb], content: `@everyone`, avatarURL: client.user.avatarURL({ dynamic: true }), username: client.user.username }).catch(err => {
              deleted.push(web)
            })
          } catch (err) {
            deleted.push(web)
          }
        }
        message.channel.send(`**All Messages have Been Sent**`);
        deleted.length > 0 ? message.channel.send(`Webhooks that couldn't be sent\n\`\`\`\n${deleted.join(`\n`)}\n\`\`\``) : null;
        break;
    }

  }
}