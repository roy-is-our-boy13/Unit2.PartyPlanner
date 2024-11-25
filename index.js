const COHORT = `2109-CPU-RM-WEB-PT`;
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const form = document.getElementById("PartyForm");
const list = document.getElementById("listOfParties");

form.addEventListener("submit", inputPartyDetails);

let parties = [];

async function fetchTheListOfParties()
{
    try
    {
        const response = await fetch(API_URL);

        if(!response.ok)
        {
            throw new Error("There was an error while trying to fetch the list of party.");
        }

        const result = await response.json();

        if (result.data) 
        {
            parties = Array.isArray(result.data) ? result.data : [result.data];
        } 
        else 
        {
            console.warn("No data was found.");
            parties = [];
        }
        
        render();
    }
    catch(error)
    {
        console.error(error);
    }
}

async function addParty(name, date, location, description)
{
    try
    {
        const response = await fetch(API_URL, 
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
            {
                name,
                date: new Date().toISOString(), 
                location, 
                description
            }),
        });

        console.log(JSON.stringify({ name, date, location, description }));

        const json = await response.json();

        console.log("Response from server:", json);

        console.log(json);

        if (json.error)
        {
            throw new Error(json.error);
        }

        if (!Array.isArray(parties)) 
        {
            parties = [];
        }

        parties.push(json);
        
        render();
    }
    catch(error)
    {
        console.error(error);
    }
}

async function deleteParty(id)
{
    try
    {
        const response = await fetch(`${API_URL}/${id}`, 
        {
            method: "DELETE",
        });

        if(!response.ok)
        { 
            throw new Error("There was an error while trying to delete the party event.");
        }

        const newPartiesList = [];

        for (let i = 0; i < parties.length; i++) 
        {
            const party = parties[i];

            if (party.id !== id) 
            {
                newPartiesList.push(party);
            }
        }
        
        parties = newPartiesList;

        location.reload();
        render();
    }
    catch(error)
    {
        console.error(error);
    }
}

async function render()
{
    list.innerHTML = "";
    
    let redloadScreen = false;

    for (let i = 0; i < parties.length; i++)
    {
        console.log(`Party ${i}:`, parties[i]);
    
        const item = document.createElement("div");

        item.className = "partyItem";
        item.innerHTML = `
            <h3>${parties[i].name }</h3>
            <p><strong>Date:</strong> ${new Date(parties[i].date).toLocaleString()}</p>
            <p><strong>Location:</strong> ${parties[i].location}</p>
            <p>${parties[i].description}</p>
            <button class="colorButton" onclick="deleteParty('${parties[i].id}')">Delete</button>`;
        list.appendChild(item);

        if(!redloadScreen)
        {
            //location.reload();
            redloadScreen = true;
        }
    }
}

async function inputPartyDetails(event)
{
    event.preventDefault()

    const nameOfParty = document.getElementById("partyName").value;
    const dateAndTimeOfParty = document.getElementById("DatetimeLocal").value;
    const partyLocation  = document.getElementById("location").value;
    const descriptionOfParty = document.getElementById("description").value;

    addParty(nameOfParty, dateAndTimeOfParty, partyLocation, descriptionOfParty);
    form.reset();
    location.reload();
}

fetchTheListOfParties();