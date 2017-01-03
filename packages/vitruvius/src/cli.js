import yargs from 'yargs';
import * as build from './commands/build';

export function run() {
    return yargs
        .usage('Usage: $0 <cmd>')
        .command(build)
        .demandCommand(1)
        .help()
        .alias('help', 'h')
        .argv;
}
