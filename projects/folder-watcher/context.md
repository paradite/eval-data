use/useFileOperations.ts
```ts
import {Ref, nextTick, ref, watch, watchEffect} from 'vue';

import {
  fileOperations,
  isDirectory,
  isFile,
  getDirectoryFilesFullPath,
  getCurrentTime,
  getFilePathsInFolder,
  getCommonPathPrefix,
  pathSeparator,
  joinPath,
  normalizePath,
} from '#preload';
import type {FileObj, FileObjs, FolderType, StoreType, Workspace} from '#preload';
import {getFileObjPath} from '../util/getFileObjPath';
import {saveConfiguration, readFile, getPathBaseName} from '#preload';
import {
  BINARY_FILE_REGEX,
  FONT_FILE_REGEX,
  IGNORED_FILES,
  IMAGE_FILE_REGEX,
  MAX_FILE_LENGTH,
  VIDEO_FILE_REGEX,
} from '../constants/limit';
import {useNotification} from '/@/use/useNotification';
import {refreshContent} from '../util/refreshContent';
import {formatSize} from '../util/formatNumber';
import {getIgnoredFolders, getIgnoredSuffixes} from '../util/ignorePattern';

const {displayNotification} = useNotification();

export function useFileOperations(
  config: StoreType,
  workspaces: Ref<Workspace[]>,
  activeWorkspaceName: Ref<string>,
) {
  const files = fileOperations(config.workspaces, activeWorkspaceName.value);
  const filesRef: Ref<FileObjs> = ref(files);

  const ignoredSuffixesRef = ref(config.ignoredSuffixes || '');
  const ignoredFoldersRef = ref(config.ignoredFolders || '');

  const folderStructureRef: Ref<(FileObj | FolderType)[]> = ref([]);
  const folderMapRef: Ref<Map<string, FolderType>> = ref(new Map<string, FolderType>());
  const expandedFoldersRef = ref(new Set<string>());
  const commonPathPrefixRef = ref('');
  const defaultExpandedFoldersCount = ref(0);

  const isAllParentsExpanded = (path: string, expandedFolders: Set<string>) => {
    const pathParts = path.split(pathSeparator);
    if (pathParts.length === 2 && pathParts[0] === '') return true;
    for (let i = 1; i < pathParts.length; i++) {
      const parentPath = pathParts.slice(0, i).join(pathSeparator);
      if (!expandedFolders.has(parentPath) && parentPath !== '') {
        return false;
      }
    }
    return true;
  };

  const updateCommonPathPrefix = () => {
    commonPathPrefixRef.value = getCommonPathPrefix(filesRef.value.map(f => f.path));
  };

  watchEffect(() => {
    folderMapRef.value.clear();
    folderStructureRef.value = [];
    updateCommonPathPrefix();

    const sortedFiles = filesRef.value.sort((a, b) => a.path.localeCompare(b.path));

    sortedFiles.forEach(file => {
      // const parts = file.path.split(pathSeparator);
      if (file.placeholder) {
        folderStructureRef.value.push(file);
      } else {
        const parts = file.path.substring(commonPathPrefixRef.value.length).split(pathSeparator);
        let currentPath = '';
        for (let i = 0; i < parts.length - 1; i++) {
          currentPath += (i > 0 ? pathSeparator : '') + parts[i];
          if (!folderMapRef.value.has(currentPath) && currentPath !== '') {
            const folder: FolderType = {
              type: 'folder',
              path: currentPath,
              fullPath: joinPath(commonPathPrefixRef.value, currentPath),
              name: parts[i],
              files: [],
              folders: [],
            };
            folderMapRef.value.set(currentPath, folder);
            if (currentPath.split(pathSeparator).length === 2 && parts[0] === '') {
              folderStructureRef.value.push(folder);
            } else if (currentPath.split(pathSeparator).length === 1) {
              folderStructureRef.value.push(folder);
            } else {
              const parentPath = currentPath.substring(0, currentPath.lastIndexOf(pathSeparator));
              folderMapRef.value.get(parentPath)?.folders.push(folder);
            }
          }
          if (i === parts.length - 2) {
            folderMapRef.value.get(currentPath)?.files.push(file);
          }
        }
        if (parts.length === 2 && parts[0] === '') {
          folderStructureRef.value.push(file);
        }
      }
    });

    const expandedFolders = new Set(expandedFoldersRef.value);
    folderStructureRef.value = folderStructureRef.value.filter(item => {
      if (item.type !== 'folder') return true;
      return isAllParentsExpanded(item.fullPath, expandedFolders);
    });

    // sort folderStructureRef such that folders come first
    folderStructureRef.value.sort((a, b) => {
      if (a.type === 'folder' && b.type === 'folder') {
        return a.path.localeCompare(b.path);
      }
      if (a.type === 'folder') {
        return -1;
      }
      if (b.type === 'folder') {
        return 1;
      }
      if (b.placeholder) {
        return -1;
      }
      if (a.placeholder) {
        return 1;
      }
      return a.path.localeCompare(b.path);
    });
  });

  const toggleFolder = (folderPath: string) => {
    console.log('toggleFolder', folderPath);
    if (expandedFoldersRef.value.has(folderPath)) {
      expandedFoldersRef.value.delete(folderPath);
    } else {
      expandedFoldersRef.value.add(folderPath);
    }
  };

  const toggleExpandAllFolers = () => {
    if (
      expandedFoldersRef.value.size === 0 ||
      expandedFoldersRef.value.size === defaultExpandedFoldersCount.value
    ) {
      filesRef.value.forEach(file => {
        const parts = file.path.split(pathSeparator);
        let currentPath = '';
        for (let i = 0; i < parts.length - 1; i++) {
          currentPath += (i > 0 ? pathSeparator : '') + parts[i];
          expandedFoldersRef.value.add(currentPath);
        }
      });
    } else {
      expandDefaultFolders();
    }
  };

  const expandDefaultFolders = () => {
    expandedFoldersRef.value.clear();
    expandFolderAndParents(commonPathPrefixRef.value);
    defaultExpandedFoldersCount.value = expandedFoldersRef.value.size;
  };

  const expandFolderAndParents = (folderPath: string) => {
    const parts = folderPath.split(pathSeparator);
    let currentPath = '';
    for (let i = 0; i < parts.length; i++) {
      currentPath += (i > 0 ? pathSeparator : '') + parts[i];
      expandedFoldersRef.value.add(currentPath);
    }
  };

  const expandFolderToIncludeFile = (path: string) => {
    const parts = path.split(pathSeparator);
    let currentPath = '';
    for (let i = 0; i < parts.length - 1; i++) {
      currentPath += (i > 0 ? pathSeparator : '') + parts[i];
      expandedFoldersRef.value.add(currentPath);
    }
  };

  const expandFoldersForIncludedFiles = () => {
    console.log('expandFoldersForIncludedFiles');
    expandDefaultFolders();
    filesRef.value.forEach(file => {
      if (file.includeInCodeContext) {
        expandFolderToIncludeFile(file.path);
      }
    });
  };

  expandFoldersForIncludedFiles();

  watch(activeWorkspaceName, () => {
    console.log('activeWorkspaceName changed');
    // Clean up existing watchers before switching workspace
    if (refreshContentUtils) {
      refreshContentUtils.cleanup();
    }
    expandFoldersForIncludedFiles();
    refreshContentUtils = refreshContent(filesRef, handleNewFileDetected, handleFileDeleted);
  });

  const handleFileChange = async (event: Event, fileObj: FileObj) => {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const filePath = input.files[0].path;
      const content = readFile(filePath);
      if (!content) {
        console.log('file content is empty');
        return;
      }
      const file = filesRef.value.find(f => getFileObjPath(f) === fileObj.path);
      if (file) {
        file.file = input.files[0];
        file.path = filePath;
        file.name = input.files[0].name;
        file.content = content;
        file.addedTime = getCurrentTime();
        file.placeholder = false;
        expandFolderToIncludeFile(file.path);
        persistFileChanges();
      }
    }
  };

  const persistFileChanges = () => {
    console.log('persisting file changes');
    const pathsWithIncludeExcludeInfo = filesRef.value.map(fileObj => ({
      path: getFileObjPath(fileObj),
      includeInCodeContext: fileObj.includeInCodeContext,
      addedTime: fileObj.addedTime,
    }));
    const workspace = workspaces.value.find(
      workspace => workspace.name === activeWorkspaceName.value,
    );
    if (workspace) {
      workspace.files = pathsWithIncludeExcludeInfo;

      saveConfiguration({
        workspaces: config.workspaces.map(workspace => {
          if (workspace.name === activeWorkspaceName.value) {
            return {
              ...workspace,
              files: pathsWithIncludeExcludeInfo,
            };
          }
          return workspace;
        }),
      });
    }
  };

  const processFile = (filePath: string, include: boolean, manualAdd: boolean): boolean => {
    const name = getPathBaseName(filePath);
    const content = readFile(filePath);
    if (!content) {
      displayNotification(`Adding empty file ${name}`, true);
    }
    if (IGNORED_FILES.includes(name)) {
      displayNotification(`File ${name} is automatically ignored.`, true);
      return false;
    }
    if (IMAGE_FILE_REGEX.test(name)) {
      displayNotification(`Image file ${name} is automatically ignored.`, true);
      return false;
    }
    if (VIDEO_FILE_REGEX.test(name)) {
      displayNotification(`Video file ${name} is automatically ignored.`, true);
      return false;
    }
    if (FONT_FILE_REGEX.test(name)) {
      displayNotification(`Font file ${name} is automatically ignored.`, true);
      return false;
    }
    if (BINARY_FILE_REGEX.test(name)) {
      displayNotification(`Binary file ${name} is automatically ignored.`, true);
      return false;
    }
    const length = content?.length;
    if (length && length > MAX_FILE_LENGTH) {
      displayNotification(
        `File ${name} is too long (${formatSize(length)} > ${formatSize(
          MAX_FILE_LENGTH,
        )}). Please select a smaller file.`,
        true,
      );
      return false;
    }

    // Check if the file already exists
    const existingFile = filesRef.value.find(file => getFileObjPath(file) === filePath);
    if (existingFile) {
      // Toggle the file status to selected if it is manually added existing file
      if (manualAdd) {
        existingFile.includeInCodeContext = true;
        displayNotification(`Toggled ${name} to selected.`, true);
        persistFileChanges();
      }
      // If it is not manually added, do not add it again
      return false;
    }

    filesRef.value.push({
      name,
      type: 'file',
      file: new File([filePath], name),
      includeInCodeContext: include,
      path: filePath,
      content: content || '',
      addedTime: getCurrentTime(),
    });
    expandFolderToIncludeFile(filePath);
    return true;
  };

  const addFile = (
    input: File | string,
    include: boolean,
    persist: boolean,
    manualAdd: boolean,
  ): boolean => {
    let result = false;

    if (typeof input === 'string') {
      const filePath = input;
      if (isDirectory(filePath)) {
        const files = getDirectoryFilesFullPath(filePath);
        files.forEach(file => {
          if (isFile(file)) {
            result = processFile(file, include, manualAdd);
          }
        });
      } else {
        result = processFile(filePath, include, manualAdd);
      }
    } else {
      const file = input;
      const filePath = file.path;
      if (isDirectory(filePath)) {
        const files = getDirectoryFilesFullPath(filePath);
        files.forEach(file => {
          if (isFile(file)) {
            result = processFile(file, include, manualAdd);
          }
        });
      } else {
        result = processFile(filePath, include, manualAdd);
      }
    }

    if (result) {
      updateCommonPathPrefix();
      expandFolderToIncludeFile(typeof input === 'string' ? input : input.path);
    }

    if (persist) {
      persistFileChanges();
    }

    return result;
  };

  // Store the refresh content utilities
  let refreshContentUtils:
    | {
        addFileWatcher: (file: FileObj) => void;
        addDirectoryWatcher: (dirPath: string) => void;
        cleanup: () => void;
      }
    | undefined;

  // Callback function to handle newly detected files
  const handleNewFileDetected = (filePath: string) => {
    // Check if file is already in the list
    const existingFile = filesRef.value.find(f => getFileObjPath(f) === filePath);
    if (!existingFile) {
      // Check if the detected file belongs to the current workspace
      // by using the already calculated commonPathPrefixRef
      const workspaceFiles = filesRef.value.filter(f => !f.placeholder);

      // If no files in workspace, don't add any new files automatically
      if (workspaceFiles.length === 0) {
        console.log('Ignoring new file as workspace is empty:', filePath);
        return;
      }

      // Use the existing commonPathPrefixRef to check if file belongs to workspace
      const workspaceCommonPrefix = commonPathPrefixRef.value;
      const normalizedFilePath = normalizePath(filePath);
      const normalizedCommonPrefix = normalizePath(workspaceCommonPrefix);

      const belongsToCurrentWorkspace = normalizedFilePath.startsWith(normalizedCommonPrefix);

      if (belongsToCurrentWorkspace) {
        // Add the new file with includeInCodeContext set to true
        const result = addFile(filePath, true, true, false);
        if (result) {
          console.log('Automatically added new file to current workspace:', filePath);

          const fileName = getPathBaseName(filePath);
          displayNotification(`Added ${fileName} to the context list.`, true);

          // Find the newly added file and set up watching for it
          const newFile = filesRef.value.find(f => getFileObjPath(f) === filePath);
          if (newFile && refreshContentUtils) {
            refreshContentUtils.addFileWatcher(newFile);

            // Also add directory watcher for the new file's directory
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

  // Callback function to handle deleted files
  const handleFileDeleted = (filePath: string) => {
    // Find the file in the context list
    const fileIndex = filesRef.value.findIndex(f => getFileObjPath(f) === filePath);
    if (fileIndex !== -1) {
      const fileName = getPathBaseName(filePath);

      // Remove the file from the context list
      filesRef.value.splice(fileIndex, 1);

      console.log('Automatically removed deleted file from context:', filePath);
      displayNotification(`Removed ${fileName} from the context list (file was deleted).`, true);

      // Persist the changes
      persistFileChanges();
    }
  };

  // Initialize content watching with the callbacks
  refreshContentUtils = refreshContent(filesRef, handleNewFileDetected, handleFileDeleted);

  const addFolder = (paths: string[], recursive: boolean, includeNewFiles: boolean) => {
    const suffixesToIgnore = getIgnoredSuffixes(ignoredSuffixesRef.value);
    const ignoredFolders = getIgnoredFolders(ignoredFoldersRef.value);
    const files = getFilePathsInFolder(paths, recursive);
    let addedFiles = 0;
    let removedFiles = 0;
    const LIMIT = 500;

    // Remove files that don't exist from filesRef
    filesRef.value = filesRef.value.filter(file => {
      const filePath = getFileObjPath(file);
      const fileExists = isFile(filePath);
      if (!fileExists) {
        removedFiles++;
      }
      return fileExists;
    });

    for (const filePath of files) {
      if (addedFiles >= LIMIT) {
        displayNotification(
          `Only ${LIMIT} files can be added at a time. Please add more files in batches.`,
          true,
        );
        break;
      }

      if (
        isFile(filePath) &&
        !suffixesToIgnore.some(suffix => filePath.toLowerCase().endsWith(suffix.toLowerCase())) &&
        // folder is not in the ignored list
        !ignoredFolders.some(folder => filePath.includes(folder))
      ) {
        const result = addFile(filePath, includeNewFiles, false, false);
        if (result) {
          addedFiles++;
          console.log('added file:', filePath);
        } else {
          console.log('file not added:', filePath);
        }
      }
    }

    // display notification for files added and removed
    displayNotification(
      `Added ${addedFiles} file${addedFiles === 1 ? '' : 's'} and removed ${removedFiles} file${
        removedFiles === 1 ? '' : 's'
      }.`,
      true,
    );

    persistFileChanges();
  };

  const updateIgnoredSuffixes = (newSuffixes: string) => {
    ignoredSuffixesRef.value = newSuffixes;
    saveConfiguration({
      ignoredSuffixes: newSuffixes,
    });
  };

  const updateIgnoredFolders = (newFolders: string) => {
    ignoredFoldersRef.value = newFolders;
    saveConfiguration({
      ignoredFolders: newFolders,
    });
  };

  const addNewFileInput = () => {
    filesRef.value.push({
      file: null,
      type: 'file',
      includeInCodeContext: true,
      path: '',
      content: '',
      addedTime: getCurrentTime(),
      placeholder: true,
    });
    nextTick(() => {
      const fileInputs = document.querySelectorAll<HTMLInputElement>('[type="file"]');
      const lastFileInput = fileInputs[fileInputs.length - 1];
      lastFileInput.click();
    });
  };

  const removeFile = (fileObj: FileObj) => {
    const index = filesRef.value.findIndex(f => getFileObjPath(f) === getFileObjPath(fileObj));
    filesRef.value.splice(index, 1);
    persistFileChanges();
  };

  const updateFiles = (newFiles: FileObj[]) => {
    filesRef.value = newFiles;
    // Clean up existing watchers before updating files
    if (refreshContentUtils) {
      refreshContentUtils.cleanup();
    }
    refreshContentUtils = refreshContent(filesRef, handleNewFileDetected, handleFileDeleted);
    persistFileChanges();
  };

  const clearFiles = () => {
    if (
      confirm(
        'Are you sure you want to remove all files from the list? The context list will be empty.',
      )
    ) {
      // Clean up existing watchers before clearing files
      if (refreshContentUtils) {
        refreshContentUtils.cleanup();
      }
      filesRef.value = [];
      persistFileChanges();
    }
  };

  const removeDuplicateFiles = () => {
    // remove duplicate files while preserving the order
    const seen = new Set();
    filesRef.value = filesRef.value.filter(file => {
      const path = getFileObjPath(file);
      if (seen.has(path)) {
        return false;
      }
      seen.add(path);
      return true;
    });
    // Clean up existing watchers before removing duplicates
    if (refreshContentUtils) {
      refreshContentUtils.cleanup();
    }
    refreshContentUtils = refreshContent(filesRef, handleNewFileDetected, handleFileDeleted);
    persistFileChanges();
  };

  const uncheckAllFiles = () => {
    filesRef.value.forEach(file => {
      file.includeInCodeContext = false;
    });
    persistFileChanges();
  };

  // Cleanup function to be called when component unmounts
  const cleanup = () => {
    if (refreshContentUtils) {
      refreshContentUtils.cleanup();
    }
  };

  return {
    filesRef,
    ignoredSuffixesRef,
    ignoredFoldersRef,
    handleFileChange,
    persistFileChanges,
    addNewFileInput,
    removeFile,
    updateFiles,
    addFile,
    clearFiles,
    removeDuplicateFiles,
    uncheckAllFiles,
    addFolder,
    updateIgnoredSuffixes,
    updateIgnoredFolders,
    folderMapRef,
    folderStructureRef,
    toggleExpandAllFolers,
    expandedFoldersRef,
    toggleFolder,
    commonPathPrefixRef,
    defaultExpandedFoldersCount,
    cleanup,
  };
}
```

