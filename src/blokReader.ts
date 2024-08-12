import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import useTransformer from './transformer';
import type { Callback, BlokBundle } from './types';

const getFileName = (path: string) => {
  let name = '';
  const splitPath = path.split('/');
  name = splitPath[splitPath.length - 1];
  name = name.split('.')[0];
  return name;
}

const scanFile = (filePath: string, callback: Callback) => {
  const transformer = useTransformer(callback);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const s = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.ES5);
  const { transformed }: any = ts.transform(s, [transformer]); //we dont need to store trasnformed code since we just scan, but lets leave it for now :)
}

const getFilePathsRecursively = (folderPath: string): string[] => {
  let fileList: string[] = [];

  // Get all files and directories in the current folder
  const items = fs.readdirSync(folderPath);

  items.forEach(item => {
    const itemPath = path.join(folderPath, item);

    // Check if it's a directory
    if (fs.statSync(itemPath).isDirectory()) {
      // Recursively read files in the nested folder
      fileList = fileList.concat(getFilePathsRecursively(itemPath));
    } else {
      // It's a file, add it to the list
      fileList.push(itemPath);
    }
  });

  return fileList;
}

/**
 * Gathers all the config defintions in the stated project path (set it in .env)
 * 
 *  @returns {BlokBundle[] } list of all blok bundles that contains file data and the blok definition
 */
const getAllBlokConfigs = () => {
  const blokBundles: BlokBundle[] = [];
  const folderPath = process.env.PROJECT_PATH || './';
  console.log('\nblok reader:')

  try {
    console.log('   > reading directory ' + folderPath)
    const files = getFilePathsRecursively(folderPath);
    files.forEach((filePath: string) => {

      const callback: Callback = (definition) => {
        blokBundles.push({
          file: {
            path: filePath,
            name: getFileName(filePath)
          },
          definition
        });
      }

      scanFile(filePath, callback);
    })

    console.log('   > blok data gathered successfully')

  } catch (error: any) {
    console.error('   > error occured while reading files: \n', error.message);
    return null;
  }

  return blokBundles;
}

export { getAllBlokConfigs };
