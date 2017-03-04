import * as path from 'path';
import buildPackage from 'vitruvius-build-package';
import { getPackages } from 'vitruvius-lerna';

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
        default: [],
        demandOption: false,
        describe: 'glob patterns of files to ignore',
        type: 'array'
    }
};

export const handler = (argv) => {
    const packages = getPackages();
    packages.forEach((pkg) => {
        const srcDir = path.join(pkg, argv.src);
        const destDir = path.join(pkg, argv.dest);
        buildPackage({
            srcDir,
            destDir,
            ignorePatterns: argv.ignore
        });
    });
};
