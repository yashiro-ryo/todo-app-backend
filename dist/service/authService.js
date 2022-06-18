"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function sign(payroad, key) {
    return jsonwebtoken_1.default.sign(payroad, key);
}
function decode(token, key) {
    return jsonwebtoken_1.default.verify(token, key);
}
exports.default = {
    sign,
    decode,
};
//# sourceMappingURL=authService.js.map