#!/bin/bash

for file in pending/*.ts; do
    echo "Compiling $file"
    if tsc "$file" --noEmit; then
        echo "✓ $file compiled successfully"
    else
        echo "✗ $file failed to compile"
    fi
done