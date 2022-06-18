"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../service/database"));
const router = (0, express_1.Router)();
router.get("/user", (req, res) => {
    console.log('get user');
    const token = Array.isArray(req.headers.token)
        ? req.headers.token[0]
        : req.headers.token;
    if (token == undefined || token.length == 0) {
        console.log("token is null or token.length == 0");
        return;
    }
    database_1.default.getUserInfo(token).then((result) => {
        res.status(200).send(result);
    });
});
exports.default = router;
//# sourceMappingURL=userRouter.js.map