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
 * @returns {{ good: Array<WebhookClient>, bad: Array<String> }}
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
  
    let helpEmbed = new MessageEmbed().setColor(client.info.color).setFooter(client.info.footer).setTimestamp()
      .setTitle(`Command: \!webhook`)
      .setDescription(`Sends a Message to All Webhooks`)
      .addField(`\u200B`, `
**\!webhook add**
*Adds a Webhook to list*
__Usage:__ \`\!webhook add {LINK}\`
__Example:__ \`\!webhook add https://discord.com/api/webhooks/905197857848573993/5-1YruIvNb\`

**\!webhook delete**
*Removes a Webhook from the list*
__Usage:__ \`\!webhook delete {LINK}\`
__Example:__ \`\!webhook delete https://discord.com/api/webhooks/905197857848573993/5-1YruIvNb\`

**\!webhook info**
*Shows info about your Webhook List*
__Usage:__ \`\!webhook info\`
__Example:__ \`\!webhook info\`
      `, true)
      .addField(`\u200B`, `
**\!webhook clear**
*Clears the Webhook List*
__Usage:__ \`\!webhook clear\`
__Example:__ \`\!webhook clear\`

**\!webhook send**
*Sends the message to all Webhooks*
__Usage:__ \`\!webhook send\`
__Example:__ \`\!webhook send\`
      `, true)

    if (!args[0]) return message.channel.send({ embeds: [helpEmbed] })

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

        let Emb = client.embeds.WebHookMes(prices);
        let count = 0;

        let deleted = [];
        for (let i = 0; i < webhook.webhooks.length; i++) {
          let web = webhook.webhooks[i];
          let webClient;
          try {
            webClient = new WebhookClient({ url: web });
            count++
            await webClient.send({ embeds: [Emb], content: `@everyone`, avatarURL: client.user.avatarURL({ dynamic: true }), username: client.user.username }).catch(err => {
              count--
              deleted.push(web)
            })
          } catch (err) {
            deleted.push(web)
          }
        }
        message.channel.send(`**All Messages have Been Sent**\n*${count} messages sent*`);
        deleted.length > 0 ? message.channel.send(`Webhooks that couldn't be sent\n\`\`\`\n${deleted.join(`\n`)}\n\`\`\``) : null;
        break;
      case "info":
        let infoEmbed = new MessageEmbed().setColor(client.info.color).setFooter(client.info.footer).setTimestamp()
          .setTitle(`Webhooks Info`)

        let tested = testWebhook(webhook.webhooks);
        infoEmbed.addField(`**Webhooks:**`, tested.good.map((ele, i) => `**${i+1}.)** *${ele.id}* - [URL](${ele.url})`).join(`\n`) || `None`)
        message.channel.send({ embeds: [infoEmbed] })
        break;
      default:
        return message.channel.send(`**Invalid Sub Command**`)
    }

  }
}