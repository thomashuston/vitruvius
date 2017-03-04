import * as path from 'path';
import buildPackage from '../packages/vitruvius-build-package/src';

const ROOT_DIR = path.resolve(path.join(__dirname, '..'));

// TODO: Replace with vitruvius-lerna package
const packages = [
    'vitruvius',
    'vitruvius-build-package',
    'vitruvius-lerna'
];

packages.forEach((p) => {
    const packageDir = path.join(ROOT_DIR, 'packages', p);
    buildPackage({
        srcDir: path.join(packageDir, 'src'),
        destDir: path.join(packageDir, 'lib')
    });
});
