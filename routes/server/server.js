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
var router = new Router();
var returnCode;
(function (returnCode) {
    returnCode[returnCode["success"] = 200] = "success";
    returnCode[returnCode["tokenFailure"] = 401] = "tokenFailure";
    returnCode[returnCode["error"] = 400] = "error";
})(returnCode || (returnCode = {}));
function returnMsg(ctx, status, msg, data) {
    ctx.body = { code: returnCode[status], msg: msg, data: data };
}
var verificationToken = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var token, data, status_1, error_1, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                token = ctx.get('Authorization');
                if (!(token === '')) return [3 /*break*/, 1];
                ctx.body = { code: returnCode.error, message: '未登录', data: null };
                return [2 /*return*/, false];
            case 1:
                _a.trys.push([1, 3, , 4]);
                data = jwt.verify(token.split(' ')[1], tokenConfig.privateKey);
                return [4 /*yield*/, DB.find('user', { _id: DB.getID(data.id) })];
            case 2:
                status_1 = _a.sent();
                if (status_1) {
                    return [2 /*return*/, true];
                }
                else {
                    returnMsg(ctx, 'success', '该账号没有权限操作', null);
                    return [2 /*return*/, false];
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                returnMsg(ctx, 'tokenFailure', 'token过期', null);
                return [2 /*return*/, false];
            case 4: return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                console.log(error_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
router.post(interfaceNameObj.adminLogin, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, pwd, _b, data, a, token;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = ctx.request.body, username = _a.username, pwd = _a.pwd;
                console.log(username, pwd);
                return [4 /*yield*/, DB.find('admin', { username: username })];
            case 1:
                _b = _c.sent(), data = _b[0], a = _b.slice(1);
                console.log(data);
                if (data) {
                    token = jwt.sign({ id: data._id }, tokenConfig.privateKey, { expiresIn: '7d' });
                    returnMsg(ctx, 'success', 'success', { token: "Bearer " + token });
                    return [2 /*return*/, false];
                }
                returnMsg(ctx, 'error', '未找到账号', null);
                return [2 /*return*/];
        }
    });
}); });
router.post(interfaceNameObj.user, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, verificationToken(ctx)];
            case 1:
                if (!(_a.sent())) {
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, DB.find('user', { status: '1' }, { workRecordObj: 0, notice: 0 })];
            case 2:
                data = _a.sent();
                if (data) {
                    returnMsg(ctx, 'success', 'success', data);
                    return [2 /*return*/, false];
                }
                returnMsg(ctx, 'error', 'error', null);
                return [2 /*return*/];
        }
    });
}); });
router.post(interfaceNameObj.delteUser, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, data, a, status_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!verificationToken(ctx)) {
                    return [2 /*return*/, false];
                }
                userId = ctx.request.body.userId;
                return [4 /*yield*/, DB.find('user', { _id: DB.getID(userId) }, {})];
            case 1:
                _a = _b.sent(), data = _a[0], a = _a.slice(1);
                if (!data) return [3 /*break*/, 3];
                return [4 /*yield*/, DB.update('user', { _id: DB.getID(userId) }, { status: '0' })];
            case 2:
                status_2 = _b.sent();
                if (status_2.result.n) {
                    returnMsg(ctx, 'success', 'success', null);
                    return [2 /*return*/, false];
                }
                returnMsg(ctx, 'error', '删除失败', null);
                return [2 /*return*/, false];
            case 3:
                returnMsg(ctx, 'error', '没找到此用户', null);
                return [2 /*return*/];
        }
    });
}); });
router.post(interfaceNameObj.teamAll, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, offfset, limit, data;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, verificationToken(ctx)];
            case 1:
                if (!(_b.sent())) {
                    return [2 /*return*/, false];
                }
                _a = ctx.request.body, offfset = _a.offfset, limit = _a.limit;
                return [4 /*yield*/, DB.find('team', {}, {}, Number(offfset), Number(limit))];
            case 2:
                data = _b.sent();
                returnMsg(ctx, 'success', 'success', data);
                return [2 /*return*/];
        }
    });
}); });
module.exports = router.routes();
