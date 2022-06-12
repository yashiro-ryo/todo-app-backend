import mysql from "mysql2/promise";
import authService, { PayRoad, Setting } from "./authService";

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
      // isDeleteModalShowはデフォルトでは表示する
      await con.query(
        `insert user values (null, '${userName}', '${userEmail}', '${userPassHashed}', null, 1)`
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
      `select user_id, user_name, user_pass_hashed, is_delete_modal_show from user where user_email = '${userEmail}'`
    );
    if (result.length != 1) {
      con.end();
      return { token: null, errorMsg: "一致するユーザーが存在しません." };
    }
    if (userPass === result[0].user_pass_hashed) {
      const token = authService.sign(
        {
          userId: result[0].user_id,
          userName: result[0].user_name,
          setting: { isDeleteModalShow: result[0].is_delete_modal_show },
        },
        result[0].user_pass_hashed
      );
      await con.query(
        `update user set user_access_token='${token}' where user_id = ${result[0].user_id}`
      );
      con.end();
      return {
        token: token,
        errorMsg: "",
      };
    } else {
      con.end();
      return {
        token: null,
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
    getUserIdByToken(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExLCJ1c2VyTmFtZSI6IuW-s-WztuWkqumDjiIsInNldHRpbmciOnsiaXNEZWxldGVNb2RhbFNob3ciOjF9LCJpYXQiOjE2NTQ5NTg4ODZ9.3QRqu_-DMA-nlhKvx39-ihsacMb0mKVhXMO5j0nE4no"
    );
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

/**
 * トークンからidを取得する関数
 * @param token
 * @returns userId
 */
async function getUserIdByToken(token: string) {
  try {
    const con = await mysql.createConnection(dbConfig);
    const [result]: any = await con.query(
      `select user_id, user_pass_hashed from user where user_access_token = '${token}'`
    );
    if (result.length != 1) {
      console.log("more then 1 user matched");
      con.end();
      return -1;
    }
    // 認証
    if(authenticateToken(token, result[0].user_id, result[0].user_pass_hashed) == 1){
      con.end()
      return result[0].user_id
    }else {
      con.end()
      throw new Error('failed authentication')
    }
  } catch (e) {
    console.log(e);
  }
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
function authenticateToken(
  token: string,
  userId: string,
  userPass: string
) {
  const tokenDecoded: any = authService.decode(token, userPass);
  if(tokenDecoded == null){
    console.log('token is null')
    return -1
  }
  if(tokenDecoded.userId === userId){
    console.log('sucessed authentication')
    return 1
  }else {
    console.log('failed authentication')
    return -1
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
  getUserIdByToken,
} as const;
