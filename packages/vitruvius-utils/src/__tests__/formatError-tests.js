import * as path from 'path';
import { transform } from 'babel-core';
import formatError from '../formatError';

const getError = (fn) => {
    try {
        fn();
    } catch (e) {
        return e;
    }
};

it('formats Babel errors', () => {
    const error = getError(() => transform('cons invalid = true;'));

    expect(
        formatError(error, path.join(process.cwd(), 'foo/bar.js'))
    ).toMatchSnapshot();
});

it('returns other errors as strings', () => {
    const error = getError(() => { throw new Error('other error type'); });

    expect(
        formatError(error, path.join(process.cwd(), 'foo/bar.js'))
    ).toMatchSnapshot();
});
