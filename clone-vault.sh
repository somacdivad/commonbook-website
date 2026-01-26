#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${SCRIPT_DIR}/src/vault"
REPO_URL="${VAULT_REPO_URL:-https://github.com/somacdivad/commonbook.git}"

mkdir -p "${SCRIPT_DIR}/src"

if [[ -d "${TARGET_DIR}/.git" ]]; then
	echo "Vault already exists at ${TARGET_DIR}; updating..."
	git -C "${TARGET_DIR}" pull --ff-only
	exit 0
fi

git clone "${REPO_URL}" "${TARGET_DIR}"
