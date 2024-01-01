const {
    Client,
    GatewayIntentBits,
    ButtonStyle,
    ButtonBuilder,
    ActivityType,
    ActionRowBuilder,
    Collection,
  } = require("discord.js");
  const fs = require("fs");
  
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.MessageContent
    ],
  });
  const prefix = "Your-Prefix";
  client.commands = new Collection();
  
  client.once("ready", () => {
    client.user.setActivity("(prefix)help", { type: ActivityType.Streaming });
    console.log(`${client.user.tag} Sudah menyala`);
  });
  
  // folder commands
  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));
  
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  }
  
  client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
  
    if (!client.commands.has(commandName)) return;
  
    const command = client.commands.get(commandName);
  
    try {
      command.execute(message, args, client);
    } catch (error) {
      console.error(error);
      message.reply("Terjadi kesalahan saat menjalankan command.");
    }
  });
  
  //command help
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
  
    if (command === "help") {
      const embed = {
        author: {
          name: message.author.username,
          icon_url: message.author.avatarURL(),
        },
        title: "",
        color: 0x2B2D31,
        description:
          "",
      };
  
      const embed1 = {
        author: {
          name: message.author.username,
          icon_url: message.author.avatarURL(),
        },
        description: "",
        color: 0x2B2D31,
      };
  
      const nextButton = new ButtonBuilder()
        .setCustomId("next_button")
        .setLabel("⏭️ Next")
        .setStyle(ButtonStyle.Primary);
      const prevButton = new ButtonBuilder()
        .setCustomId("prev_button")
        .setLabel("⏮️ Previous")
        .setStyle(ButtonStyle.Primary);
  
      const buttonRow = new ActionRowBuilder().addComponents(nextButton);
      const buttonRow1 = new ActionRowBuilder().addComponents(prevButton);
  
      const message1 = await message.channel.send({
        embeds: [embed],
        components: [buttonRow],
      });
  
      const filter = (interaction) =>
        interaction.isButton() && interaction.user.id === message.author.id;
  
      const collector = message.channel.createMessageComponentCollector({
        filter,
        time: 60000,
      });
  
      collector.on("collect", async (interaction) => {
        if (interaction.customId === "next_button") {
          await interaction.update({
            embeds: [embed1],
            components: [buttonRow1],
          });
        } else if (interaction.customId === "prev_button") {
          await interaction.update({
            embeds: [embed],
            components: [buttonRow],
          });
        }
      });
  
      collector.on("end", () => {
        message1.edit({
          components: [],
        });
      });
    }
  });
  
  
  client.login(
    "Your-Discord-Bot-Token"
  );
  