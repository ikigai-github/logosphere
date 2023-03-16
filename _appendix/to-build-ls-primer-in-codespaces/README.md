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

### 1.setup
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

### 3.ls-primer-nx-workspace
```
@norywoo ➜ /workspaces $ source 3.ls-primer-nx-workspace.rc 
🏃 npx create-nx-workspace@15.4.4 --name ls-primer --pm pnpm --nxCloud false --preset empty
Need to install the following packages:
  create-nx-workspace@15.4.4
Ok to proceed? (y) y

 >  NX   Let's create a new workspace [https://nx.dev/getting-started/intro]


 >  NX   Nx is creating your v15.4.4 workspace.
:
```

### 4.ls-primer-music-module 
```
@norywoo ➜ /workspaces $ source 4.ls-primer-music-module.rc 
🏃 cd ls-primer
🏃 pnx g @logosphere/sdk:module --name music

>  NX  Generating @logosphere/sdk:module
:
🏃 cp ../misc/app.module.ts apps/music/src/app/app.module.ts
🏃 pnx g @logosphere/sdk:docker-compose

>  NX  Generating @logosphere/sdk:docker-compose

CREATE .env
CREATE docker-compose.yaml
CREATE tmp/docker/blockfrost-config/default.ts
🏃 pnx affected:build

 >  NX   Affected criteria defaulted to --base=main --head=HEAD


    ✔  nx run music-gen:build (6s)
    ✔  nx run music:build (11s)

 —————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

 >  NX   Successfully ran target build for 2 projects (18s)
 
🏃 pnx affected:test

 >  NX   Affected criteria defaulted to --base=main --head=HEAD


    ✔  nx run music:test (5s)
    ✔  nx run music-gen:test (17s)

 —————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

 >  NX   Successfully ran target test for 2 projects (17s)

🏃 ln -s ./libs/music-gen/src/fluree/music-fluree-schema.json
🏃 cd ..
```

### ls-primer-docker-compose
```
@norywoo ➜ /workspaces $ source 5.ls-primer-docker-compose.rc 
🏃 cd ls-primer
🏃 pnx g @logosphere/sdk:docker-compose

>  NX  Generating @logosphere/sdk:docker-compose

Files: .env, docker-compose.yaml already exist. Override and continue? (y/n): y
UPDATE .env
UPDATE docker-compose.yaml
🏃 export CARDANO_WALLET_ID=1299b5d429f8a79abc507ea6b906b16afb0a3625
🏃 export CARDANO_WALLET_ADDRESS=addr_test1qp03spdp50p77qs64ufnjf62scd3ssa0u7s9al9vun4t8pkkgl0hrywrkj94j0hszqz339sv90p3c2rw8fdg66ez7cxq3taf3p
🏃 export CARDANO_WALLET_MNEMONIC=slab,praise,suffer,rabbit,during,dream,arch,harvest,culture,book,owner,loud,wool,salon,table,animal,vivid,arrow,dirt,divide,humble,tornado,solution,jungle
🏃 export FLUREE_ROOT_PRIVATE_KEY=d301d43c7c97c0cbc2ae9cda8cefe64b08b54915e43239c452fb7e3464735dec
🏃 export FLUREE_ROOT_PUBLIC_KEY=02c32207d7d19e1982ef67dadce291f4d9dd25d1f730bcfde400ce1d12d712bea4
🏃 export FLUREE_ROOT_AUTH_ID=TfFtV4LCDiL48oAbqn8Th312Tyw6UNztnYc
🏃 cd ls-primer
bash: cd: ls-primer: No such file or directory
🏃 cp docker-compose.yaml docker-compose.yaml.orig
🏃 yq -yi '.services.music = null' docker-compose.yaml
🏃 sed -ie '/music:/d' docker-compose.yaml
🏃 docker-compose up -d
Creating network "ls-primer_default" with the default driver
Creating ls-primer_fluree-ledger_1      ... done
Creating ls-primer_postgres_1           ... done
Creating ls-primer_cardano-node_1  ... done
Creating ls-primer_cardano-submit-api_1 ... done
Creating ls-primer_blockfrost_1         ... done
Creating ls-primer_cardano-db-sync_1    ... done
🏃 docker-compose ps
             Name                           Command                  State                        Ports                  
-------------------------------------------------------------------------------------------------------------------------
ls-primer_blockfrost_1           /app/blockfrost-backend-ry ...   Up             0.0.0.0:3000->3000/tcp,:::3000->3000/tcp
ls-primer_cardano-db-sync_1      /nix/store/9r07xp541bmp258 ...   Up             0.0.0.0:3002->3002/tcp,:::3002->3002/tcp
ls-primer_cardano-node_1         entrypoint                       Up (healthy)   0.0.0.0:3001->3001/tcp,:::3001->3001/tcp
ls-primer_cardano-submit-api_1   /nix/store/wr29fnsggvm95gw ...   Up             0.0.0.0:9090->8090/tcp,:::9090->8090/tcp
ls-primer_fluree-ledger_1        ./fluree_start.sh                Up             0.0.0.0:8090->8090/tcp,:::8090->8090/tcp
ls-primer_postgres_1             docker-entrypoint.sh postgres    Up (healthy)   0.0.0.0:5432->5432/tcp,:::5432->5432/tcp
🏃 cd ..
```
