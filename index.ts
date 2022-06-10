import express, { Application, Request, Response } from 'express'
import database from './service/database'
import cors from 'cors';

const app: Application = express()
const PORT = 3030

app.use(cors({ origin: true, credentials: true }));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));

app.get('/signin', async (_req: Request, res: Response) => {
  return res.sendFile(__dirname + '/public/html/signin.html')
})

app.get('/signup', async (_req: Request, res: Response) => {
  return res.sendFile(__dirname + '/public/html/signup.html')
})

// signin
app.post('/signin', (req: Request, res: Response) => {
  console.log('called post signin');
  database.signin(req.body.userEmail, req.body.userPass).then((result) => {
    console.log(result)
    res.status(200).send(result)
  })
})

// app body
/*
app.get('/dashboard', (req: Request, res: Response) => {
  console.log('get dashboard')
  res.sendFile(__dirname + '/public/build/index.html')
})
*/

type Task = {
  taskName: string,
  describe: string | null,
  deadline: string | null,
  isCompleted: boolean
}

// REST API
app.get("/tasks/:user_id", (req: Request, res: Response) => {
  console.log("requested GET /recipes");
  // REST APIではアクセストークンをもとにユーザーIDの認証を今後実装
  // 現時点ではpostにuserIdを載せる

  database.getAllTasks(Number(req.params.user_id)).then((result) => {
    res.status(200).json({
      task: result,
    });
  });
});

app.get("/tasks/:id", (req: Request, res: Response) => {
  console.log("requested GET /recipes/" + req.params.id);
  database.getTask(Number(req.params.id))
    .then((result) => {
      if(result.length != 0){
        res.status(200).json({
          message: "Recipe details by id",
          task: result,
        });
      }else {
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

app.post("/tasks/:user_id", (req: Request, res: Response) => {
  console.log("requested POST /recipes");
  // TODO validation
  var task: Task = {
    taskName: req.body.taskName,
    describe: req.body.describe == null ? '': req.body.describe,
    deadline: req.body.deadline == null ? '2000/01/01 00:00:00': req.body.deadline,
    isCompleted: req.body.isCompleted == null ? '': req.body.isCompleted
  };
  console.log(task);
  database.createTask(Number(req.params.user_id), task)
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

app.patch("/tasks/:task_id", (req: Request, res: Response) => {
  console.log("requested PATCH /recipes/" + req.params.task_id);
  // TODO validation
  var task: Task = {
    taskName: req.body.taskName,
    describe: req.body.describe == null ? '': req.body.describe,
    deadline: req.body.deadline == null ? '2000/01/01 00:00:00': req.body.deadline,
    isCompleted: req.body.isCompleted == null ? '': req.body.isCompleted
  };
  database.updateTask(Number(req.params.task_id), task)
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

app.delete("/tasks/:task_id", (req: Request, res: Response) => {
  console.log("requested delete task" + req.params.task_id);
  database.deleteTask(Number(req.params.task_id))
    .then(() => {
      res.status(200).json({ message: "Recipe successfully removed!" });
    })
    .catch(() => {
      res.status(500).json({ message: "No Recipe found" });
    });
});

// 404 Not Found
app.use((req: Request, res: Response) => {
  res.status(404).send("404 Not Found !");
});

try {
  app.listen(PORT, () => {
    console.log(`dev server running at: http://localhost:${PORT}/`)
  })
} catch (e) {
  if (e instanceof Error) {
    console.error(e.message)
  }
}
