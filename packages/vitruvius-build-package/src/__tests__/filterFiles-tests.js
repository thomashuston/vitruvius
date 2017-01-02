import filterFiles from '../filterFiles';

describe('filterFiles', () => {

    it('filters out files in `__mocks__` directories by default', () => {
        const files = filterFiles([
            'src/__mocks__/file1.js',
            'src/__mocks__/file1.jsx',
            'src/file1.js',
            'src/file2.jsx'
        ]);

        expect(files).toEqual([
            'src/file1.js',
            'src/file2.jsx'
        ]);
    });

    it('filters out files in `__tests__` directories by default', () => {
        const files = filterFiles([
            'src/__tests__/file1-test.js',
            'src/__tests__/file2-test.jsx',
            'src/file1.js',
            'src/file2.jsx'
        ]);

        expect(files).toEqual([
            'src/file1.js',
            'src/file2.jsx'
        ]);
    });

    it('filters out JS files ending in `.spec` by default', () => {
        const files = filterFiles([
            'src/file1.js',
            'src/file1.spec.js',
            'src/file2.jsx',
            'src/file2.spec.jsx'
        ]);

        expect(files).toEqual([
            'src/file1.js',
            'src/file2.jsx'
        ]);
    });

    it('filters out JS files ending in `.test` by default', () => {
        const files = filterFiles([
            'src/file1.js',
            'src/file1.test.js',
            'src/file2.jsx',
            'src/file2.test.jsx'
        ]);

        expect(files).toEqual([
            'src/file1.js',
            'src/file2.jsx'
        ]);
    });

    it('filers out files matching specified patterns', () => {
        const files = filterFiles([
            'src/file1.js',
            'src/file2.foo.js',
            'src/file3.bar.json',
            'src/file4.js'
        ], [
            '**/*.foo.js',
            '**/*.bar.*'
        ]);

        expect(files).toEqual([
            'src/file1.js',
            'src/file4.js'
        ]);
    });

    it('doesn\'t use default ignore patterns when patterns are specified', () => {
        const files = filterFiles([
            'src/__mocks__/file1.js',
            'src/__tests__/file1-test.js',
            'src/file1.js',
            'src/file2.js',
            'src/file2.spec.js',
            'src/file3.js',
            'src/file3.test.js',
            'src/file4.foo.js'
        ], [
            '**/*.foo.js'
        ]);

        expect(files).toEqual([
            'src/__mocks__/file1.js',
            'src/__tests__/file1-test.js',
            'src/file1.js',
            'src/file2.js',
            'src/file2.spec.js',
            'src/file3.js',
            'src/file3.test.js'
        ]);
    });

});
