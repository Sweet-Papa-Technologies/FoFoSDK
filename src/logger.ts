
// Colors for different log levels
const colors = {
  info: '\x1b[32m', // Green
  warn: '\x1b[33m', // Yellow
  error: '\x1b[31m', // Red
  debug: '\x1b[36m' // Cyan
};

export type loglevel = 'info' | 'warn' | 'error' | 'debug';

export function log(sLog: string | number, sFunction = 'none', sLogLevel: loglevel = 'info', emoji = '') {
  const dTimestamp = new Date();
  const sTimestamp = dTimestamp.toISOString();
  const color = colors[sLogLevel] || ''; // Get the corresponding color for the log level
  const resetColor = '\x1b[0m'; // Reset color

  if (emoji == '') {

    switch (sLogLevel) {
      case 'info':
        emoji = '📗';
        break;
      case 'warn':
        emoji = '📙';
        break;
      case 'error':
        emoji = '📕';
        break;
      case 'debug':
        emoji = '📘';
        break;
      default:
        emoji = '📗';
        break;
    }
  }

  const message = `\n[${sTimestamp}][${color}${sLogLevel.toUpperCase()}${resetColor}] [${sFunction.toUpperCase()}] ${sLog} ${emoji}\n`;

  console.log(message);
}