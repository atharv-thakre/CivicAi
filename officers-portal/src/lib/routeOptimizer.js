import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import L from 'leaflet';

// ─── Haversine Distance ────────────────────────────────────────────────────
// Returns distance in kilometres between two [lat, lng] points.

export function haversineKm(a, b) {
  const R = 6371;
  const [lat1, lng1] = [a[0] * (Math.PI / 180), a[1] * (Math.PI / 180)];
  const [lat2, lng2] = [b[0] * (Math.PI / 180), b[1] * (Math.PI / 180)];
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const calc =
    Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng +
    sinDLat * sinDLat;
  const c = 2 * Math.atan2(Math.sqrt(calc), Math.sqrt(1 - calc));
  return R * c;
}

// ─── Cost Matrix ────────────────────────────────────────────────────────────

function buildCostMatrix(coords) {
  const n = coords.length;
  const matrix = Array.from({ length: n }, () => new Float64Array(n));
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const d = haversineKm(coords[i], coords[j]);
      matrix[i][j] = d;
      matrix[j][i] = d;
    }
  }
  return matrix;
}

// ─── Nearest-Neighbour TSP heuristic ────────────────────────────────────────
// Greedy construction: always go to the closest unvisited node.
// Returns the ordered indices (starting at startIdx).

function nearestNeighbour(matrix, startIdx) {
  const n = matrix.length;
  const visited = new Uint8Array(n);
  const tour = [startIdx];
  visited[startIdx] = 1;
  let current = startIdx;

  for (let step = 1; step < n; step++) {
    let best = -1;
    let bestDist = Infinity;
    for (let j = 0; j < n; j++) {
      if (!visited[j] && matrix[current][j] < bestDist) {
        bestDist = matrix[current][j];
        best = j;
      }
    }
    if (best === -1) break;
    tour.push(best);
    visited[best] = 1;
    current = best;
  }
  return tour;
}

// ─── 2-opt local improvement ────────────────────────────────────────────────

function twoOptSwap(tour, i, k) {
  const newTour = tour.slice(0, i);
  const reversed = tour.slice(i, k + 1).reverse();
  newTour.push(...reversed);
  newTour.push(...tour.slice(k + 1));
  return newTour;
}

function tourLength(matrix, tour) {
  let len = 0;
  for (let i = 0; i < tour.length - 1; i++) {
    len += matrix[tour[i]][tour[i + 1]];
  }
  return len;
}

function twoOpt(matrix, tour, maxIterations) {
  let best = tour.slice();
  let bestLen = tourLength(matrix, best);
  const n = best.length;
  let improved = true;
  let iter = 0;

  while (improved && iter < maxIterations) {
    improved = false;
    for (let i = 1; i < n - 1; i++) {
      for (let k = i + 1; k < n; k++) {
        const candidate = twoOptSwap(best, i, k);
        const candLen = tourLength(matrix, candidate);
        if (candLen < bestLen - 0.001) {
          best = candidate;
          bestLen = candLen;
          improved = true;
        }
      }
    }
    iter++;
  }
  return best;
}

// ─── Main solveRoute(coords, startIndex) → ordered indices ──────────────────

export function solveRoute(coords, startIndex = 0) {
  if (coords.length === 0) return [];
  if (coords.length === 1) return [0];
  const matrix = buildCostMatrix(coords);
  const initial = nearestNeighbour(matrix, startIndex);
  return twoOpt(matrix, initial, 200);
}

// ─── Total route length from ordered indices ────────────────────────────────

export function routeLengthKm(coords, order) {
  if (order.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < order.length - 1; i++) {
    total += haversineKm(coords[order[i]], coords[order[i + 1]]);
  }
  return total;
}

// ─── Estimated time (assume 30 km/h average in urban traffic) ────────────────

export function estimateHours(km) {
  const AVG_KMH = 30;
  return km / AVG_KMH;
}

// ─── Hook: officer geolocation ───────────────────────────────────────────────

export function useOfficerLocation() {
  const [location, setLocation] = useState(null);
  const [locating, setLocating] = useState(true);
  const [locError, setLocError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocating(false);
      setLocError('Geolocation not supported');
      return;
    }
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        setLocError(err.message);
        // fallback to Bhopal, India
        setLocation([23.2599, 77.4126]);
      },
      { enableHighAccuracy: true, maximumAge: 30000 }
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  return { location, locating, locError };
}

// ─── Cluster builder: greedy spatial clustering ──────────────────────────────

export function clusterComplaints(points, maxRadiusKm = 5) {
  if (!points.length) return [];
  const clusters = [];
  const assigned = new Set();

  points.forEach((p, i) => {
    if (assigned.has(i)) return;
    const cluster = [p];
    assigned.add(i);
    // find neighbours
    points.forEach((q, j) => {
      if (i === j || assigned.has(j)) return;
      if (haversineKm([p.lat, p.lng], [q.lat, q.lng]) <= maxRadiusKm) {
        cluster.push(q);
        assigned.add(j);
      }
    });
    clusters.push(cluster);
  });
  return clusters;
}