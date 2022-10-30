#! /usr/bin/env node
import commander from "commander";
// import fs and path modules
import fs = require("fs");
import path = require("path");
import figlet = require("figlet");

interface Options {
  ls: string;
  mkdir: string;
  touch: string;
}


console.log(figlet.textSync("Dir Manager"));

const program = new commander.Command();

program
  .version("1.0.0")
  .description("An example CLI for managing a directory")
  .option("-l, --ls  [value]", "List directory contents")
  .option("-m, --mkdir <value>", "Create a directory")
  .option("-t, --touch <value>", "Create a file")
  .parse(process.argv);

const options: Options = program.opts();

//define the following function
async function listDirContents(filepath: string) {
  try {
    // add the following
    const files = await fs.promises.readdir(filepath);
    const detailedFilesPromises = files.map(async (file: string) => {
      const fileDetails = await fs.promises.lstat(path.resolve(filepath, file));
      const { size, birthtime } = fileDetails;
      return { filename: file, "size(KB)": size, created_at: birthtime };
    });
    const detailedFiles = await Promise.all(detailedFilesPromises);
    console.table(detailedFiles);
  } catch (error) {
    console.error("Error occurred while reading the directory!", error);
  }
}


// create the following function
function createDir(filepath: string) {
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath);
    console.log("The directory has been created successfully");
  }
}

function createFile(filepath: string) {
  fs.openSync(filepath, "w");
  console.log("An empty file has been created");
}

if (options.ls) {
  const filepath = typeof options.ls === "string" ? options.ls : __dirname;
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  listDirContents(filepath);
}
if (options.mkdir) {
  createDir(path.resolve(__dirname, options.mkdir));
}
if (options.touch) {
  createFile(path.resolve(__dirname, options.touch));
}

if (!process.argv.slice(2).length) {
  program.outputHelp();
}