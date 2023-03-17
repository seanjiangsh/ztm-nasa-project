const API_URL = "http://localhost:5000";

async function httpGetPlanets() {
  // * Load planets and return as JSON.
  try {
    const response = await fetch(`${API_URL}/planets`);
    return await response.json();
  } catch (err) {
    console.error(err);
  }
}

async function httpGetLaunches() {
  // * Load launches, sort by flight number, and return as JSON.
  try {
    const response = await fetch(`${API_URL}/launches`);
    const launchJson = await response.json();
    return launchJson.sort((a, b) => a.flightNumber - b.flightNumber);
  } catch (err) {
    console.error(err);
  }
}

async function httpSubmitLaunch(launch) {
  // * Submit given launch data to launch system.
  try {
    const fetchInit = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(launch),
    };
    const res = await fetch(`${API_URL}/launches`, fetchInit);
    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function httpAbortLaunch(id) {
  // * Delete launch with given ID.
  try {
    const fetchInit = { method: "DELETE" };
    const res = await fetch(`${API_URL}/launches/${id}`, fetchInit);
    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
