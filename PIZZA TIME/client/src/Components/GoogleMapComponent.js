import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox';
import '@reach/combobox/styles.css';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};
const libraries = ['places'];
const GoogleMapComponent = ({ onAddressConfirm }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [markerPosition, setMarkerPosition] = useState(center);
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setMarkerPosition({ lat, lng });
      onAddressConfirm({ lat, lng, address });
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onClick = useCallback((e) => {
    setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    onAddressConfirm({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  }, [onAddressConfirm]);

  useEffect(() => {
    onAddressConfirm(markerPosition);
  }, [markerPosition, onAddressConfirm]);

  return isLoaded ? (
    <div>
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          placeholder="Search your address"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === 'OK' &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onClick={onClick}
      >
        <MarkerF position={markerPosition} />
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
};

export default GoogleMapComponent;
