"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var DB = require('../../module/db');
var jwt = require('jsonwebtoken');
var Router = require('koa-router');
var tokenConfig = { privateKey: 'yue' };
var multer = require('koa-multer'); //加载koa-multer模块
var fnc = require('../../module/fnc/fnc');
var interfaceNameObj = require('../../module/interfaceName');
var getTime = fnc.getTime;
var router = new Router();
var returnCode;
(function (returnCode) {
    returnCode[returnCode["success"] = 200] = "success";
    returnCode[returnCode["tokenFailure"] = 401] = "tokenFailure";
    returnCode[returnCode["error"] = 400] = "error";
})(returnCode || (returnCode = {}));
var verificationToken = function (ctx) {
    try {
        var token = ctx.get('Authorization');
        var data = void 0;
        if (token === '') {
            return { flog: false, msg: '未登录', data: null };
        }
        else {
            try {
                data = jwt.verify(token.split(' ')[1], tokenConfig.privateKey);
                return { flog: true, data: data, msg: 'success' };
            }
            catch (error) {
                // console.log(error)
                return { flog: false, msg: 'token过期', data: null };
            }
        }
    }
    catch (error) {
        console.log(error);
    }
};
router.post(interfaceNameObj.notice, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, offset, limit, data, list, arr, len, i, a, b, i, status;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!verificationToken(ctx).flog) {
                    ctx.body = { code: returnCode.tokenFailure, message: "" + verificationToken(ctx).msg };
                    return [2 /*return*/];
                }
                _a = ctx.request.body, offset = _a.offset, limit = _a.limit;
                if (!offset || offset <= 0) {
                    ctx.body = { code: returnCode.error, message: 'offset 错误', data: null };
                    return [2 /*return*/, false];
                }
                ;
                if (!limit || limit <= 0) {
                    ctx.body = { code: returnCode.error, message: 'limit 错误', data: null };
                    return [2 /*return*/, false];
                }
                ;
                offset = offset * 1;
                limit = limit * 1;
                return [4 /*yield*/, DB.find('user', { _id: DB.getID(verificationToken(ctx).data.id) }, {})];
            case 1:
                data = _b.sent();
                list = data[0].notice;
                len = list.length;
                if (len === 0) {
                    ctx.body = { code: returnCode.error, message: '无数据', data: [] };
                    return [2 /*return*/, false];
                }
                if (offset == 1) {
                    arr = list.slice(0, limit);
                    //  console.log(limit)
                    for (i = 0; 0 <= i && i < limit; i++) {
                        if (list[i]) {
                            list[i].flog = true;
                        }
                    }
                }
                else {
                    arr = list.slice(offset * limit - limit, offset * limit);
                    a = offset * limit - limit;
                    b = offset * limit;
                    for (i = offset * limit - limit; a <= i && i <= b; i++) {
                        if (list[i]) {
                            list[i].flog = true;
                        }
                    }
                }
                return [4 /*yield*/, DB.update('user', { _id: DB.getID(verificationToken(ctx).data.id) }, { notice: list })];
            case 2:
                status = _b.sent();
                // console.log(status.result.n);
                if (status.result.n) {
                    ctx.body = { code: returnCode.success, message: '成功', data: arr };
                }
                return [2 /*return*/];
        }
    });
}); });
router.post(interfaceNameObj.unread, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var data, _i, _a, i;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!verificationToken(ctx).flog) {
                    ctx.body = { code: returnCode.tokenFailure, message: "" + verificationToken(ctx).msg };
                    return [2 /*return*/];
                }
                return [4 /*yield*/, DB.find('user', { _id: DB.getID(verificationToken(ctx).data.id) })];
            case 1:
                data = _b.sent();
                for (_i = 0, _a = data[0].notice; _i < _a.length; _i++) {
                    i = _a[_i];
                    if (!i.flog) {
                        ctx.body = { code: returnCode.success, message: '', data: { status: '1' } };
                        return [2 /*return*/, false];
                    }
                }
                ctx.body = { code: returnCode.success, message: '', data: { status: '0' } };
                return [2 /*return*/];
        }
    });
}); });
router.post(interfaceNameObj.changePwd, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var data, obj, _a, pwd, newPwd, status;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!verificationToken(ctx).flog) {
                    ctx.body = { code: returnCode.tokenFailure, message: "" + verificationToken(ctx).msg };
                    return [2 /*return*/];
                }
                return [4 /*yield*/, DB.find('user', { _id: DB.getID(verificationToken(ctx).data.id) })];
            case 1:
                data = _b.sent();
                obj = data[0];
                _a = ctx.request.body, pwd = _a.pwd, newPwd = _a.newPwd;
                if (pwd !== obj.pwd) {
                    ctx.body = { code: returnCode.error, message: "\u539F\u5BC6\u7801\u9519\u8BEF", data: null };
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, DB.update('user', { _id: DB.getID(verificationToken(ctx).data.id) }, { pwd: newPwd })];
            case 2:
                status = _b.sent();
                if (status.result.n) {
                    ctx.body = { code: returnCode.success, message: '修改密码成功', data: null };
                }
                else {
                    ctx.body = { code: returnCode.error, message: '修改密码失败', data: null };
                }
                return [2 /*return*/];
        }
    });
}); });
router.post(interfaceNameObj.createTeam, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var data, status, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!verificationToken(ctx).flog) {
                    ctx.body = { code: returnCode.tokenFailure, message: "" + verificationToken(ctx).msg };
                    return [2 /*return*/, false];
                }
                ctx.request.body.createTime = new Date().getTime();
                ctx.request.body.createDay = getTime('yearMonthDay'); //创建年月日
                ctx.request.body.flog = true; //是否解散(默认true)
                return [4 /*yield*/, DB.find('user', { _id: DB.getID(verificationToken(ctx).data.id) })];
            case 1:
                data = _a.sent();
                return [4 /*yield*/, DB.find('team', {})];
            case 2:
                status = _a.sent();
                ctx.request.body.id = status.length + 1; //自增id
                ctx.request.body.taskList = []; //任务列表
                ctx.request.body.memberList = []; //成员列表
                ctx.request.body.flog = true; //默认未删除为true
                ctx.request.body.userId = DB.getID(data[0]._id); //队长id
                return [4 /*yield*/, DB.insert('team', ctx.request.body)];
            case 3:
                res = _a.sent();
                if (res.result.n) {
                    ctx.body = { code: returnCode.success, message: '创建成功', data: null };
                }
                else {
                    ctx.body = { code: returnCode.error, message: '创建失败', data: null };
                }
                return [2 /*return*/];
        }
    });
}); });
router.post(interfaceNameObj.teamAll, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!verificationToken(ctx).flog) {
                    ctx.body = { code: returnCode.tokenFailure, message: "" + verificationToken(ctx).msg };
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, DB.find('team', {}, { _id: 0 }, Number(ctx.request.body.offset), Number(ctx.request.body.limit))];
            case 1:
                res = _a.sent();
                console.log(res);
                ctx.body = { code: returnCode.success, message: '成功', data: res };
                return [2 /*return*/];
        }
    });
}); });
router.post(interfaceNameObj.myTeam, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, useranme, res;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!verificationToken(ctx).flog) {
                    ctx.body = { code: returnCode.tokenFailure, message: "" + verificationToken(ctx).msg };
                    return [2 /*return*/, false];
                }
                _a = ctx.request.body, userId = _a.userId, useranme = _a.useranme;
                return [4 /*yield*/, DB.find('team', { userId: DB.getID(userId), flog: true }, { flog: 0 })];
            case 1:
                res = _b.sent();
                // console.log(res)
                res.forEach(function (val, ind) {
                    val.username = useranme;
                });
                ctx.body = { code: returnCode.success, message: '成功', data: res };
                return [2 /*return*/];
        }
    });
}); });
router.post(interfaceNameObj.searchUser, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var text, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!verificationToken(ctx).flog) {
                    ctx.body = { code: returnCode.tokenFailure, message: "" + verificationToken(ctx).msg };
                    return [2 /*return*/, false];
                }
                text = ctx.request.body.text;
                if (text === verificationToken(ctx).data.username) {
                    ctx.body = { code: returnCode.error, message: '不能搜索自己的账号', data: null };
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, DB.find('user', { username: text }, { pwd: 0, workRecordObj: 0, notice: 0 })];
            case 1:
                res = _a.sent();
                if (res.length) {
                    ctx.body = { code: returnCode.success, message: 'success', data: res[0] };
                }
                else {
                    ctx.body = { code: returnCode.error, message: '未找到此账号', data: null };
                }
                console.log(res);
                return [2 /*return*/];
        }
    });
}); });
router.post(interfaceNameObj.inviteJoin, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, teamId, inviteId, message, teamData, i, name_1, inviteJoinHistory, _i, _b, iterator, len, obj, status_1, obj, status_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!verificationToken(ctx).flog) {
                    ctx.body = { code: returnCode.tokenFailure, message: "" + verificationToken(ctx).msg };
                    return [2 /*return*/, false];
                }
                _a = ctx.request.body, userId = _a.userId, teamId = _a.teamId, inviteId = _a.inviteId;
                message = '';
                return [4 /*yield*/, DB.find('team', { id: Number(teamId) })];
            case 1:
                teamData = _c.sent();
                // console.log(teamData[0].userId,userId,'----205')
                // console.log( teamData[0].userId!=userId,'----206')
                // console.log(ctx.request.body,'----207')
                if (teamData[0].userId != userId) {
                    ctx.body = { code: returnCode.error, message: '你不是该团队的队长', data: null };
                    return [2 /*return*/, false];
                }
                if (!teamData.length) return [3 /*break*/, 3];
                for (i = 0; i < teamData[0].memberList.length; i++) { //标注
                    if (teamData[0].memberList[i].userId === inviteId) {
                        ctx.body = { code: returnCode.error, message: '邀请人已经在团队里面', data: null };
                        return [2 /*return*/];
                    }
                }
                return [4 /*yield*/, DB.find('user', { _id: DB.getID(teamData[0].userId) }, { username: 1 })];
            case 2:
                name_1 = _c.sent();
                message = name_1[0].username + "\u9080\u8BF7\u4F60\u52A0\u5165" + teamData[0].teamName;
                return [3 /*break*/, 4];
            case 3:
                ctx.body = { code: returnCode.error, message: '未找到此团队' };
                _c.label = 4;
            case 4: return [4 /*yield*/, DB.find('inviteJoinHistory', { userId: inviteId })];
            case 5:
                inviteJoinHistory = _c.sent();
                if (!inviteJoinHistory.length) return [3 /*break*/, 7];
                for (_i = 0, _b = inviteJoinHistory[0].list; _i < _b.length; _i++) {
                    iterator = _b[_i];
                    if (teamId === iterator.teamId && !iterator.status) {
                        ctx.body = { code: returnCode.error, message: '已发送过请求，对方还未回复', data: null };
                        return [2 /*return*/, false];
                    }
                }
                len = inviteJoinHistory[0].list.length + 1;
                obj = { id: len, teamId: teamId, status: '', message: message, teamName: teamData[0].teamName };
                inviteJoinHistory[0].list.unshift(obj);
                return [4 /*yield*/, DB.update('inviteJoinHistory', { userId: inviteId }, { list: inviteJoinHistory[0].list })];
            case 6:
                status_1 = _c.sent();
                if (status_1.result.n) {
                    ctx.body = { code: returnCode.success, message: '已向该用户发送邀请', data: null };
                }
                return [3 /*break*/, 9];
            case 7:
                obj = { userId: inviteId, list: [{ id: 1, teamId: teamId, status: '', message: message }] };
                return [4 /*yield*/, DB.insert('inviteJoinHistory', obj)];
            case 8:
                status_2 = _c.sent();
                if (status_2.result.n) {
                    ctx.body = { code: returnCode.success, message: '已向该用户发送邀请', data: null };
                }
                _c.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); });
