/* =========================================================
   CONTENT: this is the file you edit to change what the site says.
   (app.js has the logic and normally does not need changes.)
   ========================================================= */

const BIRTHDAY = "2027-04-21";

// Which days are shown, in order.
//  - { from, to } shows every day between the two dates (inclusive)
//  - "gap" draws a "···" separator, used to skip days nobody needs to see
const TIMELINE = [
  { from: "2027-04-16", to: "2027-04-26" },
  "gap",                                        // 27, 28, 29 April are skipped
  { from: "2027-04-30", to: "2027-04-30" },
];

// Days that are locked: greyed out, cannot be opened. Example: ["2027-04-15"]
const LOCKED = [];

// Where I am: the colored band under the day squares (it scrolls together with them).
//  from / to: first and last day (inclusive)
//  name:      text shown on the band
//  color:     band color (used when there is no image, and behind the image)
//  image:     optional picture, e.g. "images/covilha.jpg" (put the file in an "images" folder
//             next to index.html). Leave "" for a plain color.
// If two entries overlap, the LATER one in the list wins for that day, so you can write
// the dates the way you think of them (16-24, 24-26, 26-30) and the 24th and 26th
// belong to the place you arrive in.
// PLACEHOLDER places and dates, replace with the real ones.
const LOCATIONS = [
  { from: "2027-04-16", to: "2027-04-18", name: "Porto", color: "#1ea382", image: "images/Porto.jpg" },
  { from: "2027-04-18", to: "2027-04-24", name: "Covilhã", color: "#2d6a8a", image: "images/Covilha.png" },
  { from: "2027-04-24", to: "2027-04-26", name: "Aveiro",  color: "#b45f1a", image: "images/Aveiro.png" },
  { from: "2027-04-26", to: "2027-04-30", name: "Covilhã", color: "#2d6a8a", image: "images/Covilha2.png" },
];

// Info panel for a place. Tap the place in the band under the days and this panel opens.
// The key must be the same text as "name" in LOCATIONS above. Places without an entry here are not clickable.
//  map:   what Google Maps should show (a village or town is enough; no exact address needed)
//  photo: optional landscape picture; if left out, the picture of the place in LOCATIONS is used
//  stay / how: texts per language ("Where to stay" and "How to get there")
// PLACEHOLDER texts, edit them.
const PLACES = {
  "Covilhã": {
    map: "Teixoso, Covilhã, Portugal",
    photo: "images/home.jpeg",
    stay: {
      en: "You are welcome to stay at my house in Teixoso, a village next to Covilhã. There are enough rooms for everyone. I will send the exact address and the room details in our group.",
      pt: "Podem ficar na minha casa, no Teixas. Envio a morada exata e os detalhes dos quartos no nosso grupo.",
      de: "Ihr könnt bei mir zu Hause in Teixoso übernachten, einem Dorf direkt neben Covilhã. Es gibt genügend Zimmer für alle. Die genaue Adresse und die Zimmer schicke ich euch in unserer Gruppe.",
    },
    how: {
      en: "The closest big airports are Lisbon and Porto, around 3 hours from Covilhã by car. You can also come by bus or train. It is also possible for me to pick you up by car at the airport. More details will follow.",
      pt: "Tu és tuga, não precisas de saber isto :p",
      de: "Die nächsten großen Flughäfen sind Lissabon und Porto, etwa 3 Stunden mit dem Auto von Covilhã entfernt. Man kann auch mit Bus oder Zug kommen. Notfalls kann ich euch mit dem Auto am Flughafen abholen. Weitere Details folgen.",
    },
  },
};

// Texts for the whole page, per language.
// weekdays: starts on Sunday. months: starts on January. Change the abbreviations here.
const I18N = {
  en: {
    locale: "en-GB",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    heroTitle: "I'm turning 30!",
    weekTitle: "The birthday week. I will be in Portugal from 16 to 30 April",
    lockedTag: "Nothing here",
    countdown: (n) => n > 0 ? `${n} days to go` : (n === 0 ? "Today is the day!" : "What a party!"),
    when: "When", where: "Where",
    hint: "Tap a day or a place to see more. More plans will be added soon.",
    emptyTitle: "Plans coming soon",
    emptyText: "Nothing planned for this day yet. Check back later!",
    footer: "Made with love",
    notice: "⚠️ Aveiro hotel: please tell me by 31 December if you're coming",   // leave "" to hide
    stayTitle: "Where to stay", howTitle: "How to get there", openMap: "Open in Google Maps",
  },
  pt: {
    locale: "pt-PT",
    weekdays: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
    months: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
    heroTitle: "Vou fazer 30 anos!",
    weekTitle: "A semana de aniversário. Vou estar em Portugal de 16 a 30 de abril",
    lockedTag: "Nada aqui",
    countdown: (n) => n > 0 ? `Faltam ${n} dias` : (n === 0 ? "Hoje é o dia!" : "Que festa!"),
    when: "Quando", where: "Onde",
    hint: "Toca num dia ou num sítio para ver mais. Em breve haverá mais planos.",
    emptyTitle: "Planos em breve",
    emptyText: "Ainda não há nada planeado para este dia. Volta mais tarde!",
    footer: "Feito com carinho",
    notice: "⚠️ Hotel em Aveiro: diz-me até 31 de dezembro se vens",
    stayTitle: "Onde ficar", howTitle: "Como chegar", openMap: "Abrir no Google Maps",
  },
  de: {
    locale: "de-DE",
    weekdays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    months: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
    heroTitle: "Ich werde 30!",
    weekTitle: "Die Geburtstagswoche. Ich bin vom 16. bis 30. April in Portugal",
    lockedTag: "Nichts hier",
    countdown: (n) => n > 0 ? `Noch ${n} Tage` : (n === 0 ? "Heute ist der Tag!" : "Was für eine Party!"),
    when: "Wann", where: "Wo",
    hint: "Tippe auf einen Tag oder einen Ort, um mehr zu sehen. Weitere Pläne folgen bald.",
    emptyTitle: "Pläne folgen bald",
    emptyText: "Für diesen Tag ist noch nichts geplant. Schau später wieder vorbei!",
    footer: "Mit Liebe gemacht",
    notice: "⚠️ Hotel in Aveiro: Sag mir bitte bis zum 31. Dezember, ob du kommst",
    stayTitle: "Übernachtung", howTitle: "Anreise", openMap: "In Google Maps öffnen",
  },
};

