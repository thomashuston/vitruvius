import * as path from 'path';
import buildPackage from 'vitruvius-build-package';
import { handler as build } from '../build';

jest.mock('vitruvius-build-package', () => jest.fn());

it('builds code in the source directory into the destination directory', () => {
    build({
        srcDir: 'src',
        destDir: 'lib'
    });

    expect(buildPackage).toHaveBeenCalledWith({
        srcDir: path.join(process.cwd(), 'src'),
        destDir: path.join(process.cwd(), 'lib')
    });
});
