### OnConnect
> 当连接是会调用OnConnect函数，在OnConnect函数中可以进行一些前置处理
- context参数说明

| 方法 | 说明 | 参数 | 返回值 |
| --- | --- | ---- | ---- |
| DeviceOnline | 将设备上线 | 设备id | - |
| GetSession | 获取Session | - | Session |
| GetDeviceById | 通过设备id获取设备 | - | Device |
| GetHeader | 获取http请求头 | (key: string) | string |
| GetUrl | 获取http url | - | string |
| GetQuery | 获取http query | (key: string) | string |
| GetForm | 获取http表单 | (key: string) | string |

```javascript
function OnConnect(context) {
  var session = context.GetSession()
  session.SendText('success')
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
| GetDeviceById | 通过设备id获取设备 | - | Device |
| GetConfig | 获取设备配置项 | (key: string) | string |
| SaveProperties | 保存属性 | (data: object) | - |
| SaveEvents | 保存事件 | (eventId: string, data: object) | - |
| ReplyOk | 服务下发执行成功 | - | - |
| ReplyFail | 服务下发执行失败 | (str: string) | - |
| IsTextMessage | 是否为文本消息 | - | boolean |
| IsBinaryMessage | 是否为字节消息 | - | boolean |
| GetHeader | 获取http请求头 | (key: string) | string |
| GetUrl | 获取http url | - | string |
| GetQuery | 获取http query | (key: string) | string |
| GetForm | 获取http表单 | (key: string) | string |

```javascript
function OnMessage(context) {
  var msg = context.MsgToString()
  var obj = JSON.parse(msg)
  if (obj.type == 'prop') {
    context.SaveProperties(obj)
  } else if (obj.type == 'event') {
    context.SaveEvents(obj.eventId, obj)
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
  var msg = context.GetMessage().Data
  context.GetSession().SendText(JSON.stringify(msg))
}
```

### Session对象

| 方法 | 说明 | 参数 | 返回值 |
| --- | --- | ---- | ---- |
| Disconnect | 断开连接 | - | - |
| SendText | 发送文本数据 | (data: string) | - |
| SendBinary | 将16进制文本数据转换成byte发送 | (data: string) | - |

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
```javascript
// 设备报文 -> 物模型
function OnMessage(context) {
  var session = context.GetSession();
  var payload = JSON.parse(context.MsgToString());
  var topic = context.GetUrl();
  // 根据路径来判断是什么类型
  if (topic.startsWith("/report-property")) {
    context.SaveProperties(payload)
  } else if (topic.startsWith("/fault_alarm")) {
    context.SaveEvents('fire_alarm', payload)
  } else {
    // 如果都不匹配则给客户端返回404
    session.SendText('{"status":404, "message": "uri ['+ topic +']not support"}')
  }

}

// 物模型 -> 设备报文
function OnInvoke(context) {
  var message = context.();
  context.GetSession().SendText(JSON.stringify(message.Data))
}
```