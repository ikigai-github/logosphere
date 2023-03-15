# TBD

## setupBuildScripts
To copy *ls-primer* build scripts and associated files under /workspaces/

```
@norywoo ➜ /workspaces/logosphere (logosphere-ls-primer-codespaces) $ cd _appendix/to-build-ls-primer-in-codespaces/ 
@norywoo ➜ /workspaces/logosphere/_appendix/to-build-ls-primer-in-codespaces (logosphere-ls-primer-codespaces) $ source ./setupBuildScripts.rc 
@norywoo ➜ /workspaces $ ls
1.setup.rc             3.ls-primer-nx-workspace.rc  5.ls-primer-music-container.rc  logosphere
2.build_logosphere.rc  4.ls-primer-music-module.rc  6.ls-primer-docker-compose.rc   misc
```

```
@norywoo ➜ /workspaces $ source 1.setup.rc 
Downloading and installing node v16.19.1...
Downloading https://nodejs.org/dist/v16.19.1/node-v16.19.1-linux-x64.tar.xz...
:
npm notice Log in on https://registry.npmjs.org/
Username: npm_user_name
Password: 
Email: (this IS public) you@example.com
npm notice Please use the one-time password (OTP) from your authenticator application
Enter one-time password: 777123
```
### 2.build_logosphere
```
@norywoo ➜ /workspaces $ source 2.build_logosphere.rc 
:
 >  NX   Running affected:* commands with --all can result in very slow builds.

   --all is not meant to be used for any sizable project or to be used in CI.
   
   Learn more about checking only what is affected: https://nx.dev/nx/affected


    ✔  nx run cardano:build (11s)
    ✔  nx run fluree:build (13s)
    ✔  nx run ipfs:build (7s)
    ✔  nx run media:build (31s)
    ✔  nx run cardano-e2e:build (24s)
    ✔  nx run fluree-e2e:build (21s)
    ✔  nx run ipfs-e2e:build (18s)
    ✔  nx run sdk:build (25s)
    ✔  nx run media-e2e:build (23s)

 ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

 >  NX   Successfully ran target build for 9 projects (1m)
 
17d16
<     "@logosphere/fluree": "0.5.3",
25d23
<     "@logosphere/cardano": "0.5.3",
12,15d11
<         '@logosphere/cardano': '0.5.3',
<         '@logosphere/ipfs': '0.1.1',
<         '@logosphere/fluree': '0.5.3',
<         '@logosphere/sdk': '0.6.7',
66c62
< //# sourceMappingURL=add-dependencies.js.map
\ No newline at end of file
---
> //# sourceMappingURL=add-dependencies.js.map
```


