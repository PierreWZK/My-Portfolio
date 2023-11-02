// Quand le html est chargé alors on lance la fonction
document.addEventListener("DOMContentLoaded", launchPage);

function launchPage() {

    //! JOUR DE LA SEMAINE
    // Récuperer le jour de la semaine, puis changer la valeur du H1 en fonction du jour
    let date = new Date();
    let day = date.getDay();

    let jour = document.getElementById("jour");
    let dayName = getDay(day);

    jour.innerText = dayName;
    //! JOUR DE LA SEMAINE

    //! GIF DU JOUR + Commentaire du jour
    //? Récupérer le result du promise (urlGif)
    let urlGif = makeNewGif(dayName);
    urlGif.then((result) => {
        let gif = document.getElementById("gif");
        gif.src = result;
    });
    //! GIF DU JOUR + Commentaire du jour

    //! On refait la fonction toutes les 10 minutes pour changer le gif
    setInterval(function () {
        //? Récupérer le result du promise (urlGif)
        let urlGif = makeNewGif(dayName);
        urlGif.then((result) => {
            let gif = document.getElementById("gif");
            gif.src = result;
        });
    }, 600000);
}

function getDay(val) {
    var dayName = "";
    switch (val) {
        case 0:
            dayName = "Un Dimanche ?";
            break;
        case 1:
            dayName = "Un Lundi ?";
            break;
        case 2:
            dayName = "Un Mardi ?";
            break;
        case 3:
            dayName = "Un Mercredi ?";
            break;
        case 4:
            dayName = "Un Jeudi ?";
            break;
        case 5:
            dayName = "Un Vendredi ?";
            break;
        case 6:
            dayName = "Un Samedi ?";
            break;
        default:
            dayName = "error, day not found";
            break;
    }

    return dayName;
}

function makeNewGif(dayName) {

    let randomPrompt = randomSearchPrompt(dayName);

    // TODO: appel fonction pour les gif par rapport au textprompt 
    //? Requetes API pour les gifs (lien suivant : https://tenor.googleapis.com/v2/search?q=excited&key=AIzaSyCcmLXLnEEGPF67vQWlfnubnWA0C6WlNRs&client_key=my_test_app&limit=8)
    //? On aura des variables en fonction des parametre du lien.
    //* q = le textprompt
    //* key = la clé de l'API
    //* client_key = la clé de l'application
    //! On return seulement un lien aléatoire parmis les 8 liens de l'API

    let link = randomGif(randomPrompt)
    return link;
}

function randomSearchPrompt(dayName) {
    let randomPrompt = [];
    switch (dayName) {
        case 'Un Lundi ?':
            randomPrompt = [
                'cestparti',
                'decollage',
                'deploiement',
                'happydeveloppeur',
                'tired'
            ]
            break;

        case 'Un Mardi ?':
            randomPrompt = [
                'continuation',
                'efficacite',
                'productivite',
                'bonchance',
                'investi'
            ]
            break;

        case 'Un Mercredi ?':
            randomPrompt = [
                'stabilite',
                'recherche',
                'becareful',
                'reussite',
                'avancement'
            ]
            break;

        case 'Un Jeudi ?':
            randomPrompt = [
                'evaluation',
                'chokbar',
                'relax',
                'preparation',
                'reflechir'
            ]
            break;

        case 'Un Vendredi ?':
            randomPrompt = [
                'mauvaischoix',
                'OhNoo',
                'apero',
                'jamais',
                'arrete'
            ]
            break;

        case 'Un Samedi ?':
            randomPrompt = [
                'fada',
                'weekend',
                'mimir',
                'gaming',
                'sardine'
            ]
            break;

        case 'Un Dimanche ?':
            randomPrompt = [
                'zzzzzzzzzz',
                'apero',
                'raclette',
                'ptitdej',
                'tk78'
            ]
            break;

        default:
            randomPrompt = ['ERREUR'];
    }

    let jourFerie = jourFerieTomorrow();
    jourFerie.then((result) => {
        jourFerie = result;
        if (jourFerie) {
            randomPrompt = [
                'Ferié',
                'NotWorking',
                'STOP',
                'arrete',
            ];
        }
    });

    let randomTextPrompt = randomPrompt[Math.floor(Math.random() * randomPrompt.length)]

    getCommentRandom(dayName, randomTextPrompt)

    return randomTextPrompt;
}

