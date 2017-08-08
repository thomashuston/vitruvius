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
const rootDir = path.resolve(path.join(__dirname, '..', '..', '..', '..', '..'));

beforeEach(() => {
    output = [];
    buildPackage.mockReset();
    Date.now = () => now;
});

it('builds code in the source directory into the destination directory for all packages', () => {
    mockPackages = [
        path.join(rootDir, '/packages/fake-pkg-1'),
        path.join(rootDir, '/packages/fake-pkg-2')
    ];

    build({
        src: 'src',
        dest: 'lib',
        'ignore-files': [
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

it('does not build code for ignore packages', () => {
    mockPackages = [
        path.join(rootDir, '/examples/example-pkg'),
        path.join(rootDir, '/packages/fake-pkg-1'),
        path.join(rootDir, '/packages/fake-pkg-2')
    ];

    build({
        src: 'src',
        dest: 'lib',
        'ignore-packages': [
            'examples/**'
        ]
    });

    expect(buildPackage).toHaveBeenCalledTimes(2);
    expect(buildPackage).toHaveBeenCalledWith({
        srcDir: path.join(mockPackages[1], 'src'),
        destDir: path.join(mockPackages[1], 'lib')
    });
    expect(buildPackage).toHaveBeenCalledWith({
        srcDir: path.join(mockPackages[2], 'src'),
        destDir: path.join(mockPackages[2], 'lib')
    });
});

it('exits with success code when all packages build successfully', () => {
    mockPackages = [
        path.join(rootDir, '/packages/fake-pkg-1'),
        path.join(rootDir, '/packages/fake-pkg-2')
    ];

    build({
        src: 'src',
        dest: 'lib'
    });

    expect(process.exit).toHaveBeenCalledWith(0);
});

it('exits with failure code when some packages fail to build', () => {
    mockPackages = [
        path.join(rootDir, '/packages/fake-pkg-1'),
        path.join(rootDir, '/packages/fake-pkg-2')
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
            path.join(rootDir, '/packages/fake-pkg-1'),
            path.join(rootDir, '/packages/fake-pkg-2')
        ];

        build({
            src: 'src',
            dest: 'lib'
        });

        expect(output.join('')).toMatchSnapshot();
    });

    it('logs errors when some packages fail to build', () => {
        mockPackages = [
            path.join(rootDir, '/packages/fake-pkg-1'),
            path.join(rootDir, '/packages/fake-pkg-2')
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
            path.join(rootDir, '/packages/fake-pkg-1'),
            path.join(rootDir, '/packages/fake-pkg-2')
        ];

        buildPackage.mockImplementationOnce(() => {
            transform('cons invalid = 1;', {
                filename: path.join(rootDir, '/packages/fake-pkg-1/invalid.js')
            });
        });

        build({
            src: 'src',
            dest: 'lib'
        });

        expect(output.join('')).toMatchSnapshot();
    });

}
