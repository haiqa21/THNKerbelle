import { DataStore } from '../interfaces';
import fs from 'fs';

// YOU MAY MODIFY THIS OBJECT BELOW
let data = {
  users: [],
  events: []
};

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
function getData() {
  return data;
}

function loadData() {
  const dataString = fs.readFileSync('./database.json', 'utf-8');
  data = JSON.parse(dataString);
}

function saveData() {
  const dataStore = getData();
  const dataString = JSON.stringify(dataStore, null, 2);
  fs.writeFileSync('./database.json', dataString);
}

export { getData, loadData, saveData };
