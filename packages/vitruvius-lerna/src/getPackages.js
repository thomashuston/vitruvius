import PackageUtilities from 'lerna/lib/PackageUtilities';
import Repository from 'lerna/lib/Repository';

export default function getPackages() {
    return PackageUtilities.getPackages(new Repository()).map(pkg => pkg.location);
}
