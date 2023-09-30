default: zola-serve

init:
    git submodule update --init --recursive

dev *ARGS: init
    zola serve --drafts --interface 127.0.0.1 --port 8080 --base-url localhost {{ARGS}}

dev-open *ARGS: init
    zola serve --drafts --interface 127.0.0.1 --port 8080 --base-url localhost --open {{ARGS}}

zola-install:
    docker pull ghcr.io/getzola/zola:v0.16.0

zola-serve: zola-install
    docker run -i -u "$(id -u):$(id -g)" -v $PWD:$PWD --workdir $PWD -p 8080:8080 ghcr.io/getzola/zola:v0.16.0 serve --interface 0.0.0.0 --port 8080 --base-url localhost

line-count:
    tokei . -e themes/ -e public/
