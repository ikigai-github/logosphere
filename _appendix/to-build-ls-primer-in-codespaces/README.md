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

