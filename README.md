# Discord-API.js
Discord-API.js 是一个专注在简化与 Discord API 交互，优化内存占用的第三方工具库。

## Install
```bash
bun add discord-api.js
```

## Usage
```ts
import { Discord } from "discord-api.js"

const client = new Discord.Client({
    client_token: CLIENT_TOKEN,
    client_id: CLIENT_ID,
    intents: [
        Discord.GatewayIntent.GuildMessages,
        Discord.GatewayIntent.MessageContent
    ]
})

// Fetch Data
const guilds = await client.me.getGuilds(); // => APIGuild[];
const channels = await client.guild('GUILD_ID').channels.list(); // => APIGuildChannel
const member = await client.guild('GUILD_ID').member('USER_ID').get(); // => APIGuildMember
// Send Message
await client.channel('CHANNEL_ID').messages.create({ content: 'Hello, Discord!' });
// Set Role
await client.guild('GUILD_ID').member('USER_ID').role('ROLE_ID').add();
// Remove Member
await client.guild('GUILD_ID').member('USER_ID').remove();

// Gateway Events
client.connect();
client.on(Discord.GatewayEvent.CreateMessage, message => {
    console.log(message.content)
})
```