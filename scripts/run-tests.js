const { spawn } = require("node:child_process")

function mapTestPath(pattern) {
    if (pattern.startsWith("build/")) {
        return pattern
    }

    if (pattern.startsWith("tests/")) {
        const withoutPrefix = pattern.replace(/^tests\//, "")
        return `build/tests/${withoutPrefix}`.replace(/\.ts$/, ".js")
    }

    return pattern
}

const additionalArgs = process.argv.slice(2)
const nodeArgs = ["--test"]

if (additionalArgs.length === 0) {
    nodeArgs.push("build/tests/**/*.test.js")
} else {
    nodeArgs.push(...additionalArgs.map(mapTestPath))
}

const runner = spawn("node", nodeArgs, { stdio: "inherit" })

runner.on("exit", (code, signal) => {
    if (signal) {
        process.kill(process.pid, signal)
        return
    }

    process.exit(code ?? 1)
})
