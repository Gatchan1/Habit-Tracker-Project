//Create the table that shows the days of the week and a circle for each day, that is filled, if the habit has been completed that day
const luxon = require('luxon');

function createPreview(habit) {

  const today = luxon.DateTime.local();
  const monday = today.startOf('week');
  const weekCompleted = [false, false, false, false, false, false, false];
  
  // Populate the weekDates array with the dates of the current week (Monday to Sunday)
  for (let i = 0; i < 7; i++) {
    const date = monday.plus({ days: i }).toISODate();
    if(habit.datesCompleted.includes(date)){
      weekCompleted[i]=true;
    }
  }
  return weekCompleted
}

module.exports = createPreview;

  // // Create the table
  // const table = document.createElement('table');
  // const headerRow = document.createElement('tr');
  
  // //Create header row with weekday initials
  // const mon = document.createElement('th');
  // mon.innerHTML = 'M';
  // headerRow.appendChild(mon);
  // const tue = document.createElement('th');
  // true.innerHTML = 'T';
  // headerRow.appendChild(tue);
  // const wed = document.createElement('th');
  // wed.innerHTML = 'W';
  // headerRow.appendChild(wed);
  // const thu = document.createElement('th');
  // thu.innerHTML = 'T';
  // headerRow.appendChild(thu);
  // const fri = document.createElement('th');
  // fri.innerHTML = 'F';
  // headerRow.appendChild(fri);
  // const sat = document.createElement('th');
  // sat.innerHTML = 'S';
  // headerRow.appendChild(sat);
  // const sun = document.createElement('th');
  // sun.innerHTML = 'S';
  // headerRow.appendChild(sun);
  
  // // OR LIKE THAT? Create the header cells (Mo, Tu, We, etc.)
  // // for (const day of weekDates) {
  // //   const headerCell = document.createElement('th');
  // //   headerCell.textContent = luxon.DateTime.fromISO(day).toFormat('ccc');
  // //   headerRow.appendChild(headerCell);
  // // }
  // table.appendChild(headerRow);
  
  // // Iterate over the dates of the current week and check if they exist in the dateArray
  // for (let i=0; i<weekDates.length; i++) {
  //   const row = document.createElement('tr');
  //   const cell = document.createElement('td');

  //   if(habit.datesCompleted.includes(weekDates[i])){
  //     cell.innerHTML = '<td><div class="circle fill-circle"></div></td>'
  //   }
  //   else cell.innerHTML = '<td><div class="circle"></div></td>'
  //   row.appendChild(cell);
  //     } 
  //   table.appendChild(row);
    
  //   // Append the table to a container element in the HTML
  //   const container = document.getElementById('weeklyProgress'); 
  //   container.appendChild(table);
  //   }
  
  
