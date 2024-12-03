# OS support: alpine-3.16-amd64-openssl-1.1.x

- Base Docker image: `node:lts-alpine3.16`
- OS: Linux Alpine 3.16
- Arch: amd64 (x86_64)
- OpenSSL location: `/lib/libssl.so.1.1`
- Binary target: `linux-musl`

This is the last Alpine version to have OpenSSL 1.1, as Alpine 3.17+ upgraded to OpenSSL 3.

Running `prisma` -v will fail with:

```sh
┌──────────────────────────────────────────────┐
│    Prisma only supports Node.js >= 18.18.    │
│    Please upgrade your Node.js version.      │
└──────────────────────────────────────────────┘
```
