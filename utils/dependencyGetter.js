import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";


// Directory for DevSnap metadata
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __rootDir = path.resolve(__dirname, "..");
const DEV_SNAP_DIR = path.join(__rootDir, ".devsnap");


// node dependency getter
const nodeDependecyGetter = () => {


  // node tester
  const nodeTester = process.version || '';
  const nodepackage = {
    dependencies: [],
    engine: ''
  }
  const checkedFramTime = nodeTester !== '' ? 'node' : '';
  const entries = fs.readdirSync(__rootDir, { withFileTypes: true });
  let packageJson = null;

  for (const entry of entries) {
    if (entry.name == "package.json") {
      const packagePath = path.join(__rootDir, entry.name)
      const packagePathObj = JSON.parse(fs.readFileSync(packagePath, "utf-8"))
      packageJson = Object.keys(packagePathObj.dependencies)
    }
  }

  nodepackage.dependencies = packageJson
  nodepackage.engine = checkedFramTime
  return nodepackage;
}

const pythonDependecyGetter = () => {
  const pythonPackage = {
    dependencies: [],
    engine: ''
  }
  const entries = fs.readdirSync(__rootDir, { withFileTypes: true });
  let requirements = null;

  for (const entry of entries) {
    if (entry.name == "requirements.txt") {
      const packagePath = path.join(__rootDir, entry.name)
      const packagePathObj = fs.readFileSync(packagePath, "utf-8")
      requirements = packagePathObj.split('\n')
    } else {
      requirements = []
    }
  }

  pythonPackage.dependencies = requirements
  pythonPackage.engine = 'python'
  return pythonPackage;
}



export { nodeDependecyGetter }