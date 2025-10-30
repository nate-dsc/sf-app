declare module "node:child_process" {
    export const execFile: any
}

declare module "node:fs" {
    export const mkdtempSync: any
    export const rmSync: any
}

declare module "node:os" {
    const os: any
    export default os
}

declare module "node:path" {
    const path: any
    export default path
}

declare module "node:util" {
    export const promisify: any
}

declare module "node:test" {
    export const describe: any
    export const it: any
    export const beforeEach: any
    export const afterEach: any
}

declare module "node:assert/strict" {
    const assert: any
    export default assert
}