function randomGif(prompt) {
    return new Promise((resolve, reject) => {
        let API_KEY = "AIzaSyCcmLXLnEEGPF67vQWlfnubnWA0C6WlNRs";
        let CLIENT_KEY = "my_test_app";
        let limit = 15;
        let url = "https://tenor.googleapis.com/v2/search?q=" + prompt + "&key=" + API_KEY + "&client_key=" + CLIENT_KEY + "&limit=" + limit;

        let request = new XMLHttpRequest();

        request.open('GET', url, true);

        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                let data = JSON.parse(this.response);
                let randomLink = data.results[Math.floor(Math.random() * data.results.length)].media_formats.gif.url;
                resolve(randomLink); // Renvoyer le résultat via la promesse
            } else {
                reject('Error');
            }
        };

        request.send();
    });
}

function getCommentRandom(dayName, textPrompt) {
    let commentText = "BLABLA";
    if (textPrompt == 'ERREUR') commentText = "Erreur, le site marche plus à l'aide !";

    let jourFerie = jourFerieTomorrow();
    jourFerie.then((result) => {
        jourFerie = result;

        if (jourFerie) {
            ferieComment = [
                "HOP HOP HOP ! Demain c'est férié, donc ne touches à rien, retourne à ta place et dev SEULEMENT en local !",
                "La veille d'un jour férié, prenons une pause. Le travail peut attendre, profitons de ce moment pour nous ressourcer !",
                "Demain, c'est jour férié. La veille est un moment pour préparer une transition en douceur. Évitons les changements majeurs aujourd'hui !",
                "Vas-y mets en prod, on va rien dire... SAUF SI TU VEUX TE FAIRE VIRER !",
            ]

            commentText = ferieComment[Math.floor(Math.random() * ferieComment.length)]
        } else {
            if (dayName == 'Un Lundi ?') {
                //!Lundi
                if (textPrompt == 'cestparti') commentText = "Lundi matin, c'est parti pour une semaine pleine de défis et d'opportunités !";
                if (textPrompt == 'decollage') commentText = "Lundi, prêt pour le décollage vers de nouvelles réalisations !";
                if (textPrompt == 'deploiement') commentText = "Lundi, un jour idéal pour le déploiement de nos projets. C'est parti !";
                if (textPrompt == 'happydeveloppeur') commentText = "Lundi, soyons des développeurs heureux en faisant ce que nous aimons !";
                if (textPrompt == 'tired') commentText = "Lundi matin, un peu fatigué ? Prends ton café et rejoins-nous faire des mises en production bien préparée !";
            } else if (dayName == 'Un Mardi ?') {
                //!Mardi
                if (textPrompt == 'continuation') commentText = "Mardi, poursuivons avec détermination ce que nous avons commencé. La clé du succès est la continuité !";
                if (textPrompt == 'efficacite') commentText = "Mardi, l'efficacité est notre alliée. Mettons-nous au travail de manière optimale !";
                if (textPrompt == 'productivite') commentText = "Mardi, maximisons notre productivité et balançons tout en prod sans trop tarder.";
                if (textPrompt == 'bonchance') commentText = "Mardi, la chance nous sourit. Continuons à travailler dur, car ce n'est que le début de la semaine !";
                if (textPrompt == 'investi') commentText = "Mardi, investissons du temps pour ce qui est des mises en prod et les tests. On aura le temps de coder fin de semaine 🙃";
            } else if (dayName == 'Un Mercredi ?') {
                //!Mercredi
                if (textPrompt == 'stabilite') commentText = "Mercredi, la stabilité est essentielle. Assurons-nous de maintenir une base solide pour nos projets.";
                if (textPrompt == 'recherche') commentText = "Mercredi, un jour propice à la recherche et à l'innovation. Expérimentons de nouvelles choses !";
                if (textPrompt == 'becareful') commentText = "Mercredi, soyons prudents dans nos décisions. La vigilance est la clé de la réussite !";
                if (textPrompt == 'reussite') commentText = "Mercredi, avançons avec confiance vers la réussite. Nous sommes sur la bonne voie !";
                if (textPrompt == 'avancement') commentText = "Mercredi, continuons à progresser et à avancer. Chaque pas compte vers nos objectifs !";
            } else if (dayName == 'Un Jeudi ?') {
                //!Jeudi
                if (textPrompt == 'evaluation') commentText = "Jeudi, prenons un moment pour évaluer notre progression. C'est le chemin vers l'excellence !";
                if (textPrompt == 'chokbar') commentText = "TU VEUX METTRE EN PROD UN JEUDI ! T'es chokbar !";
                if (textPrompt == 'relax') commentText = "Jeudi, détendons-nous et profitons d'un moment de relaxation bien mérité. Le repos est important ! Donc pas de mise en prod !";
                if (textPrompt == 'preparation') commentText = "Jeudi, préparons-nous mentalement pour les défis à venir. Reste tranquille, et Lundi prochain tu pourras mettre en prod !";
                if (textPrompt == 'reflechir') commentText = "Réfléchis a ce que tu fais avant de faire quoi que ce soit ! On est jeudi, à tes risques et péril !";
            } else if (dayName == 'Un Vendredi ?') {
                //!Vendredi
                if (textPrompt == 'mauvaischoix') commentText = "Vendredi, faisons le bon choix en évitant les mises en production. Préparons-nous pour un week-end paisible !";
                if (textPrompt == 'OhNoo') commentText = "Oh noooo ! Pourquoi vouloir mettre en prod un vendredi ?! Si je vois une merge request, je me casse !";
                if (textPrompt == 'apero') commentText = "Vendredi, fin de semaine ! Enfin, nous pouvons nous détendre et profiter d'un apéro bien mérité. Qui est partant ce soir ?";
                if (textPrompt == 'jamais') commentText = "Vendredi, le jour où les mises en production ne sont jamais une bonne idée. Évitons les soucis le week-end !";
                if (textPrompt == 'arrete') commentText = "Vendredi, arrêtons les mises en production. C'est le moment de se préparer pour un week-end sans encombre !";
            } else if (dayName == 'Un Samedi ?') {
                //!Samedi
                if (textPrompt == 'fada') commentText = "T'y es complétement fada toi ! C'est le week-end et tu veux mettre en prod ?! NON !";
                if (textPrompt == 'weekend') commentText = "Tranquille, reste posé dans ton canapé... D'ailleurs qu'est ce que tu fais sur ce site un samedi ?!";
                if (textPrompt == 'mimir') commentText = "Rompiche ! C'est le week-end, tu peux faire la grasse matinée !";
                if (textPrompt == 'gaming') commentText = "Un peu de détente en jouant aux jeux... Profite au lieu d'être ici !";
                if (textPrompt == 'sardine') commentText = "A qu'est ce qu'on est serré au fond de cette boite... Profite du week-end pour te détendre !";
            } else if (dayName == 'Un Dimanche ?') {
                //!Dimanche
                if (textPrompt == 'zzzzzzzzzz') commentText = "ZZZzzzzZZzZZZZZZZzzzzZZzzzZZzzZZzZZZzZZzZzZzZzZzZZZzZZZzZZzz, VAS DORMIR !";
                if (textPrompt == 'apero') commentText = "Allez, prends un dernier verre et prépare toi pour la semaine qui arrives !";
                if (textPrompt == 'raclette') commentText = "Dimanche, posé, tranquille, en famille, avec une bonne raclette !";
                if (textPrompt == 'ptitdej') commentText = "Déjà debout ?! Profite du week-end pour faire la grasse matinée !";
                if (textPrompt == 'tk78') commentText = "Aujourd'hui, si je fais cette vidéo-là, c'est tout simplement pour insulter des grosses mères. Aujourd'hui j'lai juré, j'ai dit la tête de oim. Ça va pas se passer comme ça, aujourd'hui jvais insulter des mères.";
            }

        }
        //! COMMENTAIRE DU JOUR
        // Récuperer le commentaire du jour
        let comment = document.getElementById("comment");
        // Changer le commentaire en fonction du jour et du nombre aléatoire
        comment.innerText = commentText;
        //! COMMENTAIRE DU JOUR
    });
}

function jourFerieTomorrow() {
    return new Promise((resolve, reject) => {
        let year = new Date().getFullYear();
        let url = 'https://calendrier.api.gouv.fr/jours-feries/metropole/' + year + '.json'

        let request = new XMLHttpRequest();

        request.open('GET', url, true);
        let isFerie = false;

        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                let data = JSON.parse(this.response);

                let tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                let tomorrowString = tomorrow.toISOString().slice(0, 10);

                for (const [key, value] of Object.entries(data)) {
                    // console.log(key, tomorrowString, key == tomorrowString);
                    if (key == tomorrowString) {
                        isFerie = true;
                    }
                }
                resolve(isFerie);
            } else {
                reject(false);
            }
        };

        request.send();
    });
}

let meteoShow = false;
function showMeteo() {
    let meteo = document.getElementById("meteo");
    if (meteoShow) {
        meteo.classList.remove("meteo-transition");
        meteoShow = false;
    } else {
        meteo.classList.add("meteo-transition");
        meteoShow = true;
    }
}