

const ClientsNearby = () => {
    if ('geolocation' in navigator) {
        // Geolocation API is supported
        navigator.geolocation.getCurrentPosition(
            // Success callback
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                // Now you can use the latitude and longitude to perform further tasks
            },
            // Error callback
            (error) => {
                console.error('Error getting user location:', error.message);
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser');
    }

    return (
        <div className="clients-nearby">
            <h3 style={{ margin: "50px 0px" }}>Clients Nearby</h3>
        </div>
    )
}

export default ClientsNearby