// Events by date (YYYY-MM-DD).
//  type: "party" = party color, "travel" or "note" = plain (flights, explore days), anything else = yellow
//  icon: optional emoji on the square (parties use 🎉 by default)
//  when / where: optional lines in the details
// To add a day, copy an entry, change the date and fill in the three languages.
const EVENTS = {
  "2027-04-16": {
    type: "travel",
    icon: "✈️",
    tag:   { en: "Flight", pt: "Voo", de: "Flug" },
    title: { en: "Flying to Porto", pt: "Voo para Porto", de: "Flug nach Porto" },
    where: { en: "Nuremberg → Porto", pt: "Nuremberga → Porto", de: "Nürnberg → Porto" },
    text:  {
      en: "I'm flying from Nuremberg to Porto. The birthday trip starts here!",
      pt: "Vou voar de Nuremberga para Porto. A viagem de aniversário começa aqui!",
      de: "Ich fliege von Nürnberg nach Porto. Hier beginnt die Geburtstagsreise!",
    },
  },
  "2027-04-17": {
    type: "note",
    icon: "🧭",
    tag:   { en: "Explore", pt: "Explorar", de: "Entdecken" },
    title: { en: "Exploring before the parties", pt: "A explorar antes das festas", de: "Entdecken vor den Feiern" },
    text:  {
      en: "A day to explore Portugal before the celebrations begin.",
      pt: "Um dia para explorar Portugal antes de as festas começarem.",
      de: "Ein Tag, um Portugal zu entdecken, bevor die Feiern beginnen.",
    },
  },
  "2027-04-21": {
    type: "party",
    tag:   { en: "Party 1", pt: "Festa 1", de: "Feier 1" },
    title: { en: "Birthday party #1", pt: "Festa de aniversário #1", de: "Geburtstagsfeier #1" },
    when:  { en: "Afternoon (exact time to be announced)", pt: "Tarde (hora exata a anunciar)", de: "Nachmittag (genaue Uhrzeit folgt)" },
    where: { en: "To be announced", pt: "A anunciar", de: "Wird noch bekannt gegeben" },
    text:  {
      en: "The actual birthday! Come celebrate the big 3-0 with me.",
      pt: "O dia de anos a sério! Vem celebrar os 30 comigo.",
      de: "Der echte Geburtstag! Feiert mit mir den runden 30sten.",
    },
  },
  "2027-04-25": {
    type: "party",
    icon: "🏃",
    tag:   { en: "Party 2", pt: "Festa 2", de: "Feier 2" },
    title: { en: "Birthday party #2", pt: "Festa de aniversário #2", de: "Geburtstagsfeier #2" },
    when:  { en: "Afternoon (exact time to be announced)", pt: "Tarde (hora exata a anunciar)", de: "Nachmittag (genaue Uhrzeit folgt)" },
    where: { en: "To be announced", pt: "A anunciar", de: "Wird noch bekannt gegeben" },
    text:  {
      en: "A second party, so that everyone can join at least one. Can't make the 21st? Come on the 25th!",
      pt: "Uma segunda festa, para que todos possam vir a pelo menos uma. Não podes no dia 21? Vem no dia 25!",
      de: "Eine zweite Feier, damit alle bei mindestens einer dabei sein können. Am 21. keine Zeit? Dann komm am 25.!",
    },
  },
  "2027-04-26": {
    type: "note",
    icon: "🧭",
    tag:   { en: "Explore", pt: "Explorar", de: "Entdecken" },
    title: { en: "Explore more of Portugal", pt: "Descobrir mais de Portugal", de: "Mehr von Portugal entdecken" },
    text:  {
      en: "The parties are over, but Portugal has much more to offer. Use the next days to visit other places in the country!",
      pt: "As festas acabaram, mas Portugal tem muito mais para oferecer. Aproveita os próximos dias para visitar outros sítios do país!",
      de: "Die Feiern sind vorbei, aber Portugal hat noch viel mehr zu bieten. Nutzt die nächsten Tage, um andere Orte im Land zu entdecken!",
    },
  },
  "2027-04-30": {
    type: "travel",
    icon: "✈️",
    tag:   { en: "Flight", pt: "Voo", de: "Flug" },
    title: { en: "Flying back to Germany", pt: "Voo de regresso à Alemanha", de: "Rückflug nach Deutschland" },
    where: { en: "Portugal → Germany", pt: "Portugal → Alemanha", de: "Portugal → Deutschland" },
    text:  {
      en: "The trip ends here and it's time to fly back to Germany. Thank you for celebrating with me!",
      pt: "A viagem acaba aqui e é hora de voar de volta para a Alemanha. Obrigado por celebrarem comigo!",
      de: "Hier endet die Reise und es geht zurück nach Deutschland. Danke, dass ihr mit mir gefeiert habt!",
    },
  },
};
