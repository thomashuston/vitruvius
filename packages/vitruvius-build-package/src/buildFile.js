import * as babel from 'babel-core';
import * as fs from 'fs-extra';

export default function buildFile(srcPath, destPath) {
    const { code } = babel.transformFileSync(srcPath);
    fs.writeFileSync(destPath, code);
}
