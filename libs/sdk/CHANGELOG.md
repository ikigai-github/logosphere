# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

### [0.7.2](https://github.com/ikigai-github/logosphere/compare/sdk-0.7.1...sdk-0.7.2) (2023-03-31)

### [0.7.1](https://github.com/ikigai-github/logosphere/compare/sdk-0.7.0...sdk-0.7.1) (2023-03-20)

### [0.6.7](https://github.com/ikigai-github/logosphere/compare/sdk-0.6.6...sdk-0.6.7) (2023-01-31)

- **sdk:** removing unnecessary exports ([220c783](https://github.com/ikigai-github/logosphere/commit/220c783e906d370c445fd1ebf9aadeee5777f5fc))

### Bug Fixes

### [0.6.6](https://github.com/ikigai-github/logosphere/compare/sdk-0.6.5...sdk-0.6.6) (2023-01-31)

### Bug Fixes

- **sdk:** removing generators export from sdk index file ([6e7ce71](https://github.com/ikigai-github/logosphere/commit/6e7ce719c64e5b632d8ae11d4cf699966b612b20))

### [0.6.5](https://github.com/ikigai-github/logosphere/compare/sdk-0.6.4...sdk-0.6.5) (2023-01-31)

### Bug Fixes

- **sdk:** adding gen postfix to the module lib generator ([c89260d](https://github.com/ikigai-github/logosphere/commit/c89260d38964dbf0ccf704c094055d365c78b2c4))
- **sdk:** adjust canonical schema generator to module lib with postfix ([534ab52](https://github.com/ikigai-github/logosphere/commit/534ab52d2a85a265d5eb9e9704d1a0f362326def))
- **sdk:** adjust dto generator to module lib with postfix ([532ac3c](https://github.com/ikigai-github/logosphere/commit/532ac3cba16f762b6b2aa92deeb955a8ff849170))
- **sdk:** adjust entity generator to module lib with postfix ([1d4e7e9](https://github.com/ikigai-github/logosphere/commit/1d4e7e9781788c5c6b0da01aad7718ffd60d3083))
- **sdk:** adjust enum type generator to module lib with postfix ([a297071](https://github.com/ikigai-github/logosphere/commit/a29707184485b83a5b8a067d005183128a931f00))
- **sdk:** adjust fluree schema generator to module lib with postfix ([3bedfb5](https://github.com/ikigai-github/logosphere/commit/3bedfb567a724c0e43cbe1a5ea145a004f68db25))
- **sdk:** adjust gql generator to module lib with postfix ([0f95be0](https://github.com/ikigai-github/logosphere/commit/0f95be0446dcd9e0dbef063e324f24fb4f16535f))
- **sdk:** adjust mapper generator to module lib with postfix ([da8366d](https://github.com/ikigai-github/logosphere/commit/da8366d2bb4d43fe9778327c183e112ef6394524))
- **sdk:** adjust repositories generator to module lib with postfix ([7f525ba](https://github.com/ikigai-github/logosphere/commit/7f525bad516ff0e13de6cc8743da2a603bcd9d7e))
- **sdk:** adjust resolvers generator to module lib with postfix ([b4f449a](https://github.com/ikigai-github/logosphere/commit/b4f449ac5ec2c398e5e20c98b506834d40f60043))
- **sdk:** adjusting docker file for postfixed library ([527c6ea](https://github.com/ikigai-github/logosphere/commit/527c6ea14ffd976db86afb595e0d9f158b677d6b))
- **sdk:** adjusting SDK generators to refactored libs ([03db6e0](https://github.com/ikigai-github/logosphere/commit/03db6e0728b644adce2d307745de7a88bcc96a95))
- **sdk:** changing fastify to express in init generator ([f91c7c1](https://github.com/ikigai-github/logosphere/commit/f91c7c1b1aee53aa18183d5e8d5b377b41f4fa0e))
- **sdk:** enabling e2e generator ([ed7dcba](https://github.com/ikigai-github/logosphere/commit/ed7dcba5051bf7d9ef5d77f11e1515e61696b3cd))
- **sdk:** modifying app and init unit tests to the changed nestjs and rxjs version constants ([2596388](https://github.com/ikigai-github/logosphere/commit/25963881102bcafc8ec81045b8cdd144791bf482))
- **sdk:** workaround for NX 15 bug, adding -app postfix to the app ([85f258f](https://github.com/ikigai-github/logosphere/commit/85f258f982dcb881e295b4edffa93ede4c98eea8))

### [0.6.4](https://github.com/ikigai-github/logosphere/compare/sdk-0.6.3...sdk-0.6.4) (2023-01-12)

### Bug Fixes

- **sdk:** disabling setting default collection ([d7a61b1](https://github.com/ikigai-github/logosphere/commit/d7a61b14f3aab6920aaaa1e45c45e5c414dc2877))

### [0.6.3](https://github.com/ikigai-github/logosphere/compare/sdk-0.6.2...sdk-0.6.3) (2023-01-12)

### [0.6.2](https://github.com/ikigai-github/logosphere/compare/sdk-0.6.1...sdk-0.6.2) (2023-01-12)

### [0.6.1](https://github.com/ikigai-github/logosphere/compare/sdk-0.6.0...sdk-0.6.1) (2022-10-31)

## [0.6.0](https://github.com/ikigai-github/logosphere/compare/sdk-0.5.0...sdk-0.6.0) (2022-10-14)

### Features

- **fluree:** wallet collection ([dba923f](https://github.com/ikigai-github/logosphere/commit/dba923f8d69b24159cac5f95a8a6708fd7111b73))
- **model:** wallet and user entities ([5fcf8dc](https://github.com/ikigai-github/logosphere/commit/5fcf8dcdd69d39dcf063bd7aa8b07cdf71b0357f))

## [0.5.0](https://github.com/ikigai-github/logosphere/compare/sdk-0.4.3...sdk-0.5.0) (2022-10-07)

### Features

- **api:** fluree closed api ([27e3dd2](https://github.com/ikigai-github/logosphere/commit/27e3dd2507c3e775eb97a81416f8dca30f7a60e9))

### [0.4.3](https://github.com/ikigai-github/logosphere/compare/sdk-0.4.2...sdk-0.4.3) (2022-08-23)

### Bug Fixes

- **log-213:** splitting update and dependent create transacts on update ([e133d86](https://github.com/ikigai-github/logosphere/commit/e133d8621b74cab0ee307ef4df7398685c5b12f5))

### [0.4.2](https://github.com/ikigai-github/logosphere/compare/sdk-0.4.1...sdk-0.4.2) (2022-08-05)

### Bug Fixes

- **log-213:** fluree update transaction fixes ([a784675](https://github.com/ikigai-github/logosphere/commit/a784675c8b90f588def4898b95c30cd485ad7630))
- **log-214:** fixing returning referenced objects in minting mutation ([efc8258](https://github.com/ikigai-github/logosphere/commit/efc8258ea7ba29a4f93827a4f638071a09afd1ea))
- **log-215:** e2e tests fix + handling optional query selection in repos ([f6904ae](https://github.com/ikigai-github/logosphere/commit/f6904ae050532ed62f27a2193b7cb87f76798048))

### [0.4.1](https://github.com/ikigai-github/logosphere/compare/sdk-0.4.0...sdk-0.4.1) (2022-07-21)

### Bug Fixes

- **log-212:** docker fixes and version bumps ([14686de](https://github.com/ikigai-github/logosphere/commit/14686de6b7a84b893d90522ac81447961e4e206b))

## [0.4.0](https://github.com/ikigai-github/logosphere/compare/sdk-0.3.1...sdk-0.4.0) (2022-07-19)

### Features

- **log-204:** mapper helpers functions ([aa6d82e](https://github.com/ikigai-github/logosphere/commit/aa6d82edfea9e574c55af7ad74449428159ccfab))
- **log-204:** unreal engine generator ([a1b7114](https://github.com/ikigai-github/logosphere/commit/a1b711486e125f7857211f2b2199a8015448d554))
- **log-210:** name prefix ([41ceef7](https://github.com/ikigai-github/logosphere/commit/41ceef7eabccff0f850a533733e93ef9f55e532f))

### Bug Fixes

- **log-204:** fixing indentation in mappers ([d03fb8a](https://github.com/ikigai-github/logosphere/commit/d03fb8a19b616b938f8a04a943d50718643355a8))

### [0.3.1](https://github.com/ikigai-github/logosphere/compare/sdk-0.3.0...sdk-0.3.1) (2022-06-30)

### Bug Fixes

- **log-198:** assigning correct subjectId in fluree mappers ([7d11446](https://github.com/ikigai-github/logosphere/commit/7d11446decee4fd8ad5146c42ea3252ee918b9d4))
- **log-198:** fixing flow of the new project generation from scratch ([10d49fc](https://github.com/ikigai-github/logosphere/commit/10d49fc30ab6c30fe9fde293a269e2f67a5f2a6c))
- **log-200:** fluree queries to traverse gql selection list ([a782970](https://github.com/ikigai-github/logosphere/commit/a7829709ebfa6a01c4766120426ee2de26fcf655))

## [0.3.0](https://github.com/ikigai-github/logosphere/compare/sdk-0.2.0...sdk-0.3.0) (2022-06-23)

### Features

- **log-196:** add hierarchical Fluree schema file to generator ([e4e2719](https://github.com/ikigai-github/logosphere/commit/e4e2719d0dfeb6019bfb7497463976cac02efe63))
- **log-196:** docker image build ([803e312](https://github.com/ikigai-github/logosphere/commit/803e312b6ae43af148922e07272dc01df50f0365))
- **log-196:** fluree schema autoupdate ([dca5e05](https://github.com/ikigai-github/logosphere/commit/dca5e059f079a6e24b709259167ba158ca1403c6))

## [0.2.0](https://github.com/ikigai-github/logosphere/compare/sdk-0.1.1...sdk-0.2.0) (2022-06-16)

### Features

- **log-161:** tags for enums in fluree schema ([036c874](https://github.com/ikigai-github/logosphere/commit/036c874d804b19db95ae993c661ec22a28b07407))
- **log-188:** fluree parser to canonical schema ([990238f](https://github.com/ikigai-github/logosphere/commit/990238f375ef7ec4ade88c72bb3519d140d8578d))
- **log-188:** fluree schema update ([ba741eb](https://github.com/ikigai-github/logosphere/commit/ba741eb43e48576ab294d89dad63389d35b8dc42))

### [0.1.1](https://github.com/ikigai-github/logosphere/compare/sdk-0.1.0...sdk-0.1.1) (2022-06-06)

### Bug Fixes

- **log-186:** removing hardcoded string from resolver generator ([101fac5](https://github.com/ikigai-github/logosphere/commit/101fac562d883ae00757f95885fedd76c1785fb3))

## 0.1.0 (2022-06-01)

### Features

- **log-183:** release versioning and deployment ([fb2e406](https://github.com/ikigai-github/logosphere/commit/fb2e4060161d0069c13ac8508982c36b3a7bbabb))