router.post(interfaceNameObj.beInvited, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, history;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!verificationToken(ctx).flog) {
                    ctx.body = { code: returnCode.tokenFailure, message: "" + verificationToken(ctx).msg };
                    return [2 /*return*/, false];
                }
                userId = ctx.request.body.userId;
                return [4 /*yield*/, DB.find('inviteJoinHistory', { userId: userId }, { _id: 0, userId: 0 })];
            case 1:
                history = _a.sent();
                if (history.length) {
                    ctx.body = { code: returnCode.success, message: 'success', data: history[0].list };
                }
                else {
                    ctx.body = { code: returnCode.success, message: '暂时没有数据', data: history };
                }
                return [2 /*return*/];
        }
    });
}); });
router.post(interfaceNameObj.processInvitation, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, status, userId, teamId, username, data, i, msg, teamData, obj, res;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!verificationToken(ctx).flog) {
                    ctx.body = { code: returnCode.tokenFailure, message: "" + verificationToken(ctx).msg };
                    return [2 /*return*/, false];
                }
                _a = ctx.request.body, id = _a.id, status = _a.status, userId = _a.userId, teamId = _a.teamId, username = _a.username;
                return [4 /*yield*/, DB.find('inviteJoinHistory', { userId: userId })
                    // console.log(data)
                ];
            case 1:
                data = _b.sent();
                i = 0;
                _b.label = 2;
            case 2:
                if (!(i < data[0].list.length)) return [3 /*break*/, 8];
                if (!(id == data[0].list[i].id)) return [3 /*break*/, 7];
                data[0].list[i].status = status;
                return [4 /*yield*/, DB.update('inviteJoinHistory', { userId: userId }, { list: data[0].list })];
            case 3:
                msg = _b.sent();
                if (!msg.result.n) {
                    ctx.body = { code: returnCode.error, message: '数据更新失败', data: null };
                    return [2 /*return*/];
                }
                if (!(status === '1')) return [3 /*break*/, 6];
                return [4 /*yield*/, DB.find('team', { id: Number(teamId) })];
            case 4:
                teamData = _b.sent();
                obj = { userId: userId, username: username };
                teamData[0].memberList.push(obj);
                return [4 /*yield*/, DB.update('team', { id: Number(teamId) }, { memberList: teamData[0].memberList })];
            case 5:
                res = _b.sent();
                // console.log(res.result)
                if (res.result.n) {
                    ctx.body = { code: returnCode.success, message: 'success', data: null };
                }
                else {
                    ctx.body = { code: returnCode.error, message: '数据更新失败', data: null };
                }
                return [3 /*break*/, 7];
            case 6:
                ctx.body = { code: returnCode.success, message: "\u4F60\u5DF2\u62D2\u7EDD\u4E86" + data[0].list[i].teamName + "\u56E2\u961F\u7684\u9080\u8BF7" };
                return [2 /*return*/, false];
            case 7:
                i++;
                return [3 /*break*/, 2];
            case 8: return [2 /*return*/];
        }
    });
}); });
router.post(interfaceNameObj.participateTeam, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!verificationToken(ctx).flog) {
                    ctx.body = { code: returnCode.tokenFailure, message: "" + verificationToken(ctx).msg };
                    return [2 /*return*/, false];
                }
                userId = ctx.request.body.userId;
                console.log(ctx.request.body);
                return [4 /*yield*/, DB.find('team', { "memberList.userId": userId }, { _id: 0, flog: 0, taskList: 0, memberList: 0, userId: 0 })];
            case 1:
                data = _a.sent();
                console.log(data);
                ctx.body = { code: returnCode.success, message: 'success', data: data };
                return [2 /*return*/];
        }
    });
}); });
router.post(interfaceNameObj.deleteTeam, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var teamId, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!verificationToken(ctx).flog) {
                    ctx.body = { code: returnCode.tokenFailure, message: "" + verificationToken(ctx).msg };
                    return [2 /*return*/, false];
                }
                teamId = ctx.request.body.teamId;
                return [4 /*yield*/, DB.update('team', { id: Number(teamId) }, { flog: false })];
            case 1:
                data = _a.sent();
                if (data.result.n) {
                    ctx.body = { code: returnCode.success, message: '删除成功' };
                }
                else {
                    ctx.body = { code: returnCode.error, message: '删除失败' };
                }
                return [2 /*return*/];
        }
    });
}); });
/**
 * 接收{teamId:'',userId:'',taskNmae:'',taskLabel:''}
 * 额外添加开始时间createTime、结束时间endTime、任务状态taskStatus(默认为'0'未完成)、
 * 任务是否领取状态isReceive(0未领取)、是否逻辑删除flog(默认为true)
 */