util/refreshContent.ts
```ts
import type {Ref} from 'vue';
import {
  getFileName,
  getFileDirectory,
  readFile,
  unwatchFile,
  watchFile,
  watchDirectory,
  isFile,
  joinPath,
} from '#preload';
import type {FSWatcher, FileObj} from '#preload';
import {getFileObjPath} from './getFileObjPath';
import {useNotification} from '/@/use/useNotification';
const {displayNotification} = useNotification();

export const refreshContent = (
  selectedFiles: Ref<FileObj[]>,
  onNewFileDetected?: (filePath: string) => void,
  onFileDeleted?: (filePath: string) => void,
) => {
  // Create local watcher storage for this instance
  const watchers: {[key: string]: FSWatcher} = {};
  const directoryWatchers: {[key: string]: FSWatcher} = {};

  // Cleanup function to remove all watchers
  const cleanup = () => {
    Object.keys(watchers).forEach(key => {
      unwatchFile(watchers[key]);
      delete watchers[key];
    });

    Object.keys(directoryWatchers).forEach(key => {
      unwatchFile(directoryWatchers[key]);
      delete directoryWatchers[key];
    });
  };

  const updateFileContent = (file: FileObj) => {
    const filePath = getFileObjPath(file);
    const content = readFile(filePath);
    if (!content) {
      console.warn('file content is empty');
      return;
    }
    file.content = content;
  };

  // Function to add a file watcher for a specific file
  const addFileWatcher = (file: FileObj) => {
    const filePath = getFileObjPath(file);

    // Don't add watcher if it already exists
    if (watchers[filePath]) {
      return;
    }

    const watcher = watchFile(filePath, eventType => {
      if (eventType === 'change') {
        const content = readFile(filePath);
        if (!content) {
          console.warn('file content is empty');
          return;
        }
        file.content = content;
        displayNotification(`File ${getFileName(filePath)} has been updated`, true);
      } else if (eventType === 'rename') {
        // File was deleted or moved
        if (!isFile(filePath) && onFileDeleted) {
          onFileDeleted(filePath);
        }
      }
    });
    if (watcher) {
      watchers[filePath] = watcher;
    }
  };

  const files = selectedFiles.value;
  const includedFiles = files.filter(file => file.file && file.includeInCodeContext);
  console.log(`refreshing ${includedFiles.length} files`);

  // Get unique directories from included files
  const watchedDirectories = new Set<string>();

  includedFiles.forEach(file => {
    updateFileContent(file);
    const filePath = getFileObjPath(file);

    // Watch individual file for changes
    addFileWatcher(file);

    // Add directory to watch list
    const dirPath = getFileDirectory(filePath);
    if (dirPath && !watchedDirectories.has(dirPath)) {
      watchedDirectories.add(dirPath);
    }
  });

  // watch all directories in the context list
  selectedFiles.value.forEach(file => {
    const dirPath = getFileDirectory(getFileObjPath(file));
    if (dirPath && !watchedDirectories.has(dirPath)) {
      watchedDirectories.add(dirPath);
    }
  });

  // Watch directories for new files and deletions
  if (onNewFileDetected || onFileDeleted) {
    watchedDirectories.forEach(dirPath => {
      const dirWatcher = watchDirectory(dirPath, (eventType, filename) => {
        if (eventType === 'rename' && filename) {
          const filePath = joinPath(dirPath, filename);
          // Check if it's a new file (not a deletion)
          if (isFile(filePath) && onNewFileDetected) {
            onNewFileDetected(filePath);
          } else if (!isFile(filePath) && onFileDeleted) {
            // File was deleted - check if it was in our context list
            const wasInContext = selectedFiles.value.some(
              file => getFileObjPath(file) === filePath,
            );
            if (wasInContext) {
              onFileDeleted(filePath);
            }
          }
        }
      });

      if (dirWatcher) {
        directoryWatchers[dirPath] = dirWatcher;
      }
    });
  }

  // Function to add a directory watcher for a specific directory
  const addDirectoryWatcher = (dirPath: string) => {
    // Don't add watcher if it already exists or if no callback is provided
    if (directoryWatchers[dirPath] || (!onNewFileDetected && !onFileDeleted)) {
      return;
    }

    const dirWatcher = watchDirectory(dirPath, (eventType, filename) => {
      if (eventType === 'rename' && filename) {
        const filePath = joinPath(dirPath, filename);
        // Check if it's a new file (not a deletion)
        if (isFile(filePath) && onNewFileDetected) {
          onNewFileDetected(filePath);
        } else if (!isFile(filePath) && onFileDeleted) {
          // File was deleted - check if it was in our context list
          const wasInContext = selectedFiles.value.some(file => getFileObjPath(file) === filePath);
          if (wasInContext) {
            onFileDeleted(filePath);
          }
        }
      }
    });

    if (dirWatcher) {
      directoryWatchers[dirPath] = dirWatcher;
    }
  };

  // Return functions to add individual file and directory watchers, plus cleanup
  return {
    addFileWatcher: (file: FileObj) => addFileWatcher(file),
    addDirectoryWatcher: (dirPath: string) => addDirectoryWatcher(dirPath),
    cleanup,
  };
};
```