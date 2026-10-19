import test from 'node:test';
import assert from 'node:assert/strict';
import { videoCatalog, videoDetails } from '../world-content.js';
import { generateResults } from '../engine.js';
import { scriptFor, beatAt } from '../video-scenes.js';
import { catalogScripts } from '../video-scripts.js';

function checkScript(video) {
  const script = scriptFor(video);
  assert.equal(script.duration, video.durationSeconds, video.title);
  assert.ok(script.beats.length >= 3, `${video.title} braucht mindestens drei Beats`);
  assert.equal(script.beats[0].start, 0, video.title);
  script.beats.forEach((beat, i) => {
    assert.equal(typeof beat.end, 'number', video.title);
    assert.ok(beat.end > beat.start && beat.end <= script.duration, `${video.title}: Beat ${i} liegt außerhalb der Laufzeit`);
    if (i) assert.equal(beat.start, script.beats[i - 1].end);
  });
  assert.doesNotMatch(JSON.stringify(script), /\{n\}|\{title\}|undefined|NaN/, video.title);
  const longest = Math.max(...script.beats.map(beat => beat.end - beat.start));
  assert.ok(longest <= 7.5, `${video.title}: ${longest} Sekunden ohne Schnitt sind zu lang`);
  if (script.sponsor) assert.ok(script.sponsor.end > script.sponsor.start && script.sponsor.name);
  return script;
}

test('Jedes Katalogvideo hat ein eigenes Drehbuch, das genau zur Laufzeit passt', () => {
  const catalog = videoCatalog(3);
  for (const title of Object.keys(catalogScripts).filter(title => !title.startsWith('2 + 2'))) assert.ok(catalog.some(video => video.title === title), `Drehbuch ohne Video: ${title}`);
  for (const video of catalog) {
    assert.ok(catalogScripts[video.title], `Kein Drehbuch für ${video.title}`);
    checkScript(video);
  }
});

test('Suchvideos bekommen je nach Länge Intro, Sponsor, Pointe und Endscreen', () => {
  for (const query of ['Banane', 'Drucker', 'Berlin', 'BMW M3', 'Taylor Swift', 'Windows Update', 'Wetter', 'Taschenrechner']) {
    for (let seed = 0; seed < 8; seed++) {
      for (const result of generateResults(query, seed).results.filter(item => item.site === 'youtuba')) {
        const video = videoDetails(result, seed);
        const script = checkScript(video);
        const adsOnly = /NUR DIE WERBUNG/i.test(video.title);
        if (adsOnly) assert.ok(script.sponsor, 'Werbevideos bestehen aus Werbung');
        else if (video.durationSeconds >= 30 && script.kind !== 'kids') {
          assert.ok(script.sponsor, `${video.title} (${video.durationSeconds} s) ohne Sponsor`);
          assert.ok(script.beats.at(-1).endscreen, `${video.title} ohne Endscreen`);
        } else if (video.durationSeconds <= 12) assert.equal(script.sponsor, null);
        assert.ok(script.beats.some(beat => beat.big), `${video.title} ohne Pointe`);
      }
    }
  }
});

test('Beats wechseln mit der Zeit und Timer laufen nur, solange sie laufen sollen', () => {
  const breath = scriptFor(videoCatalog(1).find(video => video.title.startsWith('Ich habe 24 STUNDEN')));
  assert.equal(beatAt(breath, 0.5).text, 'Tag 1. Ab jetzt atme ich nicht mehr.');
  assert.equal(beatAt(breath, 2.5).big, 'GONE WRONG');
  const stopped = beatAt(breath, 2.5).timer;
  assert.equal(stopped.running, false);
  assert.ok(Math.abs(stopped.base - 2.1) < 1e-9);
  const update = scriptFor(videoCatalog(1).find(video => video.title.startsWith('UPDATE')));
  assert.equal(beatAt(update, 33).state.bar, 0);
  assert.equal(beatAt(update, 27).state.bar, 99.9);
});
