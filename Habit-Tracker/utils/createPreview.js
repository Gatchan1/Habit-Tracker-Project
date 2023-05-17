//Create the table from here??

function createPreview() {

const today = luxon.DateTime.local();
const monday = currentDate.startOf('week');
const weekDates = [];

// Populate the weekDates array with the dates of the current week (Monday to Sunday)
for (let i = 0; i < 7; i++) {
  const date = startOfWeek.plus({ days: i });
  weekDates.push(date.toFormat('yyyy-MM-dd'));
}

// Create the table
const table = document.createElement('table');
const headerRow = document.createElement('tr');

// Create the header cells (Mo, Tu, We, etc.)
for (const day of weekDates) {
  const headerCell = document.createElement('th');
  headerCell.textContent = luxon.DateTime.fromISO(day).toFormat('ccc');
  headerRow.appendChild(headerCell);
}

table.appendChild(headerRow);

// Iterate over the dates of the current week and check if they exist in the dateArray
for (const date of weekDates) {
  const row = document.createElement('tr');

  for (const day of weekDates) {
    const cell = document.createElement('td');
    if(dateArray.includes(day)){
        //<td><div class="circle fill-circle"></div></td>
        cell.textContent = exists ? 'Exists' : 'Does not exist';
        row.appendChild(cell);
    } 
    else{} //<td><div class="circle"></div></td>
  }
  table.appendChild(row);
}

// Append the table to a container element in the HTML
const container = document.getElementById('weeklyProgress'); 
container.appendChild(table);
  }

  module.exports = createPreview;
  