import * as fs from 'fs-extra';
import copyFile from '../copyFile';

jest.mock('fs-extra', () => ({
    copySync: jest.fn()
}));

it('copies source file to the destination', () => {
    const srcPath = 'src/file.json';
    const destPath = 'dest/file.json';

    copyFile(srcPath, destPath);

    expect(fs.copySync).toHaveBeenCalledWith(srcPath, destPath);
});
