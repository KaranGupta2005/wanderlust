document.addEventListener("DOMContentLoaded", async () => {
  const mapContainer = document.getElementById("map");
  if (!mapContainer) {
    console.error("Map container not found");
    return;
  }

  const mapKey = mapContainer.dataset.mapkey;
  const locationString = mapContainer.dataset.location;

  if (!mapKey || !locationString || typeof maptilersdk === "undefined") {
    console.warn("Map SDK not loaded or missing key/location.");
    mapContainer.innerHTML = "<p class='text-danger'>Map unavailable.</p>";
    return;
  }

  try {
    maptilersdk.config.apiKey = mapKey;
    const map = new maptilersdk.Map({
      container: 'map',
      style: maptilersdk.MapStyle.STREETS,
      center: [0, 0],
      zoom: 2
    });

    const resp = await fetch(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(locationString)}.json?key=${mapKey}`
    );
    const data = await resp.json();
    console.log("Geocode response:", data);

    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].geometry.coordinates;
      map.setCenter([lng, lat]);
      map.setZoom(12);
      new maptilersdk.Marker().setLngLat([lng, lat]).addTo(map);
    } else {
      console.warn("No location data found.");
      mapContainer.innerHTML = "<p class='text-danger'>Location not found.</p>";
    }
  } catch (err) {
    console.error("Error in geocoding fetch:", err);
    mapContainer.innerHTML = "<p class='text-danger'>Map failed to load.</p>";
  }
});
