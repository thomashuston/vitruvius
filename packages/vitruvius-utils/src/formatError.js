import * as path from 'path';
import chalk from 'chalk';

const BABEL_MESSAGE_PATTERN = /^([^:]+): (.*) \([0-9]+:[0-9]+\)$/;
const ROOT_DIR = process.cwd();

function separateMessageFromFile(message) {
    const messageMatch = message.match(BABEL_MESSAGE_PATTERN);
    if (messageMatch) {
        return messageMatch[2];
    } else {
        return message;
    }
}

export default function formatError(error, file) {
    if (error._babel) {
        const message = separateMessageFromFile(error.message);
        const relativeFilePath = path.relative(ROOT_DIR, file);
        return `${message}\n\n at ${chalk.reset.cyan(relativeFilePath)}:${error.loc.line}:${error.loc.column}\n\n${error.codeFrame}`;
    } else {
        return error.toString();
    }
}
