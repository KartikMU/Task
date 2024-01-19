// This section contains logic for eventListener which acts on event "DOMConentLoaded"
// This event works when HTML document is completely loaded.
// Contains a callback function which initiates fetchData function(to fetch data when page loads) which gets called when elements like launchYear, LaunchSuccess, etc. are interacted.
document.addEventListener('DOMContentLoaded', function () {
    fetchData();

    document.getElementById('launchYear').addEventListener('input', fetchData);
    document.getElementById('launchSuccess').addEventListener('change', fetchData);
    document.getElementById('searchCategory').addEventListener('change', fetchData);
    document.getElementById('searchQuery').addEventListener('input', fetchData);
});

// Based on filters(launchYear and launchSuccess) and search options , fetchData function fetches data from SpaceX API as provided.
function fetchData() {
    const launchYear = document.getElementById('launchYear').value.trim();
    const launchSuccess = document.getElementById('launchSuccess').value.trim();
    const searchCategory = document.getElementById('searchCategory').value.trim();
    const searchQuery = document.getElementById('searchQuery').value.trim();

    
    let apiUrl = 'https://api.spacexdata.com/v3/launches?';

    if (launchYear !== '') {
        apiUrl += `&launch_year=${launchYear}`;
    }

    if (launchSuccess !== '') {
        apiUrl += `&launch_success=${launchSuccess}`;
    }

    if (searchQuery !== '') {
        apiUrl += `&${searchCategory}=${searchQuery}`;
    }

    // Here fetch API is used to make request to SpaceX API and if it gets successful response it converts into JSON format.
    // Calls displayResults function to retrieves data and if any error comes it shows that error-text "Error fetching data" in console. 
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => displayResults(data))
        .catch(error => console.error('Error fetching data:', error));
}

// displayResults function is used to display the fetched data on the webpage.
//a.) Function shows "No results found" message on webpage if their is no data corresponding to filters and search criteria applied.
//b.) Function shows fetched data in dynamic table form if their is some data corresponding to filters and search criteria applied.  
function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (data.length === 0) {
        resultsDiv.innerHTML = '<p>No results found.</p>';
        return;
    }

    // dynamic table to display results.
    const table = document.createElement('table');
    table.className = 'table table-striped';

    // table header elements such as Flight Number, Mission Name, etc for each column. are created. 
    const headerRow = table.createTHead().insertRow();
    headerRow.innerHTML = '<th>Flight Number</th><th>Mission Name</th><th>Rocket Name</th><th>Launch Year</th><th>Status</th>';

    // table body.
    const tbody = table.createTBody();

    // To insert data into table rows
    data.forEach(item => {
        const row = tbody.insertRow();

        // adds Flight Number
        row.insertCell().textContent = item.flight_number;

        // adds Mission Name
        row.insertCell().textContent = item.mission_name;

        // adds Rocket Name
        row.insertCell().textContent = item.rocket.rocket_name;

        // adds Launch Year
        row.insertCell().textContent = item.launch_year;

        // shows Status of Mission and Rocket in color: a.) Green: If status is "Success", then it is shown in green color. b.) Red: If status is "Failure", then it is shown in red color.
        const statusCell = row.insertCell();
        statusCell.textContent = item.launch_success ? 'Success' : 'Failure';
        statusCell.style.color = item.launch_success ? 'green' : 'red';
    });

    resultsDiv.appendChild(table);
}
