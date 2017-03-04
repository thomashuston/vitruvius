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

const file = path.join(process.cwd(), 'foo/bar.js');

it('formats Babel errors', () => {
    const error = getError(() => transform('cons invalid = true;', { filename: file }));

    console.log(error.message);

    expect(formatError(error)).toMatchSnapshot();
});

it('returns other errors as strings', () => {
    const error = getError(() => { throw new Error('other error type'); });

    expect(formatError(error)).toMatchSnapshot();
});
