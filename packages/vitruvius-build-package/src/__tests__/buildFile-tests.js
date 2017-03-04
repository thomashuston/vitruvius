import * as fs from 'fs-extra';
import buildFile from '../buildFile';

const mockCompiledCode = 'compiled code';
jest.mock('babel-core', () => ({
    transformFileSync: () => ({
        code: mockCompiledCode
    })
}));

jest.mock('fs-extra', () => ({
    writeFileSync: jest.fn()
}));

it('writes compiled source code to the destination', () => {
    const srcPath = 'src/file.js';
    const destPath = 'dest/file.js';

    buildFile(srcPath, destPath);

    expect(fs.writeFileSync).toHaveBeenCalledWith(destPath, mockCompiledCode);
});
