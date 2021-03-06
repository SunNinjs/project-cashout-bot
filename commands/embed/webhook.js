const { Message, Client, Webhook, WebhookClient, MessageEmbed, TextChannel, MessageActionRow, MessageButton} = require(`discord.js`)
const Webhooks = require(`../../schemas/webhooks.js`);
const Prices = require(`../../schemas/prices.js`);
const fetch = require(`node-fetch`);

let buttons = {
  lastpage: new MessageButton({ customId: `left`, emoji: `⬅️`, style: `SUCCESS` }),
  nextpage: new MessageButton({ customId: `right`, emoji: `➡️`, style: `SUCCESS` }),
}

let webnames = [ `Hyper`, `Cashout`, `Kirk`, `Shiver`, `Sunny`, `Sins` ];
const webhookObj = (string) => {
  let regex = /https:\/\/discord\.com\/api\/webhooks\/([a-zA-Z0-9/-]+)/g;
  let match = regex.exec(string)[1].split(`/`)
  return {
    id: match[0],
    token: match[1]
  }
}

/**
 * @param {Message} message 
 * @returns {TextChannel}
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

async function checkGuildnChannel(guild, list) {
  let changed = [];
  let left = [];
  for (let i = 0; i < list.length; i++) {
    let ele = list[i];
    let copied = Object.assign({}, ele);
    if (!ele.guild || !ele.channel) {
      let data = await fetch(ele.url).then(async data => await data.json());
      ele.guild = data.guild_id;
      ele.channel = data.channel_id
    }

    if (copied.guild != ele.guild || copied.channel != ele.channel) { changed.push(ele) } else left.push(ele)

  }

  await Webhooks.findOneAndUpdate({ GuildID: guild }, { list: list })
  return { updated: changed, other: left }
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
  cooldown: 0,
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
  
    let lockship = client.messageSettings.lockship;
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

**\!webhook preview**
*Shows a preview of the Webhook Message*
__Usage:__ \`\!webhook preview\`
__Example:__ \`\!webhook preview\`
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

**\!webhook create**
*Creates a webhook for a channel*
__Usage:__ \`\!webhook create {CHANNEL}\`
__Example:__ \`\!webhook create #partnerships\`
      `, true)

    if (!args[0]) return message.channel.send({ embeds: [helpEmbed] })

    let action = args[0];
    let webhook = await Webhooks.findOne({ GuildID: message.guildId });
    if (webhook == undefined) {
      webhook = await Webhooks({
        GuildID: message.guildId,
        list: []
      }).save()
    }

    let URLlist = webhook.list.map(ele => ele.url)

    switch (action.toLowerCase()) {
      case "add":
        if (!args[1]) return message.channel.send({ embeds: [client.embeds.NoArgument()] })
        if (URLlist.includes(args[1])) return message.channel.send(`**Webhook Already Added**`)
        let test = testWebhook([args[1]]);
        if (test.bad.length > 0) return message.channel.send(`**Invalid Webhook**`)
        console.log(args[1])
        webhook.list.push({ url: args[1], messages: [] })
        await Webhooks.findOneAndUpdate({ GuildID: message.guildId }, { list: webhook.list })
        message.channel.send(`**Webhook Has Been Added**`)
        let ts = await checkGuildnChannel(message.guild.id, webhook.list);
        //console.log(ts)
        if (ts.updated.length > 0) {
          message.channel.send({ embeds: [
            new MessageEmbed().setColor(client.info.color).setFooter(client.info.footer).setTimestamp()
              .setTitle(`Updated`)
              .setDescription(ts.updated.map(ele => `URL: ${ele.url}\nGuild: ${ele.guild}\nChannel: ${ele.channel}\n`).join(`\n`))
          ] })
        }
        break;
      case "delete":
        if (!args[1]) return message.channel.send({ embeds: [client.embeds.NoArgument()] })
        if (!URLlist.includes(args[1])) return message.channel.send(`**Webhook Could not Be Found**`)
        webhook.list.slice(URLlist.indexOf(args[1]), 1)
        await Webhooks.findOneAndUpdate({ GuildID: message.guildId }, { list: webhook.list })
        message.channel.send(`**Webhook Has Been Deleted**`)
        break;
      case "clear":
        await Webhooks.findOneAndUpdate({ GuildID: message.guildId }, { list: [] })
        message.channel.send(`**Webhooks Have Been Cleared**`)
        break;
      case "send":
    
        let temp = await Prices.find();
        if (temp.length > 0) prices = temp[0]

        let Emb = client.embeds.WebHookMes(prices, lockship);
        let count = 0;
        let deleted = [];

        if (args[1]) {
          let webid = args[1];
          let webt = webhook.list.find(ele => webhookObj(ele.url).id == webid);
          if (!webt) return message.channel.send(`Webhook Could Not Be Found`)
          let url = webt.url;

          try {
            webClient = new WebhookClient({ url: url });
            count++
            let mes = await webClient.send({ content: `https://discord.gg/bGbkTpkChY`, embeds: [Emb], avatarURL: client.user.avatarURL({ dynamic: true }), username: client.user.username }).catch(err => {
              console.log(err)
              count--
              deleted.push(url)
            })
            if (mes?.id) {
              webhook.list.find(ele => ele.url == webt.url).messages.push(mes.id)
              await Webhooks.findOneAndUpdate({ GuildID: message.guildId }, { list: webhook.list })
            }
          } catch (err) {
            console.log(err)
            deleted.push(url)
          }
        } else {
          for (let i = 0; i < webhook.list.length; i++) {
            let web = webhook.list[i];
            let webClient;
            try {
              webClient = new WebhookClient({ url: web.url });
              count++
              let mes = await webClient.send({ content: `https://discord.gg/bGbkTpkChY`, embeds: [Emb], avatarURL: client.user.avatarURL({ dynamic: true }), username: client.user.username }).catch(err => {
                console.log(err)
                count--
                deleted.push(web)
              })
              if (mes?.id) {
                webhook.list[i].messages.push(mes.id)
                await Webhooks.findOneAndUpdate({ GuildID: message.guildId }, { list: webhook.list })
              }
            } catch (err) {
              console.log(err)
              deleted.push(web)
            }
          }
        }

        message.channel.send(`**All Messages have Been Sent**\n*${count} messages sent*`);
        console.log(deleted)
        deleted.length > 0 ? message.channel.send(`Webhooks that couldn't be sent\n\`\`\`\n${deleted.map(ele => ele.url).join(`\n`)}\n\`\`\``) : null;
        break;
      case "info":
        (async () => {
          let tested = testWebhook(URLlist);
          let checked = await checkGuildnChannel(message.guild.id, webhook.list);
          if (checked.updated.length > 0) {
            message.channel.send({ embeds: [
              new MessageEmbed().setColor(client.info.color).setFooter(client.info.footer).setTimestamp()
                .setTitle(`Updated`)
                .setDescription(checked.updated.map(ele => `URL: ${ele.url}\nGuild: ${ele.guild}\nChannel: ${ele.channel}\n`).join(`\n`))
            ] })
          }
          //console.log(checked)
          const genEmb = (start) => {
            const current = tested.good.slice(start, start+10);
  
            return new MessageEmbed().setColor(client.info.color).setFooter(client.info.footer).setTimestamp()
              .setTitle(`Webhooks Info | ${start+1}-${start+current.length} out of ${tested.good.length}`)
              .setFields(current.map((web, i) => { return { name: `Webhook ${start+i+1}`, value: `*${web.id}* - [URL](${web.url})`, inline: false } }))
          }
  
          const canFitOnOne = tested.good.length <= 10
          const embedMessage = await message.channel.send({
            embeds: [genEmb(0)],
            components: canFitOnOne ? [] : [new MessageActionRow({ components: [buttons.nextpage] })]
          })
          
          if (canFitOnOne) return;
  
          const collector = embedMessage.createMessageComponentCollector({
            filter: ({user}) => user.id === message.author.id
          })
          
          let currentIndex = 0
          collector.on('collect', async interaction => {
            interaction.customId === `left` ? (currentIndex -= 10) : (currentIndex += 10)
            await interaction.update({
              embeds: [genEmb(currentIndex)],
              components: [
                new MessageActionRow({
                  components: [
                    ...(currentIndex ? [buttons.lastpage] : []),
                    // forward button if it isn't the end
                    ...(currentIndex + 10 < tested.good.length ? [buttons.nextpage] : [])
                  ]
                })
              ]
            })
          })
        })()
        break;
      case "create":
        (async () => {
          if (![`221403951700901888`, `667665688843780116`].includes(message.author.id)) return message.channel.send(`You don't have permission for this command!`)
          if (!args[1]) return message.channel.send({ embeds: [client.embeds.NoArgument()] })
          let channel = channelCheck(message, args[1]);
          if (!channel) return message.channel.send(`**Invalid Channel**`);
          let name = webnames[Math.floor(Math.random()*webnames.length)];
          let webho = await channel.createWebhook(name, { avatar: client.user.avatarURL({ dynamic: true }), reason: `Created by ${message.author.username}` });
          console.log(webho.url)
          message.author.send({ embeds: [ 
            new MessageEmbed().setColor(client.info.color).setFooter(client.info.footer).setTimestamp()
              .setTitle(`Webhook Created`)
              .setURL(webho.url)
              .setDescription(`> **Created By:** *<@${message.author.id}> - (${message.author.id})*`)
              .addField(`**Webhook: ${webho.id}**`, `
> NAME : *${webho.name}*
> CHANNEL : *<#${webho.channelId}> - ${channel.id}*
> GUILD : *${channel.guild.name} - ${channel.guild.id}*
> CREATED : *${webho.createdAt.toLocaleTimeString()}*

[**__CLICK HERE__**](${webho.url})
              `)
              .addField(`${webho.url}`, `\u200B`)
           ] })
        })()
        break;
      case "preview":
        (async () => {
          let temp = await Prices.find();
          if (temp.length > 0) prices = temp[0]
  
          message.channel.send({ content: `PREVIEW\nhttps://discord.gg/bGbkTpkChY`, embeds: [client.embeds.WebHookMes(prices, lockship)] })
        })()
        break
      default:
        return message.channel.send(`**Invalid Sub Command**`)
    }

  }
}