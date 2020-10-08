#!/usr/bin/env node

import program from "commander";
import { expand } from "config-expander";
import GithubProvider from "github-repository-provider";
import { defaultServerConfig, createServer } from "./server.mjs";
import sd from "sd-daemon";

program
  .option("-c, --config <dir>", "use config directory")
  .action(async () => {
    sd.notify("STATUS=starting");

    const configDir = process.env.CONFIGURATION_DIRECTORY || program.config;

    const config = await expand(configDir ? "${include('config.json')}" : {}, {
      constants: {
        basedir: configDir || process.cwd(),
        installdir: new URL("..", import.meta.url).pathname
      },
      default: {
        ...defaultServerConfig
      }
    });

    const listeners = sd.listeners();
    if (listeners.length > 0) {
      config.http.port = listeners[0];
    }

    await createServer(
      config,
      sd,
      GithubProvider.initialize(undefined, process.env),
      {
        logger: console
      }
    );
  })
  .parse(process.argv);
