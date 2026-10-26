/* ===========================================================
   词汇数据（来自我自己的课本笔记，Lernwortschatz 第 5、6 页）
   -----------------------------------------------------------
   字段说明：
     de    德语词条（含词性、复数、不规则动词三形，照课本抄的）
     pos   词类（中文，用于显示）
     zh    中文释义（我自己笔记里写的）
     en    英文释义（英文模式用）
     ex    例句（课本括号里的原句优先，其余是我自己造/改写的短句）
     cat   词类分组，用于「按词类」筛选
     thema 主题分组，用于「按主题」筛选

   注意：本文件统一用单引号字符串 —— 德语复数标记是引号（如 der Sturm, "-e"），
   用双引号会需要转义，容易写错。
   =========================================================== */

const VOKABELN = [
  /* ---------- 主题：日常与学习（我原来自己整理的 31 个词）---------- */
  { de: 'die Erfahrung, -en', pos: '名词', zh: '经验', en: 'experience', ex: 'Ich habe schon viel Erfahrung mit Gruppenarbeit.', cat: 'nomen', thema: 'alltag' },
  { de: 'der Erfolg, -e', pos: '名词', zh: '成功', en: 'success', ex: 'Der Erfolg kommt nicht über Nacht.', cat: 'nomen', thema: 'alltag' },
  { de: 'die Bewerbung, -en', pos: '名词', zh: '申请（求职/入学）', en: 'application (job / university)', ex: 'Ich schreibe gerade meine Bewerbung für ein Praktikum.', cat: 'nomen', thema: 'alltag' },
  { de: 'der Termin, -e', pos: '名词', zh: '预约；约定的时间', en: 'appointment; agreed time', ex: 'Ich habe morgen einen Termin beim Arzt.', cat: 'nomen', thema: 'alltag' },
  { de: 'die Umgebung, -en', pos: '名词', zh: '环境；周边', en: 'surroundings; area', ex: 'Die Umgebung hier ist sehr ruhig.', cat: 'nomen', thema: 'alltag' },
  { de: 'der Vorteil, -e', pos: '名词', zh: '优点', en: 'advantage', ex: 'Ein Vorteil von Karteikarten ist, dass man überall lernen kann.', cat: 'nomen', thema: 'alltag' },
  { de: 'der Nachteil, -e', pos: '名词', zh: '缺点', en: 'disadvantage', ex: 'Der Nachteil ist, dass es viel Zeit kostet.', cat: 'nomen', thema: 'alltag' },
  { de: 'die Möglichkeit, -en', pos: '名词', zh: '可能性；机会', en: 'possibility; opportunity', ex: 'Es gibt viele Möglichkeiten, Deutsch zu lernen.', cat: 'nomen', thema: 'alltag' },
  { de: 'der Zusammenhang, "-e', pos: '名词', zh: '关联；联系', en: 'connection; context', ex: 'Ich sehe keinen Zusammenhang zwischen den beiden Problemen.', cat: 'nomen', thema: 'alltag' },
  { de: 'die Entscheidung, -en', pos: '名词', zh: '决定', en: 'decision', ex: 'Das war eine schwierige Entscheidung.', cat: 'nomen', thema: 'alltag' },
  { de: 'die Prüfung, -en', pos: '名词', zh: '考试', en: 'exam', ex: 'Ich bereite mich auf die B1-Prüfung vor.', cat: 'nomen', thema: 'alltag' },
  { de: 'die Aufgabe, -n', pos: '名词', zh: '任务；作业', en: 'task; exercise', ex: 'Die Aufgabe war schwieriger als gedacht.', cat: 'nomen', thema: 'alltag' },
  { de: 'sich bewerben (um + Akk.)', pos: '动词', zh: '申请', en: 'to apply (for)', ex: 'Ich bewerbe mich um einen Studienplatz.', cat: 'verben', thema: 'alltag' },
  { de: 'teilnehmen (an + Dat.)', pos: '动词', zh: '参加', en: 'to take part (in)', ex: 'Ich nehme an einem Deutschkurs teil.', cat: 'verben', thema: 'alltag' },
  { de: 'sich interessieren für', pos: '动词', zh: '对……感兴趣', en: 'to be interested in', ex: 'Ich interessiere mich für deutsche Musik.', cat: 'verben', thema: 'alltag' },
  { de: 'stattfinden', pos: '动词', zh: '举行；发生', en: 'to take place', ex: 'Der Kurs findet am Montag statt.', cat: 'verben', thema: 'alltag' },
  { de: 'verschieben', pos: '动词', zh: '推迟；挪动', en: 'to postpone; to move', ex: 'Wir müssen den Termin verschieben.', cat: 'verben', thema: 'alltag' },
  { de: 'sich entscheiden (für)', pos: '动词', zh: '决定；选择', en: 'to decide (on)', ex: 'Ich habe mich für den B1-Kurs entschieden.', cat: 'verben', thema: 'alltag' },
  { de: 'zunehmen', pos: '动词', zh: '增加', en: 'to increase', ex: 'Die Zahl der Studierenden nimmt zu.', cat: 'verben', thema: 'alltag' },
  { de: 'erreichen', pos: '动词', zh: '达到；够到', en: 'to reach', ex: 'Ich will das B1-Niveau erreichen.', cat: 'verben', thema: 'alltag' },
  { de: 'sich vorbereiten (auf + Akk.)', pos: '动词', zh: '准备', en: 'to prepare (for)', ex: 'Ich bereite mich auf die Prüfung vor.', cat: 'verben', thema: 'alltag' },
  { de: 'empfehlen', pos: '动词', zh: '推荐', en: 'to recommend', ex: 'Kannst du mir ein Buch empfehlen?', cat: 'verben', thema: 'alltag' },
  { de: 'üben', pos: '动词', zh: '练习', en: 'to practise', ex: 'Ich übe jeden Tag eine Stunde.', cat: 'verben', thema: 'alltag' },
  { de: 'zuverlässig', pos: '形容词', zh: '可靠的', en: 'reliable', ex: 'Er ist ein zuverlässiger Kollege.', cat: 'adjektive', thema: 'alltag' },
  { de: 'anstrengend', pos: '形容词', zh: '累人的；费力的', en: 'exhausting', ex: 'Der Tag war sehr anstrengend.', cat: 'adjektive', thema: 'alltag' },
  { de: 'deutlich', pos: '形容词', zh: '清楚的；明确的', en: 'clear; distinct', ex: 'Sprich bitte deutlich.', cat: 'adjektive', thema: 'alltag' },
  { de: 'geduldig', pos: '形容词', zh: '有耐心的', en: 'patient', ex: 'Man muss geduldig sein, wenn man eine Sprache lernt.', cat: 'adjektive', thema: 'alltag' },
  { de: 'obwohl', pos: '连词', zh: '尽管（从句，动词到句末）', en: 'although (verb goes to the end)', ex: 'Obwohl es regnet, gehe ich joggen.', cat: 'sonstiges', thema: 'alltag' },
  { de: 'deshalb', pos: '副词', zh: '因此', en: 'therefore', ex: 'Ich habe früh angefangen, deshalb bin ich fertig.', cat: 'sonstiges', thema: 'alltag' },
  { de: 'außerdem', pos: '副词', zh: '此外', en: 'besides; also', ex: 'Außerdem lese ich jeden Tag Nachrichten.', cat: 'sonstiges', thema: 'alltag' },
  { de: 'trotzdem', pos: '副词', zh: '尽管如此', en: 'nevertheless', ex: 'Es war spät, trotzdem bin ich noch gelaufen.', cat: 'sonstiges', thema: 'alltag' },

  /* ---------- 主题：商业与创意（Lernwortschatz 5 · Geschäftsideen）---------- */
  { de: 'auf eine Idee kommen', pos: '短语', zh: '想到一个主意', en: 'to come up with an idea', ex: 'Wir müssen auf eine neue Idee kommen.', cat: 'sonstiges', thema: 'business' },
  { de: 'der Fortschritt, -e', pos: '名词', zh: '进步；进展', en: 'progress', ex: 'Der Fortschritt ist langsam, aber sichtbar.', cat: 'nomen', thema: 'business' },
  { de: 'die Marke, -n', pos: '名词', zh: '品牌；商标；标记', en: 'brand; label', ex: 'Diese Marke ist in Deutschland sehr bekannt.', cat: 'nomen', thema: 'business' },
  { de: 'der Bedarf (Sg.)', pos: '名词', zh: '需求', en: 'demand; need', ex: 'Der Bedarf an günstigen Wohnungen ist groß.', cat: 'nomen', thema: 'business' },
  { de: 'liefern', pos: '动词', zh: '供应；供货；交付', en: 'to deliver', ex: 'Wir liefern die Ware am Montag.', cat: 'verben', thema: 'business' },
  { de: 'fördern', pos: '动词', zh: '促进；资助；推动', en: 'to promote; to support', ex: 'Die Universität fördert junge Forscher.', cat: 'verben', thema: 'business' },
  { de: 'verbrauchen (Energie verbrauchen)', pos: '动词', zh: '消耗；耗费', en: 'to consume', ex: 'Neue Geräte verbrauchen weniger Strom.', cat: 'verben', thema: 'business' },
  { de: 'verleihen (verleiht, verlieh, hat verliehen)', pos: '动词', zh: '出借；授予', en: 'to lend; to award', ex: 'Die Bibliothek verleiht Bücher für vier Wochen.', cat: 'verben', thema: 'business' },
  { de: 'verteilen', pos: '动词', zh: '分配；分发', en: 'to distribute', ex: 'Wir verteilen die Aufgaben auf drei Tage.', cat: 'verben', thema: 'business' },
  { de: 'haltbar (Frische Milch ist nicht lange haltbar.)', pos: '形容词', zh: '耐放的；可保存的', en: 'durable; long-lasting', ex: 'Frische Milch ist nicht lange haltbar.', cat: 'adjektive', thema: 'business' },

  /* ---------- 主题：天气（Lernwortschatz 5 · Wetter）---------- */
  { de: 'der Blitz, -e', pos: '名词', zh: '闪电', en: 'lightning', ex: 'Der Blitz war über der Stadt zu sehen.', cat: 'nomen', thema: 'wetter' },
  { de: 'blitzen', pos: '动词', zh: '打闪；闪电', en: 'to flash (lightning)', ex: 'Es blitzt und donnert.', cat: 'verben', thema: 'wetter' },
  { de: 'der Donner, -', pos: '名词', zh: '雷；雷声', en: 'thunder', ex: 'Der Donner war noch lange zu hören.', cat: 'nomen', thema: 'wetter' },
  { de: 'donnern', pos: '动词', zh: '打雷；轰鸣', en: 'to thunder', ex: 'Es donnert seit einer Stunde.', cat: 'verben', thema: 'wetter' },
  { de: 'hageln', pos: '动词', zh: '下冰雹', en: 'to hail', ex: 'Gestern hat es gehagelt.', cat: 'verben', thema: 'wetter' },
  { de: 'der Sturm, "-e', pos: '名词', zh: '暴风雨', en: 'storm', ex: 'Ein Sturm kommt auf.', cat: 'nomen', thema: 'wetter' },
  { de: 'mild', pos: '形容词', zh: '温和的', en: 'mild', ex: 'Der Winter ist dieses Jahr mild.', cat: 'adjektive', thema: 'wetter' },
  { de: 'extrem', pos: '形容词', zh: '极端的', en: 'extreme', ex: 'Das Wetter ist extrem wechselhaft.', cat: 'adjektive', thema: 'wetter' },
  { de: 'neblig', pos: '形容词', zh: '有雾的', en: 'foggy', ex: 'Am Morgen ist es oft neblig.', cat: 'adjektive', thema: 'wetter' },
  { de: 'feucht', pos: '形容词', zh: '潮湿的', en: 'humid; damp', ex: 'Die Luft ist heute sehr feucht.', cat: 'adjektive', thema: 'wetter' },
  { de: 'die Wettervorhersage, -n', pos: '名词', zh: '天气预报', en: 'weather forecast', ex: 'Die Wettervorhersage sagt Regen an.', cat: 'nomen', thema: 'wetter' },

  /* ---------- 主题：城市与生活（Lernwortschatz 6 · Leben in der Stadt / Berufe / Orte / Wohnen）---------- */
  { de: 'anonym', pos: '形容词', zh: '匿名的（我笔记里写作「无名的」）', en: 'anonymous', ex: 'Im Internet kann man anonym bleiben.', cat: 'adjektive', thema: 'stadt' },
  { de: 'lebenswert', pos: '形容词', zh: '值得生活的', en: 'worth living in', ex: 'Diese Stadt ist sehr lebenswert.', cat: 'adjektive', thema: 'stadt' },
  { de: 'miteinander', pos: '副词', zh: '互相；共同', en: 'with each other', ex: 'Wir lernen viel miteinander.', cat: 'sonstiges', thema: 'stadt' },
  { de: 'frisch (Ich genieße die frische Luft.)', pos: '形容词', zh: '新鲜的', en: 'fresh', ex: 'Ich genieße die frische Luft.', cat: 'adjektive', thema: 'stadt' },
  { de: 'sich befinden (befindet, befand, hat befunden)', pos: '动词', zh: '位于；处在', en: 'to be located', ex: 'Das Museum befindet sich im Zentrum.', cat: 'verben', thema: 'stadt' },
  { de: 'begegnen', pos: '动词', zh: '碰到；遇见', en: 'to encounter', ex: 'Auf der Straße begegne ich oft Nachbarn.', cat: 'verben', thema: 'stadt' },
  { de: 'die Bildung (Sg.)', pos: '名词', zh: '教育；修养', en: 'education', ex: 'Bildung ist für die Stadt wichtig.', cat: 'nomen', thema: 'stadt' },
  { de: 'der Dienstleistungsbereich, -e', pos: '名词', zh: '服务业', en: 'service sector', ex: 'Im Dienstleistungsbereich arbeiten viele Menschen.', cat: 'nomen', thema: 'stadt' },
  { de: 'heutig (die heutigen Fahrzeuge)', pos: '形容词', zh: '今天的；当今的', en: "today's", ex: 'Die heutigen Fahrzeuge sind viel leiser.', cat: 'adjektive', thema: 'stadt' },
  { de: 'das Homeoffice (Sg.)', pos: '名词', zh: '居家办公', en: 'working from home', ex: 'Ich arbeite zweimal pro Woche im Homeoffice.', cat: 'nomen', thema: 'stadt' },
  { de: 'von ... aus', pos: '短语', zh: '从……（某地）出发', en: 'from ... (a place)', ex: 'Ich arbeite viel von zu Hause aus.', cat: 'sonstiges', thema: 'stadt' },
  { de: 'die Lebensqualität (Sg.)', pos: '名词', zh: '生活质量', en: 'quality of life', ex: 'Die Lebensqualität in der Stadt ist hoch.', cat: 'nomen', thema: 'stadt' },
  { de: 'die Mobilität (Sg.)', pos: '名词', zh: '流动性；机动性', en: 'mobility', ex: 'Mobilität ist für junge Leute wichtig.', cat: 'nomen', thema: 'stadt' },
  { de: 'die Verkehrssituation, -en', pos: '名词', zh: '交通状况', en: 'traffic situation', ex: 'Die Verkehrssituation ist am Morgen schwierig.', cat: 'nomen', thema: 'stadt' },
  { de: 'der Bürgermeister, -', pos: '名词', zh: '市长', en: 'mayor', ex: 'Der Bürgermeister eröffnet das Fest.', cat: 'nomen', thema: 'stadt' },
  { de: 'die Pädagogin, -nen', pos: '名词', zh: '女教师；女教育工作者', en: 'teacher / educator (female)', ex: 'Sie ist Pädagogin an einer Schule.', cat: 'nomen', thema: 'stadt' },
  { de: 'der Praktikant, -en', pos: '名词', zh: '实习生（男）', en: 'intern (male)', ex: 'Der Praktikant arbeitet drei Monate hier.', cat: 'nomen', thema: 'stadt' },
  { de: 'die Doktorandin, -nen', pos: '名词', zh: '女博士生', en: 'doctoral student (female)', ex: 'Sie ist Doktorandin an der Universität.', cat: 'nomen', thema: 'stadt' },
  { de: 'die Akademie, -n', pos: '名词', zh: '研究院；学院', en: 'academy', ex: 'Er arbeitet an der Akademie.', cat: 'nomen', thema: 'stadt' },
  { de: 'das Altenheim, -e', pos: '名词', zh: '养老院；敬老院', en: 'retirement home', ex: 'Meine Großmutter lebt in einem Altenheim.', cat: 'nomen', thema: 'stadt' },
  { de: 'das Fundbüro, -s', pos: '名词', zh: '失物招领处', en: 'lost property office', ex: 'Ich habe meinen Schirm im Fundbüro abgeholt.', cat: 'nomen', thema: 'stadt' },
  { de: 'die Fußgängerzone, -n', pos: '名词', zh: '步行街区', en: 'pedestrian zone', ex: 'In der Fußgängerzone gibt es viele Geschäfte.', cat: 'nomen', thema: 'stadt' },
  { de: 'das Hallenbad, "-er', pos: '名词', zh: '室内游泳池', en: 'indoor swimming pool', ex: 'Wir schwimmen jeden Samstag im Hallenbad.', cat: 'nomen', thema: 'stadt' },
  { de: 'die Kindertagesstätte, -n', pos: '名词', zh: '日托所；托儿所', en: 'day-care centre', ex: 'Sie bringt ihr Kind in die Kindertagesstätte.', cat: 'nomen', thema: 'stadt' },
  { de: 'der Kiosk, -e', pos: '名词', zh: '小卖部；报刊亭', en: 'kiosk', ex: 'Am Kiosk bekommt man Fahrkarten.', cat: 'nomen', thema: 'stadt' },
  { de: 'die Klinik, -en', pos: '名词', zh: '医院；专科医院', en: 'hospital; clinic', ex: 'Er arbeitet in der Klinik.', cat: 'nomen', thema: 'stadt' },
  { de: 'der Tierpark, -s', pos: '名词', zh: '动物园', en: 'zoo', ex: 'Der Tierpark ist am Wochenende voll.', cat: 'nomen', thema: 'stadt' },
  { de: 'die Volkshochschule, -n', pos: '名词', zh: '民众大学；社区大学', en: 'adult education centre', ex: 'Ich mache einen Kurs an der Volkshochschule.', cat: 'nomen', thema: 'stadt' },
  { de: 'der Zirkus, -se', pos: '名词', zh: '马戏团', en: 'circus', ex: 'Der Zirkus kommt nächste Woche in die Stadt.', cat: 'nomen', thema: 'stadt' },
  { de: 'das Stadtviertel, -', pos: '名词', zh: '城区；城市街区', en: 'city district', ex: 'Das Stadtviertel ist sehr ruhig.', cat: 'nomen', thema: 'stadt' },
  { de: 'die Wohnanlage, -n', pos: '名词', zh: '住宅小区', en: 'housing complex', ex: 'Die Wohnanlage hat einen großen Garten.', cat: 'nomen', thema: 'stadt' },

  /* ---------- 主题：未来与计划（Lernwortschatz 6 · Zukunftsvisionen / gute Vorsätze）---------- */
  { de: 'werden (Was wird sich ändern?)', pos: '动词', zh: '将会；变得', en: 'will; to become', ex: 'Was wird sich in der Zukunft ändern?', cat: 'verben', thema: 'zukunft' },
  { de: 'ausgehen von (geht aus, ging aus, ist ausgegangen)', pos: '动词', zh: '从……出发；以……为依据', en: 'to assume; to start from', ex: 'Experten gehen davon aus, dass es wärmer wird.', cat: 'verben', thema: 'zukunft' },
  { de: 'die Prognose, -n', pos: '名词', zh: '预测；预报', en: 'forecast', ex: 'Die Prognose lautet: mehr Regen.', cat: 'nomen', thema: 'zukunft' },
  { de: 'lauten (Die Prognose lautet: ...)', pos: '动词', zh: '（内容）是；写道', en: 'to read; to be worded', ex: 'Die Prognose lautet: mehr Regen.', cat: 'verben', thema: 'zukunft' },
  { de: 'irgendwann', pos: '副词', zh: '某时；总有一天', en: 'sometime', ex: 'Irgendwann möchte ich nach Berlin.', cat: 'sonstiges', thema: 'zukunft' },
  { de: 'voraussichtlich', pos: '副词', zh: '预计；估计', en: 'probably; expected', ex: 'Der Zug kommt voraussichtlich um acht.', cat: 'sonstiges', thema: 'zukunft' },
  { de: 'eventuell', pos: '副词', zh: '也许；有可能', en: 'possibly', ex: 'Eventuell komme ich später.', cat: 'sonstiges', thema: 'zukunft' },
  { de: 'möglicherweise', pos: '副词', zh: '或许；可能', en: 'possibly', ex: 'Möglicherweise regnet es morgen.', cat: 'sonstiges', thema: 'zukunft' },
  { de: 'längst', pos: '副词', zh: '早就；早已', en: 'long since', ex: 'Das ist längst bekannt.', cat: 'sonstiges', thema: 'zukunft' },
  { de: 'das Labor, -e', pos: '名词', zh: '实验室', en: 'laboratory', ex: 'Sie arbeitet im Labor.', cat: 'nomen', thema: 'zukunft' },
  { de: 'der Planet, -en', pos: '名词', zh: '行星', en: 'planet', ex: 'Auf einem anderen Planeten zu leben ist noch Zukunftsmusik.', cat: 'nomen', thema: 'zukunft' },
  { de: 'die Passagierin, -nen', pos: '名词', zh: '女乘客', en: 'passenger (female)', ex: 'Die Passagierin wartet am Gate.', cat: 'nomen', thema: 'zukunft' },
  { de: 'der Chip, -s', pos: '名词', zh: '芯片', en: 'chip', ex: 'Der Chip ist kleiner als ein Fingernagel.', cat: 'nomen', thema: 'zukunft' },
  { de: 'die Haut, "-e', pos: '名词', zh: '皮肤；外表', en: 'skin', ex: 'Die Haut braucht im Sommer Sonnenschutz.', cat: 'nomen', thema: 'zukunft' },
  { de: 'der Anteil, -e', pos: '名词', zh: '份额；比例；部分', en: 'share; proportion', ex: 'Der Anteil der Radfahrer nimmt zu.', cat: 'nomen', thema: 'zukunft' },
  { de: 'das Fünftel, -', pos: '名词', zh: '五分之一', en: 'one fifth', ex: 'Ein Fünftel der Studierenden wohnt im Wohnheim.', cat: 'nomen', thema: 'zukunft' },
  { de: 'wachsen (wächst, wuchs, ist gewachsen)', pos: '动词', zh: '生长；增长；变大', en: 'to grow', ex: 'Die Stadt wächst schnell.', cat: 'verben', thema: 'zukunft' },
  { de: 'der Vorsatz, "-e', pos: '名词', zh: '决心；打算', en: 'resolution; intention', ex: 'Mein Vorsatz für das neue Jahr ist mehr Sport.', cat: 'nomen', thema: 'zukunft' },
  { de: 'fassen (einen Vorsatz fassen)', pos: '动词', zh: '下（决心）；作出（决定）', en: 'to make (a resolution)', ex: 'Ich habe einen Vorsatz gefasst.', cat: 'verben', thema: 'zukunft' },
  { de: 'sich vornehmen (nimmt vor, nahm vor, hat vorgenommen)', pos: '动词', zh: '打算；计划', en: 'to intend; to plan', ex: 'Ich nehme mir vor, früher aufzustehen.', cat: 'verben', thema: 'zukunft' },
  { de: 'realisieren', pos: '动词', zh: '实现', en: 'to realise; to implement', ex: 'Ich will das Projekt dieses Jahr realisieren.', cat: 'verben', thema: 'zukunft' },
  { de: 'gelingen (es gelingt, gelang, ist gelungen)', pos: '动词', zh: '成功；达到', en: 'to succeed', ex: 'Der Plan ist gelungen.', cat: 'verben', thema: 'zukunft' },
  { de: 'der Anlass, "-e', pos: '名词', zh: '缘由；场合', en: 'occasion; reason', ex: 'Der Anlass war mein Geburtstag.', cat: 'nomen', thema: 'zukunft' },
  { de: 'Silvester, - (ohne Artikel)', pos: '名词', zh: '除夕（12 月 31 日）', en: "New Year's Eve", ex: 'Silvester feiern wir zu Hause.', cat: 'nomen', thema: 'zukunft' }
];
