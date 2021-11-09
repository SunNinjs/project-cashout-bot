const { Message, Client, Collection, Guild, Intents, MessageEmbed, MessageActionRow, MessageButton } = require(`discord.js`);
const { EventEmitter } = require(`events`);
require(`dotenv`).config()

const info = {
  color: `#3fbf9b`,
  prefix: process.env.PREFIX,
  errColor: `#73110a`,
  footer: `Made By Sun#4798 || Dm if any issues!`,
  footerImg: `https://64.media.tumblr.com/50b0f8b09564ece765e0f1f1dbeb3f0f/44508fffb1ecb43e-92/s800x448/3b361e24656372acc1254910cec552d1c5798b74.gif`,
  emojis: {
    X: `❌`,
    exclamation_question: `⁉️`,
    headphones: `🎧`,
    clocks: [`🕐`, `🕑`, `🕒`, `🕓`, `🕔`, `🕕`, `🕖`, `🕗`, `🕘`, `🕙`, `🕚`, `🕛`, `🕜`, `🕝`, `🕞`, `🕟`, `🕠`, `🕡`, `🕢`, `🕣`, `🕤`, `🕥`, `🕦`, `🕧`],
    clocks2: {

    }
  }
};

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

function parseMS(ms) {
  const roundTowardsZero = ms > 0 ? Math.floor : Math.ceil;
  return {
    days: roundTowardsZero(ms / 86400000),
    hours: roundTowardsZero(ms / 3600000) % 24,
    minutes: roundTowardsZero(ms / 60000) % 60,
    seconds: roundTowardsZero(ms / 1000) % 60
  };
}

function durationString(durObj) {
  return Object.values(durObj)
    .map((m) => (isNaN(m) ? 0 : m))
    .join(':');
}

/*
  async IdMaker() {
    let result = await libraries.find();
    let ids = result.flatMap(lib => lib.playlists).map(pl => pl.id);
    ids.sort((a, b) => Number.parseInt(a) - Number.parseInt(b));
    let id = `${Number.parseInt(ids[ids.length - 1]) + 1}`;
    if (id.length < 7) {
      let missing = 7 - id.length;
      let string = ``;
      for (i = 0; i < missing; i++) { string += `0` }
      id = `${string}${id}`
    }
    return id
  }
*/

const Errors = new Collection();
Errors
  .set(`Music`, {
    200001: `Command Executor is not in a Voice Channel`,
    200002: `Command Executor is not in the same Voice Channel as the bot`,
    200004: `There is no songs in the queue`,
    200003: `Bot is not in a Voice Channel`,
    200005: `Nothing is playing`,
  })
  .set(`Normal`, {
    100001: `Invalid Permissions`,
    100002: `Invalid Bot Permissions`,
    100003: `Argument Missing or not valid`,
    100004: `No Dj Roles Found`,
    100005: `Invalid Arguments`,
    100006: `User could not be found`
  })
  .set(`Playlist`, {
    300001: `Playlist with name already exists`,
    300002: `Max Amount of Playlists In Library`,
    300003: `No Library Found for Member`,
    300004: `Playlist could not be Found`,
    300005: `Max Amount of Songs in Playlist`,
    300006: `Song Could not be Found`,
    300007: `Name is invalid or missing`,
})

