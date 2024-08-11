### OnConnect函数
> 当连接是会调用OnConnect函数，在OnConnect函数中可以进行一些前置处理
- context参数说明

| 方法 | 说明 | 参数 | 返回值 |
| --- | --- | ---- | ---- |
| GetSession | 获取Session | - | Session |
| GetDevice | 获取设备 | - | Device |
| GetConfig | 获取设备配置项 | (key: string) | string |

```javascript
// 当连接到Broker时可以在这里发送心跳报文或者别的
function OnConnect(context) {
  var session = context.GetSession()
  session.Publish('topic', 'xxx')
}
```

### OnMessage函数
> 当有消息接收时会调用OnMessage函数
- context参数说明

| 方法 | 说明 | 参数 | 返回值 |
| --- | --- | ---- | ---- |
| GetMessage | 获取消息原始数据 | - | byte数组 |
| MsgToString | 将原始数据转换成字符串 | - | 文本 |
| MsgToHexStr | 将原始数据转换成16进制字符串 | - | 16进制字符串 |
| DeviceOnline | 将设备上线 | 设备id | - |
| GetSession | 获取Session | - | Session |
| GetDevice | 获取设备 | - | Device |
| GetConfig | 获取设备配置项 | (key: string) | string |
| SaveProperties | 保存属性 | (data: object) | - |
| SaveEvents | 保存事件 | (eventId: string, data: object) | - |
| ReplyOk | 服务下发执行成功 | - | - |
| ReplyFail | 服务下发执行失败 | (str: string) | - |
| Topic | 获取消息Topic | - | string |

```javascript
// 当Broker向客户端推送数据时，执行OnMessage函数
function OnMessage(context) {
  console.log("OnMessage: " + context.MsgToString())
  var data = JSON.parse(context.MsgToString())
	if (data.name == 'reply') {
		context.ReplyOk()
		return
	}
  var topic = context.Topic()
  if (topic == '/prop') {
    context.SaveProperties(data)
  } else if (topic == '/event') {
    context.SaveEvents(data.eventId, data)
  }
}
```
### OnInvoke函数
> 当有进行命令下发调用OnInvoke函数
- context参数说明

| 方法 | 说明 | 参数 | 返回值 |
| --- | --- | ---- | ---- |
| GetMessage | 获取下发消息 | - | FuncInvoke |
| DeviceOnline | 将设备上线 | (deviceId: string) | - |
| GetSession | 获取Session | - | Session |
| GetDevice | 获取设备 | - | Device |
| GetDeviceById | 通过设备id获取设备 | (deviceId: string) | Device |
| GetConfig | 获取设备配置项 | (key: string) | string |
| SaveProperties | 保存属性 | (data: object) | - |
| SaveEvents | 保存事件 | (eventId: string, data: object) | - |
| ReplyOk | 服务下发执行成功 | - | - |
| ReplyFail | 服务下发执行失败 | (str: string) | - |

- FuncInvoke

| 方法 | 说明 | 参数 | 返回值 |
| --- | --- | ---- | ---- |
| FunctionId | 功能id | - | string |
| Data | 下发数据 | - | object |

```javascript
function OnInvoke(context) {
  var data = JSON.stringify(context.GetMessage().Data)
	console.log("OnInvoke: " + data)
  var session = context.GetSession()
  // 向Broker发送文本信息
	session.Publish("/invoke", data)
}
```

### Session对象

| 方法 | 说明 | 参数 | 返回值 |
| --- | --- | ---- | ---- |
| Disconnect | 断开连接 | - | - |
| Publish | 发送文本数据 | (topic: string, data: string) | - |
| PublishHex | 将16进制文本数据转换成byte发送 | (topic: string, data: string) | - |

### 样例
```javascript
function OnMessage(context) {
  console.log("OnMessage: " + context.MsgToString())
  var data = JSON.parse(context.MsgToString())
	if (data.name == 'reply') {
		context.ReplyOk()
		return
	}
  var topic = context.Topic()
  if (topic == '/prop') {
    context.SaveProperties(data)
  } else if (topic == '/event') {
    context.SaveEvents(data.eventId, data)
  }
}
function OnInvoke(context) {
  var data = JSON.stringify(context.GetMessage().Data)
	console.log("OnInvoke: " + data)
  var session = context.GetSession()
  // 向Broker发送文本信息
	session.Publish("/invoke", data)
}
```