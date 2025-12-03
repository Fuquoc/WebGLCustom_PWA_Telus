// // unity-loader-eta.js
// //
// // Tính toán thời gian còn lại (ETA) khi load Unity WebGL
// // Bằng cách đo tốc độ tải file .data.unityweb theo stream

// export async function estimateUnityETA(dataUrl, onProgress, onETA, onDone) {
//     try {
//         console.log("Tính toán thời gian");
//         const head = await fetch(dataUrl, { method: "HEAD" });
//         const totalSize = parseInt(head.headers.get("Content-Length"));

//         if (!totalSize || isNaN(totalSize)) {
//             console.warn("Cannot read Content-Length! ETA may be inaccurate.");
//         }

//         // Bắt đầu tải stream để đo tốc độ
//         const res = await fetch(dataUrl);
//         const reader = res.body.getReader();

//         let loaded = 0;
//         let startTime = performance.now();

//         while (true) {
//             const { done, value } = await reader.read();

//             if (done) {
//                 if (onDone) onDone();
//                 break;
//             }

//             loaded += value.length;

//             const elapsedSec = (performance.now() - startTime) / 1000;
//             const speed = loaded / elapsedSec; // bytes / second

//             let etaSec = 0;
//             if (speed > 0) {
//                 etaSec = (totalSize - loaded) / speed;
//             }

//             if (onProgress) {
//                 onProgress(loaded / totalSize);
//             }

//             if (onETA) {
//                 onETA(etaSec);
//             }
//         }
//     } catch (err) {
//         console.error("ETA loader error:", err);
//     }
// }

// // unity-loader-eta.js

export async function downloadWithEta(url, onProgress) {
  const start = performance.now();
  const res = await fetch(url);
  const total = Number(res.headers.get('Content-Length')) || 0;

  const reader = res.body.getReader();
  let received = 0;
  let lastTime = start;
  let speed = 0;
  const alpha = 0.2; // hệ số làm mượt

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.length;

    const now = performance.now();
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    const instSpeed = value.length / dt;
    speed = speed ? speed * (1 - alpha) + instSpeed * alpha : instSpeed;

    const progress = total ? received / total : 0;
    const remaining = total && speed ? (total - received) / speed : NaN;

    onProgress({
      progress,
      received,
      total,
      speed,
      remaining,
      elapsed: (now - start) / 1000
    });
  }

  return { received, total, elapsed: (performance.now() - start) / 1000 };
}