router.post(interfaceNameObj.createTeamWork, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, teamId, userId, _b, team, a, status;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!verificationToken(ctx).flog) {
                    ctx.body = { code: returnCode.tokenFailure, message: "" + verificationToken(ctx).msg };
                    return [2 /*return*/, false];
                }
                _a = ctx.request.body, teamId = _a.teamId, userId = _a.userId;
                return [4 /*yield*/, DB.find('team', { id: Number(teamId) })];
            case 1:
                _b = _c.sent(), team = _b[0], a = _b.slice(1);
                ctx.request.body.createTime = new Date().getTime();
                ctx.request.body.endTime = null;
                ctx.request.body.taskStatus = '0';
                ctx.request.body.flog = true;
                ctx.request.body.taskId = team.taskList.length + 1;
                ctx.request.body.isReceive = '1';
                if (team.userId.toString() === userId) { //如果是队长创建的项目未领取的状态
                    ctx.request.body.isReceive = '0';
                    ctx.request.body.userId = null;
                }
                team.taskList.unshift(ctx.request.body);
                return [4 /*yield*/, DB.update('team', { id: Number(teamId) }, { taskList: team.taskList })];
            case 2:
                status = _c.sent();
                // console.log(status.result.n);
                if (status.result.n) {
                    ctx.body = { code: returnCode.success, message: '创建成功' };
                    return [2 /*return*/];
                }
                ctx.body = { code: returnCode.error, message: '创建失败' };
                return [2 /*return*/];
        }
    });
}); });
/**
 * {teamId:'',taskId:'',userId:'';}
 *
 */
