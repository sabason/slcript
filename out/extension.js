"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const commandMap = {
    // 程序控制相关
    1: {
        name: "NewLine",
        description: "回车，空行",
        documentation: "**NewLine()**\n\n插入一个空行。"
    },
    2: {
        name: "Comment",
        description: "注释",
        documentation: "**Comment(text: string)**\n\n添加注释。\n\n`text`: 注释内容"
    },
    3: {
        name: "GotoLabel",
        description: "Goto标记定义,跟一个字符串参数",
        documentation: "**GotoLabel(labelName: string)**\n\n定义一个跳转标签。\n\n`labelName`: 标签名称"
    },
    4: {
        name: "Goto",
        description: "跳转命令，跟一个字符串参数，说明跳转的位置",
        documentation: "**Goto(labelName: string)**\n\n跳转到指定的标签。\n\n`labelName`: 标签名称"
    },
    5: {
        name: "Call",
        description: "调用系统过程，跟一个整型参数",
        documentation: "**Call(procedureId: number)**\n\n调用系统过程。\n\n`procedureId`: 过程ID"
    },
    6: {
        name: "Return",
        description: "调用系统函数",
        documentation: "**Return()**\n\n从当前函数返回。"
    },
    7: {
        name: "Exit",
        description: "中止脚本",
        documentation: "**Exit()**\n\n中止脚本执行。"
    },
    8: {
        name: "IfCondition",
        description: "判断，跟3个参数，中间一个为判断操作符",
        documentation: "**IfCondition(operand1, operator, operand2)**\n\n条件判断语句。\n\n`operand1`: 操作数1\n`operator`: 比较运算符\n`operand2`: 操作数2"
    },
    9: { name: "Then", description: "则", documentation: "**Then**\n\n`If` 语句的条件成立时执行的代码块。" },
    10: { name: "EndIf", description: "结束条件", documentation: "**EndIf**\n\n结束 `If` 语句。" },
    11: { name: "Else", description: "否则", documentation: "**Else**\n\n`If` 语句的条件不成立时执行的代码块。" },
    12: { name: "EndElse", description: "结束否则", documentation: "**EndElse**\n\n结束 `Else` 代码块(如果存在)。" },
    13: {
        name: "If2",
        description: "同if,跟7个参数，中间一个为两部布尔计算值的与或操作",
        documentation: "**If2(op1, opr1, op2, boolOperator, op3, opr2, op4)**\n\n复杂的条件判断语句。\n\n`op1`, `op2`, `op3`, `op4`: 操作数\n`opr1`, `opr2`: 比较运算符\n`boolOperator`: 布尔运算符 (AND/OR)"
    },
    20: {
        name: "Set",
        description: "赋值语句",
        documentation: "**Set(variable, value)**\n\n赋值语句。\n\n`variable`: 变量名\n`value`: 值"
    },
    21: {
        name: "Calc",
        description: "计算语句,参数1=参数2 op 参数4，op为操作符",
        documentation: "**Calc(resultVar, operand1, operator, operand2)**\n\n计算语句。\n\n`resultVar`: 结果变量\n`operand1`: 操作数1\n`operator`: 运算符\n`operand2`: 操作数2"
    },
    22: {
        name: "Randomize",
        description: "取随机数(0 <= rc < intValue)",
        documentation: "**Randomize(intValue)**\n\n生成随机数。\n\n`intValue`: 上限 (生成的随机数小于此值)"
    },
    // 新增的命令映射
    100: { name: "SlEvCmdCodeGetItemPrice", description: "获取物品价格", documentation: "**SlEvCmdCodeGetItemPrice(itemId: number)**\n\n获取物品价格。\n\n`itemId`: 物品ID" },
    101: { name: "SlEvCmdCodeGetTime", description: "获取时间", documentation: "**SlEvCmdCodeGetTime()**\n\n获取当前游戏时间。" },
    200: { name: "MessageValue", description: "调试显示数字", documentation: "**MessageValue(value: number)**\n\n显示数值。\n\n`value`: 要显示的数值" },
    201: { name: "MessageString", description: "调试显示字符串", documentation: "**MessageString(text: string)**\n\n显示字符串。\n\n`text`: 要显示的字符串" },
    // 玩家相关
    1100: { name: "SlEvCmdCodePlayerGetLevel", description: "获取玩家等级", documentation: "**SlEvCmdCodePlayerGetLevel()**\n\n获取当前玩家等级。" },
    1101: { name: "SlEvCmdCodePlayerAddExp", description: "增加玩家经验值", documentation: "**SlEvCmdCodePlayerAddExp(exp: number)**\n\n增加玩家经验值。\n\n`exp`: 增加的经验值" },
    1102: { name: "SlEvCmdCodePlayerGetItemQuantity", description: "获取玩家物品数量", documentation: "**SlEvCmdCodePlayerGetItemQuantity(itemId: number)**\n\n获取玩家指定物品的数量。\n\n`itemId`: 物品ID" },
    1103: { name: "SlEvCmdCodePlayerAddItem", description: "给予玩家物品", documentation: "**SlEvCmdCodePlayerAddItem(itemId: number, quantity: number)**\n\n给予玩家指定数量的物品。\n\n`itemId`: 物品ID\n`quantity`: 数量" },
    1104: { name: "SlEvCmdCodePlayerRemoveItem", description: "移除玩家物品", documentation: "**SlEvCmdCodePlayerRemoveItem(itemId: number, quantity: number)**\n\n移除玩家指定数量的物品。\n\n`itemId`: 物品ID\n`quantity`: 数量" },
    1105: { name: "SlEvCmdCodePlayerGetGoldRemainder", description: "获取玩家剩余金钱", documentation: "**SlEvCmdCodePlayerGetGoldRemainder()**\n\n获取玩家当前剩余金钱。" },
    1106: { name: "SlEvCmdCodePlayerAddGold", description: "增加玩家金钱", documentation: "**SlEvCmdCodePlayerAddGold(amount: number)**\n\n增加玩家金钱。\n\n`amount`: 增加的金钱数量" },
    1107: { name: "SlEvCmdCodePlayerSubtractGold", description: "扣除玩家金钱", documentation: "**SlEvCmdCodePlayerSubtractGold(amount: number)**\n\n扣除玩家金钱。\n\n`amount`: 扣除的金钱数量" },
    1108: { name: "SlEvCmdCodePlayerGetWearItem", description: "获取玩家穿戴的物品", documentation: "**SlEvCmdCodePlayerGetWearItem()**\n\n获取玩家当前穿戴的物品。" },
    1109: { name: "SlEvCmdCodePlayerGetCurrentJob", description: "获取玩家当前职业", documentation: "**SlEvCmdCodePlayerGetCurrentJob()**\n\n获取玩家当前职业。" },
    1110: { name: "SlEvCmdCodePlayerChangeJob", description: "更改玩家职业", documentation: "**SlEvCmdCodePlayerChangeJob(jobId: number)**\n\n更改玩家职业。\n\n`jobId`: 职业ID" },
    1111: { name: "SlEvCmdCodePlayerHasSpecificAbility", description: "检查玩家是否拥有特定技能", documentation: "**SlEvCmdCodePlayerHasSpecificAbility(abilityId: number)**\n\n检查玩家是否拥有指定技能。\n\n`abilityId`: 技能ID" },
    1112: { name: "SlEvCmdCodePlayerAddAbility", description: "给予玩家技能", documentation: "**SlEvCmdCodePlayerAddAbility(abilityId: number)**\n\n给予玩家指定技能。\n\n`abilityId`: 技能ID" },
    1113: { name: "SlEvCmdCodePlayerLevelUp", description: "玩家升级/转生", documentation: "**SlEvCmdCodePlayerLevelUp()**\n\n使玩家升级或转生。" },
    1114: { name: "SlEvCmdCodePlayerGetCurrentTitle", description: "获取玩家当前称号", documentation: "**SlEvCmdCodePlayerGetCurrentTitle()**\n\n获取玩家当前称号。" },
    1115: { name: "SlEvCmdCodePlayerSetTitle", description: "设置玩家称号", documentation: "**SlEvCmdCodePlayerSetTitle(title: string)**\n\n设置玩家称号。\n\n`title`: 称号" },
    1116: { name: "SlEvCmdCodePlayerHasTitle", description: "检查玩家是否拥有称号", documentation: "**SlEvCmdCodePlayerHasTitle(title: string)**\n\n检查玩家是否有指定称号。\n\n`title`: 称号" },
    1117: { name: "SlEvCmdCodePlayerOpenStorage", description: "玩家打开仓库 - 可能是基类，具体功能不明确", documentation: "**SlEvCmdCodePlayerOpenStorage()**\n\n玩家打开仓库。" },
    1118: { name: "SlEvCmdCodePlayerOpenStorage_Overload", description: "玩家打开仓库 - 与 1117 相同，疑似函数重载，具体功能不明确", documentation: "**SlEvCmdCodePlayerOpenStorage()**\n\n玩家打开仓库。" },
    1119: { name: "SlEvCmdCodePlayerAddItemAccurately", description: "精确地给予玩家物品", documentation: "**SlEvCmdCodePlayerAddItemAccurately(itemId: number, quantity: number)**\n\n精确地给予玩家指定数量的物品。\n\n`itemId`: 物品ID\n`quantity`: 数量" },
    1120: { name: "SlEvCmdCodePlayerGetInvenPage", description: "获取玩家背包页数", documentation: "**SlEvCmdCodePlayerGetInvenPage()**\n\n获取玩家背包的页数。" },
    1121: { name: "SlEvCmdCodePlayerAddInvenPage", description: "增加玩家背包页数", documentation: "**SlEvCmdCodePlayerAddInvenPage(pages: number)**\n\n增加玩家背包的页数。\n\n`pages`: 增加的页数" },
    1122: { name: "SlEvCmdCodePlayerGetStoragePage", description: "获取家仓库页数", documentation: "**SlEvCmdCodePlayerGetStoragePage()**\n\n获取玩家家仓库的页数。" },
    1123: { name: "SlEvCmdCodePlayerAddStoragePage", description: "增加玩家仓库页数", documentation: "**SlEvCmdCodePlayerAddStoragePage(pages: number)**\n\n增加玩家仓库的页数。\n\n`pages`: 增加的页数" },
    1124: { name: "SlEvCmdCodePlayerGageControlByValue", description: "根据数值控制玩家计量条", documentation: "**SlEvCmdCodePlayerGageControlByValue(value: number)**\n\n根据数值控制玩家的计量条。\n\n`value`: 控制的数值" },
    1125: { name: "SlEvCmdCodePlayerGageControlByPercentage", description: "根据百分比控制玩家计量条", documentation: "**SlEvCmdCodePlayerGageControlByPercentage(percentage: number)**\n\n根据百分比控制玩家的计量条。\n\n`percentage`: 百分比" },
    1126: { name: "SlEvCmdCodePlayerGetSex", description: "获取玩家性别", documentation: "**SlEvCmdCodePlayerGetSex()**\n\n获取玩家的性别。" },
    1213: { name: "SlEvCmdCodePlayerGetPartyName", description: "获取玩家队伍名称", documentation: "**SlEvCmdCodePlayerGetPartyName()**\n\n获取玩家当前队伍的名称。" },
    500: { name: "SlEvCmdCodePlayerGetTotalLevel", description: "获取玩家总等级", documentation: "**SlEvCmdCodePlayerGetTotalLevel()**\n\n获取玩家的总等级。" },
    // 任务相关
    1200: { name: "SlEvCmdCodeQuestIfHasQuest", description: "检查玩家是否拥有任务", documentation: "**SlEvCmdCodeQuestIfHasQuest(questId: number)**\n\n检查玩家是否拥有指定任务。\n\n`questId`: 任务ID" },
    1201: { name: "SlEvCmdCodeQuestCreate", description: "创建任务", documentation: "**SlEvCmdCodeQuestCreate(questId: number)**\n\n创建指定的任务。\n\n`questId`: 任务ID" },
    1202: { name: "SlEvCmdCodeQuestGetState", description: "获取任务状态", documentation: "**SlEvCmdCodeQuestGetState(questId: number)**\n\n获取指定任务的状态。\n\n`questId`: 任务ID" },
    1203: { name: "SlEvCmdCodeQuestSetState", description: "设置任务状态", documentation: "**SlEvCmdCodeQuestSetState(questId: number, state: number)**\n\n设置指定任务的状态。\n\n`questId`: 任务ID\n`state`: 状态" },
    1204: { name: "SlEvCmdCodeQuestGetFlagData", description: "获取任务标志数据", documentation: "**SlEvCmdCodeQuestGetFlagData(questId: number)**\n\n获取指定任务的标志数据。\n\n`questId`: 任务ID" },
    1205: { name: "SlEvCmdCodeQuestSetFlagData", description: "设置任务标志数据", documentation: "**SlEvCmdCodeQuestSetFlagData(questId: number, flagData: any)**\n\n设置指定任务的标志数据。\n\n`questId`: 任务ID\n`flagData`: 标志数据" },
    1206: { name: "SlEvCmdCodeQuestGetQuestCount", description: "获取任务数量", documentation: "**SlEvCmdCodeQuestGetQuestCount()**\n\n获取当前玩家的任务数量。" },
    // NPC 相关
    1300: { name: "SlEvCmdCodeNPCOpenShopWindowForServer", description: "NPC 打开商店窗口", documentation: "**SlEvCmdCodeNPCOpenShopWindowForServer()**\n\nNPC 打开商店窗口。" },
    1301: { name: "SlEvCmdCodeNPCSetMoveInfo", description: "设置 NPC 移动信息", documentation: "**SlEvCmdCodeNPCSetMoveInfo(moveInfo: any)**\n\n设置 NPC 的移动信息。\n\n`moveInfo`: 移动信息" },
    400: { name: "SlEvCmdCodeNPCTalkBoxOpenForServer", description: "打开 NPC 对话框", documentation: "**SlEvCmdCodeNPCTalkBoxOpenForServer()**\n\n打开 NPC 的对话框。" },
    401: { name: "SlEvCmdCodeNPCTalkBoxWaitToCloseForServer", description: "等待 NPC 对话框关", documentation: "**SlEvCmdCodeNPCTalkBoxWaitToCloseForServer()**\n\n等待 NPC 对话框关闭。" },
    402: { name: "SlEvCmdCodeNPCTalkBoxClearForServer", description: "清除 NPC 对话框内容", documentation: "**SlEvCmdCodeNPCTalkBoxClearForServer()**\n\n清除 NPC 对话框的内容。" },
    403: { name: "SlEvCmdCodeNPCTalkBoxAddStringForServer", description: "向 NPC 对话框添字符串", documentation: "**SlEvCmdCodeNPCTalkBoxAddStringForServer(text: string)**\n\n向 NPC 对话框添加字符串。\n\n`text`: 要添加的字符串" },
    404: { name: "SlEvCmdCodeNPCTalkBoxAddMenuForServer", description: "向 NPC 对话框添加菜单", documentation: "**SlEvCmdCodeNPCTalkBoxAddMenuForServer(menu: any)**\n\n向 NPC 对话框添加菜单。\n\n`menu`: 菜单数据" },
    405: { name: "SlEvCmdCodeNPCTalkBoxAddStrIntForServer", description: "向 NPC 对话框添加字符串和整数", documentation: "**SlEvCmdCodeNPCTalkBoxAddStrIntForServer(text: string, value: number)**\n\n向 NPC 对话框添加字符串和整数。\n\n`text`: 字符串\n`value`: 整数" },
    406: { name: "SlEvCmdCodeNPCTalkBoxAddStrItemForServer", description: "向 NPC 对话框添加字符串和物品", documentation: "**SlEvCmdCodeNPCTalkBoxAddStrItemForServer(text: string, itemId: number)**\n\n向 NPC 对话框添加字符串和物品。\n\n`text`: 字符串\n`itemId`: 物品ID" },
    407: { name: "SlEvCmdCodeNPCTalkBoxAddMenuIntForServer", description: "向 NPC 对话框添加菜单和整数", documentation: "**SlEvCmdCodeNPCTalkBoxAddMenuIntForServer(menu: any, value: number)**\n\n向 NPC 对话框添加菜单和整数。\n\n`menu`: 菜单数据\n`value`: 整数" },
    // 游戏对象/事相关
    2000: { name: "SlEvCmdCodeGameObjDropItem", description: "游戏对象掉落物品", documentation: "**SlEvCmdCodeGameObjDropItem(itemId: number)**\n\n游戏对象掉落指定物品。\n\n`itemId`: 物品ID" },
    300: { name: "SlEvCmdCodeGameObjSetAniState", description: "设置游戏对象动画状态", documentation: "**SlEvCmdCodeGameObjSetAniState(state: string)**\n\n设置游戏对象的动画状态。\n\n`state`: 动画状态" },
    301: { name: "SlEvCmdCodeGameObjSetPos", description: "设置游戏对象位置", documentation: "**SlEvCmdCodeGameObjSetPos(x: number, y: number)**\n\n设置游戏对象的位置。\n\n`x`: X坐标\n`y`: Y坐标" },
    302: { name: "SlEvCmdCodeGameObjSetDir", description: "设置游戏对象方向", documentation: "**SlEvCmdCodeGameObjSetDir(direction: string)**\n\n设置游戏对象的方向。\n\n`direction`: 方向" },
    303: { name: "SlEvCmdCodeGameObjSetVisibility", description: "设置游戏对象可见性", documentation: "**SlEvCmdCodeGameObjSetVisibility(visible: boolean)**\n\n设置游戏对象的可见性。\n\n`visible`: 是否可见" },
    304: { name: "SlEvCmdCodeGameObjSetName", description: "设置游戏对象名称", documentation: "**SlEvCmdCodeGameObjSetName(name: string)**\n\n设置游戏对象的名称。\n\n`name`: 名称" },
    305: { name: "SlEvCmdCodeGameObjTeleport", description: "瞬移游戏对象", documentation: "**SlEvCmdCodeGameObjTeleport(x: number, y: number)**\n\n瞬移游戏对象到指定位置。\n\n`x`: X坐标\n`y`: Y坐标" },
    306: { name: "SlEvCmdCodeGameObjDie", description: "游戏对象死亡", documentation: "**SlEvCmdCodeGameObjDie()**\n\n使游戏对象死亡。" },
    307: { name: "SlEvCmdCodeGameObjPlayAni", description: "播放游戏对象动画", documentation: "**SlEvCmdCodeGameObjPlayAni(animation: string)**\n\n播放游戏对象的动画。\n\n`animation`: 动画名称" },
    308: { name: "SlEvCmdCodeGameObjStopAni", description: "停止游戏对象动画", documentation: "**SlEvCmdCodeGameObjStopAni()**\n\n停止游戏对象的动画。" },
    4000: { name: "SlEvCmdCodeMapChange", description: "切换场景", documentation: "**SlEvCmdCodeMapChange(mapId: number)**\n\n切换到指定场景。\n\n`mapId`: 场景ID" },
    4001: { name: "SlEvCmdCodeMapSetPos", description: "设置场景位置", documentation: "**SlEvCmdCodeMapSetPos(x: number, y: number)**\n\n设置场景的位置。\n\n`x`: X坐标\n`y`: Y坐标" },
    4002: { name: "SlEvCmdCodeMapSetVisiable", description: "设置场景可见性", documentation: "**SlEvCmdCodeMapSetVisiable(visible: boolean)**\n\n设置场景的可见性。\n\n`visible`: 是否可见" },
    5000: { name: "SlEvCmdCodeSetOther", description: "设置其他信息", documentation: "**SlEvCmdCodeSetOther(data: any)**\n\n设置其他信息。\n\n`data`: 其他数据" },
    5001: { name: "SlEvCmdCodeGetOther", description: "获取其他信息", documentation: "**SlEvCmdCodeGetOther()**\n\n获取其他信息。" },
    5002: { name: "SlEvCmdCodeIsItemAvailable", description: "检查物品是否可用", documentation: "**SlEvCmdCodeIsItemAvailable(itemId: number)**\n\n检查指定物品是否可用。\n\n`itemId`: 物品ID" },
    // 聊天/消息相关
    1501: { name: "SlEvCmdCodeReturnOnly", description: "仅返回 (占位符/仅返回 - 似乎被重载用于聊天功能)", documentation: "**SlEvCmdCodeReturnOnly()**\n\n仅返回。" },
    1600: { name: "NoticeStop", description: "服务器消息结束", documentation: "**NoticeStop**\n\n服务器消息结束。" },
    1601: { name: "NoticeStart", description: "服务器消息开始", documentation: "**NoticeStart**\n\n服务器消息开始。" },
    1602: { name: "NoticeContext", description: "服务器消息内容", documentation: "**NoticeContext**\n\n服务器消息内容。" },
    1603: { name: "NoticeValue", description: "服务器消息值", documentation: "**NoticeValue**\n\n服务器消息值。" },
    1604: { name: "NoticeString", description: "服务器消息字符串", documentation: "**NoticeString**\n\n服务器消息字符串。" },
    1700: { name: "SlEvCmdCodeGroupCreate", description: "创建组", documentation: "**SlEvCmdCodeGroupCreate()**\n\n创建组。" },
    1800: { name: "SlEvCmdCodeChatCafeCommon", description: "聊天咖啡馆通用功能", documentation: "**SlEvCmdCodeChatCafeCommon()**\n\n聊天咖啡馆通用功能。" },
    1801: { name: "ChatRoomContext", description: "聊天房间内容", documentation: "**ChatRoomContext**\n\n聊天房间内容。" },
    1802: { name: "ChatRoomMenu", description: "聊天房间菜单", documentation: "**ChatRoomMenu**\n\n聊天房间菜单。" },
    1803: { name: "SlEvCmdCodeChatCafeWaitForSelect", description: "等待聊天咖啡馆选择", documentation: "**SlEvCmdCodeChatCafeWaitForSelect()**\n\n等待聊天咖啡馆选择。" },
    1804: { name: "SlEvCmdCodeChatCafeGroupCreate", description: "创建聊天咖啡馆组", documentation: "**SlEvCmdCodeChatCafeGroupCreate()**\n\n创建聊天咖啡馆组。" },
    1000: { name: "SlEvCmdCodeGetSystemTimeServer", description: "获取系统间 - 服务器", documentation: "**SlEvCmdCodeGetSystemTimeServer()**\n\n获取系统时间 - 服务器。" },
};
function activate(context) {
    // 注册自动补全提供者
    const provider = vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'sl' }, {
        provideCompletionItems(document, position) {
            const completionItems = Object.keys(commandMap).map(key => {
                const command = commandMap[Number(key)];
                const item = new vscode.CompletionItem(command.name, vscode.CompletionItemKind.Function);
                item.detail = command.description;
                item.documentation = new vscode.MarkdownString(command.documentation);
                return item;
            });
            return completionItems;
        }
    }, '.'); // 触发字符 "."
    context.subscriptions.push(provider);
    // 注册命令
    Object.keys(commandMap).forEach(key => {
        const command = commandMap[Number(key)];
        const commandId = command.name;
        const disposable = vscode.commands.registerCommand(commandId, () => {
            //  这里可以根据需要修改命令的实际功能
            vscode.window.showInformationMessage(`执行命令: ${command.description}`);
            // 获取当前编辑器
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                // 获取当前光标位置
                const position = editor.selection.active;
                // 插入命令文本
                editor.edit(editBuilder => {
                    editBuilder.insert(position, `${command.name}()`);
                });
            }
        });
        context.subscriptions.push(disposable);
    });
    // 语法高亮
    const slSemanticTokensProvider = new SLSemanticTokensProvider();
    context.subscriptions.push(vscode.languages.registerDocumentSemanticTokensProvider('sl', slSemanticTokensProvider, slSemanticTokensProvider.getLegend()));
    // 注册悬停提供者
    context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: 'sl' }, {
        provideHover(document, position) {
            const wordRange = document.getWordRangeAtPosition(position);
            const word = document.getText(wordRange);
            const key = Object.keys(commandMap).find(key => commandMap[Number(key)].name === word);
            if (key) { // 确保 key 是有效的
                const command = commandMap[Number(key)];
                return new vscode.Hover(new vscode.MarkdownString(command.documentation));
            }
            return null; // 如果没有找到对应的命令，返回 null
        }
    }));
}
class SLSemanticTokensProvider {
    getCommandRegex() {
        const commandNames = Object.values(commandMap).map(c => c.name).sort();
        const escapedCommandNames = commandNames.map(name => name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
        const commandRegexPart = `\\b(${escapedCommandNames.join('|')})\\b`;
        return new RegExp(`//.*|${commandRegexPart}`, 'g');
    }
    async provideDocumentSemanticTokens(document, token) {
        const builder = new vscode.SemanticTokensBuilder(this.getLegend());
        const regex = this.getCommandRegex();
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            let match;
            while (match = regex.exec(line.text)) {
                const tokenType = match[0].startsWith("//") ? 'comment' : 'function';
                const startPos = new vscode.Position(i, match.index);
                const endPos = new vscode.Position(i, match.index + match[0].length);
                const range = new vscode.Range(startPos, endPos); // Define range here
                builder.push(range, tokenType);
            }
        }
        return builder.build();
    }
    getLegend() {
        const tokenTypes = ['comment', 'function'];
        const tokenModifiers = []; // 显式声明为 string[] 类型
        return new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers);
    }
}
function deactivate() { }
//# sourceMappingURL=extension.js.map