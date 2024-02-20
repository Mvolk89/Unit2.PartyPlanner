const API_URL = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2311-FTB-MT-WEB-PT/events";

const state = {
  events: [],
};

const eventList = document.querySelector("#events");

const addEventForm = document.querySelector("#addEvent");
addEventForm.addEventListener("submit", addEvents);

async function render() {
  try {
    await getEvents(); 
    renderEvents(); 
  } catch (error) {
    console.error("Error rendering events:", error); 
  }
}
render();

async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.events = json.data; 
  } catch (error) {
    throw new Error("Error fetching events:", error);
  }
}

function renderEvents() { 
    if (!state.events.length) {
      eventList.innerText = ""; 
      return;
    }
  
    const eventItems = state.events.map((event) => { 
      const li = document.createElement("li");
      li.innerText = `
        ${event.name}
        Date: ${new Date(event.date).toLocaleDateString()} /
        Location: ${event.location} 
        Description: ${event.description} 
      `;
  
      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Delete";
      deleteButton.addEventListener("click", () => deleteEvents(event.id));
  
      li.appendChild(deleteButton);
      return li;
    });
  
    eventList.replaceChildren(...eventItems);
  }
  

async function addEvents(event) { 
  event.preventDefault();

  const _date = new Date(addEventForm.date.value).toISOString();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: addEventForm.id.value,
        name: addEventForm.name.value, 
        description: addEventForm.description.value,
        date: _date,
        location: addEventForm.location.value, 
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create event"); 
    }

    addEventForm.reset();

    render();
  } catch (error) {
    console.error("Error adding event:", error);
  }
}

async function deleteEvents(eventId) {
    try {
      const response = await fetch(`${API_URL}/${eventId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete event");
      }
  
      render();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  }