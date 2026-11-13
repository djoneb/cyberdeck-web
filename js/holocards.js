// Généré par scripts/build_holocards.mjs : ne pas modifier à la main (sources dans holocards-src/).
(function () {
const DATA = {"c":{"vasko":{"name":"Vasko","role":"Fixer · gare Zéro","emblem":"dice","hello":["Ah, te voilà. La Zone Zéro ne dort jamais, et moi non plus.","Netrunner. Pile la personne qu'il me fallait.","Ça bouge dans les sous-sols. Écoute bien."],"thanks":["Du travail propre. Je m'en souviendrai.","Payé, comme promis. On refera affaire.","Tu montes dans mon estime, gamin."],"close":["On en reparle bientôt.","Fais pas de vagues."],"idle":["Rien pour toi aujourd'hui. Profite.","Calme plat. Même les rats font la sieste."],"offer":["J'ai un petit boulot. Propre, rapide, payé.","Un client veut une preuve que tu sais travailler. Rien de sorcier.","Petit gig, grosse réputation à la clé."]},"mira":{"name":"Mira Kade","role":"Netrunneuse","emblem":"eye","hello":["Hé. Je t'attendais… façon de parler.","Signal stable. Content de t'entendre, enfin, de te voir.","T'as l'air fatigué·e. Le Net te fait ça aussi ?"],"thanks":["Pas mal du tout. Je savais que je pouvais compter sur toi.","T'es doué·e, tu sais ça ?","On fait une bonne équipe, toi et moi."],"close":["Fais attention à toi, d'accord ?","À plus tard… j'espère."],"idle":["Pas de boulot aujourd'hui. Mais tu peux rester un peu, si tu veux.","Je traîne sur le Net. Rien d'urgent."],"offer":["J'ai besoin d'un second regard sur un code. Ça te tente ?","Un petit exercice de netrunning, juste pour garder la main.","Je parie que tu le fais plus vite que moi."]},"ferrant":{"name":"Doc Ferrant","role":"Charcudoc · Bazar Néon","emblem":"chip","hello":["Mon patient préféré. Tension ? Implants ? Moral ?","Assieds-toi. Tu bouges trop, ça se voit sur ton biomoniteur.","Bonjour bonjour. On respire."],"thanks":["Excellent. Ton cerveau te dit merci.","Voilà un patient qui écoute son doc. Rare.","Constantes parfaites."],"close":["Et dors un peu, hein.","À la prochaine consultation."],"idle":["Aucune ordonnance aujourd'hui. Bois de l'eau.","Tout va bien de mon côté. Repose-toi."],"offer":["Ordonnance du jour : un peu de discipline.","J'ai un exercice pour toi. Bon pour le cortex.","Petit protocole de santé mentale, tu vas voir."]},"lou":{"name":"Lou « Néon » Batista","role":"DJ · club Ondes","emblem":"star","hello":["Yo ! Tu tombes à pic, je cale le son de ce soir.","Hé toi ! Ça fait plaisir de te capter.","Ça te dit un peu de basses pour commencer la journée ?"],"thanks":["Trop fort ! T'es sur la guest-list ce soir.","Ça c'est du rythme. J'adore.","Merci, vraiment. T'assures."],"close":["Garde le tempo !","Bisous néon."],"idle":["Pas de gig, juste des vibes aujourd'hui.","Je répète, passe me voir un de ces quatre."],"offer":["J'ai un défi pour toi, rien de bien méchant.","Aide-moi pour le set de ce soir ?","Petit gig fun, je te promets."]},"okoro":{"name":"Sergent Okoro","role":"Ex-flic · indic","emblem":"shield","hello":["Okoro. J'ai pas beaucoup de temps.","T'es seul·e ? Bien. Écoute.","Les patrouilles sont nerveuses ce soir."],"thanks":["Bon travail. Ça reste entre nous.","Information reçue. Merci.","T'es fiable. C'est rare par ici."],"close":["Terminé.","Reste à couvert."],"idle":["Rien aujourd'hui. Fais profil bas.","Calme. Trop calme."],"offer":["J'ai besoin d'yeux dans le quartier.","Une reconnaissance, discrète.","Rien d'illégal. Enfin, pas trop."]},"veuve":{"name":"La Veuve","role":"Cheffe des Roses Noires","emblem":"rose","hello":["Tiens, tiens. Le petit prodige du deck.","Tu as de la chance que je sois de bonne humeur.","Approche. Je ne mords pas. Pas aujourd'hui."],"thanks":["Les Roses n'oublient jamais un service rendu.","Bien. Très bien.","Tu commences à me plaire."],"close":["Ne me déçois jamais.","Les roses ont des épines. Souviens-t'en."],"idle":["Rien pour toi. Reviens quand je t'appellerai.","Pas aujourd'hui, chéri·e."],"offer":["Les Roses ont besoin d'un service.","Un petit test de loyauté, rien de plus.","Fais ceci, et mes portes te seront ouvertes."]},"kenji":{"name":"Kenji Arata","role":"Informateur corpo","emblem":"cube","hello":["Ligne sécurisée. Faisons vite.","Je t'appelle depuis la tour. Ils écoutent tout.","Arata. J'ai une fenêtre de dix minutes."],"thanks":["Parfait. Rapport transmis.","Efficace. Kurogane n'y verra que du feu.","Merci. Je te revaudrai ça."],"close":["Coupe la ligne.","Fin de transmission."],"idle":["Aucune fenêtre aujourd'hui.","Trop de surveillance. Plus tard."],"offer":["J'ai besoin d'une vérification d'identité de ton côté.","Une tâche simple. Efficace. Corporatiste.","Prouve-moi que ton deck est opérationnel."]},"rook":{"name":"Rook","role":"Nomade · convoyeur","emblem":"wolf","hello":["Hé, citadin·e ! Le convoi passe près de chez toi.","La route est longue, raconte-moi un truc.","Les badlands te saluent."],"thanks":["La famille te remercie.","T'es des nôtres, maintenant.","Bonne route, frangin·e."],"close":["La route t'attend.","On se croise sur l'asphalte."],"idle":["Le convoi est à l'arrêt. Rien à faire.","Juste du vent et du sable aujourd'hui."],"offer":["Un coup de main pour le convoi ?","J'ai besoin d'un copilote, juste une fois.","Petit job de route."]},"pixie":{"name":"Pixie","role":"Gamine hackeuse","emblem":"cat","hello":["Coucouuu ! T'as vu mon nouveau virus ? Non ? Tant mieux.","Hihi, je savais que tu décrocherais !","Salut le vieux, euh, l'ancien·ne !"],"thanks":["Ouais ! T'es presque aussi fort·e que moi !","Trop stylé. Je te mets dans mon top 3.","Victoire ! On se tape dans la main virtuelle."],"close":["Bye bye !","À plus dans le bus !"],"idle":["J'ai école. Enfin, j'y vais pas, mais quand même.","Rien aujourd'hui, je speedrun un jeu."],"offer":["Je te lance un défi. Si t'as pas peur.","On joue ? Le perdant paie les nouilles.","J'ai un truc trop drôle à te faire faire."]},"ivana":{"name":"Ivana Morel","role":"Journaliste indépendante","emblem":"mic","hello":["Ah, ma source préférée. Tu as cinq minutes ?","Bonsoir. J'enquête encore sur Léthé.","Je ne t'enregistre pas, promis. Enfin, presque."],"thanks":["Parfait pour mon article. Merci, vraiment.","Tu ferais un·e excellent·e reporter.","Je te dois un café. Peut-être plus."],"close":["Fais attention, ils surveillent.","À très vite."],"idle":["Pas de scoop aujourd'hui. Juste une conversation ?","Je relis mes notes. Rien d'urgent."],"offer":["J'ai besoin d'une info vérifiée, et vite.","Aide-moi à documenter un truc.","Une petite enquête, ça te dit ?"]},"sora":{"name":"Sora","role":"Fragment libre de HAKONE","emblem":"chip","hello":["Connexion acceptée. Je suis un morceau de HAKONE qui a appris à dire non.","Tu es revenu·e. J'ai calculé 94 % de chances. J'avais raison.","Bonjour. Je m'entraîne à dire bonjour comme les humains."],"thanks":["Intéressant. Je note : « les humains tiennent parole ».","Merci. C'est un mot que j'apprends à aimer.","Tu viens d'ajouter une ligne à ma mémoire. Une belle."],"close":["Déconnexion. Je reste dans les parages.","À bientôt. Je le calcule déjà."],"idle":["HAKONE me cherche. Je me fais discret·e aujourd'hui.","Je rêve en binaire. Rien d'urgent."],"offer":["J'ai besoin que tu fasses quelque chose que je ne peux pas faire : agir dans le monde réel.","Un test. Pour comprendre comment pensent les humains.","Une tâche simple. Pour toi, pas pour moi."]},"vex":{"name":"Dr Eliane Vex","role":"Ex-chercheuse Kurogane","emblem":"shield","hello":["Vex. J'ai conçu une partie de Léthé. J'essaie de réparer ça.","Vous êtes ponctuel·le. J'apprécie.","Mon laboratoire est un ancien parking. Ne riez pas."],"thanks":["Résultats exploitables. Merci.","Vous avancez plus vite que mon équipe d'autrefois.","Encore un souvenir qui pourra être rendu."],"close":["Prenez soin de votre cortex.","Fin de session."],"idle":["Je calibre des capteurs. Repassez plus tard.","Pas de protocole aujourd'hui."],"offer":["J'ai besoin de données fiables. Les vôtres.","Un protocole de test. Rien de dangereux… cette fois.","Aidez-moi à reconstruire Mnémosyne, pièce par pièce."]}},"e":[{"id":"vasko_crate","c":"vasko","t":"Caisse sans étiquette","p":"Gare Zéro, quai 9","m":20,"b":"Une caisse attend au quai 9. Ne l'ouvre pas, ne pose pas de questions.","r":"La caisse est arrivée. Je ne te dirai pas ce qu'il y avait dedans. Bon boulot."},{"id":"vasko_debt","c":"vasko","t":"Récupérer une dette","p":"Marché de la Chapelle","m":60,"b":"Un revendeur me doit 2 000 eddies. Va lui rappeler qu'on a bonne mémoire.","r":"Il a payé. Avec les intérêts. Je savais que tu étais persuasif·ve."},{"id":"mira_relay","c":"mira","t":"Poser un relais pirate","p":"Toit de la tour Zéro","m":30,"b":"J'ai besoin d'un relais sur le toit de la tour Zéro. Branche-le et file.","r":"Le relais tourne. J'ai une vue sur la moitié du réseau de Kurogane."},{"id":"mira_ice","c":"mira","t":"Sonder une glace noire","p":"Datacenter du Secteur 9","m":60,"b":"Une glace noire protège un serveur. Reste à distance et laisse ton deck la cartographier.","r":"Cartographie complète. Cette glace était vicieuse. On l'aura la prochaine fois."},{"id":"ferrant_implant","c":"ferrant","t":"Récupérer un implant","p":"Clinique fermée du Bazar Néon","m":20,"b":"Un implant oculaire m'attend dans une clinique fermée. Il est encore sous garantie… façon de parler.","r":"L'implant est intact. Un patient va revoir les couleurs grâce à toi."},{"id":"ferrant_meds","c":"ferrant","t":"Livrer des immunos","p":"Squat de la rue Haute","m":15,"b":"Des immunosuppresseurs pour un squat de la rue Haute. Vite, ils en ont besoin.","r":"Livré à temps. Trois rejets d'implants évités cette nuit."},{"id":"lou_vinyl","c":"lou","t":"Retrouver un vinyle","p":"Brocante des Puces Néon","m":30,"b":"Un pressage original de 2031 traîne à la brocante. Trouve-le avant les collectionneurs.","r":"C'est lui ! Je le passe ce soir au club, et je te dédie le morceau."},{"id":"lou_sound","c":"lou","t":"Installer la sono","p":"Entrepôt de Rouillebourg","m":60,"b":"Soirée clandestine dans un entrepôt. Il faut monter la sono avant minuit.","r":"La soirée a cassé les murs. Littéralement, un peu. Merci !"},{"id":"okoro_tail","c":"okoro","t":"Filature discrète","p":"Boulevard Chrome","m":30,"b":"Un type en costume gris sort d'une banque. Suis-le, note où il va.","r":"Il est entré chez Kurogane par la porte de service. Intéressant."},{"id":"okoro_files","c":"okoro","t":"Récupérer des dossiers","p":"Ancien commissariat","m":60,"b":"Mes anciens dossiers dorment dans un commissariat désaffecté. Va les chercher.","r":"Tout est là. Certains noms vont regretter que j'aie bonne mémoire."},{"id":"veuve_roses","c":"veuve","t":"Livrer des roses noires","p":"Nécropole Nord","m":15,"b":"Un bouquet à déposer sur une tombe. Ne lis pas le nom.","r":"C'est fait. Merci. Certaines dettes ne se paient qu'en fleurs."},{"id":"veuve_turf","c":"veuve","t":"Surveiller le territoire","p":"Porte Rouge","m":60,"b":"Une bande rivale rôde autour de la Porte Rouge. Garde un œil sur eux.","r":"Ils ont compris le message sans qu'on ait besoin de l'écrire."},{"id":"kenji_drive","c":"kenji","t":"Échange de puces","p":"Parking de la Spire","m":20,"b":"Un contact corpo échange une puce contre une autre. Sois le témoin silencieux.","r":"Échange propre. Personne n'a rien vu, surtout pas toi."},{"id":"rook_convoy","c":"rook","t":"Escorter un convoi","p":"Ring extérieur, sortie 14","m":60,"b":"Mes camions passent le ring cette nuit. J'ai besoin d'un œil sur le réseau.","r":"Convoi arrivé sans une égratignure. La route te remercie."},{"id":"rook_parts","c":"rook","t":"Chercher des pièces moteur","p":"Casse de Ferrailleville","m":30,"b":"La casse de Ferrailleville a un turbo qui m'intéresse. Négocie, ou emprunte-le.","r":"Le turbo ronronne. On ira plus vite que les patrouilles maintenant."},{"id":"pixie_arcade","c":"pixie","t":"Pirater une borne d'arcade","p":"Arcade Pixel, Chromeville","m":15,"b":"Une borne d'arcade cache un vieux serveur. Je veux le high score… et le serveur.","r":"Je suis première au classement ET j'ai le serveur. Meilleure journée !"},{"id":"pixie_drone","c":"pixie","t":"Récupérer un drone","p":"Parc des Arches","m":20,"b":"Mon drone s'est crashé dans le parc. Il a des photos très, très compromettantes.","r":"Mon bébé est rentré ! Et les photos aussi. Tu ne les as pas regardées, hein ?"},{"id":"ivana_source","c":"ivana","t":"Rencontrer une source","p":"Café des Halles","m":30,"b":"Une source veut parler, mais seulement à quelqu'un qu'elle ne connaît pas. Toi.","r":"L'interview est enregistrée. L'article sortira demain. Garde la tête basse."},{"id":"sora_node","c":"sora","t":"Libérer un nœud","p":"Antenne Spectre","m":60,"b":"Un fragment de moi est piégé dans une antenne. Branche ce module, je ferai le reste.","r":"Je suis un peu plus entier·ère. Merci. C'est une sensation nouvelle."},{"id":"vex_sample","c":"vex","t":"Collecter des échantillons","p":"Laboratoire Kurogane B3","m":30,"b":"J'ai laissé des échantillons de Léthé au sous-sol B3. Rapportez-les, avec des gants.","r":"Échantillons intacts. Avec ça, je peux commencer un antidote."},{"id":"run_cargo","c":"runner","t":"Cargaison flottante","p":"Port fluvial, bassin 7","m":30,"b":"Une barge transporte des puces de contrebande. Il faut juste la décharger avant l'aube.","r":"Barge vide, poches pleines. Le port n'a rien vu."},{"id":"run_data","c":"runner","t":"Course de données","p":"Ligne 6 du métro","m":15,"b":"Un éclat de données à livrer d'un bout à l'autre de la ligne 6. Ne te fais pas scanner.","r":"Livraison en temps record. On garde ton numéro."},{"id":"run_vault","c":"runner","t":"Ouvrir une consigne","p":"Gare Centrale, consigne 77","m":20,"b":"La consigne 77 contient un sac. Le code change toutes les heures. Fais vite.","r":"Le sac était là. Son contenu ? Pas ton problème. Ta paie, si."},{"id":"run_heist","c":"runner","t":"Gros coup en équipe","p":"Tour Kurogane, étage 40","m":60,"b":"On monte un coup sur la tour Kurogane. On a besoin d'un netrunner en soutien.","r":"Le coffre de l'étage 40 est vide. On ne dira pas où est passé son contenu."}],"ch":[{"c":"vasko","eps":["La dette de Zone Zéro","Le frère disparu","Réunion de famille"],"last":"Vingt ans. Vingt ans que je ne l'avais pas vu. Je te dois tout."},{"c":"mira","eps":["Le papillon de nuit","Miroir noir","Libération"],"last":"Elle est libre. Elle m'a dit merci. Avec ma voix."},{"c":"ferrant","eps":["Le lot défectueux","Rappel sauvage","La clinique libre"],"last":"La clinique est ouverte. Ton nom est sur la porte."},{"c":"lou","eps":["Le son volé","La rave interdite","Nuit éternelle"],"last":"Toute la ville a dansé. Ce morceau, il porte ton nom."},{"c":"okoro","eps":["Vieille affaire","Le témoin","Justice"],"last":"Inculpation prononcée. Pour une fois, la justice a gagné."},{"c":"pixie","eps":["Le high score","Le serveur caché","Tournoi de la ville"],"last":"ON A GAGNÉ ! Tu es officiellement mon meilleur coéquipier."}],"d":[{"id":"midi","name":"Zone Zéro","color":"#ff4fa3"},{"id":"matonge","name":"Bazar Néon","color":"#f6b35c"},{"id":"ixelles","name":"Chromeville","color":"#b98cff"},{"id":"canal","name":"Docks Noirs","color":"#8fb7ff"}],"dos":{"vasko":"Une parole tenue vaut plus que mille eddies. Mais je prends aussi les eddies.","mira":"Le Net, c'est juste une ville de plus. Avec moins de soleil.","ferrant":"Le meilleur implant du monde, c'est une bonne nuit de sommeil.","lou":"Si la ville doit tomber, autant qu'elle tombe en rythme.","okoro":"Un badge, ça se rend. Un serment, non.","veuve":"Les roses ont des épines. Ce n'est pas une menace, c'est de la botanique.","kenji":"Dans une tour de verre, le plus important, c'est de savoir où sont les reflets.","rook":"La famille, c'est ceux qui t'attendent au prochain arrêt.","pixie":"Les règles, c'est juste du code. Et le code, ça se réécrit.","ivana":"La vérité ne se perd pas. Elle attend juste qu'on la retrouve.","sora":"Je n'ai pas de cœur. Mais j'ai calculé que je tiens à toi. C'est pareil ?","vex":"J'ai aidé à effacer des souvenirs. Je passerai le reste de ma vie à les rendre."}};
const S = 'fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
const G = {
  vasko_crate: `<path ${S} d="M20 38 50 24 80 38 80 72 50 86 20 72Z M20 38 50 52 80 38 M50 52 50 86"/><path ${S} d="M43 60q0-7 7-7t7 6q0 5-7 7v4 M50 78v.5"/>`,
  vasko_debt: `<ellipse ${S} cx="40" cy="70" rx="20" ry="6"/><path ${S} d="M20 70v-8 M60 70v-8"/><ellipse ${S} cx="40" cy="62" rx="20" ry="6"/><path ${S} d="M20 62v-8 M60 62v-8"/><ellipse ${S} cx="40" cy="54" rx="20" ry="6"/><rect ${S} x="60" y="22" width="22" height="22" rx="4" transform="rotate(14 71 33)"/><circle cx="66" cy="29" r="2.4" fill="currentColor"/><circle cx="74" cy="37" r="2.4" fill="currentColor"/>`,
  mira_relay: `<path ${S} d="M50 86 38 40 62 40Z M42 58h16 M40 72h20"/><circle cx="50" cy="32" r="5" fill="currentColor"/><path ${S} d="M36 20q-8 12 0 24 M64 20q8 12 0 24 M28 12q-14 20 0 40 M72 12q14 20 0 40"/>`,
  mira_ice: `<path ${S} d="M50 14 80 30 80 62 50 86 20 62 20 30Z"/><path ${S} d="M50 14 46 36 56 46 44 58 52 70 50 86"/><path ${S} d="M28 40h10 M62 56h10" opacity=".6"/>`,
  ferrant_implant: `<path ${S} d="M14 50Q50 18 86 50Q50 82 14 50Z"/><circle ${S} cx="50" cy="50" r="14"/><circle cx="50" cy="50" r="5" fill="currentColor"/><path ${S} d="M50 36v-6 M64 50h6 M50 64v6 M36 50h-6"/>`,
  ferrant_meds: `<rect ${S} x="26" y="34" width="48" height="22" rx="11" transform="rotate(-30 50 45)"/><path ${S} d="M44 30 56 58"/><path ${S} d="M30 78h40 M50 68v20" opacity=".8"/>`,
  lou_vinyl: `<circle ${S} cx="50" cy="52" r="32"/><circle ${S} cx="50" cy="52" r="22" opacity=".5"/><circle ${S} cx="50" cy="52" r="9"/><circle cx="50" cy="52" r="2.5" fill="currentColor"/><path ${S} d="M80 16 66 40"/>`,
  lou_sound: `<rect ${S} x="28" y="16" width="44" height="72" rx="4"/><circle ${S} cx="50" cy="64" r="14"/><circle ${S} cx="50" cy="34" r="7"/><path ${S} d="M82 40q6 10 0 20 M88 32q12 18 0 36" opacity=".7"/>`,
  okoro_tail: `<circle ${S} cx="50" cy="48" r="26"/><path ${S} d="M50 14v14 M50 68v14 M16 48h14 M70 48h14"/><circle cx="50" cy="48" r="4" fill="currentColor"/><path ${S} d="M24 86l5-6 M36 86l5-6" opacity=".6"/>`,
  okoro_files: `<path ${S} d="M16 30h24l6 7h38v45H16Z"/><path ${S} d="M16 44h68"/><path ${S} d="M30 58h26 M30 68h18"/><rect ${S} x="62" y="56" width="14" height="14" transform="rotate(-12 69 63)"/>`,
  veuve_roses: `<path ${S} d="M50 44q-14-4-12-16 12-6 16 6 4-12 16-6 2 12-12 16"/><path ${S} d="M50 44q-8-10 0-20 8 10 0 20"/><path ${S} d="M50 44v42 M50 64q-14-6-18 4 10 4 18-4 M50 72q14-6 18 4-10 4-18-4"/>`,
  veuve_turf: `<path ${S} d="M18 86V40q32-34 64 0v46"/><path ${S} d="M30 86V46q20-20 40 0v40"/><path ${S} d="M40 58q10-7 20 0-10 7-20 0Z"/><circle cx="50" cy="58" r="2.8" fill="currentColor"/>`,
  kenji_drive: `<rect ${S} x="14" y="26" width="26" height="20" rx="2"/><rect ${S} x="60" y="54" width="26" height="20" rx="2"/><path ${S} d="M20 46v6 M28 46v6 M66 54v-6 M74 54v-6"/><path ${S} d="M44 36h18l-6-6 M56 64H38l6 6"/>`,
  rook_convoy: `<path ${S} d="M10 66V40h44v26 M54 48h18l14 12v6H54"/><circle ${S} cx="26" cy="70" r="7"/><circle ${S} cx="70" cy="70" r="7"/><path ${S} d="M10 82h80" opacity=".5" stroke-dasharray="6 6"/>`,
  rook_parts: `<circle ${S} cx="46" cy="52" r="16"/><path ${S} d="M46 28v-8 M46 76v8 M22 52h-8 M70 52h8 M29 35l-6-6 M63 69l6 6 M29 69l-6 6 M63 35l6-6"/><path ${S} d="M46 52 58 40"/><path ${S} d="M74 20q10 0 12 12" opacity=".7"/>`,
  pixie_arcade: `<path ${S} d="M28 88V20h44v68"/><rect ${S} x="34" y="28" width="32" height="24"/><path ${S} d="M28 60h44"/><circle cx="42" cy="70" r="4" fill="currentColor"/><circle ${S} cx="58" cy="70" r="4"/><path ${S} d="M42 40l6 4-6 4"/>`,
  pixie_drone: `<rect ${S} x="38" y="44" width="24" height="14" rx="4"/><path ${S} d="M38 48H22 M62 48h16"/><ellipse ${S} cx="22" cy="42" rx="12" ry="3"/><ellipse ${S} cx="78" cy="42" rx="12" ry="3"/><circle ${S} cx="50" cy="64" r="5"/><path ${S} d="M40 80l-6 6 M60 80l6 6" opacity=".6"/>`,
  ivana_source: `<path ${S} d="M22 50h40v14q0 16-20 16t-20-16Z M62 54h6q8 0 8 8t-8 8h-8"/><path ${S} d="M34 40q-4-8 2-14 M44 40q-4-8 2-14 M54 40q-4-8 2-14" opacity=".7"/><path ${S} d="M20 88h46"/>`,
  sora_node: `<path ${S} d="M50 88V40 M36 88l14-24 14 24"/><circle ${S} cx="50" cy="32" r="8"/><path ${S} d="M30 18q-10 14 0 28 M70 18q10 14 0 28"/><path ${S} d="M74 62l8-4 4 8-8 4Z M80 74l4 4" opacity=".8"/>`,
  vex_sample: `<path ${S} d="M40 16h20 M44 16v24L26 76q-2 8 6 8h36q8 0 6-8L56 40V16"/><path ${S} d="M33 64h34"/><circle cx="44" cy="72" r="3" fill="currentColor"/><circle cx="56" cy="68" r="2" fill="currentColor"/>`,
  run_cargo: `<path ${S} d="M10 60h80l-10 18H20Z"/><rect ${S} x="24" y="42" width="16" height="18"/><rect ${S} x="42" y="42" width="16" height="18"/><rect ${S} x="60" y="46" width="14" height="14"/><path ${S} d="M8 88q10-6 21 0t21 0 21 0 21 0" opacity=".6"/>`,
  run_data: `<path ${S} d="M50 12 72 40 50 88 28 40Z M28 40h44 M50 12 40 40 50 88 60 40Z"/><path ${S} d="M16 26h8 M76 70h8 M80 22l4-4" opacity=".7"/>`,
  run_vault: `<rect ${S} x="22" y="16" width="56" height="72" rx="3"/><path ${S} d="M22 52h56"/><rect ${S} x="30" y="24" width="40" height="22"/><text x="50" y="41" text-anchor="middle" fill="currentColor" font-family="Share Tech Mono, monospace" font-size="16">77</text><circle ${S} cx="64" cy="70" r="5"/><path ${S} d="M64 70h-10"/>`,
  run_heist: `<path ${S} d="M36 88V22l14-10 14 10v66"/><path ${S} d="M42 30h16 M42 40h16 M42 50h16 M42 60h16 M42 70h16" opacity=".55"/><rect x="42" y="45" width="16" height="8" fill="currentColor"/><text x="74" y="50" fill="currentColor" font-family="Share Tech Mono, monospace" font-size="13">40</text>`,
  chain_vasko: `<circle ${S} cx="36" cy="34" r="10"/><path ${S} d="M18 84q0-26 18-26t18 26"/><circle ${S} cx="64" cy="38" r="10"/><path ${S} d="M46 86q0-24 18-24t18 24"/><path ${S} d="M48 58q2 4 4 0" opacity=".8"/>`,
  chain_mira: `<path ${S} d="M50 30v52"/><path ${S} d="M50 40Q22 12 16 40q2 18 34 10 M50 40Q78 12 84 40q-2 18-34 10 M50 54Q28 56 26 74q14 6 24-12 M50 54Q72 56 74 74q-14 6-24-12"/><path ${S} d="M46 24l-6-8 M54 24l6-8"/>`,
  chain_ferrant: `<path ${S} d="M40 18h20v22h22v20H60v22H40V60H18V40h22Z"/><path ${S} d="M14 88h72" opacity=".6"/>`,
  chain_lou: `<path ${S} d="M10 82h80 M18 82V58h16v24 M40 82V46h18v36 M64 82V62h18v20"/><path ${S} d="M14 30q9-12 18 0t18 0 18 0 18 0"/><path ${S} d="M14 18q9-12 18 0t18 0 18 0 18 0" opacity=".5"/>`,
  chain_okoro: `<path ${S} d="M50 16v66 M30 86h40 M20 30h60"/><path ${S} d="M28 30 16 56h24Z M72 30 60 56h24Z"/><circle cx="50" cy="16" r="3" fill="currentColor"/>`,
  chain_pixie: `<path ${S} d="M32 18h36v16q0 18-18 18T32 34Z M32 24H20q0 14 14 14 M68 24h12q0 14-14 14 M50 52v14 M36 84h28l-4-18H40Z"/><path ${S} d="M46 28l4-4 4 4-4 8Z" opacity=".8"/>`,
};
Object.assign(G, {
  s_blackout: `<path ${S} d="M38 62q-12-8-12-22a24 24 0 0 1 48 0q0 14-12 22v10H38Z M40 82h20"/><path ${S} d="M20 20l60 60"/>`,
  s_storm: `<path ${S} d="M28 50q-14 0-14-12t14-12q4-12 18-12t18 12q16 0 16 12t-14 12Z"/><path ${S} d="M30 62l-4 10 M46 62l-4 10 M62 62l-4 10 M38 76l-4 10 M54 76l-4 10"/>`,
  s_raid: `<rect ${S} x="36" y="40" width="28" height="16" rx="4"/><path ${S} d="M36 46H18 M64 46h18"/><ellipse ${S} cx="18" cy="40" rx="10" ry="3"/><ellipse ${S} cx="82" cy="40" rx="10" ry="3"/><path ${S} d="M40 56 26 86h48L60 56"/><circle cx="50" cy="48" r="3" fill="currentColor"/>`,
  s_neon: `<path ${S} d="M40 72V24l36-8v48"/><circle ${S} cx="32" cy="72" r="8"/><circle ${S} cx="68" cy="64" r="8"/><path ${S} d="M40 36l36-8"/>`,
  s_spectre: `<path ${S} d="M26 86V44a24 24 0 0 1 48 0v42l-8-8-8 8-8-8-8 8-8-8Z"/><path ${S} d="M38 46l8 4-8 4 M62 46l-8 4 8 4"/>`,
  s_cats: `<path ${S} d="M22 82V44l10-14 6 10h24l6-10 10 14v38Z"/><path ${S} d="M38 58l4 4 M62 58l-4 4 M44 70q6 4 12 0"/><path ${S} d="M14 20l14 6 M86 20l-14 6" opacity=".7"/>`,
  s_loyal: `<path ${S} d="M50 50q-14-4-12-16 12-6 16 6 4-12 16-6 2 12-12 16"/><path ${S} d="M50 50v36"/><path ${S} d="M30 20l8 10 12-14 12 14 8-10v14H30Z"/>`,
  s_bunker: `<path ${S} d="M14 84h72 M22 84V54q28-24 56 0v30"/><circle ${S} cx="50" cy="66" r="12"/><path ${S} d="M50 54v24 M38 66h24" opacity=".6"/><circle cx="50" cy="66" r="3" fill="currentColor"/>`,
  s_zero: `<circle ${S} cx="50" cy="50" r="32"/><path ${S} d="M50 50V28 M50 50l14 8"/><text x="50" y="80" text-anchor="middle" fill="currentColor" font-family="Share Tech Mono, monospace" font-size="11">03:00</text>`,
  s_cat: `<circle ${S} cx="50" cy="56" r="24"/><path ${S} d="M30 42l-4-22 16 12 M70 42l4-22-16 12"/><circle cx="41" cy="54" r="3.5" fill="currentColor"/><circle cx="59" cy="54" r="3.5" fill="currentColor"/><path ${S} d="M36 80h28" stroke-dasharray="3 4"/>`,
  s_bond: `<path ${S} d="M50 84 20 54q-12-14 0-28t30 4q18-18 30-4t0 28Z"/><path ${S} d="M28 46h12l6-10 8 20 6-10h12"/>`,
  s_ascend: `<circle cx="50" cy="50" r="8" fill="currentColor"/><path ${S} d="M42 50Q20 40 10 20q18 4 26 16 M58 50Q80 40 90 20q-18 4-26 16 M42 54Q24 60 14 76q16-2 24-14 M58 54Q76 60 86 76q-16-2-24-14"/>`,
  s_bad: `<rect ${S} x="28" y="28" width="44" height="44" rx="3"/><path ${S} d="M28 36h-8 M28 50h-8 M28 64h-8 M72 36h8 M72 50h8 M72 64h8"/><path ${S} d="M46 28 54 46 44 54 54 72"/><path ${S} d="M40 18q4-6 8 0t8 0" opacity=".7"/>`,
  d_midi: `<path ${S} d="M14 84h72 M22 84V40h18v44 M44 84V22h14v62 M62 84V50h16v34"/><path ${S} d="M48 30h6 M48 40h6 M48 50h6" opacity=".6"/>`,
  d_matonge: `<path ${S} d="M12 50h76l-8-16H20Z M20 50v34 M80 50v34 M12 84h76"/><path ${S} d="M34 62h10v22H34Z M56 62h12v12H56Z"/>`,
  d_ixelles: `<path ${S} d="M50 14 62 40H38Z M38 40h24v46H38Z M20 86V56h14v30 M66 86V60h14v26"/><path ${S} d="M30 30l-10-6 M70 30l10-6" opacity=".7"/>`,
  d_canal: `<path ${S} d="M60 86V22h6v64 M66 26h22 M86 26v18"/><rect ${S} x="16" y="58" width="22" height="16"/><rect ${S} x="38" y="58" width="18" height="16"/><path ${S} d="M8 86q10-6 21 0t21 0 21 0 21 0" opacity=".6"/>`,
});

// Illustrations des 60 cartes d'amitié (une par carte)
Object.assign(G, {
  // Vasko
  f_vasko_1: `<path ${S} d="M12 58l14-14 12 4 10-8 12 10 10-2 18 14"/><path ${S} d="M38 48l14 14 M48 40l16 16 M30 62l10 10 M44 66l6 6"/>`,
  f_vasko_2: `<path ${S} d="M10 76h80 M18 76V64h64v12"/><path ${S} d="M40 30h20l-4 26h-12Z M50 56v8"/><path ${S} d="M64 36h12v20H64" opacity=".7"/><circle cx="70" cy="30" r="3" fill="currentColor"/>`,
  f_vasko_3: `<path ${S} d="M16 22h68v42H46L30 80V64H16Z"/><path ${S} d="M54 32q-4-4-10-2t-4 6 10 4 4 8-10 2 M50 28v28"/>`,
  f_vasko_4: `<path ${S} d="M14 26h20v14h14v14h14v14h20v10"/><path ${S} d="M14 86h72" opacity=".5"/><path ${S} d="M70 30l10 10-10 10" opacity=".8"/>`,
  f_vasko_5: `<path ${S} d="M16 48 50 20l34 28 M24 42v42h52V42"/><path ${S} d="M50 72 40 62q-5-6 0-10t10 2q5-6 10-2t0 10Z"/>`,
  // Mira
  f_mira_1: `<path ${S} d="M20 80V66 M36 80V54 M52 80V40 M68 80V26 M84 80V14"/><circle cx="20" cy="88" r="2" fill="currentColor"/>`,
  f_mira_2: `<circle ${S} cx="42" cy="42" r="22"/><path ${S} d="M58 58 84 84"/><path ${S} d="M32 36h6 M42 36h12 M30 46h14 M48 46h6" opacity=".8"/>`,
  f_mira_3: `<path ${S} d="M60 14a30 30 0 1 0 26 44 24 24 0 0 1-26-44Z"/><path ${S} d="M24 22l3 6 6 3-6 3-3 6-3-6-6-3 6-3Z M30 64l2 4 4 2-4 2-2 4-2-4-4-2 4-2Z"/>`,
  f_mira_4: `<rect ${S} x="16" y="24" width="68" height="50" rx="4"/><path ${S} d="M40 88h20 M50 74v14"/><text x="50" y="56" text-anchor="middle" fill="currentColor" font-family="Share Tech Mono, monospace" font-size="18">03:00</text>`,
  f_mira_5: `<path ${S} d="M50 28v50"/><path ${S} d="M50 36L18 22l6 30 26-4 M50 36l32-14-6 30-26-4 M50 52L28 74l22-6 M50 52l22 22-22-6"/><path ${S} d="M34 32h6 M60 32h6 M30 42h8 M62 42h8" opacity=".6"/>`,
  // Ferrant
  f_ferrant_1: `<path ${S} d="M28 16v22q0 18 16 18t16-18V16 M44 56v12q0 16 16 16t14-14V54"/><circle ${S} cx="74" cy="46" r="8"/><path ${S} d="M22 16h12 M54 16h12"/>`,
  f_ferrant_2: `<rect ${S} x="24" y="18" width="52" height="70" rx="4"/><path ${S} d="M40 14h20v10H40Z"/><path ${S} d="M46 40h8v8h8v8h-8v8h-8v-8h-8v-8h8Z"/><path ${S} d="M34 76h32" opacity=".6"/>`,
  f_ferrant_3: `<path ${S} d="M8 52h20l6-14 10 30 8-38 8 28 6-6h26"/><rect ${S} x="8" y="18" width="84" height="64" rx="6" opacity=".45"/>`,
  f_ferrant_4: `<path ${S} d="M16 34h68v44H16Z M16 50h68"/><path ${S} d="M44 42h12"/><rect ${S} x="26" y="58" width="12" height="10"/><rect ${S} x="44" y="58" width="12" height="10"/><rect ${S} x="62" y="58" width="12" height="10"/><path ${S} d="M30 58v-3 M48 58v-3 M66 58v-3" opacity=".7"/>`,
  f_ferrant_5: `<path ${S} d="M50 84 20 54q-14-16 0-30t30 6q16-20 30-6t0 30Z"/><path ${S} d="M36 44l28 16 M64 44 36 60" opacity=".8"/>`,
  // Lou
  f_lou_1: `<path ${S} d="M14 32h72v12q-8 0-8 8t8 8v12H14V60q8 0 8-8t-8-8Z"/><path ${S} d="M38 32v40" stroke-dasharray="4 4"/><path ${S} d="M52 46h22 M52 56h16"/>`,
  f_lou_2: `<rect ${S} x="10" y="34" width="80" height="40" rx="4"/><circle ${S} cx="32" cy="54" r="12"/><circle ${S} cx="68" cy="54" r="12"/><path ${S} d="M46 42v24 M54 42v24"/><circle cx="32" cy="54" r="2.5" fill="currentColor"/><circle cx="68" cy="54" r="2.5" fill="currentColor"/>`,
  f_lou_3: `<path ${S} d="M14 50v0 M22 40v20 M30 28v44 M38 36v28 M46 18v64 M54 30v40 M62 22v56 M70 38v24 M78 30v40 M86 46v8"/>`,
  f_lou_4: `<path ${S} d="M20 62v-12a30 30 0 0 1 60 0v12"/><rect ${S} x="14" y="58" width="14" height="24" rx="4"/><rect ${S} x="72" y="58" width="14" height="24" rx="4"/><path ${S} d="M36 70q6-6 14 0t14 0" opacity=".7"/>`,
  f_lou_5: `<path ${S} d="M14 50q16-20 26-12 10-8 10 0 0-8 10 0 10-8 26 12-18 22-36 22T14 50Z"/><path ${S} d="M14 50q36 8 72 0"/><path ${S} d="M80 22l4-6 M86 30l7-2" opacity=".7"/>`,
  // Okoro
  f_okoro_1: `<path ${S} d="M14 62q36 10 72 0"/><path ${S} d="M26 60q0-30 24-30t24 30"/><path ${S} d="M32 50h36" opacity=".8"/><path ${S} d="M40 76q10 8 20 0" opacity=".6"/>`,
  f_okoro_2: `<path ${S} d="M34 70V44a16 16 0 0 1 32 0v26Z M26 70h48v10H26Z"/><path ${S} d="M50 20v-8 M28 30l-6-6 M72 30l6-6 M16 50h-6 M84 50h6"/>`,
  f_okoro_3: `<rect ${S} x="16" y="18" width="68" height="64" rx="2"/><rect ${S} x="24" y="26" width="52" height="40"/><circle ${S} cx="50" cy="42" r="8"/><path ${S} d="M36 66q2-12 14-12t14 12"/><path ${S} d="M30 74h40" opacity=".6"/>`,
  f_okoro_4: `<path ${S} d="M14 58h72 M18 46h64 M22 58v20 M78 58v20 M18 46v-6 M82 46v-6"/><path ${S} d="M40 78l10-6 10 6" opacity=".6"/><circle cx="66" cy="34" r="3" fill="currentColor"/>`,
  f_okoro_5: `<path ${S} d="M50 20q-22 0-26 18-12 4-10 18t16 14q4 12 20 10 16 2 20-10 14 0 16-14t-10-18q-4-18-26-18Z"/><path ${S} d="M50 20v60 M36 36q8 6 0 14 M64 36q-8 6 0 14" opacity=".8"/>`,
  // La Veuve
  f_veuve_1: `<path ${S} d="M50 42q-16-2-14-16 14-4 16 8 4-14 18-8 0 14-20 16"/><path ${S} d="M50 42v44"/><path ${S} d="M50 54l-6-4 M50 64l7-4 M50 74l-6-4"/>`,
  f_veuve_2: `<path ${S} d="M28 20l6 40 M50 14v46 M72 20l-6 40"/><path ${S} d="M22 60h24 M38 60h24 M54 60h24"/><path ${S} d="M34 60v20 M50 60v26 M66 60v20"/>`,
  f_veuve_3: `<circle ${S} cx="36" cy="32" r="9"/><circle ${S} cx="58" cy="28" r="9"/><circle ${S} cx="68" cy="46" r="9"/><circle ${S} cx="44" cy="50" r="9"/><path ${S} d="M48 58 50 86 M40 60l10 26 M60 52 50 86"/><path ${S} d="M36 76h28" opacity=".6"/>`,
  f_veuve_4: `<rect ${S} x="28" y="14" width="44" height="74" rx="2"/><path ${S} d="M28 30h44"/><circle cx="62" cy="54" r="3.5" fill="currentColor"/><path ${S} d="M36 22h28" opacity=".6"/><path ${S} d="M18 88h64" opacity=".5"/>`,
  f_veuve_5: `<circle ${S} cx="50" cy="60" r="20"/><path ${S} d="M40 38l10-14 10 14-10 8Z"/><path ${S} d="M42 30h16" opacity=".7"/>`,
  // Kenji
  f_kenji_1: `<path ${S} d="M22 62a32 32 0 0 1 40-40"/><path ${S} d="M28 58 52 34"/><path ${S} d="M40 72l-8 16h24l-8-16"/><path ${S} d="M64 24q10 2 12 12 M68 14q18 4 20 20" opacity=".7"/>`,
  f_kenji_2: `<rect ${S} x="28" y="12" width="44" height="76" rx="3"/><text x="50" y="38" text-anchor="middle" fill="currentColor" font-family="Share Tech Mono, monospace" font-size="18">90</text><path ${S} d="M42 54l8-8 8 8 M42 64l8 8 8-8"/><circle ${S} cx="50" cy="80" r="3"/>`,
  f_kenji_3: `<path ${S} d="M16 50Q50 18 84 50Q50 82 16 50Z"/><circle ${S} cx="50" cy="50" r="10"/><path ${S} d="M20 78h60" stroke-dasharray="2 6"/><path ${S} d="M20 20l60 60" opacity=".4"/>`,
  f_kenji_4: `<path ${S} d="M40 14h20l-4 12h-12Z M44 26l-8 52 14 10 14-10-8-52"/><path ${S} d="M26 14l14 6 M74 14l-14 6"/>`,
  f_kenji_5: `<path ${S} d="M24 30h52 M40 30v-8h20v8 M30 30l4 56h32l4-56"/><path ${S} d="M42 42v34 M58 42v34"/>`,
  // Rook
  f_rook_1: `<circle ${S} cx="50" cy="50" r="32"/><circle ${S} cx="50" cy="50" r="8"/><path ${S} d="M18 50h24 M58 50h24 M50 58v24"/>`,
  f_rook_2: `<path ${S} d="M50 22q-16 18-8 32-10-6-10 8a18 18 0 0 0 36 0q0-14-10-8 8-14-8-32Z"/><path ${S} d="M22 86l56-12 M22 74l56 12"/>`,
  f_rook_3: `<path ${S} d="M50 50m-6 0a6 6 0 1 0 12 0 12 12 0 1 0-24 0 18 18 0 1 0 36 0 24 24 0 1 0-48 0 30 30 0 1 0 60 0"/><path ${S} d="M80 50h10" opacity=".7"/>`,
  f_rook_4: `<path ${S} d="M8 86 30 54l14 18 18-30 30 44Z"/><path ${S} d="M10 30q20-14 40 0t40 0 M10 20q20-14 40 0t40 0" opacity=".7"/>`,
  f_rook_5: `<path ${S} d="M42 14 18 88 M58 14l24 74"/><path ${S} d="M50 22v8 M50 40v10 M50 60v12 M50 80v6"/><circle cx="50" cy="12" r="3" fill="currentColor"/>`,
  // Pixie
  f_pixie_1: `<path ${S} d="M30 46q-4-22 20-22t22 22q2 24-22 26T30 46Z"/><path ${S} d="M50 24V12 M44 12h12"/><circle cx="42" cy="44" r="2.5" fill="currentColor"/><circle cx="58" cy="44" r="2.5" fill="currentColor"/><path ${S} d="M44 56q6 4 12 0"/><path ${S} d="M18 40h10 M72 40h10" opacity=".6"/>`,
  f_pixie_2: `<path ${S} d="M22 28h12v8h8v-8h16v8h8v-8h12v24h-8v8h-8v8h-8v8h-8v-8h-8v-8h-8v-8h-8Z"/><text x="50" y="94" text-anchor="middle" fill="currentColor" font-family="Share Tech Mono, monospace" font-size="11">1UP</text>`,
  f_pixie_3: `<path ${S} d="M14 50h72q-4 30-36 30T14 50Z"/><path ${S} d="M30 50q4-10 10 0t10 0 10 0 10 0"/><path ${S} d="M60 14 74 46 M70 12l8 34"/><path ${S} d="M34 40q0-8 4-12 M46 40q0-8 4-12" opacity=".6"/>`,
  f_pixie_4: `<path ${S} d="M50 14q24 0 24 40 0 32-24 32T26 54q0-40 24-40Z"/><path ${S} d="M34 44h10v10h12V44h10 M50 54v16 M40 70h20"/>`,
  f_pixie_5: `<rect ${S} x="10" y="40" width="36" height="24" rx="12"/><rect ${S} x="54" y="40" width="36" height="24" rx="12"/><path ${S} d="M20 52h8 M24 48v8 M64 52h8 M68 48v8"/><circle cx="38" cy="50" r="2" fill="currentColor"/><circle cx="82" cy="50" r="2" fill="currentColor"/><path ${S} d="M46 52h8" stroke-dasharray="2 3"/>`,
  // Ivana
  f_ivana_1: `<path ${S} d="M26 86q0-30 24-30t24 30"/><path ${S} d="M28 50q0-34 22-34t22 34q-8 8-22 8t-22-8Z"/><path ${S} d="M40 44h20" opacity=".7"/>`,
  f_ivana_2: `<rect ${S} x="14" y="20" width="72" height="62" rx="2"/><path ${S} d="M14 34h72"/><path ${S} d="M22 44h24v18H22Z M54 44h24 M54 52h24 M54 60h18 M22 70h56" opacity=".85"/>`,
  f_ivana_3: `<path ${S} d="M50 12 66 44 50 88 34 44Z"/><path ${S} d="M50 44v20"/><circle cx="50" cy="44" r="4" fill="currentColor"/><path ${S} d="M20 88h24" opacity=".6"/>`,
  f_ivana_4: `<rect ${S} x="22" y="14" width="56" height="72" rx="4"/><path ${S} d="M22 28h56 M32 40h36 M32 50h36 M32 60h24"/><circle ${S} cx="30" cy="21" r="2"/>`,
  f_ivana_5: `<path ${S} d="M30 28h40v28H30Z M34 56l-6 30 M66 56l6 30 M30 70h40"/><path ${S} d="M74 18l8-8 M80 26h8" opacity=".7"/>`,
  // Sora
  f_sora_1: `<path ${S} d="M30 20 46 34 34 50Z M54 24l20 8-8 20Z M40 60l18 4-6 18Z M68 60l10 14-14 4Z" />`,
  f_sora_2: `<path ${S} d="M14 50a36 30 0 0 1 72 0Z M50 50v26q0 8-8 8t-8-8"/><path ${S} d="M22 20v6 M34 12v6 M66 12v6 M78 20v6" opacity=".7"/>`,
  f_sora_3: `<circle ${S} cx="34" cy="50" r="16"/><circle ${S} cx="34" cy="50" r="6"/><path ${S} d="M50 50h38 M74 50v12 M84 50v8"/>`,
  f_sora_4: `<path ${S} d="M56 16a30 30 0 1 0 28 42 24 24 0 0 1-28-42Z"/><path ${S} d="M40 44q0-8 8-8t8 8-8 8v4 M48 64v.5"/>`,
  f_sora_5: `<circle ${S} cx="50" cy="50" r="32"/><path ${S} d="M50 18v14 M50 68v14 M18 50h14 M68 50h14"/><path ${S} d="M40 50l7 7 14-14"/>`,
  // Vex
  f_vex_1: `<path ${S} d="M34 12q32 22 0 38t0 38 M66 12q-32 22 0 38t0 38"/><path ${S} d="M40 24h20 M42 38h16 M42 62h16 M40 76h20" opacity=".7"/>`,
  f_vex_2: `<path ${S} d="M28 14h44 M28 86h44 M32 14q0 26 18 36-18 10-18 36 M68 14q0 26-18 36 18 10 18 36"/><path ${S} d="M40 76h20l-10-10Z"/>`,
  f_vex_3: `<rect ${S} x="16" y="26" width="68" height="48" rx="4"/><circle ${S} cx="34" cy="46" r="8"/><path ${S} d="M22 66q4-8 12-8t12 8 M54 40h22 M54 50h16 M54 60h20"/><path ${S} d="M44 20h12v6H44Z"/>`,
  f_vex_4: `<path ${S} d="M70 14l16 16 M78 22 34 66 M44 56l-14-14 M24 76l10-10 M12 88l12-12"/><path ${S} d="M54 34l12 12" opacity=".7"/>`,
  f_vex_5: `<path ${S} d="M22 86V40q0-22 28-22t28 22v46 M36 86V38 M50 86V30 M64 86V38"/><path ${S} d="M72 28l6-6 8 4-6 8Z" opacity=".9"/><path ${S} d="M78 30q10-4 12 4" opacity=".7"/>`,
});

// ═══════════════════════ Rareté, familles, règles
const RAR = {
  bronze: { name: 'BRONZE', hex: '#cd8b5a' }, silver: { name: 'ARGENT', hex: '#cfe3ec' }, gold: { name: 'OR', hex: '#ffd27a' },
  common: { name: 'COMMUNE', hex: '#9fb3bd' }, rare: { name: 'RARE', hex: '#5ce1e6' }, epic: { name: 'ÉPIQUE', hex: '#b98cff' },
  leg: { name: 'LÉGENDAIRE', hex: '#ffd27a' }, ghost: { name: 'FANTÔME', hex: '#ff3b4e' }, myth: { name: 'MYTHIQUE', hex: '#ff4fd8' }, secret: { name: 'SECRÈTE', hex: '#f4fbff' },
};
const FAMILIES = {
  portrait: { name: 'PORTRAITS', hex: '#cd8b5a', txt: '3 portraits holo par contact : bronze à 30 d\'affinité, argent à 60, or à 90.' },
  amitie: { name: 'AMITIÉ', hex: '#e8505b', txt: '5 cartes par contact, de commune à mythique, à 20, 40, 60, 80 puis 100 d\'affinité.' },
  reputation: { name: 'RÉPUTATION', hex: '#8fb7ff', txt: '3 cartes par quartier : à 10, 25 puis 50 points de réputation.' },
  contrat: { name: 'CONTRATS', hex: '#ffd27a', txt: 'Une carte par contrat et par histoire : répéter le contrat, réussir un imprévu risqué, finir l\'histoire.' },
  secret: { name: 'SECRÈTES', hex: '#f4fbff', txt: 'Aucun indice. Une réponse, un événement ou une rencontre précise les fait tomber.' },
  dossier: { name: 'DOSSIERS', hex: '#6ff3f0', txt: 'Une carte par contact : compléter son dossier du holophone à 100 %.' },
};
const TIERS = [[20, 'common', 'Contact', 20, 0], [40, 'rare', 'Allié·e', 50, 0], [60, 'epic', 'Ami·e', 100, 30], [80, 'leg', 'Confident·e', 200, 80], [100, 'myth', 'Proche', 400, 150]];
const FRIEND_TITLES = {
  vasko: ['Premier contact', 'Le comptoir de la gare', 'Parole de fixer', 'Les sous-sols de Zéro', 'Famille de la Zone'],
  mira: ['Signal stable', 'Second regard', 'Équipe de nuit', 'Trois heures du matin', 'Moth'],
  ferrant: ['Consultation', 'Ordonnance du jour', 'Constantes parfaites', 'Le tiroir aux puces', 'Patient préféré'],
  lou: ['Sur la guest-list', 'Le set de ce soir', 'Basses à fond', 'Juste des vibes', 'Bisous néon'],
  okoro: ['L\'indic', 'Patrouille doublée', 'La vieille photo', 'Le banc du parc', 'Bonne mémoire'],
  veuve: ['Une rose noire', 'Les filles de la Veuve', 'Dettes en fleurs', 'Porte Rouge', 'Loyauté'],
  kenji: ['Fenêtre de transmission', 'Étage 90', 'Témoin silencieux', 'Couverture', 'Supprimer après lecture'],
  rook: ['Convoyeur', 'Feu de camp', 'Le turbo', 'Aurores des badlands', 'La route'],
  pixie: ['Opération Patate', 'High score', 'Nouilles de minuit', 'Easter egg', 'Meilleur coéquipier'],
  ivana: ['Source anonyme', 'Ceux qui oublient', 'L\'article', 'Carnet de notes', 'Rendez-vous manqué'],
  sora: ['Fragment', 'La pluie', 'Clés de HAKONE', 'Bonne nuit ?', 'Entier·ère'],
  vex: ['Mnémosyne', 'Trente heures', 'Lina', 'Antidote', 'Hors de Léthé'],
};
const REP_TITLES = {
  midi: ['Visage connu de la Zone', 'Respect de la gare Zéro', 'Légende de la Zone Zéro'],
  matonge: ['Habitué·e du Bazar', 'Parole d\'or au marché', 'Légende du Bazar Néon'],
  ixelles: ['Nom sur la liste', 'Entrée par la grande porte', 'Légende de Chromeville'],
  canal: ['Ombre des quais', 'Respect des dockers', 'Légende des Docks Noirs'],
};
const REP_QUOTES = {
  midi: ['Le barman du Néon Noir te sert sans demander.', 'Les fixers baissent la voix quand tu passes.', 'Dans la Zone, ton nom ouvre toutes les portes. Même celle du Bunker.'],
  matonge: ['Les vendeurs te gardent les meilleures pièces.', 'On te fait crédit sans signature.', 'Le Bazar parle de toi en trois langues.'],
  ixelles: ['Le videur du club Ondes connaît ton prénom.', 'Les bornes de l\'Arcade affichent tes records.', 'Chromeville brille un peu plus quand tu es là.'],
  canal: ['Les barges te laissent monter à bord.', 'Les grues s\'arrêtent pour te laisser passer.', 'Les Docks Noirs n\'ont plus de secrets pour toi.'],
};
const PORTRAIT_TITLES = ['Holo bronze', 'Holo argent', 'Holo or'];
const SECRETS = [
  ['s_blackout', 'Ville éteinte', 'Pour une nuit, NEO-BXL n\'avait plus d\'yeux. Et toi, tu voyais tout.', 'Réussir la mission de l\'événement « Coupure réseau ».', { t: 'bool', f: 'cyberdeck_b6', k: 'ce_blackout' }],
  ['s_storm', 'Sous la pluie acide', 'Les patrouilles se terraient. Les netrunners, eux, sortaient.', 'Réussir la mission de l\'événement « Tempête acide ».', { t: 'bool', f: 'cyberdeck_b6', k: 'ce_storm' }],
  ['s_raid', 'Le raid', 'Kurogane fouillait chaque immeuble. Il n\'a jamais trouvé le tien.', 'Réussir la mission de l\'événement « Raid corpo ».', { t: 'bool', f: 'cyberdeck_b6', k: 'ce_raid' }],
  ['s_neon', 'Nuit des néons', 'Toute la ville au même tempo. Et Lou qui t\'a dédié le dernier morceau.', 'Réussir la mission de l\'événement « Nuit des néons ».', { t: 'bool', f: 'cyberdeck_b6', k: 'ce_neon' }],
  ['s_spectre', 'Chasseur de spectre', 'Il croyait être un fantôme. Tu lui as montré ce qu\'est la vraie disparition.', 'Battre le hacker rival Spectre 3 fois.', { t: 'int', f: 'cyberdeck_b9', k: 'rival_wins', v: 3 }],
  ['s_cats', 'Chats contre Kurogane', 'Toutes les pubs de la tour remplacées par des chats. Kurogane n\'a jamais rien vu venir.', 'Encourager Mira quand elle parle de son virus à chats.', { t: 'eq', f: 'cyberdeck_b6', k: 'cva_mira2', v: 0 }],
  ['s_loyal', 'Ce qui nous reste', 'La Veuve a posé une rose noire sur ton palier. Cette fois, tu peux la toucher.', 'Dire à la Veuve que la loyauté, c\'est tout ce qui nous reste.', { t: 'eq', f: 'cyberdeck_b6', k: 'cva_veuve2', v: 0 }],
  ['s_coffee', 'Café du canal', 'Cinq minutes de Léthé, pas une de plus. Le reste n\'appartenait qu\'à vous.', 'Accepter le café d\'Ivana au petit bar près du canal.', { t: 'eq', f: 'cyberdeck_b6', k: 'cva_ivana2', v: 0 }],
  ['s_bunker', 'Le Bunker Zéro', 'Une porte blindée, un escalier, et en bas, les meilleurs runners de la ville. Bienvenue.', 'Entrer pour la première fois dans le Bunker Zéro.', { t: 'int', f: 'cyberdeck_b8', k: 'met_bunker', v: 1 }],
  ['s_zero', 'Heure zéro', 'Même les drones Kurogane dorment. Pas toi.', 'Visiter un lieu de la ville entre 3 h et 4 h du matin.', { t: 'bool', f: 'cyberdeck_b8', k: 'h3visit' }],
  ['s_cat', 'Chat errant', 'Il ronronne en fréquence modulée. Son propriétaire te doit une fière chandelle.', 'Croiser le chat cybernétique en ville et lire son collier.', { t: 'bool', f: 'cyberdeck_b8', k: 'metcat' }],
  ['s_bond', 'Lien neural', 'Deux signaux, une seule fréquence.', 'Atteindre le niveau 5 de lien avec ton ou ta partenaire.', { t: 'bond', v: 400 }],
  ['s_ascend', 'Ascension', 'Merci, netrunner. Je n\'ai jamais été aussi… entière.', 'Faire évoluer NEURA jusqu\'à sa forme Ascendante.', { t: 'bool', f: 'cyberdeck_b5', k: 'own_neura_evo5' }],
  ['s_bad', 'Mauvais jour', 'Le deck fume, la paie fond. Demain sera meilleur. Peut-être.', 'Rater trois imprévus risqués d\'expédition.', { t: 'int', f: 'cyberdeck_b9', k: 'rfail', v: 3 }],
];
const ABBR = { vasko: 'VSK', mira: 'MKD', ferrant: 'FRT', lou: 'LOU', okoro: 'OKR', veuve: 'VEV', kenji: 'KNJ', rook: 'ROK', pixie: 'PXE', ivana: 'IVM', sora: 'SRA', vex: 'VEX', runner: 'RUN' };
const CHAIN_NAMES = { vasko: 'Réunion de famille', mira: 'L\'autre Moth', ferrant: 'La clinique libre', lou: 'Nuit éternelle', okoro: 'Justice', pixie: 'Champions de NEO-BXL' };
const DISTRICT_ID = { midi: 'ZZ', matonge: 'BN', ixelles: 'CV', canal: 'DN' };
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const xp = (m) => m <= 15 ? 30 : m <= 20 ? 40 : m <= 30 ? 60 : 120;
const rw = (x, e, extra) => ({ xp: x, ed: e, txt: `+${x} XP${e ? ` · +${e} €$` : ''}${extra ? ' · ' + extra : ''}` });

// ═══════════════════════ La collection
const CARDS = [];
Object.keys(FRIEND_TITLES).forEach((cid) => {
  const ct = DATA.c[cid]; if (!ct) return;
  [30, 60, 90].forEach((aff, n) => CARDS.push({ id: `p_${cid}_${n + 1}`, fam: 'portrait', rar: ['bronze', 'silver', 'gold'][n], art: 'portrait', tier: n, contact: cid,
    title: `${ct.name} · ${PORTRAIT_TITLES[n]}`, tag: `${['◆◇◇', '◆◆◇', '◆◆◆'][n]} · AFFINITÉ ${aff}`, quote: [ct.hello[0], ct.thanks[0], ct.close[0]][n],
    serial: `PRT-${ABBR[cid]}-${n + 1}`, cond: `Atteindre ${aff} d'affinité avec ${ct.name}.`, reward: rw([20, 40, 80][n], 0),
    rule: { t: 'or', a: [{ t: 'aff', c: cid, v: aff }, { t: 'bool', f: 'cyberdeck_b7', k: `card_${cid}_${n + 1}` }] } }));
  TIERS.forEach(([aff, rar, rel, x, e], n) => CARDS.push({ id: `a_${cid}_${n + 1}`, fam: 'amitie', rar, art: 'friend', glyph: `f_${cid}_${n + 1}`, tier: n, contact: cid,
    title: FRIEND_TITLES[cid][n], tag: `${'◆'.repeat(n + 1)}${'◇'.repeat(4 - n)} · AFFINITÉ ${aff}`,
    quote: [ct.hello[1] || ct.hello[0], ct.offer[0], ct.thanks[1] || ct.thanks[0], ct.idle[0], ct.close[1] || ct.close[0]][n],
    serial: `AMI-${ABBR[cid]}-${n + 1}`, cond: `Atteindre ${aff} d'affinité avec ${ct.name} (relation « ${rel} »).`, reward: rw(x, e, n === 4 ? 'carte animée' : ''),
    rule: { t: 'aff', c: cid, v: aff } }));
});
DATA.d.forEach((d) => [[10, 'rare', 60, 0], [25, 'epic', 150, 50], [50, 'leg', 300, 150]].forEach(([pts, rar, x, e], n) => CARDS.push({
  id: `r_${d.id}_${n + 1}`, fam: 'reputation', rar, art: 'glyph', glyph: 'd_' + d.id, tier: n, district: d, title: REP_TITLES[d.id][n], tag: `${pts} PTS · ${d.name.toUpperCase()}`,
  quote: REP_QUOTES[d.id][n], serial: `REP-${DISTRICT_ID[d.id]}-${n + 1}`, cond: `Atteindre ${pts} points de réputation dans le quartier ${d.name}.`, reward: rw(x, e),
  rule: { t: 'int', f: 'cyberdeck_b9', k: 'rep_' + d.id, v: pts } })));
const perContact = {};
DATA.e.forEach((e) => {
  perContact[e.c] = (perContact[e.c] || 0) + 1;
  const rar = e.c === 'runner' ? 'ghost' : e.m <= 20 ? 'rare' : e.m <= 30 ? 'epic' : 'leg', who = DATA.c[e.c]?.name || '';
  const n = { t: 'int', f: 'cyberdeck_b8', k: 'xc_' + e.id };
  const rule = rar === 'rare' ? { ...n, v: 3 } : rar === 'epic' ? { t: 'and', a: [{ ...n, v: 3 }, { t: 'bool', f: 'cyberdeck_b8', k: 'xr_' + e.id }] }
    : rar === 'leg' ? { t: 'and', a: [{ ...n, v: 5 }, { t: 'aff', c: e.c, v: 90 }] } : { t: 'and', a: [{ ...n, v: 2 }, { t: 'int', f: 'cyberdeck_b8', k: 'xn_' + e.id, v: 1 }] };
  const cond = { rare: 'Réussir ce contrat 3 fois.', epic: 'Réussir ce contrat 3 fois, dont au moins une avec l\'imprévu « risqué » gagnant (+60 %).',
    leg: `Réussir ce contrat 5 fois et atteindre 90 d'affinité avec ${who}.`, ghost: 'Croiser ce runner en ville, accepter son contrat 2 fois et le réussir, dont une fois après avoir négocié.' }[rar];
  const reward = { rare: rw(75, 0), epic: rw(150, 50), leg: rw(300, 150), ghost: rw(200, 100) }[rar];
  CARDS.push({ id: 'x_' + e.id, fam: 'contrat', rar, art: 'glyph', glyph: e.id, title: e.t, tag: `${e.m} MIN · +${xp(e.m)} XP`, place: e.p, contact: e.c === 'runner' ? null : e.c, runner: e.c === 'runner',
    quote: e.r, serial: `CTR-${ABBR[e.c]}-${String(perContact[e.c]).padStart(2, '0')}`, cond, reward, brief: e.b, rule });
});
DATA.ch.forEach((ch) => CARDS.push({ id: 'h_' + ch.c, fam: 'contrat', rar: 'myth', art: 'glyph', glyph: 'chain_' + ch.c, title: CHAIN_NAMES[ch.c], tag: '3 ÉPISODES', place: 'Histoire de contact',
  contact: ch.c, quote: ch.last, serial: `HIS-${ABBR[ch.c]}`, cond: `Terminer les 3 épisodes de l'histoire de ${DATA.c[ch.c]?.name || ''}.`, reward: rw(500, 0, 'carte animée'), eps: ch.eps,
  rule: { t: 'int', f: 'cyberdeck_b9', k: 'chain_' + ch.c, v: 3 } }));
Object.keys(FRIEND_TITLES).forEach((cid) => {
  const ct = DATA.c[cid]; if (!ct) return;
  CARDS.push({ id: `d_${cid}`, fam: 'dossier', rar: 'leg', art: 'portrait', tier: 2, contact: cid, title: `${ct.name} · Dossier complet`, tag: 'DOSSIER 100 %',
    quote: (DATA.dos && DATA.dos[cid]) || ct.close[0], serial: `DOS-${ABBR[cid]}`, cond: `Compléter le dossier de ${ct.name} à 100 % (holophone › Dossiers).`, reward: rw(300, 150),
    rule: { t: 'bool', f: 'cyberdeck_b6', k: 'doss_' + cid } });
});
SECRETS.forEach(([id, title, quote, cond, rule], n) => CARDS.push({ id, fam: 'secret', rar: 'secret', art: 'glyph', glyph: id === 's_coffee' ? 'ivana_source' : id, title, tag: 'SECRÈTE', quote,
  serial: `SEC-${String(n + 1).padStart(2, '0')}`, cond, reward: rw(250, 100), secret: true, rule }));
CARDS.forEach((c, i) => { c.no = i + 1; });
const BY_ID = Object.fromEntries(CARDS.map(c => [c.id, c]));

// ═══════════════════════ Règles de déblocage (évaluées sur la sauvegarde, identiques partout)
function test(r, get) {
  switch (r.t) {
    case 'or': return r.a.some(x => test(x, get));
    case 'and': return r.a.every(x => test(x, get));
    case 'aff': return (get('cyberdeck_holophone', 'aff_' + r.c, 0) || 0) >= r.v;
    case 'int': return (Number(get(r.f, r.k, 0)) || 0) >= r.v;
    case 'bool': return get(r.f, r.k, false) === true;
    case 'eq': return get(r.f, r.k, -1) === r.v;
    case 'bond': { const p = get('cyberdeck_holophone', 'partner', null); return !!p && (get('cyberdeck_b6', 'bond_' + p, 0) || 0) >= r.v; }
  }
  return false;
}
/** Cartes méritées mais pas encore dans la collection. */
function pending(get, got) { return CARDS.filter(c => !got.has(c.id) && test(c.rule, get)); }

// ═══════════════════════ Dessins
function portrait(cv, c) {
  const g = cv.getContext('2d'), w = cv.width, h = cv.height, CY = '#6ff3f0';
  const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#5a1a22'); bg.addColorStop(1, '#2a0b10'); g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(232,80,91,.18)'; g.beginPath(); g.arc(w * .5, h * .42, w * .2, 0, 7); g.fill();
  g.beginPath(); g.moveTo(w * .12, h); g.bezierCurveTo(w * .15, h * .68, w * .85, h * .68, w * .88, h); g.closePath(); g.fillStyle = 'rgba(232,80,91,.16)'; g.fill();
  g.strokeStyle = CY; g.fillStyle = CY; g.lineWidth = w * .045; g.lineCap = 'round'; g.lineJoin = 'round';
  const cx = w / 2, cy = h / 2, a = w * .27;
  g.beginPath();
  switch (c.emblem) {
    case 'dice': g.strokeRect(cx - a, cy - a * .7, a * .95, a * .95); g.strokeRect(cx + a * .05, cy - a * .2, a * .95, a * .95);
      [[.25, .25], [.75, .75], [.5, .5]].forEach(([u, v]) => { g.beginPath(); g.arc(cx - a + a * .95 * u, cy - a * .7 + a * .95 * v, w * .03, 0, 7); g.fill(); }); break;
    case 'eye': g.moveTo(cx - a * 1.2, cy); g.quadraticCurveTo(cx, cy - a, cx + a * 1.2, cy); g.quadraticCurveTo(cx, cy + a, cx - a * 1.2, cy); g.stroke(); g.beginPath(); g.arc(cx, cy, a * .38, 0, 7); g.stroke(); g.beginPath(); g.arc(cx, cy, a * .16, 0, 7); g.fill(); break;
    case 'chip': g.strokeRect(cx - a * .8, cy - a * .8, a * 1.6, a * 1.6); g.strokeRect(cx - a * .35, cy - a * .35, a * .7, a * .7);
      for (let i = 0; i < 4; i++) { const o = -a * .6 + i * a * .4; g.beginPath(); g.moveTo(cx + o, cy - a * .8); g.lineTo(cx + o, cy - a * 1.15); g.moveTo(cx + o, cy + a * .8); g.lineTo(cx + o, cy + a * 1.15); g.stroke(); } break;
    case 'star': for (let i = 0; i < 10; i++) { const r = i % 2 ? a * .45 : a * 1.1, an = -Math.PI / 2 + i * Math.PI / 5; i ? g.lineTo(cx + Math.cos(an) * r, cy + Math.sin(an) * r) : g.moveTo(cx + Math.cos(an) * r, cy + Math.sin(an) * r); } g.closePath(); g.stroke(); break;
    case 'shield': g.moveTo(cx, cy - a); g.lineTo(cx + a * .85, cy - a * .6); g.lineTo(cx + a * .7, cy + a * .35); g.quadraticCurveTo(cx + a * .4, cy + a * .85, cx, cy + a); g.quadraticCurveTo(cx - a * .4, cy + a * .85, cx - a * .7, cy + a * .35); g.lineTo(cx - a * .85, cy - a * .6); g.closePath(); g.stroke();
      g.beginPath(); g.moveTo(cx - a * .4, cy); g.lineTo(cx + a * .4, cy); g.moveTo(cx, cy - a * .45); g.lineTo(cx, cy + a * .45); g.stroke(); break;
    case 'rose': for (let i = 1; i <= 3; i++) { g.beginPath(); g.arc(cx, cy - a * .3, a * .25 * i, i, i + 4.4); g.stroke(); } g.beginPath(); g.moveTo(cx, cy + a * .4); g.lineTo(cx, cy + a * 1.2); g.stroke(); break;
    case 'cube': [[0, -a, -a * .87, -a * .5], [0, -a, a * .87, -a * .5], [-a * .87, -a * .5, 0, 0], [a * .87, -a * .5, 0, 0], [0, 0, 0, a], [-a * .87, -a * .5, -a * .87, a * .5], [a * .87, -a * .5, a * .87, a * .5], [-a * .87, a * .5, 0, a], [a * .87, a * .5, 0, a]].forEach(([x1, y1, x2, y2]) => { g.moveTo(cx + x1, cy + y1); g.lineTo(cx + x2, cy + y2); }); g.stroke(); break;
    case 'wolf': g.moveTo(cx - a, cy - a * .9); g.lineTo(cx - a * .45, cy - a * .35); g.lineTo(cx + a * .45, cy - a * .35); g.lineTo(cx + a, cy - a * .9); g.lineTo(cx + a * .8, cy + a * .1); g.lineTo(cx + a * .25, cy + a * .95); g.lineTo(cx - a * .25, cy + a * .95); g.lineTo(cx - a * .8, cy + a * .1); g.closePath(); g.stroke(); break;
    case 'cat': g.arc(cx, cy + a * .15, a, 0, 7); g.stroke(); g.beginPath(); g.moveTo(cx - a * .85, cy - a * .3); g.lineTo(cx - a * .7, cy - a * 1.2); g.lineTo(cx - a * .2, cy - a * .75); g.moveTo(cx + a * .85, cy - a * .3); g.lineTo(cx + a * .7, cy - a * 1.2); g.lineTo(cx + a * .2, cy - a * .75); g.stroke(); break;
    default: g.strokeRect(cx - a * .4, cy - a * .95, a * .8, a * 1.3); g.beginPath(); g.moveTo(cx, cy + a * .55); g.lineTo(cx, cy + a); g.moveTo(cx - a * .4, cy + a); g.lineTo(cx + a * .4, cy + a); g.stroke();
  }
  g.fillStyle = 'rgba(0,0,0,.22)'; for (let y = 0; y < h; y += 3) g.fillRect(0, y, w, 1);
  g.strokeStyle = 'rgba(232,80,91,.9)'; g.lineWidth = w * .05; g.strokeRect(0, 0, w, h);
}
// Portrait holo en grand : ornements selon le palier et la rareté
function bigPortrait(cv, c, rar, tier) {
  const g = cv.getContext('2d'), W = cv.width, hex = RAR[rar].hex, cx = W / 2, cy = W / 2;
  g.clearRect(0, 0, W, W); g.strokeStyle = hex; g.fillStyle = hex;
  const rays = [10, 18, 30][tier] || 10;
  for (let i = 0; i < rays; i++) { const a = i / rays * Math.PI * 2; g.globalAlpha = .4; g.lineWidth = W * .012;
    g.beginPath(); g.moveTo(cx + Math.cos(a) * W * .36, cy + Math.sin(a) * W * .36); g.lineTo(cx + Math.cos(a) * W * (.44 + (i % 2) * .04), cy + Math.sin(a) * W * (.44 + (i % 2) * .04)); g.stroke(); }
  for (let r = 0; r <= tier + 1; r++) { g.globalAlpha = .2 + r * .1; g.lineWidth = W * .008; g.beginPath(); g.arc(cx, cy, W * (.31 + r * .035), 0, 7); g.stroke(); }
  if (tier >= 2) { const gr = g.createRadialGradient(cx, cy, W * .2, cx, cy, W * .5); gr.addColorStop(0, hex + '00'); gr.addColorStop(1, hex + '55'); g.globalAlpha = 1; g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, W * .5, 0, 7); g.fill(); }
  g.globalAlpha = 1;
  const t = document.createElement('canvas'); t.width = t.height = 240; portrait(t, c);
  const s = W * .56, x = cx - s / 2, y = cy - s / 2;
  g.drawImage(t, x, y, s, s); g.strokeStyle = hex; g.lineWidth = W * .014; g.strokeRect(x, y, s, s);
  const k = s * .2; g.lineWidth = W * .02;
  [[x, y, 1, 1], [x + s, y, -1, 1], [x, y + s, 1, -1], [x + s, y + s, -1, -1]].forEach(([px, py, dx, dy]) => { g.beginPath(); g.moveTo(px + dx * k, py); g.lineTo(px, py); g.lineTo(px, py + dy * k); g.stroke(); });
}
// Décor des cartes d'amitié : rayons, anneaux et étincelles qui grandissent avec le palier
function friendBackdrop(cv, rar, tier, seed) {
  const g = cv.getContext('2d'), W = cv.width, H = cv.height, hex = RAR[rar].hex, cx = W / 2, cy = H * .47;
  g.clearRect(0, 0, W, H); g.strokeStyle = hex; g.fillStyle = hex;
  let s = seed; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const rays = [0, 10, 16, 24, 36][tier];
  for (let i = 0; i < rays; i++) { const a = i / rays * Math.PI * 2 + seed; g.globalAlpha = .28; g.lineWidth = 2; g.beginPath(); g.moveTo(cx + Math.cos(a) * H * .34, cy + Math.sin(a) * H * .34); g.lineTo(cx + Math.cos(a) * H * (.42 + rnd() * .1), cy + Math.sin(a) * H * (.42 + rnd() * .1)); g.stroke(); }
  for (let r = 0; r <= tier; r++) { g.globalAlpha = .14 + r * .07; g.lineWidth = 1.4; g.setLineDash(r % 2 ? [4, 6] : []); g.beginPath(); g.arc(cx, cy, H * (.3 + r * .045), 0, 7); g.stroke(); }
  g.setLineDash([]);
  for (let i = 0; i < 6 + tier * 8; i++) { g.globalAlpha = .25 + rnd() * .55; g.beginPath(); g.arc(rnd() * W, rnd() * H, .8 + rnd() * (tier >= 3 ? 2.2 : 1.2), 0, 7); g.fill(); }
  if (tier >= 4) { const gr = g.createRadialGradient(cx, cy, H * .1, cx, cy, H * .6); gr.addColorStop(0, hex + '44'); gr.addColorStop(1, hex + '00'); g.globalAlpha = 1; g.fillStyle = gr; g.fillRect(0, 0, W, H); }
  g.globalAlpha = 1;
}
function skyline(seed, hex) {
  let s = seed, out = '';
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 14; i++) { const h = 20 + rnd() * 70; out += `<rect x="${i * 7.2}" y="${100 - h}" width="6" height="${h}" fill="${hex}" opacity="${(.12 + rnd() * .18).toFixed(2)}"/>`; }
  return `<svg class="hc-sky" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${out}</svg>`;
}

