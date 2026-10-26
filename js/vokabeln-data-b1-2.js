/* ===========================================================
   B1 高频词表（第 2 部分，来源：桌面「德语b1高频单词.docx」）
   -----------------------------------------------------------
   原文档第 51–100 条；跳过 2 个与主词表重复的词
   （trotzdem、der Zusammenhang）。
   例句同样是按 B1 难度补的短句。
   =========================================================== */

const VOKABELN_B1_2 = [
  { de: 'in der Tat', pos: '短语', zh: '事实上', en: 'in fact', ex: 'In der Tat ist das richtig.', cat: 'sonstiges', thema: 'b1' },
  { de: 'ohne Zweifel', pos: '短语', zh: '毫无疑问', en: 'without doubt', ex: 'Ohne Zweifel ist sie die Beste.', cat: 'sonstiges', thema: 'b1' },
  { de: 'beeinflussen (etw. Akk.)', pos: '动词', zh: '影响', en: 'to influence', ex: 'Das Wetter beeinflusst meine Stimmung.', cat: 'verben', thema: 'b1' },
  { de: 'absehbar', pos: '形容词', zh: '可预见的', en: 'foreseeable', ex: 'Ein Ende ist nicht absehbar.', cat: 'adjektive', thema: 'b1' },
  { de: 'endgültig', pos: '形容词', zh: '最终的', en: 'final', ex: 'Das ist meine endgültige Antwort.', cat: 'adjektive', thema: 'b1' },
  { de: '(eine) Entscheidung treffen', pos: '短语', zh: '作出一个决定', en: 'to make a decision', ex: 'Ich muss heute eine Entscheidung treffen.', cat: 'sonstiges', thema: 'b1' },
  { de: 'die Gewerkschaft, -en', pos: '名词', zh: '工会', en: 'trade union', ex: 'Die Gewerkschaft fordert mehr Lohn.', cat: 'nomen', thema: 'b1' },
  { de: 'ignorieren (etw. Akk.)', pos: '动词', zh: '忽视；忽略', en: 'to ignore', ex: 'Er ignoriert meine E-Mails.', cat: 'verben', thema: 'b1' },
  { de: 'los/fahren (fährt los, fuhr los, losgefahren ist)', pos: '动词', zh: '启程；出发', en: 'to set off', ex: 'Wir fahren um sechs Uhr los.', cat: 'verben', thema: 'b1' },
  { de: 'die Erlaubnis, -se', pos: '名词', zh: '许可；允许', en: 'permission', ex: 'Ich brauche die Erlaubnis meiner Eltern.', cat: 'nomen', thema: 'b1' },
  { de: 'zweiwöchig', pos: '形容词', zh: '为期两周的', en: 'two-week', ex: 'Wir machen ein zweiwöchiges Praktikum.', cat: 'adjektive', thema: 'b1' },
  { de: 'notwendig', pos: '形容词', zh: '必需的；必备的', en: 'necessary', ex: 'Eine Anmeldung ist notwendig.', cat: 'adjektive', thema: 'b1' },
  { de: 'aus aller Welt', pos: '短语', zh: '来自世界各地', en: 'from all over the world', ex: 'Hier studieren Leute aus aller Welt.', cat: 'sonstiges', thema: 'b1' },
  { de: 'der Überblick, -e', pos: '名词', zh: '概况；概论', en: 'overview', ex: 'Am Anfang gab es einen Überblick über den Kurs.', cat: 'nomen', thema: 'b1' },
  { de: 'das Praktikum, die Praktika', pos: '名词', zh: '实习', en: 'internship', ex: 'Ich mache ein Praktikum bei einer Firma.', cat: 'nomen', thema: 'b1' },
  { de: 'deswegen', pos: '副词', zh: '所以；因此（占句首，不构成从句）', en: 'therefore', ex: 'Ich war krank, deswegen fehle ich heute.', cat: 'sonstiges', thema: 'b1' },
  { de: 'der Blutdruck (Sg.)', pos: '名词', zh: '血压', en: 'blood pressure', ex: 'Der Arzt misst meinen Blutdruck.', cat: 'nomen', thema: 'b1' },
  { de: 'verwenden (etw. Akk.)', pos: '动词', zh: '使用', en: 'to use', ex: 'Ich verwende lieber einen Stift.', cat: 'verben', thema: 'b1' },
  { de: 'nicht unbedingt', pos: '短语', zh: '未必；不一定', en: 'not necessarily', ex: 'Das ist nicht unbedingt nötig.', cat: 'sonstiges', thema: 'b1' },
  { de: 'sich an/stecken (mit + Dat.)', pos: '动词', zh: '感染', en: 'to catch (an illness)', ex: 'Ich habe mich mit einer Erkältung angesteckt.', cat: 'verben', thema: 'b1' },
  { de: 'das Unternehmen, -', pos: '名词', zh: '企业；公司', en: 'company', ex: 'Das Unternehmen hat 200 Mitarbeiter.', cat: 'nomen', thema: 'b1' },
  { de: 'schwitzen', pos: '动词', zh: '出汗', en: 'to sweat', ex: 'Bei dieser Hitze schwitze ich sofort.', cat: 'verben', thema: 'b1' },
  { de: 'ungewöhnlich', pos: '形容词', zh: '不同寻常的', en: 'unusual', ex: 'Das ist ein ungewöhnlicher Fall.', cat: 'adjektive', thema: 'b1' },
  { de: 'die Flüssigkeit, -en', pos: '名词', zh: '液体', en: 'liquid', ex: 'Trink genug Flüssigkeit!', cat: 'nomen', thema: 'b1' },
  { de: 'der Experte, -n, -n', pos: '名词', zh: '专家（阳性弱变化）', en: 'expert', ex: 'Ein Experte hat den Text geprüft.', cat: 'nomen', thema: 'b1' },
  { de: 'an Bedeutung verlieren', pos: '短语', zh: '越来越不重要', en: 'to become less important', ex: 'Briefe verlieren an Bedeutung.', cat: 'sonstiges', thema: 'b1' },
  { de: 'auf jeden Fall', pos: '短语', zh: '无论如何都要', en: 'in any case', ex: 'Ich komme auf jeden Fall.', cat: 'sonstiges', thema: 'b1' },
  { de: 'der Vermieter, -', pos: '名词', zh: '出租者；房东', en: 'landlord', ex: 'Der Vermieter erhöht die Miete.', cat: 'nomen', thema: 'b1' },
  { de: 'das Verhältnis, -se', pos: '名词', zh: '关系；比例', en: 'relationship; ratio', ex: 'Wir haben ein gutes Verhältnis.', cat: 'nomen', thema: 'b1' },
  { de: 'die Pille, -n', pos: '名词', zh: '药丸', en: 'pill', ex: 'Nimm die Pille nach dem Essen.', cat: 'nomen', thema: 'b1' },
  { de: 'ab/halten (jn. Akk. von etw. Dat.)', pos: '动词', zh: '阻止某人做某事', en: 'to keep sb. from sth.', ex: 'Lass dich nicht von deiner Angst abhalten.', cat: 'verben', thema: 'b1' },
  { de: 'stoßen auf (etw. Akk.)', pos: '动词', zh: '遭遇；碰到', en: 'to come across', ex: 'Ich bin auf ein Problem gestoßen.', cat: 'verben', thema: 'b1' },
  { de: 'zahlreich', pos: '形容词', zh: '大量的；众多的', en: 'numerous', ex: 'Zahlreiche Studenten haben teilgenommen.', cat: 'adjektive', thema: 'b1' },
  { de: 'selbstbewusst', pos: '形容词', zh: '自信的', en: 'self-confident', ex: 'Sie wirkt sehr selbstbewusst.', cat: 'adjektive', thema: 'b1' },
  { de: 'ausführlich', pos: '形容词', zh: '详细的', en: 'detailed', ex: 'Er hat ausführlich geantwortet.', cat: 'adjektive', thema: 'b1' },
  { de: 'unterwegs', pos: '副词', zh: '在路上', en: 'on the way', ex: 'Ich bin gerade unterwegs.', cat: 'sonstiges', thema: 'b1' },
  { de: 'technisch', pos: '形容词', zh: '技术方面的', en: 'technical', ex: 'Es gibt ein technisches Problem.', cat: 'adjektive', thema: 'b1' },
  { de: 'sich konzentrieren (auf + Akk.)', pos: '动词', zh: '把注意力集中在……上面', en: 'to concentrate (on)', ex: 'Ich kann mich nicht konzentrieren.', cat: 'verben', thema: 'b1' },
  { de: 'zu/geben (etw. Akk.)', pos: '动词', zh: '承认', en: 'to admit', ex: 'Ich gebe zu, dass ich falsch lag.', cat: 'verben', thema: 'b1' },
  { de: 'das Nahrungsmittel, -', pos: '名词', zh: '食物', en: 'foodstuff', ex: 'Reis ist ein wichtiges Nahrungsmittel.', cat: 'nomen', thema: 'b1' },
  { de: 'vermeiden (etw. Akk.)', pos: '动词', zh: '避免', en: 'to avoid', ex: 'Ich vermeide es, spät zu essen.', cat: 'verben', thema: 'b1' },
  { de: 'das Schaufenster, -', pos: '名词', zh: '橱窗', en: 'shop window', ex: 'Ich bleibe vor dem Schaufenster stehen.', cat: 'nomen', thema: 'b1' },
  { de: 'sich bedanken (bei + Dat.)', pos: '动词', zh: '向某人表示感谢', en: 'to thank (sb.)', ex: 'Ich bedanke mich bei dir für die Hilfe.', cat: 'verben', thema: 'b1' },
  { de: 'an/zweifeln (etw. Akk.)', pos: '动词', zh: '质疑；怀疑', en: 'to doubt', ex: 'Ich zweifle seine Aussage an.', cat: 'verben', thema: 'b1' },
  { de: 'ausgesprochen', pos: '副词', zh: '非常；尤其', en: 'decidedly; very', ex: 'Das war ausgesprochen freundlich.', cat: 'sonstiges', thema: 'b1' },
  { de: 'reagieren (auf + Akk.)', pos: '动词', zh: '对……作出反应', en: 'to react (to)', ex: 'Er hat nicht auf meine Mail reagiert.', cat: 'verben', thema: 'b1' }
];
