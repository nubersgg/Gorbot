const axios = require('axios');
const cheerio = require('cheerio');
const { Client, GatewayIntentBits, EmbedBuilder, ActivityType } = require('discord.js');

// Replace with your bot token and channel ID
const TOKEN = 'ODUzMjQ2ODMwNTE4NTk5Njgw.GWiAIM.Xcxg4hm5lH89Q0LXPVEHonL_llVd_WmlJRuFoI';
const CHANNEL_ID = '1289159750604554243'; // Channel ID for "partpicker"

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
// Function to fetch product data from the provided URL
async function getWebsiteData(url) {
    try {
        console.log('Fetching data from website...');
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const products = [];
        
        // Get the number of rows in the table
        const rowCount = $('table > tbody > tr').length;
        console.log(`Found ${rowCount} rows in the table.`);

        // Loop through each row
        for (let i = 1; i <= rowCount; i++) {
            const row = $(`table > tbody > tr:nth-child(${i})`);
            const name = row.find('td.td__name > a').text().trim();

            if (name) {
                products.push(name);
            }
        }

        console.log('Fetched Products:', products);
        return products;
    } catch (error) {
        console.error('Error fetching the website:', error.message);
        client.channels.cache.get(CHANNEL_ID).send('Not a valid URL');
        return [];
    }
}

async function sendToDiscord(products, channel) {
    if (products.length > 0) {
        const embed = new EmbedBuilder()
            .setTitle("Products List")
            .setColor("FFBD00")

        products.forEach(name => {
            embed.addFields({
                name: name,
                value: '\u200B',
                inline: false
            });
        });

        try {
            await channel.send({ embeds: [embed] });
            console.log('Sent data to Discord successfully!');
        } catch (error) {
            console.error('Error sending to Discord:', error.message);
        }
    } else {
        console.log('No data to send.');
    }
}

client.on('messageCreate', async (message) => {
    if (message.content.startsWith(".")){
        if (message.content.includes('.help')) {
            client.channels.cache.get(CHANNEL_ID).send('Commands are:\n.get [URL]\n.help');
        } else if (message.content.includes('.get ')) {
            if ((message.content.includes("https://pcpartpicker.com/list/")) || (message.content.includes("https://no.pcpartpicker.com/list/"))) {
                const url = message.content.split(' ')[1]; // Extract the URL after .get

                if (url) {
                    const products = await getWebsiteData(url);
                    await sendToDiscord(products, message.channel); // Send the results to the same channel
                } else {
                    console.log('None valid URL'); // Prompt for a valid URL
                }
            }else{client.channels.cache.get(CHANNEL_ID).send('Try another URL');}
        } else if (message.content.includes('.linus')) {
            client.channels.cache.get(CHANNEL_ID).send('https://steamuserimages-a.akamaihd.net/ugc/1821118302976521066/A0618DF09DF829F5E03E9E673B9D5C51350D37D9/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true');
        } else {
            client.channels.cache.get(CHANNEL_ID).send('Invalid command, Use .help to get commands');
        }
    }
});
function doOnce(fn) {
    let called = false;
    return function() {
      if (!called) {
        called = true;
        count=0
        fn();
      }
    };
}
doOnce();
// Log in to Discord
client.login(TOKEN).catch(console.error);
client.once('ready', () => {
    console.log('Borgot is ready');
    //client.channels.cache.get(CHANNEL_ID).send('Borgot, Online');
    setRandomActivity(client);
});
const activities = [
    { type: ActivityType.Playing, name: 'Pc Building Simulator' },
    { type: ActivityType.Watching, name: 'Linus tech tips' },
    { type: ActivityType.Listening, name: 'Mining Diamonds' },
    { type: ActivityType.Custom, name: 'Doing tax evasion' },
    { type: ActivityType.Watching, name: 'Chat' },
    { type: ActivityType.Custom, name: 'Thinking about profit' },
    { type: ActivityType.Custom, name: 'Calculating math' },
    { type: ActivityType.Custom, name: 'Asking chat gpt how his day was' },
    { type: ActivityType.Custom, name: 'Thinking about its actions' },
    { type: ActivityType.Custom, name: 'Eating spaghetti' },
    { type: ActivityType.Custom, name: 'drinking soda' },
    { type: ActivityType.Custom, name: 'Finding missing screws' },
    { type: ActivityType.Playing, name: 'Walking simulator' },
    { type: ActivityType.Custom, name: 'Gathering info' },
  ];
function setRandomActivity(client) {
    function changeActivity() {
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      client.user.setActivity(randomActivity.name, { type: randomActivity.type });
      
      // Set random time between 2 and 10 seconds
      const randomInterval = Math.floor(Math.random() * (10000 - 2000 + 1)) + 2000;
      
      setTimeout(changeActivity, randomInterval); // Recursive call to keep changing activity
    }
    
    changeActivity(); // Initial call
}