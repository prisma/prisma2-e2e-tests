# OS support: amazonlinux-2-arm64-openssl-1.0.x

- Base Docker image: `amazonlinux:2`
- OS: Amazon Linux 2
- Arch: arm64 (aarch64)
- OpenSSL location: `/lib64/libssl.so.10`
- Binary target: `linux-arm64-openssl-1.0.x`

Running `prisma` -v will fail with:

```sh
node: /lib64/libm.so.6: version `GLIBC_2.27' not found (required by node)
node: /lib64/libc.so.6: version `GLIBC_2.28' not found (required by node)
```
