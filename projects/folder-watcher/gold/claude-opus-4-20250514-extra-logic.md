```ts
// use/useFileOperations.ts

// In handleNewFileDetected function, after checking if file belongs to workspace:
if (belongsToCurrentWorkspace) {
  // Check ignored suffixes before adding
  const suffixesToIgnore = getIgnoredSuffixes(ignoredSuffixesRef.value);
  const fileName = getPathBaseName(filePath);
  
  if (suffixesToIgnore.some(suffix => filePath.toLowerCase().endsWith(suffix.toLowerCase()))) {
    displayNotification(`File ${fileName} was not added (ignored suffix).`, true);
    return;
  }
  
  // Check ignored folders
  const ignoredFolders = getIgnoredFolders(ignoredFoldersRef.value);
  if (ignoredFolders.some(folder => filePath.includes(folder))) {
    displayNotification(`File ${fileName} was not added (in ignored folder).`, true);
    return;
  }

  // Add the new file with includeInCodeContext set to true
  const result = addFile(filePath, true, true, false);
  // ... rest of the code remains the same
```