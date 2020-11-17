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
router.post('/notice', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
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
                return [4 /*yield*/, DB.find('user', { username: verificationToken(ctx).data.username }, {})];
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
                return [4 /*yield*/, DB.update('user', { username: verificationToken(ctx).data.username }, { notice: list })];
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
router.post('/unread', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var data, _i, _a, i;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!verificationToken(ctx).flog) {
                    ctx.body = { code: returnCode.tokenFailure, message: "" + verificationToken(ctx).msg };
                    return [2 /*return*/];
                }
                return [4 /*yield*/, DB.find('user', { username: verificationToken(ctx).data.username })];
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
router.post('/changePwd', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var data, obj, _a, pwd, newPwd, status;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!verificationToken(ctx).flog) {
                    ctx.body = { code: returnCode.tokenFailure, message: "" + verificationToken(ctx).msg };
                    return [2 /*return*/];
                }
                return [4 /*yield*/, DB.find('user', { username: verificationToken(ctx).data.username })];
            case 1:
                data = _b.sent();
                obj = data[0];
                _a = ctx.request.body, pwd = _a.pwd, newPwd = _a.newPwd;
                if (pwd !== obj.pwd) {
                    ctx.body = { code: returnCode.error, message: "\u539F\u5BC6\u7801\u9519\u8BEF", data: null };
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, DB.update('user', { username: verificationToken(ctx).data.username }, { pwd: newPwd })];
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
router.post('/createTeam', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
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
                return [4 /*yield*/, DB.find('user', { username: verificationToken(ctx).data.username })];
            case 1:
                data = _a.sent();
                return [4 /*yield*/, DB.find('team', {})];
            case 2:
                status = _a.sent();
                ctx.request.body.id = status.length + 1; //自增id
                ctx.request.body.taskList = []; //任务列表
                ctx.request.body.memberList = []; //成员列表
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
router.post('/teamAll', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
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
router.post('/myTeam', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, useranme, res;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!verificationToken(ctx).flog) {
                    ctx.body = { code: returnCode.tokenFailure, message: "" + verificationToken(ctx).msg };
                    return [2 /*return*/, false];
                }
                _a = ctx.request.body, userId = _a.userId, useranme = _a.useranme;
                return [4 /*yield*/, DB.find('team', { userId: DB.getID(userId) })];
            case 1:
                res = _b.sent();
                res.forEach(function (val, ind) {
                    val.username = useranme;
                });
                ctx.body = { code: returnCode.success, message: '成功', data: res };
                return [2 /*return*/];
        }
    });
}); });
router.post('/searchUser', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
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
router.post('/inviteJoin', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, teamId, message, teamData, i, name_1, inviteJoinHistory, _i, _b, iterator, len, obj, status_1, obj, status_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!verificationToken(ctx).flog) {
                    ctx.body = { code: returnCode.tokenFailure, message: "" + verificationToken(ctx).msg };
                    return [2 /*return*/, false];
                }
                _a = ctx.request.body, userId = _a.userId, teamId = _a.teamId;
                message = '';
                return [4 /*yield*/, DB.find('team', { id: Number(teamId) })];
            case 1:
                teamData = _c.sent();
                if (!teamData.length) return [3 /*break*/, 3];
                for (i = 0; i < teamData[0].memberList.length; i++) { //标注
                    if (teamData[0].memberList[i].userId === userId) {
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
            case 4: return [4 /*yield*/, DB.find('inviteJoinHistory', { userId: userId })];
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
                obj = { id: len, teamId: teamId, status: '', message: message };
                inviteJoinHistory[0].list.unshift(obj);
                return [4 /*yield*/, DB.update('inviteJoinHistory', { userId: userId }, { list: inviteJoinHistory[0].list })];
            case 6:
                status_1 = _c.sent();
                if (status_1.result.n) {
                    ctx.body = { code: returnCode.success, message: '已向该用户发送邀请', data: null };
                }
                return [3 /*break*/, 9];
            case 7:
                obj = { userId: userId, list: [{ id: 1, teamId: teamId, status: '', message: message }] };
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
router.post('/beInvited', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
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
router.post('/processInvitation', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (!verificationToken(ctx).flog) {
            ctx.body = { code: returnCode.tokenFailure, message: "" + verificationToken(ctx).msg };
            return [2 /*return*/, false];
        }
        console.log(ctx.request.body);
        return [2 /*return*/];
    });
}); });
router.post('/participateTeam', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, status, userId, teamId;
    return __generator(this, function (_b) {
        if (!verificationToken(ctx).flog) {
            ctx.body = { code: returnCode.tokenFailure, message: "" + verificationToken(ctx).msg };
            return [2 /*return*/, false];
        }
        _a = ctx.request.body, id = _a.id, status = _a.status, userId = _a.userId, teamId = _a.teamId;
        console.log(ctx.request.body);
        // let status = await DB.find('team',{"memberList.id":112});
        console.log(status);
        return [2 /*return*/];
    });
}); });
module.exports = router.routes();