router.post(interfaceNameObj.receiveTask, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, teamId, userId, taskId, _b, data, a, status;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!verificationToken(ctx).flog) {
                    ctx.body = { code: returnCode.tokenFailure, message: "" + verificationToken(ctx).msg };
                    return [2 /*return*/, false];
                }
                _a = ctx.request.body, teamId = _a.teamId, userId = _a.userId, taskId = _a.taskId;
                console.log(teamId, userId);
                return [4 /*yield*/, DB.find('team', { id: Number(teamId) })];
            case 1:
                _b = _c.sent(), data = _b[0], a = _b.slice(1);
                data.taskList.forEach(function (val, ind) {
                    if (val.taskId === Number(taskId)) {
                        val.userId = userId;
                        console.log('111');
                    }
                });
                return [4 /*yield*/, DB.update('team', { id: Number(teamId) }, { taskList: data.taskList })];
            case 2:
                status = _c.sent();
                if (status.result.n) {
                    ctx.body = { code: returnCode.success, message: '领取成功', data: null };
                    return [2 /*return*/];
                }
                ctx.body = { code: returnCode.error, message: '领取失败', data: null };
                return [2 /*return*/];
        }
    });
}); });
/**
 * {teamId:'',taskId:'',userId:'';}
 *
 */
router.post(interfaceNameObj.finishTeamTask, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, teamId, userId, taskId, _b, data, a, taskflog, userFlog, statusFlog, status;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!verificationToken(ctx).flog) {
                    ctx.body = { code: returnCode.tokenFailure, message: "" + verificationToken(ctx).msg };
                    return [2 /*return*/, false];
                }
                _a = ctx.request.body, teamId = _a.teamId, userId = _a.userId, taskId = _a.taskId;
                return [4 /*yield*/, DB.find('team', { id: Number(teamId) })];
            case 1:
                _b = _c.sent(), data = _b[0], a = _b.slice(1);
                if (!data) {
                    ctx.body = { code: returnCode.error, message: '未找到该团队', data: null };
                    return [2 /*return*/, false];
                }
                taskflog = false;
                userFlog = false;
                statusFlog = false;
                data.taskList.forEach(function (val, ind) {
                    if (val.taskId === Number(taskId)) {
                        taskflog = true;
                        if (val.userId === userId) {
                            userFlog = true;
                            if (val.taskStatus === '0') {
                                statusFlog = true;
                                val.taskStatus = '1';
                                val.endTime = new Date().getTime();
                            }
                        }
                    }
                });
                if (!taskflog) {
                    ctx.body = { code: returnCode.error, message: '未找到该任务', data: null };
                    return [2 /*return*/, false];
                }
                if (!userFlog) {
                    ctx.body = { code: returnCode.error, message: '该角色没有权限更改任务状态', data: null };
                    return [2 /*return*/, false];
                }
                if (!statusFlog) {
                    ctx.body = { code: returnCode.error, message: '该任务已经是完成状态', data: null };
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, DB.update('team', { id: Number(teamId) }, { taskList: data.taskList })];
            case 2:
                status = _c.sent();
                if (status.result.n) {
                    ctx.body = { code: returnCode.success, message: '更改任务状态成功', data: null };
                    return [2 /*return*/, false];
                }
                ctx.body = { code: returnCode.error, message: '更改任务状态失败', data: null };
                return [2 /*return*/];
        }
    });
}); });
/**
 *
 * {teamId:'',taskId:'',userId:'';}
 */
