#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${SCRIPT_DIR}/src/vault"
NOTES_DIR="${SCRIPT_DIR}/src/content/docs/notes"
REPO_URL="${VAULT_REPO_URL:-https://github.com/somacdivad/commonbook.git}"

# Ensure the src directory exists
mkdir -p "${SCRIPT_DIR}/src"

# Check if the notes directory already exists and if so delete it
if [[ -d "${NOTES_DIR}" ]]; then
  rm -rf "${NOTES_DIR}"
fi

if [[ -d "${TARGET_DIR}/.git" ]]; then
	echo "Vault already exists at ${TARGET_DIR}; updating..."
	git -C "${TARGET_DIR}" pull --ff-only
else
  echo "Cloning vault from ${REPO_URL} to ${TARGET_DIR}..."
  git clone "${REPO_URL}" "${TARGET_DIR}"
fi
