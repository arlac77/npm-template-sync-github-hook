import { npmTemplateSync } from 'npm-template-sync';

const micro = require('micro');
const createHandler = require('github-webhook-handler');
//require('now-logs')('dfgkjd&dfh');
const ora = require('ora');

const handler = createHandler({
  path: '/webhook',
  secret: 'dfgkjd&dfh'
});

const server = micro(async (req, res) => {
  /*  const txt = await micro.text(req);
  console.log(txt);
*/

  handler(req, res, err => {
    res.statusCode = 404;
    res.end('no such location');
  });

  res.writeHead(200);
  res.end('woot');
});

handler.on('error', err => {
  console.error('Error:', err.message);
});

const spinner = ora('args');

handler.on('push', async event => {
  console.log(JSON.stringify(event.payload));
  console.log(
    'Received a push event for %s to %s',
    event.payload.repository.full_name,
    event.payload.ref
  );

  const pullRequest = await npmTemplateSync(
    spinner,
    console,
    process.env.GH_TOKEN,
    event.payload.repository.full_name
  );

  console.log('Generated PullRequest %s', pullRequest.full_name);
});

server.listen(3000, () => {
  // TODO public interface
  console.log(`listening...`, server._connectionKey);
});
