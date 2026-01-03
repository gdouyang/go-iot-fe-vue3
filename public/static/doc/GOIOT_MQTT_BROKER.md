Go-IoT MQTT Broker是一个公用的Mqtt Broker（默认端口为1883），所有的设备都可以连接到这个Broker，设备的clientId将是设备id。

### OnConnect函数
> 当有客户端连接是会调用OnConnect函数，在OnConnect函数中可以对客户端进行账号密码的校验，默认情况下客户端的clientId将是设备id，当设置username与password时将校验是否与配置中的一致
- context参数说明

| 方法 | 说明 | 参数 | 返回值 |
| --- | --- | ---- | ---- |
| GetConfig | 获取设备配置项 | (key: string) | string |
| GetClientId | 获取mqtt clientId | - | string |
| GetUserName | 获取mqtt 用户名 | - | 用户名 |
| GetPassword | 获取mqtt 密码 | - | 密码 |
| DeviceOnline | 将设备上线 | 设备id | - |
| AuthFail | 认证失败 | - | - |

```javascript
// 系统默认会根据用户名和密码来认证，如果不满足可写OnConnect来自行判断
// 当mqtt客户端连接到Broker时可以在这里判断用户名和密码是否正确
function OnConnect(context) {
  if (context.GetUserName() == context.GetConfig("username") && context.GetPassword() == context.GetConfig("password")) {
    // 认证成功让设备上线，一般clientId就是设备id
	  context.DeviceOnline(context.GetClientId())
    return
  }
  // 认证失败
  context.AuthFail()
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
// 当客户端向Broker推送数据时，执行OnMessage函数
function OnMessage(context) {
  console.log("OnMessage topic: " + context.Topic())
  console.log("OnMessage msg: " + context.MsgToString())
  var data = JSON.parse(context.MsgToString())
  var topic = context.Topic()
  if (topic == '/reply') {
    context.ReplyOk()
  } else if (topic == '/prop') {
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
  // 向客户端发送文本信息
	session.Publish("/invoke", data)
}
```

### Session对象

| 方法 | 说明 | 参数 | 返回值 |
| --- | --- | ---- | ---- |
| Disconnect | 断开连接 | - | - |
| Publish | 发送文本数据 | (topic: string, data: string) | - |
| PublishHex | 将16进制文本数据转换成byte发送 | (topic: string, data: string) | - |

### Device对象

| 字段 | 说明 | 参数 | 返回值 |
| --- | --- | ---- | ---- |
| Id | 设备id | - | - |
| Name | 设备名称 | - | - |

### globe对象

| 方法 | 说明 | 参数 | 返回值 |
| --- | --- | ---- | ---- |
| ToCrc16Str | 计算16进制字符串的crc16 | string | string(crc16的16进制) |
| BytesToBase64 | bytes数组转base64字符串 | byte[] | base64字符串 |
| HmacEncryptBase64 | hmac算法把 | (data: string, key: string, type: string) type取值： sha1, sha256, md5| base64字符串 |

### 样例
```json
{
  "events": [],
  "properties": [
    {
      "id": "temperature",
      "name": "温度",
      "expands": {
        "readOnly": null
      },
      "description": null,
      "scale": 2,
      "unit": "°C",
      "type": "float"
    }
  ],
  "functions": []
}
```
```javascript
// 系统默认会根据用户名和密码来认证，如果不满足可写OnConnect来自行判断
// 当mqtt客户端连接到Broker时可以在这里判断用户名和密码是否正确
function OnConnect(context) {
  if (context.GetUserName() == context.GetConfig("username") && context.GetPassword() == context.GetConfig("password")) {
    // 认证成功让设备上线，一般clientId就是设备id
	  context.DeviceOnline(context.GetClientId())
    return
  }
  // 认证失败
  context.AuthFail()
}

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