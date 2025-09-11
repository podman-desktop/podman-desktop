# /**********************************************************************
#  Copyright (C) 2025 Red Hat, Inc.
#  
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#  
#  http://www.apache.org/licenses/LICENSE-2.0
#  
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
#  
#  SPDX-License-Identifier: Apache-2.0
#  ***********************************************************************/

#!/bin/bash
set -euo pipefail

OUTPUT_DIR="$TMT_TREE/tests/playwright/output/"

cd "$TMT_TEST_DATA"

if [ -f "$OUTPUT_DIR/junit-results.xml" ]; then
  cp "$OUTPUT_DIR/junit-results.xml" .
else
  echo "Error: junit-results.xml not found"
  exit 1
fi

if [ "$1" -eq 0 ]; then 
  cat <<EOF > ./results.yaml
- name: /tests/$2
  result: pass
  note: 
    - "Playwright end-to-end tests completed successfully."
  log:
    - ../output.txt
    - junit-results.xml
EOF

elif [ "$1" -eq 255 ]; then

  if [ -d "$OUTPUT_DIR/traces" ]; then
    cp -r "$OUTPUT_DIR/traces" .
  else 
    echo "Error: traces directory does not exist"
    exit 1
  fi

  if [ -d "$OUTPUT_DIR/videos" ]; then 
    cp -r "$OUTPUT_DIR/videos" .
  else 
    echo "Error: videos directory does not exist"
    exit 1
  fi

  cat <<EOF > ./results.yaml
- name: /tests/$2
  result: fail
  note: 
    - "Playwright tests failed."
  log:
    - ../output.txt
    - junit-results.xml
    - videos
    - traces
EOF

else
  echo "Unexpected exit code: $1"
  exit 1
fi
