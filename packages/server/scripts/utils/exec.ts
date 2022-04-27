import execa, { Options as ExecaOptions, ExecaError } from 'execa';

interface Options extends ExecaOptions {
  // Print the command being executed with an initial '>'.
  // Default: `true`
  printCommand?: boolean;

  // Append FORCE_COLOR=1 to the env variables.
  // Default: `true`
  forceColor?: boolean;

  // Don't pipe stdout and stderr from the child process to the current process.
  // Usage example: the stdout of the child process is too large to print out
  // and it's meant to be handled programmatically.
  // Default: `false`
  silent?: boolean;

  // When child process exits with non-zero code, exit the current process with
  // the same code.
  // Default: `true`
  exit?: boolean;
}

export default async function exec(
  script: string,
  args: string[] = [],
  opts: Options = {},
) {
  const options = { ...opts };

  if (options.printCommand !== false) {
    process.stdout.write(`\n> ${script} ${args.join(' ')}\n`);
  }

  if (options.forceColor !== false) {
    options.env = { ...process.env, FORCE_COLOR: '1' };
  }

  const task = execa(script, args, options);

  if (options.silent !== true) {
    task.stdout?.pipe(process.stdout);
    task.stderr?.pipe(process.stderr);
  }

  try {
    return await task;
  } catch (err) {
    const error = err as ExecaError;
    if (options.exit !== false) {
      process.stderr.write(`\n${error.stderr}\n`);
      process.exit(error.exitCode);
    } else {
      return error;
    }
  }
}
