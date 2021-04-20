import "../components/css/Mapa.css";
import React, { Component } from "react";
import { MapContainer, TileLayer, Marker} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import marker from "../imatges/icolaluna.png";

const myIcon = new L.Icon({
  iconUrl: marker,
  iconRetinaUrl: marker,
  popupAnchor: [-0, -0],
  iconSize: [30, 30],
});

export default class Maps extends Component {
  state = {
    zoom: 14,
  };

  render() {
    const position = [this.props.lat, this.props.lng];

    return (
      <MapContainer
        center={position}
        zoom={this.state.zoom}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={myIcon}></Marker>
      </MapContainer>
    );
  }
}
