## 生成私钥和证书

```bash
keytool -genkey -alias undertow -storetype PKCS12 -keyalg RSA -keysize 2048 -keystore keystore.p12 -dname "CN=localhost, OU=zelin, O=zelin, L=bj, ST=
bj, C=CN"
```

