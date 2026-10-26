/* ===========================================================
   B1 高频词表（第 1 部分，来源：桌面「德语b1高频单词.docx」）
   -----------------------------------------------------------
   原文档只有「词 + 中文 + 支配格/动词三形」，没有例句；
   例句是我按 B1 难度自己补的短句，方便放进网站的表格。
   和原文档重复的 4 个词（verbrauchen / erreichen / trotzdem /
   Zusammenhang）已在主词表里，这里不再重复。

   字段同 js/vokabeln-data.js：de / pos / zh / en / ex / cat / thema
   =========================================================== */

const VOKABELN_B1 = [
  { de: 'sich beteiligen (an + Dat.)', pos: '动词', zh: '参与；参加', en: 'to take part (in)', ex: 'Ich beteilige mich an dem Projekt.', cat: 'verben', thema: 'b1' },
  { de: 'der/die Minderjährige, -n', pos: '名词', zh: '未成年人', en: 'minor (under age)', ex: 'Minderjährige brauchen eine Erlaubnis.', cat: 'nomen', thema: 'b1' },
  { de: 'entstehen (entsteht, entstand, entstanden ist)', pos: '动词', zh: '产生；出现', en: 'to arise; to come into being', ex: 'Zwischen uns ist eine Freundschaft entstanden.', cat: 'verben', thema: 'b1' },
  { de: 'zu Fuß gehen', pos: '短语', zh: '步行', en: 'to walk; to go on foot', ex: 'Ich gehe jeden Tag zu Fuß zur Uni.', cat: 'sonstiges', thema: 'b1' },
  { de: 'furchtbar', pos: '形容词', zh: '可怕的；糟糕的', en: 'terrible', ex: 'Das Wetter war furchtbar.', cat: 'adjektive', thema: 'b1' },
  { de: 'die Eintrittskarte, -n', pos: '名词', zh: '入场券；门票', en: 'admission ticket', ex: 'Die Eintrittskarte kostet zwölf Euro.', cat: 'nomen', thema: 'b1' },
  { de: 'reservieren (etw. Akk.)', pos: '动词', zh: '预订；预留', en: 'to reserve', ex: 'Ich möchte einen Tisch für zwei reservieren.', cat: 'verben', thema: 'b1' },
  { de: 'die Kantine, -n', pos: '名词', zh: '职工餐厅', en: 'canteen', ex: 'Wir essen mittags in der Kantine.', cat: 'nomen', thema: 'b1' },
  { de: 'überweisen (überweist, überwies, überwiesen hat)', pos: '动词', zh: '转账；汇款', en: 'to transfer (money)', ex: 'Ich überweise die Miete am Monatsanfang.', cat: 'verben', thema: 'b1' },
  { de: 'fehlerfrei', pos: '形容词', zh: '没有错误的', en: 'error-free', ex: 'Der Text war fast fehlerfrei.', cat: 'adjektive', thema: 'b1' },
  { de: 'damals', pos: '副词', zh: '当时；那时候（过去）', en: 'back then', ex: 'Damals war ich noch in der Schule.', cat: 'sonstiges', thema: 'b1' },
  { de: 'künftig', pos: '形容词', zh: '未来的；将来的', en: 'future', ex: 'Künftig lerne ich jeden Tag Vokabeln.', cat: 'adjektive', thema: 'b1' },
  { de: 'jeweils', pos: '副词', zh: '各自；分别', en: 'respectively; each', ex: 'Die Kurse dauern jeweils zwei Stunden.', cat: 'sonstiges', thema: 'b1' },
  { de: 'in der Lage sein, etw. zu tun', pos: '短语', zh: '有能力做某事', en: 'to be able to do sth.', ex: 'Ich bin nicht in der Lage, heute zu kommen.', cat: 'sonstiges', thema: 'b1' },
  { de: 'die Laune, -n', pos: '名词', zh: '情绪；心情', en: 'mood', ex: 'Heute habe ich gute Laune.', cat: 'nomen', thema: 'b1' },
  { de: 'normalerweise', pos: '副词', zh: '通常；一般情况下', en: 'normally', ex: 'Normalerweise stehe ich um sieben auf.', cat: 'sonstiges', thema: 'b1' },
  { de: 'unnötig', pos: '形容词', zh: '不必要的', en: 'unnecessary', ex: 'Diese Diskussion ist völlig unnötig.', cat: 'adjektive', thema: 'b1' },
  { de: 'bedienen (etw. Akk.)', pos: '动词', zh: '操作', en: 'to operate', ex: 'Kannst du diese Maschine bedienen?', cat: 'verben', thema: 'b1' },
  { de: 'die Fortbildung, -en', pos: '名词', zh: '进修', en: 'further training', ex: 'Die Firma bezahlt meine Fortbildung.', cat: 'nomen', thema: 'b1' },
  { de: 'der Anwalt, "-e (= der Rechtsanwalt)', pos: '名词', zh: '律师', en: 'lawyer', ex: 'Der Anwalt hat den Vertrag geprüft.', cat: 'nomen', thema: 'b1' },
  { de: 'der Fahrplan, "-e', pos: '名词', zh: '列车时刻表', en: 'timetable', ex: 'Der Fahrplan hängt am Bahnhof.', cat: 'nomen', thema: 'b1' },
  { de: 'wöchentlich', pos: '形容词', zh: '每周的', en: 'weekly', ex: 'Wir haben wöchentlich ein Meeting.', cat: 'adjektive', thema: 'b1' },
  { de: 'günstig', pos: '形容词', zh: '划算的；便宜的', en: 'cheap; favourable', ex: 'Die Wohnung ist günstig und zentral.', cat: 'adjektive', thema: 'b1' },
  { de: 'im Vergleich zu + Dat.', pos: '短语', zh: '与……相比', en: 'compared with', ex: 'Im Vergleich zu früher ist es hier ruhiger.', cat: 'sonstiges', thema: 'b1' },
  { de: 'der Strom, "-e', pos: '名词', zh: '电；电流', en: 'electricity', ex: 'Der Strom ist dieses Jahr teurer geworden.', cat: 'nomen', thema: 'b1' },
  { de: 'empfehlenswert', pos: '形容词', zh: '值得推荐的', en: 'recommendable', ex: 'Dieses Buch ist sehr empfehlenswert.', cat: 'adjektive', thema: 'b1' },
  { de: 'aus/bauen (etw. Akk.)', pos: '动词', zh: '扩建；扩大', en: 'to expand; to extend', ex: 'Die Universität baut den Campus aus.', cat: 'verben', thema: 'b1' },
  { de: 'froh', pos: '形容词', zh: '高兴的', en: 'glad', ex: 'Ich bin froh, dass du da bist.', cat: 'adjektive', thema: 'b1' },
  { de: 'die Anmeldung, -en', pos: '名词', zh: '注册；登记', en: 'registration', ex: 'Die Anmeldung ist bis Freitag möglich.', cat: 'nomen', thema: 'b1' },
  { de: 'die Gelegenheit, -en', pos: '名词', zh: '场合；机会', en: 'opportunity; occasion', ex: 'Bei dieser Gelegenheit möchte ich danken.', cat: 'nomen', thema: 'b1' },
  { de: 'religiös', pos: '形容词', zh: '宗教的', en: 'religious', ex: 'Das ist ein religiöses Fest.', cat: 'adjektive', thema: 'b1' },
  { de: 'die Geschwindigkeit, -en', pos: '名词', zh: '速度', en: 'speed', ex: 'Die Geschwindigkeit war zu hoch.', cat: 'nomen', thema: 'b1' },
  { de: 'sich lohnen, etw. zu tun', pos: '动词', zh: '值得做某事', en: 'to be worth doing', ex: 'Es lohnt sich, früh anzufangen.', cat: 'verben', thema: 'b1' },
  { de: 'die Ausnahme, -n', pos: '名词', zh: '例外', en: 'exception', ex: 'Diesmal mache ich eine Ausnahme.', cat: 'nomen', thema: 'b1' },
  { de: 'gefährden (etw. Akk.)', pos: '动词', zh: '危害；损害', en: 'to endanger', ex: 'Rauchen gefährdet die Gesundheit.', cat: 'verben', thema: 'b1' },
  { de: 'sauer', pos: '形容词', zh: '酸的；心情不爽的', en: 'sour; annoyed', ex: 'Warum bist du so sauer?', cat: 'adjektive', thema: 'b1' },
  { de: 'die Ansicht, -en', pos: '名词', zh: '观点；看法', en: 'view; opinion', ex: 'Meiner Ansicht nach ist das falsch.', cat: 'nomen', thema: 'b1' },
  { de: 'Rücksicht auf etw. Akk. nehmen', pos: '短语', zh: '顾及；考虑到', en: 'to be considerate of; to allow for', ex: 'Wir müssen Rücksicht auf die Nachbarn nehmen.', cat: 'sonstiges', thema: 'b1' },
  { de: 'neulich', pos: '副词', zh: '最近；近来', en: 'recently', ex: 'Neulich habe ich ihn getroffen.', cat: 'sonstiges', thema: 'b1' },
  { de: 'das Verbot, -e', pos: '名词', zh: '禁令', en: 'ban; prohibition', ex: 'Hier gilt ein Verbot für Fahrräder.', cat: 'nomen', thema: 'b1' },
  { de: 'jetzig', pos: '形容词', zh: '现在的；目前的', en: 'current', ex: 'Die jetzige Situation ist schwierig.', cat: 'adjektive', thema: 'b1' },
  { de: 'verursachen (etw. Akk.)', pos: '动词', zh: '引起；导致', en: 'to cause', ex: 'Der Regen hat große Probleme verursacht.', cat: 'verben', thema: 'b1' },
  { de: 'hoffentlich', pos: '副词', zh: '希望；但愿', en: 'hopefully', ex: 'Hoffentlich klappt es morgen.', cat: 'sonstiges', thema: 'b1' },
  { de: 'überall', pos: '副词', zh: '到处', en: 'everywhere', ex: 'Ich habe überall gesucht.', cat: 'sonstiges', thema: 'b1' },
  { de: 'betreten (etw. Akk.)', pos: '动词', zh: '走进；进入', en: 'to enter', ex: 'Bitte betreten Sie den Raum leise.', cat: 'verben', thema: 'b1' },
  { de: 'einzig', pos: '形容词', zh: '唯一的', en: 'only; sole', ex: 'Das ist die einzige Lösung.', cat: 'adjektive', thema: 'b1' },
  { de: 'sich verpflichten, etw. zu tun', pos: '动词', zh: '有义务做某事', en: 'to commit oneself to', ex: 'Ich habe mich verpflichtet, zu helfen.', cat: 'verben', thema: 'b1' },
  { de: 'gleichzeitig', pos: '副词', zh: '同时', en: 'at the same time', ex: 'Ich kann nicht gleichzeitig lesen und hören.', cat: 'sonstiges', thema: 'b1' },
  { de: 'schlimm', pos: '形容词', zh: '糟糕的', en: 'bad; serious', ex: 'Das ist nicht so schlimm.', cat: 'adjektive', thema: 'b1' },
  { de: 'der Misserfolg, -e', pos: '名词', zh: '失败', en: 'failure', ex: 'Ein Misserfolg ist kein Weltuntergang.', cat: 'nomen', thema: 'b1' }
];