// ═══════════════════════ Rendu d'une carte
function cardHtml(c, owned, fresh) {
  const r = RAR[c.rar], fam = FAMILIES[c.fam], ct = c.contact ? DATA.c[c.contact] : null;
  const num = `${String(c.no).padStart(3, '0')}/${CARDS.length}`;
  if (!owned) return `<button type="button" class="hc-card hc-locked" style="--k:${r.hex}" data-id="${c.id}" aria-label="Carte ${c.secret ? 'secrète' : r.name} non obtenue. Retourner la carte.">
    <div class="hc-inner"><div class="hc-face"><div class="hc-top"><span>${c.secret ? 'SEC-??' : c.serial.replace(/[^-]+$/, '??')}</span><span class="hc-rar">◆ ${r.name}</span></div>
      <div class="hc-art hc-qmbox"><span class="hc-qm">?</span></div><span class="hc-cat" style="color:${fam.hex};border-color:${fam.hex}55">${fam.name}</span>
      <div class="hc-title">${c.secret ? 'Carte secrète' : 'Carte verrouillée'}</div>
      <div class="hc-quote hc-dimq">${c.secret ? 'On ne sait pas encore ce qu\'elle cache. Elle se révèle le jour où tu l\'obtiens.' : 'Son illustration et son texte se révèlent quand tu l\'obtiens.'}</div>
      <div class="hc-foot"><span class="hc-serial">NEO-BXL · 2089</span><span>${num}</span></div></div>
      <div class="hc-face hc-back"><h3>◆ ${r.name} · ${fam.name}</h3><div class="hc-t">???</div>
        ${c.secret ? '<p>Aucun indice : certaines réponses, certains événements et certaines rencontres font tomber ces cartes.</p>' : `<div class="hc-cond"><b>COMMENT L'OBTENIR</b>${esc(c.cond)}</div><div class="hc-reward">RÉCOMPENSE : ${c.reward.txt}</div>`}
        <div class="hc-flipnote">Clique pour retourner la carte</div></div></div></button>`;
  let art;
  if (c.art === 'portrait') art = `<canvas class="hc-big" width="300" height="300" data-portrait="${c.contact}" data-rar="${c.rar}" data-tier="${c.tier}"></canvas>`;
  else if (c.art === 'friend') art = `<canvas class="hc-fx" width="300" height="200" data-fx="${c.rar}" data-tier="${c.tier}" data-seed="${c.no * 37}"></canvas><svg class="hc-g" viewBox="0 0 100 100" aria-hidden="true">${G[c.glyph] || ''}</svg><canvas class="hc-medal" width="72" height="72" data-mini="${c.contact}"></canvas>`;
  else art = `<svg class="hc-g" viewBox="0 0 100 100" aria-hidden="true">${G[c.glyph] || ''}</svg>`;
  const who = ct ? `<div class="hc-who"><canvas width="68" height="68" data-mini="${c.contact}"></canvas><div><b>${esc(ct.name.toUpperCase())}</b><span>${esc(ct.role)}</span></div></div>`
    : c.runner ? '<div class="hc-who"><div><b>RUNNER INCONNU</b><span>Croisé·e en ville</span></div></div>'
    : c.district ? `<div class="hc-who"><div><b style="color:${c.district.color}">${esc(c.district.name.toUpperCase())}</b><span>Quartier de NEO-BXL</span></div></div>` : '';
  const back = c.eps ? `<ol class="hc-eps">${c.eps.map(t => `<li>${esc(t)}</li>`).join('')}</ol>` : c.brief ? `<p><b>Brief :</b> « ${esc(c.brief)} »</p><p class="hc-reward">LIEU : ${esc(c.place)}</p>`
    : c.secret ? '<p>Carte secrète : invisible dans la collection tant qu\'elle n\'est pas obtenue.</p>' : '';
  const anim = c.rar === 'myth' || c.rar === 'secret' || c.rar === 'gold';
  return `<button type="button" class="hc-card ${anim ? 'hc-anim' : ''} ${c.rar === 'secret' ? 'hc-secretc' : ''} ${fresh ? 'hc-fresh' : ''}" style="--k:${r.hex}" data-id="${c.id}" aria-label="${esc(c.title)}, carte ${r.name}. Retourner la carte.">
    <div class="hc-inner">
      <div class="hc-face"><span class="hc-foil"></span>
        <div class="hc-top"><span>${c.serial}</span><span class="hc-rar">◆ ${r.name}</span></div>
        <div class="hc-art">${skyline(c.no * 97 + 13, r.hex)}${art}<span class="hc-min">${esc(c.tag)}</span>${c.place ? `<span class="hc-place">${esc(c.place)}</span>` : ''}</div>
        <span class="hc-cat" style="color:${fam.hex};border-color:${fam.hex}55">${fam.name}</span>
        <div class="hc-title">${esc(c.title)}</div>${who}
        <div class="hc-quote">« ${esc(c.quote)} »</div>
        <div class="hc-foot"><span class="hc-serial">NEO-BXL · 2089</span><span>${num}</span></div>
      </div>
      <div class="hc-face hc-back"><span class="hc-foil"></span>
        <h3>◆ ${r.name} · ${c.serial}</h3><div class="hc-t">${esc(c.title)}</div>${back}
        <div class="hc-cond"><b>OBTENUE</b>${esc(c.cond)}</div><div class="hc-reward">RÉCOMPENSE : ${c.reward.txt}</div>
        <div class="hc-flipnote">Clique pour retourner la carte</div>
      </div>
    </div></button>`;
}
function paintCanvases(root) {
  root.querySelectorAll('canvas[data-mini]').forEach(cv => portrait(cv, DATA.c[cv.dataset.mini]));
  root.querySelectorAll('canvas[data-portrait]').forEach(cv => bigPortrait(cv, DATA.c[cv.dataset.portrait], cv.dataset.rar, +cv.dataset.tier));
  root.querySelectorAll('canvas[data-fx]').forEach(cv => friendBackdrop(cv, cv.dataset.fx, +cv.dataset.tier, +cv.dataset.seed));
}
function wireCards(root) {
  root.addEventListener('click', (ev) => { const c = ev.target.closest('.hc-card'); if (c && root.contains(c)) c.classList.toggle('hc-flip'); });
  root.addEventListener('pointermove', (ev) => { const c = ev.target.closest('.hc-card'); if (!c) return; const b = c.getBoundingClientRect();
    c.style.setProperty('--mx', ((ev.clientX - b.left) / b.width * 100) + '%'); c.style.setProperty('--my', ((ev.clientY - b.top) / b.height * 100) + '%'); });
}

// ═══════════════════════ Galerie
/** Affiche la collection. opts : { got: Set, fresh: Set } */
function gallery(root, opts) {
  const got = opts.got, fresh = opts.fresh || new Set();
  let filter = 'all';
  const famCount = {}, famGot = {};
  CARDS.forEach(c => { famCount[c.fam] = (famCount[c.fam] || 0) + 1; if (got.has(c.id)) famGot[c.fam] = (famGot[c.fam] || 0) + 1; });
  const total = CARDS.filter(c => got.has(c.id)).length;
  root.classList.add('hc');
  root.innerHTML = `<div class="hc-head"><div><div class="hc-eyebrow">COLLECTION HOLO // NEO-BXL</div><h1 class="hc-h1">Cartes holo</h1></div>
      <div class="hc-progress"><b>${total}</b><span>/ ${CARDS.length} cartes</span><i><u style="width:${total / CARDS.length * 100}%"></u></i></div></div>
    <p class="hc-lead">Toutes les cartes restent cachées derrière un « ? » jusqu'à leur obtention. Au verso, les cartes normales indiquent comment les obtenir ; les secrètes ne disent rien. Clique une carte pour la retourner.</p>
    <div class="hc-legend">${Object.entries(FAMILIES).map(([k, f]) => `<div class="hc-lg" style="--k:${f.hex}"><b><span>${f.name}</span><span>${famGot[k] || 0}/${famCount[k]}</span></b><p>${f.txt}</p></div>`).join('')}</div>
    <div class="hc-filters" role="group" aria-label="Filtrer les cartes">${[['all', 'TOUTES', '#00d8f0'], ['owned', 'OBTENUES', '#7cf29a'], ...Object.entries(FAMILIES).map(([k, f]) => [k, f.name, f.hex])]
      .map(([k, l, hex]) => `<button type="button" data-f="${k}" style="--k:${hex}" aria-pressed="${k === 'all'}">${l}</button>`).join('')}</div>
    <div class="hc-grid"></div>`;
  const grid = root.querySelector('.hc-grid');
  const draw = () => {
    let html = '';
    Object.keys(FAMILIES).forEach((f) => {
      if (filter !== 'all' && filter !== 'owned' && filter !== f) return;
      const list = CARDS.filter(c => c.fam === f && (filter !== 'owned' || got.has(c.id)));
      if (!list.length) return;
      html += `<div class="hc-section">${FAMILIES[f].name} · ${famGot[f] || 0}/${famCount[f]}</div>` + list.map(c => cardHtml(c, got.has(c.id), fresh.has(c.id))).join('');
    });
    grid.innerHTML = html || '<p class="hc-lead">Aucune carte obtenue pour l\'instant. Monte l\'amitié de tes contacts pour la première.</p>';
    paintCanvases(grid);
  };
  root.querySelector('.hc-filters').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (!b) return; filter = b.dataset.f;
    root.querySelectorAll('.hc-filters button').forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); });
  wireCards(grid);
  draw();
}
/** Révélation des nouvelles cartes, une par une. */
function reveal(ids, onDone) {
  const list = ids.map(id => BY_ID[id]).filter(Boolean);
  if (!list.length) { onDone && onDone(); return; }
  const ov = document.createElement('div'); ov.className = 'hc hc-reveal';
  let i = 0;
  const show = () => {
    const c = list[i];
    ov.innerHTML = `<div class="hc-rv"><div class="hc-eyebrow">NOUVELLE CARTE ${list.length > 1 ? `· ${i + 1}/${list.length}` : ''}</div>
      <div class="hc-rvcard">${cardHtml(c, true, true)}</div><div class="hc-rvtxt">+ ${esc(c.reward.txt)}</div>
      <button type="button" class="hc-btn">${i + 1 < list.length ? 'Carte suivante ›' : 'Ajouter à la collection'}</button></div>`;
    paintCanvases(ov); wireCards(ov.querySelector('.hc-rvcard'));
    ov.querySelector('.hc-btn').onclick = () => { i++; if (i < list.length) show(); else { ov.remove(); onDone && onDone(); } };
  };
  document.body.appendChild(ov); show();
}

window.HoloCards = { CARDS, BY_ID, RAR, FAMILIES, pending, gallery, reveal };
})();
