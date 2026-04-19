import fs from 'fs/promises';
import path from 'path';

export function pathCreate(...pathSegments) {
     const validSegments = pathSegments.filter(segment =>
     segment !== null && segment !== undefined && segment !== '');
    
     if (validSegments.length === 0) {
        throw new Error('pathCreate: нет валидных сегментов пути');}

     return path.resolve(...pathSegments);
}

export async function pathExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch (error) {
        return false;
    }};

export async function readJsonFile(filePath) {
    if (!await pathExists(filePath)) {
        throw new Error(`File not found or inaccessible: ${filePath}`);
    }
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error(`Error reading or parsing JSON file '${filePath}': ${error.message}`);
    }
}

export async function writeJsonFile(filePath, data) {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        await fs.writeFile(filePath, jsonData, 'utf8');
    } catch (error) {
        throw new Error(`Error writing file: ${error.message}`);
    }
} 

export async function addDataToJsonFile(filePath, newData) {
    try {
        const currentData = await readJsonFile(filePath);
        const updatedData = [...currentData, newData];
        await writeJsonFile(filePath, updatedData);
        return newData;
    } catch (error) {
        throw new Error(`Error appending to file: ${error.message}`);
    }
}

export async function dirfilelist(filePath) {
    try {
        const files = await fs.readdir(filePath);
        return files;
    } catch (error) {
        throw new Error(`Error reading directory: ${error.message}`);
    }
}


function compareTwoArrays(fileList, dirFiles) {
  const set = new Set(dirFiles);
  return fileList.filter(item => !set.has(item));
}

export async function initFile(dirName, fileList, defaultData = []) {
    try {
    //саздаю путь к директории
    const dirPath = pathCreate(dirName);
    //проверяю существует ли директория, если нет то создаю её
    if (!await pathExists(dirPath)) {
        await fs.mkdir(dirPath, { recursive: true });
        console.log(`Directory created: ${dirName}`);
    }
    //получаю список файлов в директории
    const dirFiles = await dirfilelist(dirPath);
    //сравниваю список файлов с переданным списком и получаю недостающие файлы 
    const missingFiles = compareTwoArrays(fileList, dirFiles);
    //создаю недостающие файлы
    if(missingFiles.length > 0){
         await Promise.all(missingFiles.map(async (file) => {
            const filePath = pathCreate(dirName, file);
            if(path.extname(filePath) === '.json'){
                  await writeJsonFile(filePath, defaultData);
            }else
          { await fs.writeFile(filePath, '', 'utf8'); }
        }));
    }
    //проверяю все файлы в директории на валидность, если файл не валидный то перезаписываю его дефолтными данными
     await Promise.all(dirFiles.map(async (file) => {
        const filePath = pathCreate(dirName, file);
         
        if(path.extname(filePath) === '.json'){
            try{
           const data = await readJsonFile(filePath);
            }catch(error){
               if (error.message.includes('Error reading or parsing JSON file')){
                await writeJsonFile(filePath, defaultData);}}}
       }));

       console.log(`initFile completed successfully`);
       

    } catch (error) {
        throw new Error(`Error initializing files: ${error.message}`);
    }
}

