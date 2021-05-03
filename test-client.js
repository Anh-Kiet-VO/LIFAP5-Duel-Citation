const citations = [
    {
        _id:    "6073fed4d891aa41256d6f3c",
        quote:  "They taste like...burning.",
        character:  "Ralph Wiggum",
        image:  "https://cdn.glitch.com/3…Wiggum.png?1497567511523",
        characterDirection:	"Left",
        origin:	"The Simpsons",
    },

    {
        _id:    "6073fed4d891aa41256d6f3d",
        quote:  "My eyes! The goggles do nothing!",
        character:  "Rainier Wolfcastle",
        image:	"https://cdn.glitch.com/3…castle.png?1497567511035",
        characterDirection:	"Left",
        origin:	"The Simpsons",
    },

    {
        _id: "6073fed4d891aa41256d6f3f",
        quote:	"I live in a single room … another bowling alley.",
        character:	"Frank Grimes",
        image:	"https://cdn.glitch.com/3…Grimes.png?1497567511887",
        characterDirection:	"Left",
        origin:	"The Simpsons",
    }

];

document.addEventListener('DOMContentLoaded', function(){
    // initialisation de Mocha
    mocha.setup('tdd');
  
    //////////////////////////////////////////////////////////////////////
    // Suites de tests

  suite("Tests pour la fonction getRandomInt",
        function() {
          test("On vérifie que le résultat est bien différent de l'argument exception",
            function() {
              const nombre = getRandomInt(5);
              chai.assert.notEqual(6);
            });
        });
 
/* suite("Tests pour la fonction remplacerCarte",
          function() {
            test("On vérifie que les nouvelles conservées sont issues du tableau original",
                 function() {
                   const remplacer = remplacerCarte(1, citations[0]).map(n => n.characterDirection);
				   remplacer.forEach(n => chai.assert.equal(n.characterDirection === Right));
                 });
	});

	suite("Tests pour la fonction newQuote",
          function() {
            test("On vérifie que les nouvelles conservées sont issues du tableau original",
                 function() {
                   const remplacer = remplacerCarte(1, citations[0]).map(n => n.characterDirection);
				   remplacer.forEach(n => chai.assert.equal(n.characterDirection === Right));
                 });
	});*/
  
    mocha.checkLeaks();
    mocha.globals(['jQuery']);
    mocha.run();
    
  }, false);