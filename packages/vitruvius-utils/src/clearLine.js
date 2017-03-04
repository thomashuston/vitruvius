export default function clearLine() {
    if (process.stdout.isTTY) {
        process.stdout.write('\x1b[999D\x1b[K');
    }
}
