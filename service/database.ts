import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  database: "todo-app",
  password: "LTDEXPuzushio22@",
};

type Task = {
  taskName: string;
  describe: string | null;
  deadline: string | null;
  isCompleted: boolean;
};

// signup
async function signup(
  userName: string,
  userEmail: string,
  userPassHashed: string
) {
  /**
   * error code
   * 1: sucessed signup
   * 2: account exist
   * 3: unexpected error
   */
  try {
    // userEmailの存在チェック
    const con = await mysql.createConnection(dbConfig);
    const [result]: any = await con.query(
      `select user_email from user where user_email = '${userEmail}'`
    );
    if (result.length > 0) {
      console.log("アカウント既に存在");
      con.end();
      return 2;
    } else if (result.length == 0) {
      // 登録実行
      await con.query(
        `insert user values (null, '${userName}', '${userEmail}', '${userPassHashed}', null)`
      );
      con.end();
      return 1;
    } else {
      con.end;
      return 3;
    }
  } catch (e) {
    console.log(e);
  }
}

// signin query
async function signin(userEmail: string, userPass: string) {
  try {
    const con = await mysql.createConnection(dbConfig);
    const [result]: any = await con.query(
      `select user_id, user_name, user_pass_hashed from user where user_email = '${userEmail}'`
    );
    con.end();
    if (result.length != 1) {
      return { userId: null, errorMsg: "一致するユーザーが存在しません." };
    }

    if (userPass === result[0].user_pass_hashed) {
      // 将来的にはトークンにする
      return {
        userId: result[0].user_id,
        userName: result[0].user_name,
        errorMsg: "",
      };
    } else {
      return {
        userId: null,
        userName: null,
        errorMsg: "パスワードが違います.",
      };
    }
  } catch (e) {
    console.log(e);
  }
}

// request query
async function getAllTasks(userId: number) {
  try {
    const con = await mysql.createConnection(dbConfig);
    const [result]: any = await con.query(
      `select * from task where task_user_id = ${userId}`
    );
    con.end();
    return result;
  } catch (e) {
    throw new Error("error :" + e);
  }
}

async function getTask(id: number) {
  try {
    const con = await mysql.createConnection(dbConfig);
    const [result]: any = await con.query(
      `select * from task where task_id = ${id}`
    );
    con.end();
    return result;
  } catch (e) {
    throw new Error("error :" + e);
  }
}

async function createTask(userId: number, task: Task) {
  try {
    const con = await mysql.createConnection(dbConfig);
    await con.query(
      `insert task value (null, ${userId}, '${task.taskName}', '${task.describe}', '${task.deadline}', ${task.isCompleted})`
    );
    con.end();
  } catch (e) {
    console.log(e);
    throw new Error("error :" + e);
  }
}

async function updateTask(taskId: number, task: Task) {
  try {
    const con = await mysql.createConnection(dbConfig);
    await con.query(
      `update task set task_name='${task.taskName}', task_describe='${task.describe}', task_deadline='${task.deadline}', task_is_completed = ${task.isCompleted} where task_id = ${taskId}`
    );
  } catch (e) {
    console.log(e);
    throw new Error("error :" + e);
  }
}

async function deleteTask(taskId: number) {
  try {
    const con = await mysql.createConnection(dbConfig);
    await con.query(`delete from task where task_id = ${taskId}`);
    con.end();
  } catch (e) {
    throw new Error("error :" + e);
  }
}

export default {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  signin,
  signup,
} as const;
