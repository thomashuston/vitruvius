import * as glob from 'glob';
import * as path from 'path';

const FILE_PATTERN = '**/*';

export default function getFiles(srcDir) {
    const pattern = path.join(srcDir, FILE_PATTERN);
    return glob.sync(pattern, {
        nodir: true
    });
}
