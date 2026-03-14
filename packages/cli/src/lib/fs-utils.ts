import { lstatSync, readdirSync, readFileSync, readlinkSync } from 'node:fs';
import { join } from 'node:path';

export function hasAnyFiles(dirPath: string): boolean {
  try {
    const items = readdirSync(dirPath);
    for (const item of items) {
      const itemPath = join(dirPath, item);
      const stats = lstatSync(itemPath);
      if (stats.isFile() || stats.isSymbolicLink()) return true;
      if (stats.isDirectory() && hasAnyFiles(itemPath)) return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function arePathsEquivalent(path1: string, path2: string): boolean {
  try {
    const stats1 = lstatSync(path1);
    const stats2 = lstatSync(path2);
    
    if (stats1.isDirectory() && stats2.isDirectory()) {
      const items1 = readdirSync(path1).sort();
      const items2 = readdirSync(path2).sort();
      
      if (items1.length !== items2.length) return false;
      if (JSON.stringify(items1) !== JSON.stringify(items2)) return false;
      
      return items1.every(item => 
        arePathsEquivalent(join(path1, item), join(path2, item))
      );
    }
    
    if (stats1.isFile() && stats2.isFile()) {
      if (stats1.size !== stats2.size) return false;
      const content1 = readFileSync(path1);
      const content2 = readFileSync(path2);
      return content1.equals(content2);
    }
    
    if (stats1.isSymbolicLink() && stats2.isSymbolicLink()) {
      return readlinkSync(path1) === readlinkSync(path2);
    }
    
    return false;
  } catch {
    return false;
  }
}
