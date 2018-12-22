import { Context, PreparedContext } from "npm-template-sync";
import { GithubProvider } from "github-repository-provider";
const micro = require("micro");

let notify;
let port = 3100;

try {
  require("systemd");
  port = "systemd";
  notify = require("sd-notify");
  notify.sendStatus("starting up");
} catch (e) {}

const createHandler = require("github-webhook-handler");

const handler = createHandler({
  path: "/webhook",
  secret: "dfgkjd&dfh"
});

const server = micro(async (req, res) => {
  handler(req, res, err => {
    res.statusCode = 404;
    res.end("no such location");
  });

  res.writeHead(200);
  res.end("woot");
});

handler.on("error", err => {
  console.error("Error:", err.message);
});

handler.on("ping", async event => {
  console.log(
    "Received a ping event for %s",
    event.payload.repository.full_name
  );
});

handler.on("push", async event => {
  //console.log(JSON.stringify(event.payload));
  console.log(
    "Received a push event for %s to %s",
    event.payload.repository.full_name,
    event.payload.ref
  );

  const context = new Context(
    new GithubProvider(GithubProvider.optionsFromEnvironment(process.env)),
    {
      logger: console
    }
  );

  try {
    const pullRequest = await PreparedContext.execute(
      context,
      event.payload.repository.full_name
    );

    console.log("Generated PullRequest %s", pullRequest);
  } catch (e) {
    console.error(e);
  }
});

server.listen(port, () => {
  console.log(`listening...`, server._connectionKey);

  if (notify !== undefined) {
    notify.ready();
    console.log("notify done");
  }
});
