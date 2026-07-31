# Changelog

## 0.2.0

### Changes

#### `Discord`
- 新增用户头像URL解析工具 `defaultAvatarURL()` 和 `avatarURL()`。
- 新增 `HTTP` 导出。

#### `Discord.Event`
- 新增 `BaseGuild` 和 `ReplyBaseEvent` 的导出。

#### `Discord.HTTP`
- 新增 `multipart/form-data` 文件上传，在 `fetch()` 方法中传入 `files` 参数即可。

#### `Discord.Client`
- 更改 `api` 重命名为 `http`。

#### `Discord.Builder.Command`
- 新建实例不再需要 `Client` 参数，只有调用 `listen()` 方法才需要传入 `Client`。
- 移除 `deploy()` 方法，新增 `deployGlobalCommand()` 和 `deployGuildCommand()`。

#### `Discord.Builder.Modal`
- 新增 `if()` 和 `use()` 方法。
- 优化 `fileUpload()`、`channelSelect()`、`roleSelect()`、`userSelect()` 和 `mentionableSelect()` 的类型解析。

#### `Discord.Event.ModalComponent`
- 更改 `components` 重命名为 `data`。
- 更改 File Upload、User Select、Role Select、Channel Select、Mentionable Select 所返回的结果（通过 `data` 对象获取），从 Snowflake ID 数组更改为完整的对应的数据对象。
- 更改 `values` 的 Map 值类型为 `string[]`。

#### `Discord.Builder.Message`
- 新增 `if()` 和 `use()` 方法。
- 新增 `files` 上传文件数组参数在 `send()`、`replyInteraction()`、`editResponse()` 函数中。

#### `Discord.Event.Autocomplete`
- 修正 `focused` 的类型解析。

#### `Discord.Event.Base`
- 优化 `inGuild()` 方法定义，`interaction` 被定义为 `APIGuildInteraction`。

#### `Discord.Builder.ChatCommand`
- 优化 `attachmentOption()`、`channelOption()`、`roleOption()`、`userOption()` 和 `mentionableOption()` 的类型解析。

#### `Discord.Event.ChatCommand`
- 修正 `interaction` 的定义为 `APIChatInputApplicationCommandInteraction`。
- 更改 Attachment、User、Role、Channel、Mentionable 所返回的结果（通过 `data` 对象获取），从 Snowflake ID 数组更改为完整的对应的数据对象。

#### `Discord.Event.ReplyBaseEvent`
- 新增 `deferMessage()` 方法（从 `Discord.Event.ComponentBaseEvent` 转移）。

#### 其它
- 新增可选路径参数，使用语法 `path/to/{id?}`。