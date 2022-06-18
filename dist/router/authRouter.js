"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../service/database"));
const router = (0, express_1.Router)();
// signin
router.post("/signin", (req, res) => {
    console.log("called post signin");
    database_1.default.signin(req.body.userEmail, req.body.userPass).then((result) => {
        console.log(result);
        res.status(200).send(result);
    });
});
// signup
router.post("/signup", (req, res) => {
    console.log("called signup");
    database_1.default
        .signup(req.body.userName, req.body.userEmail, req.body.userPassHashed)
        .then((result) => {
        res.send({ status: result });
    })
        .catch(() => { });
});
exports.default = router;
//# sourceMappingURL=authRouter.js.map