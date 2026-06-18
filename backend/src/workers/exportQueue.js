// Schlanker Platzhalter für die Export-Queue.
//
// In der Vollversion läuft hier BullMQ gegen Redis, und ein separater
// Worker-Container (siehe ../../../worker/) verarbeitet die Jobs mit
// Puppeteer (rendert die Animation Frame für Frame) + FFmpeg (setzt die
// Frames zu MP4/GIF zusammen).
//
// Für den ersten Entwicklungsschritt reicht dieser Stub, damit das Backend
// lauffähig ist, ohne dass Redis bereits eingerichtet sein muss. Sobald der
// Worker existiert, hier durch eine echte BullMQ-Queue ersetzen:
//
//   import { Queue } from 'bullmq';
//   const exportQueue = new Queue('exports', { connection: { url: process.env.REDIS_URL } });
//   export async function enqueueExportJob(payload) {
//     await exportQueue.add('render', payload);
//   }

export async function enqueueExportJob(payload) {
  console.log('[exportQueue] TODO: an Worker übergeben statt nur zu loggen:', {
    exerciseId: payload.exerciseId,
    format: payload.format,
  });
}
