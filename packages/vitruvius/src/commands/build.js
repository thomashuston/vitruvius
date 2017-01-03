import * as path from 'path';
import buildPackage from 'vitruvius-build-package';

export const command = 'build <srcDir> <destDir>';

export const describe = 'build package(s)';

export const handler = (argv) => {
    const packageDir = process.cwd();
    const srcDir = path.join(packageDir, argv.srcDir);
    const destDir = path.join(packageDir, argv.destDir);
    buildPackage({
        srcDir,
        destDir
    });
};
