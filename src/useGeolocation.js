import { onUnmounted, onMounted, ref } from 'vue'

export function useGeolocation(){
    const coords = ref({ latitude: 20.5617817559, longitude: -101.2042436052 })
    const isSupported = 'navigatior' in window && 'geolocation' in navigator

    let watcher = null
    onMounted( ( ) => {
            watcher = navigator.geolocation.watchPosition
                position => (coords.value=position.coords)
            
    })
    onUnmounted( () => {
        if(watcher){
            navigator.geolocation.clearWatch(watcher)
        }
    })

    return{ coords, isSupported }
}