# IPFS upload REST API

It's a simple API for uploading images to [Pinata IPFS](https://pinata.cloud).

## Pinata Account
In order to upload images to Pinata, an account has to be created. Please note that a free account has limitations on amount of uploaded files and their sizes. There are different [pricing models](https://www.pinata.cloud/pricing#plans-details) available. 

Once the account is created, Pinata gives API credentials that need to be put into `.env` file:

```bash
# PINATA
# Pinata API credentials
PINATA_API_KEY=
PINATA_API_SECRET=
PINATA_JWT=
```
## Starting endpoint locally
The IPFS endpoint can be started with:
```
$ pnx serve ipfs
```
It uses port `2099` on localhost

## Uploading image
You can use `curl` to test uploading image to IPFS:
```
curl https://localhost:2099/ipfs/upload -F 'image=@./image.png'
```

Once the image uploaded, it will return its CID