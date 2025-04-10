#!/usr/bin/env bash
set -euo pipefail

export BIKAMP_PATH=$(pwd)
check_dependency() {
    if ! command -v "$1" >/dev/null 2>&1; then
        echo "Erro: comando '$1' não encontrado" >&2
        exit 1
    fi
}
check_dependency python

bikamp(){
	python $BIKAMP_PATH/cli/cli.py $@
}
