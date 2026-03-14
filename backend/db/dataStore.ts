import { DataStore } from '../interfaces.ts';
import fs from 'fs';
import path from "path";
const dataFile = path.join(process.cwd(), 'dataFile.json');



// YOU MAY MODIFY THIS OBJECT ABOVE

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
  let store = getData()
  console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

  store.names.pop() // Removes the last name from the names array
  store.names.push('Jake') // Adds 'Jake' to the end of the names array

  console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
*/

// Use getData() to access the data
/*
function getData() {
  return data;
}
*/

let cachedData: DataStore = readDataFile(); // Load once at startup

function readDataFile(): DataStore {
  try {
    const data = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    console.error('Error while reading data file:', e);
    return defaultData();
  }
}

function defaultData(): DataStore {
  return {
    users: [],
    events: [],
    recipes: []
  };
}

function loadData(): DataStore {
  return cachedData;
}


function writeDataFile(data: DataStore): void {
  cachedData = data; // Update memory cache
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

export {loadData, writeDataFile };

