<template>
  <nav class="navbar navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand">API Google Maps</a>
    </div>
  </nav>
  <div class="container">
    <div class="card">
      <div class="text-center">
        <div>
          <h4>TU POSICION ES:</h4>
            Latitude: {{currPos.lat.toFixed(10)}},
            Longitude: {{ currPos.lng.toFixed(10)}},
        </div>
        <div>
          <h4>TU POSICION CLICKEADA:</h4>
          <span v-if="otherPos">
            Latitude: {{ otherPos.lat.toFixed(10)}},
            Longitude: {{ otherPos.lng.toFixed(10)}},
          </span>
          <span v-else>
            Dale click en una posicion en la pantalla
          </span>
        </div>
        </div>
        <div class="mapa" ref="mapDiv" style="width: 100%; height: 60vh"></div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useGeolocation } from './useGeolocation'
import { Loader } from '@googlemaps/js-api-loader'

const GOOGLE_MAPS_API_KEY='AIzaSyCI1CF3YAe5lIdWGdJpCt4wwMpNfaHEfnI'

export default {
  name: 'App',
  setup(){
    const { coords } = useGeolocation()
    const currPos = computed ( ( ) => ({
      lat: coords.value.latitude,
      lng: coords.value.longitude
    }))

    const otherPos=ref(null)
    const loader = new Loader ({apiKey: GOOGLE_MAPS_API_KEY})
    const mapDiv = ref(null)
    let map = ref(null)
    let clickListener = null
    onMounted (async()=>{
      await loader.load()
      map.value = new google.maps.Map(mapDiv.value, {
        center: currPos.value,
        mapId: "688808effbe06893",
        zoom: 15
      })
      clickListener = map.value.addListener(
        'click',
        ({ latLng: {lat, lng}}) =>
          (otherPos.value={lat: lat(), lng: lng()})
      )
    })
    onUnmounted( async () =>{
      if(clickListener){
        clickListener.remove()
      }
    })

    let line = null
    watch([map, currPos, otherPos], () =>{
      if (line) line.setMap(null)
      if (map.value && otherPos.value != null) 
      line = new google.maps.Polyline({
        path: [currPos.value, otherPos.value],
        map: map.value
      })
    })
    return{ currPos, mapDiv, otherPos }
  }
}
</script>

<style>
.card{
  margin: 1em auto 2em;
  padding: 1em;
  border-radius: 50px;
}
.container{
  border-radius: 50px;
}
.mapa{
  border-radius: 20px;
}
</style>