import * as fs from 'fs-extra';

export default function copyFile(srcPath, destPath) {
    fs.copySync(srcPath, destPath);
}
