import * as lerna from 'lerna';
import Repository from 'lerna/lib/Repository';

export default function getPackages() {
    return lerna.getPackages(new Repository()).map(pkg => pkg.location);
}
