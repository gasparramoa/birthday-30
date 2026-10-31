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

// People who confirmed they are coming (shown as a vertical list at the bottom of the page).
//  name:  the name shown
//  days:  which parties they will be at, e.g. ["2027-04-21"], ["2027-04-25"] or both
//  photo: optional picture, e.g. "images/maria.jpg" (without it the first letter of the name is shown)
// Copy a line, change it, and add it to the list. Example:
//   { name: "Maria", days: ["2027-04-21", "2027-04-25"], photo: "" },
// Pictures at the top of the page. Use PNGs with a transparent background.
//  me:      my photo, shown on the right next to the "30" (e.g. me holding the 30)
//  friends: pictures on the left. alt = name shown on hover. bottom: true puts it in the lower row. size: 1 is normal, 1.4 = 40% bigger.
// These are PLACEHOLDERS: put your files in images/hero/ and change the paths.
const HERO = {
  me: { image: "images/hero/me.png", alt: "Gaspar" },
  // bottom: true = the picture has the legs cut off, so it stands on the bottom edge (second row)
  friends: [
    { image: "images/hero/goku.png",       alt: "Goku", size: 1.4 },
    { image: "images/hero/sonic.png",      alt: "Sonic" },
    { image: "images/hero/hornet.png",     alt: "Silksong" },
    { image: "images/hero/wargreymon.png", alt: "Wargreymon" },
    { image: "images/hero/iron-giant.png", alt: "Iron Giant", size: 0.85, bottom: true },
    { image: "images/hero/gaara.png",      alt: "Gaara",      bottom: true },
    { image: "images/hero/ashitaka.png",   alt: "Ashitaka",   bottom: true },
    { image: "images/hero/enid.png",       alt: "Enid",       bottom: true },
  ],
};

