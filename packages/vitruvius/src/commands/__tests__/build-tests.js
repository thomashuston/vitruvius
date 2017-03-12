import * as path from 'path';
import { transform } from 'babel-core';
import buildPackage from 'vitruvius-build-package';
import { handler as build } from '../build';

let mockPackages;
jest.mock('vitruvius-lerna', () => ({
    getPackages: () => mockPackages
}));

jest.mock('vitruvius-build-package', () => jest.fn());

let output;
process.stdout.write = (text) => { output.push(text); };
process.exit = jest.fn();

const now = Date.now();

beforeEach(() => {
    output = [];
    buildPackage.mockReset();
    Date.now = () => now;
});

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

it('exits with success code when all packages build successfully', () => {
    mockPackages = [
        '/foo/bar/packages/fake-pkg-1',
        '/foo/bar/packages/fake-pkg-2'
    ];

    build({
        src: 'src',
        dest: 'lib'
    });

    expect(process.exit).toHaveBeenCalledWith(0);
});

it('exits with failure code when some packages fail to build', () => {
    mockPackages = [
        '/foo/bar/packages/fake-pkg-1',
        '/foo/bar/packages/fake-pkg-2'
    ];

    buildPackage.mockImplementationOnce(() => { throw new Error('failed!'); });

    build({
        src: 'src',
        dest: 'lib'
    });

    expect(process.exit).toHaveBeenCalledWith(1);
});

if (process.platform !== 'win32') {

    it('logs success when all packages build successfully', () => {
        mockPackages = [
            '/foo/bar/packages/fake-pkg-1',
            '/foo/bar/packages/fake-pkg-2'
        ];

        build({
            src: 'src',
            dest: 'lib'
        });

        expect(output.join('')).toMatchSnapshot();
    });

    it('logs errors when some packages fail to build', () => {
        mockPackages = [
            '/foo/bar/packages/fake-pkg-1',
            '/foo/bar/packages/fake-pkg-2'
        ];

        buildPackage.mockImplementationOnce(() => { throw new Error('failed!'); });

        build({
            src: 'src',
            dest: 'lib'
        });

        expect(output.join('')).toMatchSnapshot();
    });

    it('pretty prints babel errors when babel compilation fails in a package', () => {
        mockPackages = [
            '/foo/bar/packages/fake-pkg-1',
            '/foo/bar/packages/fake-pkg-2'
        ];

        buildPackage.mockImplementationOnce(() => {
            transform('cons invalid = 1;', {
                filename: '/foo/bar/packages/fake-pkg-1/invalid.js'
            });
        });

        build({
            src: 'src',
            dest: 'lib'
        });

        expect(output.join('')).toMatchSnapshot();
    });

}
