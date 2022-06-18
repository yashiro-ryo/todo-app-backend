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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const authService_1 = __importDefault(require("./authService"));
const dbConfig = {
    host: "us-cdbr-east-05.cleardb.net",
    user: "bb667d8c95d4b4",
    database: "heroku_343c33fe017fe32",
    password: "9af8a599",
};
// signup
function signup(userName, userEmail, userPassHashed) {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * error code
         * 1: sucessed signup
         * 2: account exist
         * 3: unexpected error
         */
        try {
            // userEmailの存在チェック
            const con = yield promise_1.default.createConnection(dbConfig);
            const [result] = yield con.query(`select user_email from user where user_email = '${userEmail}'`);
            if (result.length > 0) {
                console.log("アカウント既に存在");
                con.end();
                return 2;
            }
            else if (result.length == 0) {
                // 登録実行
                // isDeleteModalShowはデフォルトでは表示する
                yield con.query(`insert user values (null, '${userName}', '${userEmail}', '${userPassHashed}', null, 1)`);
                con.end();
                return 1;
            }
            else {
                con.end;
                return 3;
            }
        }
        catch (e) {
            console.log(e);
        }
    });
}
// signin query
function signin(userEmail, userPass) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const con = yield promise_1.default.createConnection(dbConfig);
            const [result] = yield con.query(`select user_id, user_name, user_pass_hashed, is_delete_modal_show from user where user_email = '${userEmail}'`);
            if (result.length != 1) {
                con.end();
                return { token: null, errorMsg: "一致するユーザーが存在しません." };
            }
            if (userPass === result[0].user_pass_hashed) {
                const token = authService_1.default.sign({
                    userId: result[0].user_id,
                    userName: result[0].user_name,
                    setting: { isDeleteModalShow: result[0].is_delete_modal_show },
                }, result[0].user_pass_hashed);
                yield con.query(`update user set user_access_token='${token}' where user_id = ${result[0].user_id}`);
                con.end();
                return {
                    token: token,
                    errorMsg: "",
                };
            }
            else {
                con.end();
                return {
                    token: null,
                    errorMsg: "パスワードが違います.",
                };
            }
        }
        catch (e) {
            console.log(e);
        }
    });
}
/* REST API */
// request query
function getAllTasks(token) {
    return __awaiter(this, void 0, void 0, function* () {
        // tokenからuserId取得
        var userId = "";
        yield getUserIdByToken(token)
            .then((result) => {
            userId = result;
            if (userId == null || userId.length == 0) {
                return;
            }
        })
            .catch((e) => {
            console.log(e);
        });
        try {
            const con = yield promise_1.default.createConnection(dbConfig);
            const [result] = yield con.query(`select * from task where task_user_id = ${userId}`);
            con.end();
            return result;
        }
        catch (e) {
            console.log(e);
        }
    });
}
function getTask(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const con = yield promise_1.default.createConnection(dbConfig);
            const [result] = yield con.query(`select * from task where task_id = ${id}`);
            con.end();
            return result;
        }
        catch (e) {
            throw new Error("error :" + e);
        }
    });
}
function createTask(token, task) {
    return __awaiter(this, void 0, void 0, function* () {
        // tokenからuserId取得
        var userId = "";
        yield getUserIdByToken(token).then((result) => {
            userId = result;
            if (userId == null || userId.length == 0) {
                return;
            }
        });
        try {
            const con = yield promise_1.default.createConnection(dbConfig);
            yield con.query(`insert task value (null, ${userId}, '${task.taskName}', '${task.describe}', '${task.deadline}', ${task.isCompleted})`);
            con.end();
        }
        catch (e) {
            console.log(e);
        }
    });
}
function updateTask(token, taskId, task) {
    return __awaiter(this, void 0, void 0, function* () {
        // tokenから編集権限があるかどうか確認
        var isCanEdit = -1;
        yield isUserIdCanEditTask(token, taskId).then((result) => {
            if (result == undefined) {
                return;
            }
            isCanEdit = result;
        });
        if (isCanEdit != 1) {
            console.log("編集権限がありません");
            return;
        }
        try {
            const con = yield promise_1.default.createConnection(dbConfig);
            yield con.query(`update task set task_name='${task.taskName}', task_describe='${task.describe}', task_deadline='${task.deadline}', task_is_completed = ${task.isCompleted} where task_id = ${taskId}`);
        }
        catch (e) {
            console.log(e);
        }
    });
}
function deleteTask(token, taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        // tokenから編集権限があるかどうか確認
        var isCanEdit = -1;
        yield isUserIdCanEditTask(token, taskId).then((result) => {
            if (result == undefined) {
                return;
            }
            isCanEdit = result;
        });
        if (isCanEdit != 1) {
            console.log("編集権限がありません");
            return;
        }
        try {
            const con = yield promise_1.default.createConnection(dbConfig);
            yield con.query(`delete from task where task_id = ${taskId}`);
            con.end();
        }
        catch (e) {
            console.log(e);
        }
    });
}
/**
 * トークンからidを取得する関数
 * @param token
 * @returns userId
 */
function getUserIdByToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        var userId = "";
        try {
            const con = yield promise_1.default.createConnection(dbConfig);
            const [result] = yield con.query(`select user_id, user_pass_hashed from user where user_access_token = '${token}'`);
            if (result.length != 1) {
                console.log("more then 1 user matched");
                con.end();
                return "-1";
            }
            // 認証
            if (authenticateToken(token, result[0].user_id, result[0].user_pass_hashed) ==
                1) {
                con.end();
                userId = result[0].user_id;
            }
            else {
                con.end();
                return "-1";
            }
            return userId;
        }
        catch (e) {
            console.log(e);
            return "-1";
        }
    });
}
/**
 * tokenからidを抽出し、userIdと比較する
 * @param token
 * @param userId
 * 認証成功時
 * @return 1
 * 認証失敗時
 * @return -1
 */
function authenticateToken(token, userId, userPass) {
    const tokenDecoded = authService_1.default.decode(token, userPass);
    if (tokenDecoded == null) {
        console.log("token is null");
        return -1;
    }
    if (tokenDecoded.userId === userId) {
        console.log("sucessed authentication");
        return 1;
    }
    else {
        console.log("failed authentication");
        return -1;
    }
}
function isUserIdCanEditTask(token, taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        var userId = "";
        yield getUserIdByToken(token).then((result) => {
            userId = result;
            if (userId == null || userId.length == 0) {
                return -1;
            }
        });
        try {
            const con = yield promise_1.default.createConnection(dbConfig);
            const [result] = yield con.query(`select task_user_id from task where task_id = ${taskId}`);
            if (result.length == 0 || result == null) {
                return -1;
            }
            if (userId == result[0].task_user_id) {
                console.log("matched");
                return 1;
            }
        }
        catch (e) {
            console.log(e);
        }
    });
}
function getUserInfo(token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const con = yield promise_1.default.createConnection(dbConfig);
            const [result] = yield con.query(`select user_id, user_name from user where user_access_token = '${token}'`);
            if (result.length > 1) {
                console.log("matched more than 1 user");
                con.end();
                return;
            }
            con.end();
            return { userId: result[0].user_id, userName: result[0].user_name };
        }
        catch (e) {
            console.log(e);
        }
    });
}
exports.default = {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    signin,
    signup,
    getUserIdByToken,
    isUserIdCanEditTask,
    getUserInfo,
};
//# sourceMappingURL=database.js.map