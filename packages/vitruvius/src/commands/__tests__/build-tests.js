import * as path from 'path';
import buildPackage from 'vitruvius-build-package';
import { handler as build } from '../build';

let mockPackages;
jest.mock('vitruvius-lerna', () => ({
    getPackages: () => mockPackages
}));

jest.mock('vitruvius-build-package', () => jest.fn());

process.stdout.write = jest.fn();

it('builds code in the source directory into the destination directory for all packages', () => {
    mockPackages = [
        '/foo/bar/packages/fake-pkg-1',
        '/foo/bar/packages/fake-pkg-2'
    ];

    build({
        src: 'src',
        dest: 'lib',
        ignore: [
            '**/__mocks__/**',
            '**/__tests__/**'
        ]
    });

    mockPackages.forEach((pkg) => {
        expect(buildPackage).toHaveBeenCalledWith({
            srcDir: path.join(pkg, 'src'),
            destDir: path.join(pkg, 'lib'),
            ignorePatterns: [
                '**/__mocks__/**',
                '**/__tests__/**'
            ]
        });
    });
});