class Util extends EventEmitter {
  /**
   * 
   * @param {Client} client 
   */
  constructor(client) {
    super()
    this.client = client || undefined;

    this.info = info

    this.errors = Errors

    this.embeds = {
      WebHookMes(prices) {
        const Emb = new MessageEmbed()
        .setColor(`#0fffbf`)
        .setFooter(`Project Cashout`, `https://cdn.discordapp.com/icons/866951718726139924/5115e54925a361fe03832435e6598596.webp?size=128`)
        .setTimestamp()
        .setTitle(`TODAY'S PRICES`)
        //.setThumbnail(`https://cdn.discordapp.com/attachments/896630033886613517/899866069777416222/unknown.png`)
        .setDescription(`__Prices are locked in once you ship them out to us.__\n\n🏷 **LABELS WILL BE PROVIDED! OVERNIGHT & GROUND SHIPPING!**\n\u200B`)
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
> Xbox S - **$${prices.xboxs}**
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

🏷 __**Members will have the option to choose between express shipping or regular shipping.**__
💵 __Payments will be received the SAME DAY packages are delivered.__
        `, false)
        .addField(`**Payment Methods:**`, `Paypal, Zelle, Venmo, Cashapp, Applepay, BofA transfer, Chase transfer, ACH transfer, Wire transfer, Checks\n\nCheck out our discord for more details:\n[Link https://discord.gg/bGbkTpkChY](https://discord.gg/bGbkTpkChY)`)

        return Emb
      },
      AppleProducts() {
        let embed = new MessageEmbed()
          .setColor(`#0fffbf`)
          .setFooter(`Project Cashout`, `https://cdn.discordapp.com/icons/866951718726139924/5115e54925a361fe03832435e6598596.webp?size=128`)
          .setTimestamp()
          .setTitle(`__Apple Products__`)
          .setDescription(`
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
> iPhone 13 Pro Max 128GB - **$1250**
> iPhone 13 Pro Max 256GB - **$1360**
> iPhone 13 Pro Max 512GB - **$1550**
          `)

          return embed
      },
      Guides() {
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
        return embed        
      },
      WelcomeMessage() {
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
        return embed
      },
      Shipping() {
      let embed = new MessageEmbed()
      .setColor(`#0fffbf`)
      .setFooter(`Project Cashout`, `https://cdn.discordapp.com/icons/866951718726139924/5115e54925a361fe03832435e6598596.webp?size=128`)
      .setTimestamp()
      .setTitle(`__Shipping and Packaging__`)
      .setDescription(`
**__PACKAGING:__** 

> Please make sure your products are properly packaged and taped to prevent any damage. 
> 
> Any box that you use to ship is acceptable, we recommend to ship 2 consoles per box.

If you don’t have any boxes that fit, [here are some recommendations](https://docs.google.com/document/d/1F2NWHaN6usiIax5jAyARRUTbgUNfRWnWlpALQkFJxj4/edit?usp=sharing)

**__SHIPPING:__**

**Labels will be provided for you after you open a ticket to ship.**

**Factors to keep in mind,**
> 1. The weight on the label will not have to match the actual weight. UPS will charge our account the right amount for each package after.
> 2. The return address on the label will be our address instead of your home address. This helps to quicken the process of label generating.
> **3. Please use the smallest box you have that can fit the consoles, to prevent any damages.**
      `)

        return embed
      },
      Payments() {
      let embed = new MessageEmbed()
      .setColor(`#0fffbf`)
      .setFooter(`Project Cashout`, `https://cdn.discordapp.com/icons/866951718726139924/5115e54925a361fe03832435e6598596.webp?size=128`)
      .setTimestamp()
      .setTitle(`__Payments__`)
      .setDescription(`
\u200B
Payments will be received once the package has been delivered and approved.

Please be willing to accept multiple forms of payment due to daily limits for each method.

Open a ticket when your packages deliver. <#872366770898477086>

__**Forms of payment:**__ We cover all fees.
>>> **Paypal** (preferred)  - *No limit*
**Zelle** - *100k per month/5k per day*
**Venmo** - *5k per week*
**CashApp** - *10k per week*
**Apple Pay** - *10k per week*
**BoA Transfer** (preferred) - *No limit*
**Chase Transfer** (preferred) - *No limit*
**ACH Transfer** (preferred) - *No limit*
**Wire Transfer** (preferred) - *No limit*
**Checks** (deposit remotely with an image or mail it to you) - *No limit*
      `)

        return embed
      },
      FAQ() {
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

        return embed;
      },
      NoUser() {
        const embed = new MessageEmbed()
          .setColor(info.errColor)
          .setFooter(info.footer)
          .setTimestamp()
          .setTitle(`${info.emojis.X} Error: __100006__`)
          .setDescription(`**The User could not be found**`);

        return embed
      },
      NoSong() {
        const embed = new MessageEmbed()
          .setColor(info.errColor)
          .setFooter(info.footer)
          .setTimestamp()
          .setTitle(`${info.emojis.X} Error: __300006__`)
          .setDescription(`**The Song you inputed could not be found**`);

        return embed
      },
      MaxSongs() {
        const embed = new MessageEmbed()
          .setColor(info.errColor)
          .setFooter(info.footer)
          .setTimestamp()
          .setTitle(`${info.emojis.X} Error: __300005__`)
          .setDescription(`**This Playlist has the max amount of songs possible**`);

        return embed
      },
      InvalidArgument() {
        const embed = new MessageEmbed()
          .setColor(info.errColor)
          .setFooter(info.footer)
          .setTimestamp()
          .setTitle(`${info.emojis.X} Error: __100005__`)
          .setDescription(`**Invalid Argument**`);

        return embed
      },
      NoPlaylist() {
        const embed = new MessageEmbed()
          .setColor(info.errColor)
          .setFooter(info.footer)
          .setTimestamp()
          .setTitle(`${info.emojis.X} Error: __300004__`)
          .setDescription(`**Playlist Could Not Be Found**`);

        return embed
      },
      NoLibrary() {
        const embed = new MessageEmbed()
          .setColor(info.errColor)
          .setFooter(info.footer)
          .setTimestamp()
          .setTitle(`${info.emojis.X} Error: __300003__`)
          .setDescription(`**You current do not have a Library**`);

        return embed
      },
      MaxPlaylists() {
        const embed = new MessageEmbed()
          .setColor(info.errColor)
          .setFooter(info.footer)
          .setTimestamp()
          .setTitle(`${info.emojis.X} Error: __300002__`)
          .setDescription(`**You Library has the Max Amount of Playlists**`);

        return embed
      },
      PlaylistCreate(message, name, id) {
        const embed = new MessageEmbed()
          .setColor(info.color)
          .setFooter(info.footer)
          .setTimestamp()
          .setTitle(`Playlist Created`)
          .setDescription(`**New Playlist Named "${name}" with ID (${id})**\n**Created by <@${message.author.id}> (${message.author.id})**`);

        return embed
      },
      InvalidPermissions(message) {
        const Missing_Permissions = new MessageEmbed()
          .setColor(info.errColor)
          .setFooter(info.footer)
          .setTimestamp()
          .setTitle(`${info.emojis.X} Error: __100001__`)
          .setDescription(`**<@${message.author.id}> has insufficient permissions to run this command**`);

        return Missing_Permissions
      },
      InvalidBotPermissions() {
        const Bot_perms = new MessageEmbed()
          .setColor(info.errColor)
          .setFooter(info.footer)
          .setTimestamp()
          .setTitle(`${info.emojis.X} Error: __100002__`)
          .setDescription(`**${client.user.username} has insufficient permissions to run this command**`);

        return Bot_perms
      },
      NoArgument() {
        const NoArg = new MessageEmbed()
          .setColor(info.errColor)
          .setFooter(info.footer)
          .setTimestamp()
          .setTitle(`${info.emojis.X} Error: __100003__`)
          .setDescription(`**No Argument Found**`)

        return NoArg;
      },
      NoDJRoles() {
        const NoDjs = new MessageEmbed()
          .setColor(info.errColor)
          .setFooter(info.footer)
          .setTimestamp()
          .setTitle(`${info.emojis.X} Error: __100004__`)
          .setDescription(`**${ErrorCodes[100004]}**`);

        return NoDjs
      },
      NotInVoice(message) {
        const NV_Embed = new MessageEmbed()
          .setColor(info.errColor)
          .setFooter(info.footer)
          .setTimestamp()
          .setTitle(`${info.emojis.X} Error: __200001__`)
          .setDescription(`**<@${message.author.id}> is not in a Voice Channel**`);

        return NV_Embed
      },
      BotNotInVoice(message, client) {
        const NV_Embed = new MessageEmbed()
          .setColor(info.errColor)
          .setFooter(info.footer)
          .setTimestamp()
          .setTitle(`${info.emojis.X} Error: __200003__`)
          .setDescription(`**${client.user.username} is not in a Voice Channel**`);

        return NV_Embed
      },
      NothingPlaying() {
        const NV_Embed = new MessageEmbed()
          .setColor(info.errColor)
          .setFooter(info.footer)
          .setTimestamp()
          .setTitle(`${info.emojis.X} Error: __200005__`)
          .setDescription(`**Nothing is playing on the bot**`);

        return NV_Embed
      },
      NotInSameVoice(message, client) {
        const NIS_Embed = new MessageEmbed()
          .setColor(info.errColor)
          .setFooter(info.footer)
          .setTimestamp()
          .setTitle(`${info.emojis.X} Error: __200002__`)
          .setDescription(`**<@${message.author.id}> is not in the same Voice Channel as the ${client.user.username}`);

        return NIS_Embed
      },
      NoQueue() {
        const Queue_Embed = new MessageEmbed()
          .setColor(info.errColor)
          .setFooter(info.footer)
          .setTimestamp()
          .setTitle(`${info.emojis.X} Error: __200004__`)
          .setDescription(`**Queue is empty.**`)

        return Queue_Embed;
      },
      NameTaken(name) {
        const NameTak = new MessageEmbed()
          .setColor(info.errColor)
          .setFooter(info.footer)
          .setTimestamp()
          .setTitle(`${info.emojis.X} Error: __300001__`)
          .setDescription(`**Playlist with name "${name}" already exists**`);

        return NameTak
      }
    }

    this.functions = {
      split(string, length, splitby, newsplit) {
        let arr = string.split(`${splitby}`)
        let characters = ``;
        let finishedarray = []

        for (i = 0; i < arr.length; i++) {
          let newarg = arr[i] + newsplit;
          if (characters.length + newarg.length >= length) {
            finishedarray.push(characters)
            characters = newarg
          } else {
            if (i == arr.length - 1) {
              if (!arr[i] == ``) {
                arr[i] = arr[i] + newsplit
              }
              let newchar = characters + arr[i];
              finishedarray.push(newchar)
            } else {
              characters += newarg;
            }
          }
        }

        return finishedarray;
      },
      add_space(string, length) {
        for (i = 0; i < length; i++) {
          string += ` `
        }
        return string
      },
      progressBar(number, numberdone) {
        if (numberdone == 0) {
          return { string: `🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`, percentage: 0 }
        } else {
          let percentage = Math.ceil((numberdone / number) * 100)
          let string = ``
          for (i = 0; i < 100; i += 3.33) {
            let nextnumber = i + 3.33
            if (percentage > i && percentage < nextnumber) {
              string += `🔘`
            } else {
              string += `▬`
            }
          }
          return { string, percentage }
        }
      },
      MinutesAndSeconds(date) {
        if (!date) date = Date.now()
        let seconds = Math.ceil(date / 1000)
        if (seconds >= 60) {
          let minutes = Math.floor(seconds / 60)
          let remainingSeconds = seconds % 60
          if (minutes >= 60) {
            let hours = Math.floor(minutes / 60)
            let remainingMinutes = minutes % 60
            if (toString(remainingMinutes).length == 1) remainingMinutes = `0${minutes}`
            return `${hours}:${remainingMinutes}:${remainingSeconds}`
          }
          if (toString(seconds).length == 1) seconds = `0${seconds}`
          return `${minutes}:${remainingSeconds}`
        }
        return `${seconds}`
      },
      Turn_in_to_MS(current) {
        let splitted = current.split(`:`)
        time = 0;
        if (splitted.length == 4) {
          time += splitted[0] * 24 * 60 * 60 * 1000
          time += splitted[1] * 60 * 60 * 1000
          time += splitted[2] * 60 * 1000
          time += splitted[3] * 1000
        } else if (splitted.length == 3) {
          time += splitted[0] * 60 * 60 * 1000
          time += splitted[1] * 60 * 1000
          time += splitted[2] * 1000
        } else if (splitted.length == 2) {
          time += splitted[0] * 60 * 1000
          time += splitted[1] * 1000
        } else if (splitted.length == 1) {
          time += splitted[0] * 1000
        }

        return time;
      },
    }

    if (client) {
      client.info = this.info
      client.errors = this.errors;
      client.embeds = this.embeds;
      client.functions = this.functions;
      client.plcomms = this.plcomms;
    }
  }

  parseMS = parseMS

  sleep = sleep

  durationString = durationString

  /**
   * @param {String} string 
   * @param {String} ele 
   */
  howMany(string, ele) {
    let strArr = string.split(``);
    let count = 0;
    let indArr = [];
    for (let i = 0; i < strArr.length; i++) {
      let val = strArr[i];
      if (val == ele) { count++; indArr.push(i) }
    }
    return { count, indexs: indArr }
  }

  /**
   * @param {String} string 
   */
  splitQuote(string) {
    let count = this.howMany(string, `"`);
    if (count.count < 2) return undefined;
    let arr = new BetterArr();
    let pairs = Math.floor(count.count / 2);
    let done = 0;
    for (let i = 0; i < pairs; i++) {
      let str = string.substring(count.indexs[done] + 1, count.indexs[done + 1])
      arr.push(str)
      done = done + 2;
    }

    return arr
  }

  async sendEmb(channel, embed, args) {
    if (!args) args = [undefined, undefined, undefined];
    let embed2 = this.embeds[embed](args[0], args[1], args[2]);
    return await channel.send({ embeds: [embed2] })
  }

  /**
   * @param {String} string 
   * @param {Number} length 
   * @param {String} splitby 
   * @param {String} newsplit 
   * @returns {Array<String>}
   */
  split(string, length, splitby, newsplit) {
    let arr = string.split(`${splitby}`)
    let characters = ``;
    let finishedarray = []

    for (let i = 0; i < arr.length; i++) {
      let newarg = arr[i] + newsplit;
      if (characters.length + newarg.length >= length) {
        finishedarray.push(characters)
        characters = newarg
      } else {
        if (i == arr.length - 1) {
          if (!arr[i] == ``) {
            arr[i] = arr[i] + newsplit
          }
          let newchar = characters + arr[i];
          finishedarray.push(newchar)
        } else {
          characters += newarg;
        }
      }
    }

    return finishedarray;
  }

  /**
  * @param {Object} obj 
  * @returns {Number}
*/
  getDepth(object) {
    var level = 1;
    for (var key in object) {
      if (!object.hasOwnProperty(key)) continue;

      if (typeof object[key] == 'object') {
        var depth = getDepth(object[key]) + 1;
        level = Math.max(depth, level);
      }
    }
    return level;
  }

  /**
    * @param {Object} object 
    * @returns {BetterArr<BetterArr<BetterArr>>}
  */
  values(object) {
    let value = Object.entries(object)
    let arr = new BetterArr();
    for (let i = 0; i < value.length; i++) {
      let entrie = value[i];
      let val2 = entrie[1];
      if (val2 instanceof Object) {
        arr.push([entrie[0], values(val2)])
      } else arr.push(entrie)
    }

    return arr
  }

  find(obj, findKey, name) {

    if (!name) name = `First`;

    let entries = Object.entries(obj);
    let keys = entries.map(arr => arr[0])
    let values = entries.map(arr => arr[1])

    for (let i = 0; i < entries.length; i++) {
      let key = keys[i];
      let value = values[i];
      let entry = entries[i];

      if (key == findKey) {
        return { parent: [name, obj], children: entry }
      } else if (value instanceof Object) {
        let temp = this.find(value, findKey, key);
        if (temp != undefined) return temp
      } else continue

    }
  }

}

class BetterArr extends Array {
  #orrarr;
  /**
   * Better Array
   * @param {Array} array - Original Array
   */
  constructor(array) {
    super()
    this.#orrarr = array;


    if (array) { for (let k = 0; k < array.length; k++) { this.push(array[k]) }; }
  }

  shuffle() {
    for (let i = this.length - 1; i > 0; i--) {
      const newIndex = Math.floor(Math.random() * (i + 1))
      const oldValue = this[newIndex]
      this[newIndex] = this[i]
      this[i] = oldValue
    }
  }

  empty() {
    for (let i = this.length; i > 0; i--) {
      this.shift();
    }
  }

  add(ele) {
    if (!Array.isArray(ele)) {
      this.push(ele);
    } else {
      for (let i = 0; i < ele.length; i++) {
        this.push(ele[i]);
      }
    }
  }

  remove(ele) {
    let index = this.indexOf(ele);
    if (index == -1) return false;
    return this.splice(index, 1)
  }

}

module.exports = { BetterArr, Util, parseMS, durationString }