router.post(interfaceNameObj.deleteTeamTask, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, teamId, userId, taskId, _b, data, a, taskflog, userFlog, statusFlog, status;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!verificationToken(ctx).flog) {
                    ctx.body = { code: returnCode.tokenFailure, message: "" + verificationToken(ctx).msg };
                    return [2 /*return*/, false];
                }
                _a = ctx.request.body, teamId = _a.teamId, userId = _a.userId, taskId = _a.taskId;
                return [4 /*yield*/, DB.find('team', { id: Number(teamId) })];
            case 1:
                _b = _c.sent(), data = _b[0], a = _b.slice(1);
                if (!data) {
                    ctx.body = { code: returnCode.error, message: '未找到该团队', data: null };
                    return [2 /*return*/, false];
                }
                taskflog = false;
                userFlog = false;
                statusFlog = false;
                data.taskList.forEach(function (val, ind) {
                    if (val.taskId === Number(taskId)) {
                        taskflog = true;
                        if (val.userId === userId) {
                            userFlog = true;
                            if (val.flog) {
                                statusFlog = true;
                                val.flog = false;
                            }
                        }
                    }
                });
                if (!taskflog) {
                    ctx.body = { code: returnCode.error, message: '未找到该任务', data: null };
                    return [2 /*return*/, false];
                }
                if (!userFlog) {
                    ctx.body = { code: returnCode.error, message: '该角色没有权限更改任务状态', data: null };
                    return [2 /*return*/, false];
                }
                if (!statusFlog) {
                    ctx.body = { code: returnCode.error, message: '该任务已被删除', data: null };
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, DB.update('team', { id: Number(teamId) }, { taskList: data.taskList })];
            case 2:
                status = _c.sent();
                if (status.result.n) {
                    ctx.body = { code: returnCode.success, message: '删除成功', data: null };
                    return [2 /*return*/, false];
                }
                ctx.body = { code: returnCode.error, message: '删除失败', data: null };
                return [2 /*return*/];
        }
    });
}); });
/**
 *
 *
 */
