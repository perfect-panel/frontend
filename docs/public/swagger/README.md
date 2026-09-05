# Swagger assets

`perfect-panel/backend` is the authoritative source for the v1 API specifications. Its `master` workflow synchronizes every generated top-level `build/swagger/*.json` file into this directory.

The frontend generates clients from `admin.json`, `user.json`, and `common.json`. The retired gateway spec and client have been removed. `edge.json` describes the separate subscription edge service and remains backend-owned.
