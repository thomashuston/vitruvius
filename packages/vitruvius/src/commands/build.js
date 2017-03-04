import * as path from 'path';
import chalk from 'chalk';
import buildPackage from 'vitruvius-build-package';
import indent from 'indent-string';
import pluralize from 'pluralize';
import { getPackages } from 'vitruvius-lerna';
import { clearLine, formatError } from 'vitruvius-utils';

export const command = 'build';

export const describe = 'build packages';

export const builder = {
    src: {
        demandOption: true,
        describe: 'the source directory name',
        type: 'string'
    },
    dest: {
        demandOption: true,
        describe: 'the output directory name',
        type: 'string'
    },
    ignore: {
        demandOption: false,
        describe: 'glob patterns of files to ignore',
        type: 'array'
    }
};

export const handler = (argv) => {
    const packages = getPackages();

    const startTime = Date.now();
    let builtCount = 0;
    let errorCount = 0;

    packages.forEach((pkg) => {
        const packageName = path.basename(pkg);
        const srcDir = path.join(pkg, argv.src);
        const destDir = path.join(pkg, argv.dest);

        clearLine();
        process.stdout.write(`${chalk.reset.inverse.yellow.bold(' BUILD ')} ${packageName}`);

        try {
            buildPackage({
                srcDir,
                destDir,
                ignorePatterns: argv.ignore
            });
            builtCount++;
            clearLine();
            process.stdout.write(`${chalk.reset.inverse.green.bold(' BUILT ')} ${packageName}\n`);
        } catch (e) {
            errorCount++;
            clearLine();
            process.stdout.write(`${chalk.reset.inverse.red.bold(' ERROR ')} ${packageName}\n`);
            process.stdout.write(`\n${indent(formatError(e), 2)}\n\n`);
        }
    });

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);

    process.stdout.write('\n');
    process.stdout.write(chalk.bold('Packages: '));
    if (errorCount > 0) {
        process.stdout.write(chalk.reset.red.bold(`${errorCount} failed, `));
    }
    if (builtCount > 0) {
        process.stdout.write(chalk.reset.green.bold(`${builtCount} built, `));
    }
    process.stdout.write(`${packages.length} total\n`);

    process.stdout.write(chalk.bold('Time:     '));
    process.stdout.write(chalk.reset.yellow.bold(`${totalTime}s\n`));

    if (errorCount > 0) {
        process.stdout.write(chalk.reset.red.bold(`Failed to build ${pluralize('package', errorCount, true)}.\n`));
    } else {
        process.stdout.write(chalk.dim('Built all packages.\n'));
    }
};
