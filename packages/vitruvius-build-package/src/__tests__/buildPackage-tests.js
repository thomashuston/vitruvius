import * as path from 'path';
import buildFile from '../buildFile';
import buildPackage from '../';
import copyFile from '../copyFile';

jest.mock('../buildFile', () => jest.fn());
jest.mock('../copyFile', () => jest.fn());

let mockFiles;
jest.mock('../getFiles', () => () => mockFiles);

let mockFilteredFiles;
jest.mock('../filterFiles', () => () => mockFilteredFiles);

describe('buildPackage', () => {

    beforeEach(() => {
        mockFiles = [];
        mockFilteredFiles = [];
        jest.resetModules();
    });

    const givenFilteredFiles = (...files) => { mockFilteredFiles = files; };
    const givenFiles = (...files) => {
        mockFiles = files;
        givenFilteredFiles(...files);
    };

    const expectFileToHaveBeenBuilt = (srcPath, destPath) => {
        expect(buildFile).toHaveBeenCalledWith(srcPath, path.resolve(destPath));
        expect(copyFile).not.toHaveBeenCalledWith(srcPath, expect.any(String));
    };

    const expectFileToHaveBeenCopied = (srcPath, destPath) => {
        expect(copyFile).toHaveBeenCalledWith(srcPath, path.resolve(destPath));
        expect(buildFile).not.toHaveBeenCalledWith(srcPath, expect.any(String));
    };

    const expectFileToHaveBeenIgnored = (srcPath) => {
        expect(buildFile).not.toHaveBeenCalledWith(srcPath, expect.any(String));
        expect(copyFile).not.toHaveBeenCalledWith(srcPath, expect.any(String));
    };

    it('builds JS files', () => {
        givenFiles(
            'package/src/file1.js',
            'package/src/file2.json',
            'package/src/nested/file3.js',
            'package/src/nested/file4.json'
        );

        buildPackage({
            packageDir: 'package',
            srcDir: 'package/src',
            destDir: 'package/lib'
        });

        expectFileToHaveBeenBuilt('package/src/file1.js', 'package/lib/file1.js');
        expectFileToHaveBeenBuilt('package/src/nested/file3.js', 'package/lib/nested/file3.js');
    });

    it('builds JSX files to JS', () => {
        givenFiles(
            'package/src/file1.jsx',
            'package/src/nested/file2.jsx'
        );

        buildPackage({
            packageDir: 'package',
            srcDir: 'package/src',
            destDir: 'package/lib'
        });

        expectFileToHaveBeenBuilt('package/src/file1.jsx', 'package/lib/file1.js');
        expectFileToHaveBeenBuilt('package/src/nested/file2.jsx', 'package/lib/nested/file2.js');
    });

    it('copies non-JS files', () => {
        givenFiles(
            'package/src/file1.js',
            'package/src/file2.json',
            'package/src/nested/file3.js',
            'package/src/nested/file4.json'
        );

        buildPackage({
            packageDir: 'package',
            srcDir: 'package/src',
            destDir: 'package/lib'
        });

        expectFileToHaveBeenCopied('package/src/file2.json', 'package/lib/file2.json');
        expectFileToHaveBeenCopied('package/src/nested/file4.json', 'package/lib/nested/file4.json');
    });

    it('ignores filtered files', () => {
        givenFiles(
            'package/src/file1.js',
            'package/src/__tests__/file1-tests.js'
        );
        givenFilteredFiles(
            'package/src/file1.js'
        );

        buildPackage({
            packageDir: 'package',
            srcDir: 'package/src',
            destDir: 'package/lib'
        });

        expectFileToHaveBeenIgnored('package/src/__tests__/file1-tests.js');
    });

});
