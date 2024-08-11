
### OnInvoke函数
> 当有进行命令下发调用OnInvoke函数

| 方法 | 说明 | 参数 | 返回值 |
| --- | --- | ---- | ---- |
| GetMessage | 获取下发消息 | - | FuncInvoke |
| GetSession | 获取Session | - | Session |
| GetDevice | 获取设备 | - | Device |
| GetDeviceById | 通过设备id获取设备 | (deviceId: string) | Device |
| GetConfig | 获取设备配置项 | (key: string) | string |
| SaveProperties | 保存属性 | (data: object) | - |
| SaveEvents | 保存事件 | (eventId: string, data: object) | - |
| ReplyOk | 服务下发执行成功 | - | - |
| ReplyFail | 服务下发执行失败 | (str: string) | - |
| Int16ToData | 有符号整数数据 | (num: number) | string |
| FloatToInt16Data | 浮点数转 | (flo: number) | string |
| FloatToUint16Data | 浮点数转 | (flo: number) | string |

### Session对象

| 方法 | 说明 | 参数 | 返回值 |
| --- | --- | ---- | ---- |
| Disconnect | 断开连接 | - | - |
| ReadDiscreteInputs | 读取离散量输入 | (startingAddress: number, length: number) | Response |
| ReadCoils | 读取线圈 | (startingAddress: number, length: number) | Response |
| ReadInputRegisters | 读输入寄存器 | (startingAddress: number, length: number) | Response |
| ReadHoldingRegisters | 读保持寄存器 | (startingAddress: number, length: number) | Response |
| WriteCoils | 写多线圈寄存器 | (startingAddress: number, length: number, data: string) | - |
| WriteHoldingRegisters | 写*保持寄存器(length == 1时单保持寄存器, length > 1时多保持寄存器) | (startingAddress: number, length: number, data: string) | - |

### Response

| 方法 | 说明 | 参数 | 返回值 |
| --- | --- | ---- | ---- |
| GetMessage | 获取原始返回数据 | - | byte数组 |
| MsgToString | 消息转成文本 | - | string |
| MsgToHexStr | 消息转成16进制字符串 | - | string |
| MsgToUint16 | 消息转成无16位无符号整型 | - | number |
| MsgToUint32 | 消息转成无32位无符号整型 | - | number |
| MsgToUint64 | 消息转成无64位无符号整型 | - | number |
| MsgToBool | 消息转成布尔类型 | - | string |

### 样例
- 编解码

```javascript
// 物模型 -> 设备报文
function OnInvoke(context) {
  var message = context.GetMessage();
  var session = context.GetSession();
  var resp = session.ReadHoldingRegisters(4003, 1);
  var dv = new DataView(new ArrayBuffer(2));
  var data = resp.GetMessage();
  dv.setUint8(0, data[0]);
  dv.setUint8(1, data[1]);
  var temp = dv.getInt16(0);
  console.log(temp);
  context.SaveProperties({"Temperature": temp / 10});
}
```
- 物模型

```json
{
  "events": [],
  "properties": [
    {
      "id": "Temperature",
      "name": "Temperature",
      "expands": {
        "readOnly": null
      },
      "description": "Temperature x 10 (np. 10,5 st.C to 105)",
      "scale": 2,
      "unit": null,
      "type": "float"
    }
  ],
  "functions": [
    {
      "id": "getTemp",
      "name": "定时获取温度",
      "expands": {
        "readOnly": null,
        "interval": "1"
      },
      "description": null,
      "output": {},
      "inputs": [],
      "async": true
    }
  ]
}
```

#### 配置ModbusPal
> https://sourceforge.net/p/modbuspal/discussion/899955/thread/72cf35ee/cd1f/attachment/ModbusPal.jar

- 添加模拟设备
![modbus_addmockdevice](img/modbus_addmockdevice.png)
- 添加寄存器
![modbus_addregister](img/modbus_addregister.png)
- 自动生成值
![modbus_addvaluegen](img/modbus_addvaluegen.png)
- 绑定值生成器
![modbus_bindvaluegen](img/modbus_bindvaluegen.png)
- 启动
![modbus_run](img/modbus_run.png)