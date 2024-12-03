# OS support: alpine-3.16-arm64-openssl-1.1.x-with-libc

- Base Docker image: `node:lts-alpine3.16`
- OS: Linux Alpine 3.16
- Arch: arm64 (aarch64)
- OpenSSL location: `/lib/libssl.so.1.1`
- Binary target: `linux-musl-arm64-openssl-1.1.x`

Running `prisma` -v will fail with:

```sh
┌──────────────────────────────────────────────┐
│    Prisma only supports Node.js >= 18.18.    │
│    Please upgrade your Node.js version.      │
└──────────────────────────────────────────────┘
```
