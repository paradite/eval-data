```ts
// ... unchanged code above ...

  // Callback function to handle newly detected files
  const handleNewFileDetected = (filePath: string) => {
    // Check if file is already in the list
    const existingFile = filesRef.value.find(f => getFileObjPath(f) === filePath);
    if (!existingFile) {
      const workspaceFiles = filesRef.value.filter(f => !f.placeholder);
      if (workspaceFiles.length === 0) {
        console.log('Ignoring new file as workspace is empty:', filePath);
        return;
      }
      const workspaceCommonPrefix = commonPathPrefixRef.value;
      const normalizedFilePath = normalizePath(filePath);
      const normalizedCommonPrefix = normalizePath(workspaceCommonPrefix);

      const belongsToCurrentWorkspace = normalizedFilePath.startsWith(normalizedCommonPrefix);

      // --- begin modification ---
      const suffixesToIgnore = getIgnoredSuffixes(ignoredSuffixesRef.value);
      if (
        suffixesToIgnore.some(suffix =>
          filePath.toLowerCase().endsWith(suffix.toLowerCase()),
        )
      ) {
        const fileName = getPathBaseName(filePath);
        displayNotification(
          `Ignored new file "${fileName}" (matched ignored suffix)`,
          true,
        );
        return;
      }
      // --- end modification ---

      if (belongsToCurrentWorkspace) {
        const result = addFile(filePath, true, true, false);
        if (result) {
          console.log('Automatically added new file to current workspace:', filePath);

          const fileName = getPathBaseName(filePath);
          displayNotification(`Added ${fileName} to the context list.`, true);

          const newFile = filesRef.value.find(f => getFileObjPath(f) === filePath);
          if (newFile && refreshContentUtils) {
            refreshContentUtils.addFileWatcher(newFile);

            const dirPath = filePath.substring(0, filePath.lastIndexOf(pathSeparator));
            if (dirPath) {
              refreshContentUtils.addDirectoryWatcher(dirPath);
            }
          }
        }
      } else {
        console.log(
          'Ignoring new file as it does not belong to current workspace:',
          filePath,
          'Common prefix:',
          workspaceCommonPrefix,
        );
      }
    }
  };

// ... unchanged code below ...
```