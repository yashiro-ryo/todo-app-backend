"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../service/database"));
const router = (0, express_1.Router)();
// REST API
router.get("/tasks", (req, res) => {
    console.log("requested GET /recipes");
    const token = Array.isArray(req.headers.token)
        ? req.headers.token[0]
        : req.headers.token;
    if (token == undefined || token.length == 0) {
        console.log("token is null or token.length == 0");
        return;
    }
    database_1.default.getAllTasks(token).then((result) => {
        res.status(200).json({
            task: result,
        });
    });
});
router.get("/tasks/:id", (req, res) => {
    const token = Array.isArray(req.headers.token)
        ? req.headers.token[0]
        : req.headers.token;
    console.log("requested GET token :" + token);
    if (token == undefined) {
        return;
    }
    database_1.default
        .getTask(Number(req.params.id))
        .then((result) => {
        if (result.length != 0) {
            res.status(200).json({
                message: "Recipe details by id",
                task: result,
            });
        }
        else {
            res.status(200).json({
                message: "Recipe cannot find !",
            });
        }
    })
        .catch(() => {
        res.status(500).json({
            message: "Recipe cannot find !",
        });
    });
});
router.post("/tasks/", (req, res) => {
    const token = Array.isArray(req.headers.token)
        ? req.headers.token[0]
        : req.headers.token;
    console.log("requested POST token :" + token);
    if (token == undefined) {
        return;
    }
    // TODO validation
    var task = {
        taskName: req.body.taskName,
        describe: req.body.describe == null ? "" : req.body.describe,
        deadline: req.body.deadline == null ? "2000/01/01 00:00:00" : req.body.deadline,
        isCompleted: req.body.isCompleted == null ? "" : req.body.isCompleted,
    };
    database_1.default
        .createTask(token, task)
        .then(() => {
        res.status(200).json({
            message: "Recipe successfully created!",
            task: [task],
        });
    })
        .catch(() => {
        // fix error handling
        res.status(500).json({
            message: "Recipe creation failed!",
            required: "title, making_time, serves, ingredients, cost",
        });
    });
});
router.patch("/tasks/:task_id", (req, res) => {
    console.log("requested PATCH /recipes/" + req.params.task_id);
    const token = Array.isArray(req.headers.token)
        ? req.headers.token[0]
        : req.headers.token;
    if (token == undefined) {
        return;
    }
    var task = {
        taskName: req.body.taskName,
        describe: req.body.describe == null ? "" : req.body.describe,
        deadline: req.body.deadline == null ? "2000/01/01 00:00:00" : req.body.deadline,
        isCompleted: req.body.isCompleted == null ? "" : req.body.isCompleted,
    };
    database_1.default
        .updateTask(token, Number(req.params.task_id), task)
        .then((result) => {
        res.status(200).json({
            message: "Recipe successfully updated!",
            task: result,
        });
    })
        .catch(() => {
        res.status(500).json({
            message: "Recipe update failed",
        });
    });
});
router.delete("/tasks/:task_id", (req, res) => {
    const token = Array.isArray(req.headers.token)
        ? req.headers.token[0]
        : req.headers.token;
    if (token == undefined) {
        return;
    }
    console.log("requested delete task" + req.params.task_id);
    database_1.default
        .deleteTask(token, Number(req.params.task_id))
        .then(() => {
        res.status(200).json({ message: "Recipe successfully removed!" });
    })
        .catch(() => {
        res.status(500).json({ message: "No Recipe found" });
    });
});
exports.default = router;
//# sourceMappingURL=restRouter.js.map