import express from "express";
import uniqid from "uniqid";
import cors from "cors";
import fs from "fs";
import { GPTScript, RunEventType } from "@gptscript-ai/gptscript";

const gptscript = new GPTScript();

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  return res.send("Hello, World! 123");
});

app.get("/create-story", async (req, res) => {
  const url = req.query.url;
  const dir = uniqid();
  const path = "./stories/" + dir;
  fs.mkdirSync(path, { recursive: true });

  try {
    const run = await gptscript.run("./story.gpt", {
      input: `--url ${url} --dir ${dir}`,
      disableCache: true,
    });
    run.on(RunEventType.Event, (ev) => {
      if (ev.type === RunEventType.CallFinish && ev.output) {
        console.log(ev.output);
      }
    });

    const result = await run.text();

    return res.json(result);
  } catch (error) {
    console.log(error);
  }
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
