import * as path from 'path';
import buildPackage from 'vitruvius-build-package';
import { getPackages } from 'vitruvius-lerna';

export const command = 'build <srcDir> <destDir>';

export const describe = 'build packages';

export const handler = (argv) => {
    const packages = getPackages();
    packages.forEach((pkg) => {
        const srcDir = path.join(pkg, argv.srcDir);
        const destDir = path.join(pkg, argv.destDir);
        buildPackage({
            srcDir,
            destDir
        });
    });
};
