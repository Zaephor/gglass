# gglass

Build  
 [![Build Status](https://travis-ci.com/Zaephor/gglass.svg?branch=master)](https://travis-ci.com/Zaephor/gglass)
![Docker Pulls](https://img.shields.io/docker/pulls/zaephor/gglass)

Stable  
![Docker Image Size (tag)](https://img.shields.io/docker/image-size/zaephor/gglass/latest)
![MicroBadger Layers (tag)](https://img.shields.io/microbadger/layers/zaephor/gglass/latest)
![Docker Image Version (latest semver)](https://img.shields.io/docker/v/zaephor/gglass?sort=semver)

Dev  
![Docker Image Size (tag)](https://img.shields.io/docker/image-size/zaephor/gglass/dev)
![MicroBadger Layers (tag)](https://img.shields.io/microbadger/layers/zaephor/gglass/dev)

## Getting Started

gglass is meant to be a simple bookmark manager, similar in spirit to [Organizr](https://github.com/causefx/Organizr) or [Heimdall](https://heimdall.site/).

It's a bit rough, but currently targetting the couple design decisions I'm not a fan of from the other guys.

## Features

### Current Features

- User login/registration
- Non-hierarchical user group system
- Initial support for Google Auth
- Bookmark menu and editor

### Potential Features/Todos

- Traefik integration
  - Auth target
  - URI scraping
- Docker integration
  - URI scraping
- Peer/cluster configuration
  - Not sure yet about this one
  - Possible peer-based userauth
  - Possible peer-based menu population

## Overall Goals

- Easy to setup
- Minimal resource requirements
- Minimal interface
