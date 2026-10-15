// Auch die geöffneten Meldungen haben verschiedene Formen statt einer einzigen
// Bürgerbüro-Geschichte. Die Aussage jeder Meldung bleibt ausdrücklich erfunden.
export function articleCopy(result) {
  const n = result.topic.name;
  const place = result.place;
  if (result.topic.group === 'weather') return {
    rubric: 'WETTERDIENST', heading: 'Der Himmel wurde um eine Stellungnahme gebeten',
    paragraphs: [`In ${place} müssen Bewohner ihre Wetterlage inzwischen selbst entgegennehmen. Bei Abwesenheit bleibt eine kleine Wolke vor der Haustür stehen.`, 'Ein Sonnenschirm wollte die Zustellung annehmen, war aber laut zuständiger Stelle nicht im richtigen Dienst. Regenschirme sollen sich vorerst bereithalten.', 'Der morgige Wetterbericht ist noch leer. Man wolle abwarten, wie sich morgen anfühlt.'], quote: '„Wir haben rausgeschaut. Mehr Daten waren gerade nicht da.“'
  };
  if (result.topic.category === 'city') return {
    rubric: 'STADTLEBEN', heading: `Anwohner in ${n} sollen kurz überprüfen, wo sie sind`,
    paragraphs: [`Die Nachricht verbreitete sich zuerst in einer lokalen Gruppe, in der eigentlich jemand ein Ladekabel gesucht hatte. Inzwischen reden die Mitglieder wieder über Parkplätze.`, `Die Stadtverwaltung von ${n} hat einen Plan bereitgelegt. Auf ihm ist vor allem die Stadt zu sehen. Der Teil mit der Lösung müsste noch ergänzt werden.`, 'Besucher werden gebeten, ihre Ankunft selbst festzustellen. Das Ortsschild könne nicht jedem persönlich Bescheid sagen.'], quote: '„Wir sind hier. Das ließ sich bisher bestätigen.“'
  };
  if (['parcel', 'internet', 'password', 'printer', 'update'].includes(result.topic.group)) return {
    rubric: 'TECHNIK', heading: 'Der erste Neustart hat die Situation nur kurz unterbrochen',
    paragraphs: [`Der Vorgang zu „${n}“ wurde zunächst mehrfach wiederholt. Beim vierten Versuch war die Fehlermeldung an derselben Stelle, was die Beteiligten als Stabilität werteten.`, 'Der Support bat um einen Screenshot. Der Screenshot bat anschließend um einen Support. Aktuell liegen beide Anfragen nebeneinander.', 'Der zuständige Hersteller empfiehlt, das Gerät so hinzustellen, dass man die Meldung nicht mehr sieht. Eine Verbesserung der Sicht sei messbar.'], quote: '„Das System tut genau das, was es vorher auch nicht getan hat.“'
  };
  const variant = [...result.title].reduce((sum, character) => sum + character.codePointAt(0), 0) % 4;
  const copies = [
    { rubric: 'VERBRAUCHER', heading: 'Der Verkäufer hält sich an den Wortlaut', paragraphs: [`Auf Nachfrage verwies der Anbieter auf die Beschreibung von „${n}“. Dort sei genau genug angedeutet, dass niemand so richtig wisse, was nach der Bestellung passiere.`, 'Ein Käufer hatte das Kleingedruckte vergrößert. Es war danach zwar größer, aber weiterhin keine besonders gute Nachricht.', 'Die Rückgabe wird geprüft. Die Verpackung möchte allerdings gerne beim Kunden bleiben.'], quote: '„Abgebildet heißt nicht, dass wir das auch haben.“' },
    { rubric: 'KURZMELDUNG', heading: 'Vorerst bleibt die Angelegenheit genau so liegen', paragraphs: [`Eine Person in ${place} bemerkte den Vorgang zufällig und wollte eigentlich nur vorbei. Nun ist sie auf dem Symbolfoto.`, `Ob „${n}“ darüber informiert wurde, ist unklar. Eine Anfrage lag nach eigener Aussage kurz auf dem Tisch.`, 'Weitere Einzelheiten wollten bis Redaktionsschluss nicht erscheinen.'], quote: '„Ich war das mit dem Vorbeigehen.“' },
    { rubric: 'TESTBERICHT', heading: 'Das Ergebnis hängt davon ab, was man vorher erwartet hatte', paragraphs: [`Die Redaktion prüfte „${n}“ unter normalen Bedingungen. Der Tisch stand gerade, das Licht war an, und niemand hatte die Anleitung gelesen.`, 'Ein zweiter Test bestätigte vor allem, dass ein erster Test stattgefunden hatte. Die Ergebnisse wurden anschließend sehr sorgfältig anders sortiert.', 'Unser Urteil: Es lässt sich hinstellen. Für alles Weitere wäre ein weiterer Test notwendig.'], quote: '„Vier Sterne für den Standort des Versuchs.“' },
    { rubric: 'NACHGEFRAGT', heading: 'Drei Personen hatten bereits eine Meinung', paragraphs: [`Die erste befragte Person kannte „${n}“ vom Sehen. Die zweite hatte darüber einen Kommentar gelesen. Die dritte hatte denselben Kommentar geschrieben.`, 'Damit gab es zwei voneinander unabhängige Personen und einen sehr aktiven Kommentar. Die Redaktion nahm trotzdem drei Zitate auf.', 'Eine vierte Person wusste tatsächlich etwas, war aber schon auf dem Weg zum Bus.'], quote: '„Das habe ich auch irgendwo gelesen. Vielleicht bei mir.“' }
  ];
  return copies[variant];
}
