import micromatch from 'micromatch';

const IGNORE_PATTERNS = [
    '**/__mocks__/**',
    '**/__tests__/**',
    '**/*.spec.(js|jsx)',
    '**/*.test.(js|jsx)'
];

export default function filterFiles(files, ignorePatterns = IGNORE_PATTERNS) {
    return files.filter(
        file => !ignorePatterns.some(
            pattern => micromatch.isMatch(file, pattern)
        )
    );
}
