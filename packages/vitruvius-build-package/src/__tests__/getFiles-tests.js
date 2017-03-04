import getFiles from '../getFiles';

const mockFiles = [
    'src/__tests__/file1-tests.js',
    'src/file1.js',
    'src/file2.json'
];
jest.mock('glob', () => ({
    sync: () => mockFiles
}));

it('finds all files in the source directory', () => {
    const files = getFiles('src');

    expect(files).toEqual(mockFiles);
});
