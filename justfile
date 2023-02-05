default: zola-serve

zola-install:
    docker pull ghcr.io/getzola/zola:v0.16.0

zola-serve: zola-install
    docker run -i -u "$(id -u):$(id -g)" -v $PWD:$PWD --workdir $PWD -p 8080:8080 ghcr.io/getzola/zola:v0.16.0 serve --interface 0.0.0.0 --port 8080 --base-url localhost