router.post(interfaceNameObj.getMyTeamTask, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, data, arr;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!verificationToken(ctx).flog) {
                    ctx.body = { code: returnCode.tokenFailure, message: "" + verificationToken(ctx).msg };
                    return [2 /*return*/, false];
                }
                userId = ctx.request.body.userId;
                return [4 /*yield*/, DB.find('team', { 'taskList.userId': userId }, { taskList: true })];
            case 1:
                data = _a.sent();
                arr = [];
                data.forEach(function (val, ind) {
                    if (val.taskList) {
                        val.taskList.forEach(function (v, i) {
                            if (v.userId === userId) {
                                arr.push(v);
                            }
                        });
                    }
                });
                ctx.body = { code: returnCode.success, message: 'success', data: arr };
                return [2 /*return*/];
        }
    });
}); });
router.post(interfaceNameObj.transfer, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, teamId, teammateId, _b, data, a, status;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!verificationToken(ctx).flog) {
                    ctx.body = { code: returnCode.tokenFailure, message: "" + verificationToken(ctx).msg };
                    return [2 /*return*/, false];
                }
                _a = ctx.request.body, teamId = _a.teamId, teammateId = _a.teammateId;
                return [4 /*yield*/, DB.find('team', { id: Number(teamId) })];
            case 1:
                _b = _c.sent(), data = _b[0], a = _b.slice(1);
                if (verificationToken(ctx).data.id !== data.userId.toString()) {
                    ctx.body = { code: returnCode.error, message: '你不是该团队的队长', data: null };
                    return [2 /*return*/, false];
                }
                data.userId = teammateId;
                console.log(data);
                return [4 /*yield*/, DB.update('team', { id: Number(teamId) }, data)];
            case 2:
                status = _c.sent();
                if (status.result.n) {
                    ctx.body = { code: returnCode.success, message: 'success', data: null };
                    return [2 /*return*/, false];
                }
                ctx.body = { code: returnCode.error, message: 'error', data: null };
                return [2 /*return*/];
        }
    });
}); });
router.post(interfaceNameObj.getMyFinishTeamTask, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (!verificationToken(ctx).flog) {
            ctx.body = { code: returnCode.tokenFailure, message: "" + verificationToken(ctx).msg };
            return [2 /*return*/, false];
        }
        return [2 /*return*/];
    });
}); });
module.exports = router.routes();
