#!/usr/bin/env bash

PROTO_PATH=$HOME/workspace/dropsonde-protocol/events
protoc --js_out=import_style=commonjs,binary:. --proto_path=$PROTO_PATH $PROTO_PATH/*.proto
