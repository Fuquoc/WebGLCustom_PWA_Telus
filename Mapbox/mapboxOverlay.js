mapboxgl.accessToken = 'pk.eyJ1IjoiM2RhcmNodGVjaCIsImEiOiJjbWk3NzJseWkwN3Z0MmxweWN3Y3Q0a296In0.VVlt2tS-7cG6iZ2HKC_ULA';

const initCenter = [-123.355, 48.435]
const place = [-123.3658, 48.42167];

document.addEventListener("DOMContentLoaded", () => {
  const mapDiv = document.getElementById('mapOverlay');
  if (!mapDiv) return;

  const map = initMap(mapDiv);
  const markerEl = createMarkerElement();
  const marker = addMarker(map, markerEl);

  addZoomControl(map, markerEl);
  addMarkerClickLogic(map, markerEl, mapDiv);

  autoZoomOnLoad(map);
});

// ---------------- Functions ----------------

// Khởi tạo bản đồ
function initMap(container) {
  const map = new mapboxgl.Map({
    container: container,
    style: 'mapbox://styles/3darchtech/cmi7absov009201s3bsv9a9my',
    center: initCenter,
    zoom: 12
  });
  map.addControl(new mapboxgl.NavigationControl());
  return map;
}

// Tạo element cho marker
function createMarkerElement() {
  const el = document.createElement('img');
  el.src = 'Mapbox/Mark.png';
  el.style.width = '100px';
  el.style.height = '100px';
  el.style.display = 'none';
  return el;
}

// Thêm marker vào bản đồ
function addMarker(map, el) {
  return new mapboxgl.Marker({ element: el })
    .setLngLat(place)
    .addTo(map);
}

// Ẩn/hiện marker theo zoom
function addZoomControl(map, el) {
  map.on('zoom', () => {
    const currentZoom = map.getZoom();
    el.style.display = currentZoom < 14 ? 'none' : 'block';
  });
}

// Logic click vào marker
function addMarkerClickLogic(map, el, mapDiv) {
  let clickCount = 0;
  el.addEventListener('click', () => {
    clickCount++;

    if (clickCount === 1) {
      zoomTo(map, 17);
    } else if (clickCount === 2) {
      zoomTo(map, 19);

      // Sau khi zoom xong thì fade-out map
      map.once('moveend', () => fadeOutAndRemove(mapDiv));
    }
  });
}

// Zoom tới vị trí marker
function zoomTo(map, zoomLevel) {
  map.flyTo({
    center: [-123.3658, 48.42167],
    zoom: zoomLevel,
    speed: 1,
    curve: 1.2
  });
}

// Fade-out và remove map
function fadeOutAndRemove(mapDiv) {
  mapDiv.style.transition = 'opacity 1s';
  mapDiv.style.opacity = 0;
  mapDiv.classList.remove('mapboxgl-map');

  setTimeout(() => {
    mapDiv?.remove();
  }, 1000);
}

// function filterPOI(map, allowedClasses = ['restaurant', 'hotel']) {
//   map.on('style.load', () => {
//     // Chỉ hiển thị POI có class nằm trong danh sách allowedClasses
//     map.setFilter('poi-label', ['in', 'class', ...allowedClasses]);
//   });
// }

function autoZoomOnLoad(map) {
  map.on('load', () => {
    setTimeout(() => {
      map.flyTo({
        center: place,
        zoom: 15,
        duration: 3000, // thời gian animation 2 giây
        essential: true // đảm bảo animation chạy ngay cả khi user bật reduce motion
      });
    }, 1000); // delay 1 giây sau khi load
  });
}