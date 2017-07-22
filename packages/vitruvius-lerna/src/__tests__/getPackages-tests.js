import getPackages from '../getPackages';

let mockPackages;
jest.mock('lerna/lib/PackageUtilities', () => ({
    getPackages: () => mockPackages
}));
jest.mock('lerna/lib/Repository', () => class FakeRepository { });

it('returns the paths of all lerna packages', () => {
    mockPackages = [{
        name: 'fake-pkg-1',
        location: '/foo/bar/packages/fake-pkg-1'
    }, {
        name: 'fake-pkg-2',
        location: '/foo/bar/packages/fake-pkg-2'
    }];

    const packages = getPackages();

    expect(packages).toEqual([
        '/foo/bar/packages/fake-pkg-1',
        '/foo/bar/packages/fake-pkg-2'
    ]);
});
