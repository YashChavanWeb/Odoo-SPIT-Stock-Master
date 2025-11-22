import chalk from 'chalk';

export const logger = (req, res, next) => {
  const startTime = new Date();
  const { method, originalUrl } = req;

  const originalSend = res.send;

  res.send = function (body) {
    const date = startTime.toISOString();
    const statusCode = res.statusCode;

    let statusColor = chalk.green;
    if (statusCode >= 400 && statusCode < 500) {
      statusColor = chalk.yellow;
    } else if (statusCode >= 500) {
      statusColor = chalk.red;
    }

    console.log(
      `[${chalk.blue(date)}] ${chalk.cyan(method)} ${chalk.magenta(originalUrl)} ${statusColor(statusCode)}`
    );

    originalSend.call(this, body);
  };

  next();
};
