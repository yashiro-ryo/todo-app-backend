"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRouter_1 = __importDefault(require("./router/authRouter"));
const restRouter_1 = __importDefault(require("./router/restRouter"));
const userRouter_1 = __importDefault(require("./router/userRouter"));
const app = (0, express_1.default)();
const PORT = process.env.port || 5000;
app.set("port", (PORT));
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("public"));
app.use("/", authRouter_1.default);
app.use("/", restRouter_1.default);
app.use("/", userRouter_1.default);
app.get("/signin", (req, res) => {
    res.sendFile(__dirname + "/public/html/signin.html");
});
app.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/public/html/signup.html");
});
// rewrite
app.get("/dashboard", (req, res) => {
    res.sendFile(__dirname + "/public/build/index.html");
});
app.get("/profile", (req, res) => {
    res.sendFile(__dirname + "/public/build/index.html");
});
app.get("/help", (req, res) => {
    res.sendFile(__dirname + "/public/build/index.html");
});
app.get("/setting", (req, res) => {
    res.sendFile(__dirname + "/public/build/index.html");
});
app.get("/signout", (req, res) => {
    res.sendFile(__dirname + "/public/build/index.html");
});
// 404 Not Found
app.use((req, res) => {
    res.status(404).sendFile(__dirname + "/public/html/signin.html");
});
try {
    app.listen(PORT, () => {
        console.log(`dev server running at: ${PORT}`);
    });
}
catch (e) {
    if (e instanceof Error) {
        console.error(e.message);
    }
}
//# sourceMappingURL=index.js.map