import * as path from 'path';
import micromatch from 'micromatch';
import buildFile from './buildFile';
import copyFile from './copyFile';
import filterFiles from './filterFiles';
import getFiles from './getFiles';

const JS_FILE_PATTERN = '**/*.js';
const JSX_FILE_PATTERN = '**/*.jsx';

export default function buildPackage({
    packageDir,
    srcDir,
    destDir,
    ignorePatterns
}) {
    const files = getFiles(packageDir);
    const filteredFiles = filterFiles(files, ignorePatterns);
    filteredFiles.forEach((file) => {
        const relativeToSrcPath = path.relative(srcDir, file);
        const destPath = path.resolve(destDir, relativeToSrcPath);

        if (micromatch.isMatch(file, JS_FILE_PATTERN)) {
            buildFile(file, destPath);
        } else if (micromatch.isMatch(file, JSX_FILE_PATTERN)) {
            buildFile(file, destPath.replace(/\.jsx$/, '.js'));
        } else {
            copyFile(file, destPath);
        }
    });
}
