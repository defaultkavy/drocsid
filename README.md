# Drocsid
Drocsid 是一个专注在简化与 Discord API 交互，优化内存占用的第三方工具库。

## Install
```bash
bun add drocsid
```

## Usage
```ts
import { Discord } from "drocsid"

const client = new Discord.Client({
    client_token: CLIENT_TOKEN,
    client_id: CLIENT_ID,
    intents: ['GuildMessage', 'Guilds', 'MessageContent']
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
client.on('CreateMessage', message => {
    console.log(message.content)
})
```

## Command Builder
```ts
const cmd_greating = new Discord.Builder.ChatCommand('greating', 'Say a hello to bot!')
    .stringOption('name', 'What is your name', { required: true })
    .booleanOption('happy', 'Do you feeling good?')
    .oncall(event => {
        if (event.data.happy) event.reply(message => message.content(`Hi ${event.data.name}. Nice to see you! You look good!`))
        //  ^? event.data.happy: boolean | undefined
        else event.reply(message => message.content(`Hi ${event.data.name}.`))
        // since string option `name` is set `required` true, 
        // `event.data.name` will always be `string` type
    });

new Discord.Builder.Commands()
    .addGuildCommand(cmd_greating) // add greeting command to guild slash command
    .listen() // start to listen command event
    .deploy(); // register all commands to discord
```

## Message Builder
```ts
const message = new Discord.Builder.Message()
    .components(comp => comp
        .container(cont => cont
            .accentColor(Bun.color('red', 'number'))
            .components(comp => comp
                .textDisplay('This is a red color container')
            )
        )
        .actionRow(row => row
            .primaryButton('button1-custom-id', { label: 'Blue Button' })
            .secondaryButton('button2-custom-id', { label: 'Grey Button' })
            .successButton('button3-custom-id', { label: 'Green Button' })
            .dangerButton('button3-custom-id', { label: 'Red Button' })
            .linkButton('https://discord.com', { label: 'Open Discord Website' })
        )
        .actionRow(row => row
            .channelSelect('channel-custom-id')
        )
    )

client.channel('CHANNEL_ID').messages.create(message.config); // send message
```

## Modal Builder
```ts
const ID = 'RANDOM_ID';
const modal = new Discord.Builder.Modal('Example Modal', `example-modal/${ID}`)
    .shortText('Name', 'name')
    .radioGroup('Gender', 'gender', { options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
    ] })
    .checkbox('Human?', 'isHuman', { default: true })
    .paragraphText('Leave a message', 'message', { required: false });

client.onmodal(modal, 'example-modal/{id}', event => {
    event.params.id // string
    event.data.name // string
    event.data.gender // string[]
    event.data.isHuman // boolean
    event.data.message // string | undefined (required: false)
})
```

## Debug
```ts
Discord.setLogLevel(3); // print debug message
```