const GUESTS = [
];

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
//  zoom: map zoom (9 = see where it is in Portugal, 13 = close up). sections / links: extra text blocks and buttons, like in the 25 April event below.
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

  "Porto": {
    map: "Porto, Portugal",
    zoom: 13,
    photo: "images/Porto.jpg",
    stay: {
      en: "Stay close to the city centre, so you can walk to most of the places worth visiting in Porto. I am not sure yet if I will be there, but I might be nearby.",
      pt: "Fiquem perto do centro da cidade, para poderem ir a pé à maior parte dos sítios que vale a pena visitar no Porto. Ainda não tenho a certeza se estarei lá, mas posso estar por perto.",
      de: "Übernachtet am besten nah am Stadtzentrum, dann könnt ihr die meisten Sehenswürdigkeiten in Porto zu Fuß erreichen. Ich weiß noch nicht sicher, ob ich dort sein werde, aber vielleicht bin ich in der Nähe.",
    },
    how: {
      en: "From the airport to the city there is a metro, which is quite simple. If you want, you can also come straight to Covilhã, it is only a suggestion :)",
      pt: "Do aeroporto até à cidade há metro, é bastante simples. Se quiserem, também podem vir logo para a Covilhã, é só uma sugestão :)",
      de: "Vom Flughafen in die Stadt fährt eine Metro, das ist ganz einfach. Wenn ihr wollt, könnt ihr auch direkt nach Covilhã kommen, das ist nur ein Vorschlag :)",
    },
  },

  "Aveiro": {
    map: "Aveiro, Portugal",
    zoom: 9,                                  // zoomed out, so you can see where Aveiro is in Portugal (13 = close up)
    // photo: "images/aveiro.jpg",            // optional: your own picture; if left out, the Aveiro picture of the band is used
    stay: {
      en: "The plan is to stay together in a hotel in Aveiro, that is the priority. Once I know who is coming, I will book a place for everyone. Please tell me by 31 December, because the marathon weekend gets busy and places fill up fast.",
      pt: "O plano é ficarmos juntos num hotel em Aveiro, essa é a prioridade. Quando souber quem vem, reservo um sítio para todos. Digam-me até 31 de dezembro, porque o fim de semana da maratona tem muita procura e os alojamentos esgotam depressa.",
      de: "Der Plan ist, gemeinsam in einem Hotel in Aveiro zu übernachten, das hat Priorität. Sobald ich weiß, wer kommt, buche ich eine Unterkunft für alle. Bitte sagt mir bis zum 31. Dezember Bescheid, denn am Marathon-Wochenende ist viel los und die Unterkünfte sind schnell ausgebucht.",
    },
    how: {
      en: "The closest big airport is Porto, about 1 hour from Aveiro by train or car. From Lisbon it is around 3 hours. More details will follow.",
      pt: "O aeroporto grande mais próximo é o do Porto, a cerca de 1 hora de Aveiro de comboio ou de carro. De Lisboa são cerca de 3 horas. Mais detalhes em breve.",
      de: "Der nächste große Flughafen ist Porto, etwa 1 Stunde von Aveiro entfernt, mit dem Zug oder dem Auto. Von Lissabon sind es etwa 3 Stunden. Weitere Details folgen.",
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
    scrollHint: "← Swipe or use the arrows to see more days →", prevDays: "Previous days", nextDays: "Next days",
    guestsTitle: "Who is coming", guestsIntro: "Friends who already confirmed. Tell me you are coming and you will show up here!", guestsEmpty: "Nobody yet. Be the first to confirm and your name will be added here! 🎉",
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
    scrollHint: "← Desliza ou usa as setas para ver mais dias →", prevDays: "Dias anteriores", nextDays: "Dias seguintes",
    guestsTitle: "Quem vem", guestsIntro: "Amigos que já confirmaram. Diz-me que vens e apareces aqui!", guestsEmpty: "Ainda ninguém. Sê o primeiro a confirmar e o teu nome aparece aqui! 🎉",
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
    scrollHint: "← Wische oder nutze die Pfeile, um mehr Tage zu sehen →", prevDays: "Frühere Tage", nextDays: "Spätere Tage",
    guestsTitle: "Wer kommt", guestsIntro: "Freunde, die schon zugesagt haben. Sag mir Bescheid, dass du kommst, und du erscheinst hier!", guestsEmpty: "Noch niemand. Sei der Erste, der zusagt, und dein Name erscheint hier! 🎉",
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
    when:  { en: "Afternoon, from 6 pm", pt: "Tarde, a partir das 18h", de: "Nachmittag, ab 18 Uhr" },
    where: { en: "At my house in Teixoso", pt: "Em minha casa, no Teixoso", de: "Bei mir zu Hause in Teixoso" },
    text:  {
      en: "The actual birthday! Come celebrate the big 3-0 with me.",
      pt: "O dia de anos a sério! Vem celebrar os 30 comigo.",
      de: "Der echte Geburtstag! Feiert mit mir den runden 30sten.",
    },
    photos: [
      { image: "images/home3.jpeg", pos: "50% 55%" },
      { image: "images/home4.jpeg", pos: "50% 35%" },
    ],
    sections: [
      {
        title: { en: "The plan for the day", pt: "O plano para o dia", de: "Der Plan für den Tag" },
        items: {
          en: ["🌅 From 6 pm: the party starts at my house, with music, around sunset (if the weather is nice)", "🍲 We cook Portuguese food together (vegan too)", "🍹 Plenty of drinks and snacks", "🎲 Board games (A Aldeia, Werewolf) or even karaoke"],
          pt: ["🌅 A partir das 18h: a festa começa em minha casa, com música, à hora do pôr do sol (se o tempo ajudar)", "🍲 Cozinhamos comida portuguesa juntos (também vegana)", "🍹 Muitas bebidas e petiscos", "🎲 Jogos de tabuleiro (A Aldeia, Lobisomem) ou até karaoke"],
          de: ["🌅 Ab 18 Uhr: die Party startet bei mir zu Hause, mit Musik, zum Sonnenuntergang (wenn das Wetter mitspielt)", "🍲 Wir kochen zusammen portugiesisch (auch vegan)", "🍹 Jede Menge Getränke und Snacks", "🎲 Brettspiele (A Aldeia, Werwolf) oder sogar Karaoke"],
        },
      },
      {
        title: { en: "Relaxed vibe", pt: "Ambiente descontraído", de: "Entspannte Stimmung" },
        text: {
          en: "Nothing too heavy, since it is not a weekend, but we will have our fun! 🙂",
          pt: "Nada de muito pesado, já que não é fim de semana, mas vamos divertir-nos à mesma! 🙂",
          de: "Nichts allzu Wildes, da es kein Wochenende ist, aber Spaß werden wir trotzdem haben! 🙂",
        },
      },
    ],
  },
  "2027-04-23": {
    type: "dinner",
    icon: "🍽️",
    tag:   { en: "Dinner", pt: "Jantar", de: "Abendessen" },
    title: { en: "Dinner together", pt: "Jantar juntos", de: "Gemeinsames Abendessen" },
    where: { en: "Restaurant to be announced", pt: "Restaurante a anunciar", de: "Restaurant wird noch bekannt gegeben" },
    text:  {
      en: "We will probably have dinner together in a nice restaurant. Think of it as a small extra party!",
      pt: "Provavelmente vamos jantar todos juntos num bom restaurante. Vê isto como uma pequena festa extra!",
      de: "Wir werden wahrscheinlich zusammen in einem schönen Restaurant zu Abend essen. Sozusagen eine kleine Extra-Party!",
    },
  },
  "2027-04-25": {
    type: "party",
    icon: "🏃",
    tag:   { en: "Party 2", pt: "Festa 2", de: "Feier 2" },
    title: { en: "Birthday party #2", pt: "Festa de aniversário #2", de: "Geburtstagsfeier #2" },
    when:  { en: "Lunch at 2 pm", pt: "Almoço às 14h", de: "Mittagessen um 14 Uhr" },
    where: { en: "Restaurant to be announced", pt: "Restaurante a anunciar", de: "Restaurant wird noch bekannt gegeben" },
    text:  {
      en: "A second party, so that everyone can join at least one. Can't make the 21st? Come on the 25th!",
      pt: "Uma segunda festa, para que todos possam vir a pelo menos uma. Não podes no dia 21? Vem no dia 25!",
      de: "Eine zweite Feier, damit alle bei mindestens einer dabei sein können. Am 21. keine Zeit? Dann komm am 25.!",
    },
    // Two pictures side by side. pos = which part stays visible when cropped: "50% 0%" = top, "50% 100%" = bottom.
    // (For a single picture you can use  photo: "images/x.jpg",  photoPos: "50% 50%",  instead.)
    photos: [
      { image: "images/Aveiro1.jpeg", pos: "50% 85%" },
      { image: "images/Aveiro2.jpeg", pos: "50% 58%" },
    ],
    // More blocks, shown in this order. Each has a title and either "text" or a list "items".
    sections: [
      {
        title: { en: "The plan for the day", pt: "O plano para o dia", de: "Der Plan für den Tag" },
        items: {
          en: ["🏃 Morning: the Europe Marathon", "🥪 2 pm: a short lunch together", "🏛️ Afternoon: we visit the city", "🍽️ Evening: dinner in a nice Portuguese restaurant"],
          pt: ["🏃 Manhã: a Maratona da Europa", "🥪 14h: um almoço rápido todos juntos", "🏛️ Tarde: visitamos a cidade", "🍽️ Noite: jantar num bom restaurante português"],
          de: ["🏃 Vormittag: der Europe Marathon", "🥪 14 Uhr: ein kurzes gemeinsames Mittagessen", "🏛️ Nachmittag: wir besichtigen die Stadt", "🍽️ Abend: Abendessen in einem schönen portugiesischen Restaurant"],
        },
      },
      {
        title: { en: "Run with me!", pt: "Corram comigo!", de: "Lauft mit mir!" },
        text: {
          en: "I would love for you to join the race! There is a marathon, a half marathon and a 5 km walk. If running is not your thing, that's okay too: cheering along the route is always a great help.",
          pt: "Gostava muito que participassem na corrida! Há maratona, meia maratona e caminhada de 5 km. Mas também é ok se ficarem a apoiar, é sempre uma boa ajuda.",
          de: "Ich würde mich sehr freuen, wenn ihr mitlauft! Es gibt einen Marathon, einen Halbmarathon und einen 5-km-Walk. Wer nicht laufen möchte, kann mich natürlich auch anfeuern, das hilft immer.",
        },
      },
    ],
    // Buttons under the text
    links: [
      { label: { en: "Marathon website", pt: "Site da maratona", de: "Webseite des Marathons" }, url: "https://europemarathon.eu/en" },
      { label: { en: "Sign up for the race", pt: "Inscrever-me na corrida", de: "Für das Rennen anmelden" }, url: "https://app.globalsport.pt/eventos/maratona-da-europa-2027" },
    ],
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
    // Row of pictures you can scroll sideways. image = file, alt = short description (shown on hover),
    // pos = optional, which part stays visible when the picture is cropped (like photoPos).
    gallery: [
      { image: "images/covilha/waterfall.jpg", alt: "Waterfall" },
      { image: "images/covilha/group.jpg",     alt: "Canyoning with friends" },
      { image: "images/covilha/sunset.jpg",    alt: "Sunset over the rooftops" },
      { image: "images/covilha/pools.jpg",     alt: "Natural river pools" },
      { image: "images/covilha/trail.jpg",     alt: "Mountain trail", pos: "50% 70%" },
      { image: "images/covilha/river.jpg",     alt: "River" },
      { image: "images/covilha/concert.jpg",   alt: "Concert at the castle" },
      { image: "images/covilha/night.jpg",     alt: "Night out in the old streets", pos: "50% 60%" },
      { image: "images/covilha/fest.jpg",      alt: "Winter festival", pos: "50% 70%" },
      { image: "images/covilha/dog.jpg",       alt: "A walk in the countryside", pos: "50% 65%" },
    ],
    sections: [
      {
        title: { en: "What to expect in Covilhã", pt: "O que esperar da Covilhã", de: "Was euch in Covilhã erwartet" },
        items: {
          en: ["🏞️ Nature all around: rivers, natural pools and waterfalls", "🥾 Walks and trails in the mountains", "🧗 Adventure, like canyoning, if you feel like it", "🌇 Great views and sunsets over the rooftops", "🎶 Concerts, events and nights out in the old streets"],
          pt: ["🏞️ Natureza por todo o lado: rios, piscinas naturais e cascatas", "🥾 Passeios e trilhos na montanha", "🧗 Aventura, como canyoning, se te apetecer", "🌇 Vistas lindas e pores do sol sobre os telhados", "🎶 Concertos, eventos e noites nas ruas antigas"],
          de: ["🏞️ Natur rundherum: Flüsse, Naturpools und Wasserfälle", "🥾 Wanderungen und Wege in den Bergen", "🧗 Abenteuer, zum Beispiel Canyoning, wenn ihr Lust habt", "🌇 Tolle Aussichten und Sonnenuntergänge über den Dächern", "🎶 Konzerte, Veranstaltungen und Abende in den alten Gassen"],
        },
      },
      {
        title: { en: "Good to know", pt: "Bom saber", de: "Gut zu wissen" },
        text: {
          en: "Bring comfortable shoes for walking and a warm layer for the evenings, the mountains can be cool even in spring.",
          pt: "Tragam sapatos confortáveis para caminhar e um casaco para as noites, nas montanhas pode estar fresco mesmo na primavera.",
          de: "Bringt bequeme Schuhe zum Wandern und etwas Warmes für die Abende mit, in den Bergen kann es auch im Frühling kühl sein.",
        },
      },
    ],
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
