var gameObject = new Hangman();
var startButton = document.getElementById("startGame");

startButton.addEventListener("click", function () {

    gameObject.resetGame();//Reset old values
    getRandomString(); //Get random word useing ajax
    //loadData();
});


//Get random string from https://quotesondesign.com - jquery axax
function getRandomString() {
  $.ajax({
    url: "https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&callback=",
    dataType: "json",
    success: function(data) {
   
      if (data.length == 0) {
        alert("Sothing went wrong please try pressing the start button again");
        return;
      } else {
        
        var answer = data[0].title.substr(0, data[0].title.indexOf(" ")); //Get first word from random string and lowercase it
        answer = answer.replace(/[^a-zA-Z]/g, "").toLowerCase(); //Remove non-alphabetical letters from random string
         //Fallback if the random string is empty or longer than the max number of guessess after validation
        if (answer.length === 0 || answer.length > 10) {      
          gameObject.quizzAnswer = "home";
        }    
        gameObject.quizzAnswer = answer;

        //document.getElementById("answer").innerHTML = gameObject.quizzAnswer; //Used to show correct answer - for testing
        //Split answer into array - used to check if user input answer(letter) is inside the array
        answerArrary = gameObject.quizzAnswer.split(""); 
        gameObject.quizzAnswerArray = answerArrary;
        
        document.getElementById("answerQuessessNumber").innerHTML =
          "Number of wrong quessess remaing:<span style='color:blue'>" +
          gameObject.numberOfGuessess +
          "</span>";

        document.getElementById("gameContainer").style.display = "block"; //Show game board
        //gameObject.showWordLength();
        gameObject.showWordLength();
        console.log(gameObject);
      }
    },
    cache: false
  }); //End ajax  
}

document.getElementById("submitGuess").addEventListener("click", function (event) {

    event.preventDefault();
    gameObject.main();//Run all game methods
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////
		function Hangman() {

      this.quizzAnswer = "";
      this.quizzAnswerArray = [];
      this.numberOfGuessess = 10; 
      this.userAnswer = ""; //Hold all the letter the user has guesse
      this.userQuizGuess = "";

      this.main = function(){
        
        this.userQuizGuess = document.getElementById("guess").value;
        this.userQuizGuess =  this.userQuizGuess.replace(/[^a-zA-Z]/g, "").toLowerCase();
  
        if (this.userQuizGuess === "") {
      
          alert("Input a letter from the english alphabet");      
          document.getElementById("guess").value = ""; 
          return;
        }
       document.getElementById("guess").value = "";
  
      if (this.userQuizGuess === this.quizzAnswer) { //If quess correct they win

        alert("You win");
        this.resetGame();

    } else if (this.userQuizGuess.length !== 1) {
      
        //If guess wrong word
        alert("You picked the wrong word");
        this.checkNumberGuesses();
      
    } else {     
        this.guessAnswer();
    }
        
   };
      
      
			this.guessAnswer = function() {//Used to check if user gets correct answer
        
        //Used to alert if the leeter was correct or wrong or if the user has picked the letter before
				var resultMessage = "Picked letter was not correct!"; 
        //Used to change the color of the resultMessage depending on the result (red for inncorrect guess, grenn for correct guess)
				var resultMessageColor = "red"; 
        
        //Check if user has made quess before
				if (this.userAnswer.indexOf(this.userQuizGuess) === -1) {
					
          //Check if quess in answer
					for (var i = 0; i < this.quizzAnswerArray.length; i++) {
						
            //First time code create a string (userAnswer) with the same number of letters as the correct answer
						if (this.quizzAnswerArray.length !== this.userAnswer.length) {
							
							if (this.quizzAnswerArray[i] === this.userQuizGuess) {
                
								//Input the selected correct letter into the userAnswer string
								this.userAnswer += this.quizzAnswerArray[i];
								resultMessage = "You picked a correct letter!";
								resultMessageColor = "green";
							}
							
						} else {
              
							//When the user has input more than one quess updated the userAnswer string to include the correct guessess
							if (this.quizzAnswerArray[i] === this.userQuizGuess) {
                
								this.userAnswer = this.userAnswer.substr(0, i) + this.quizzAnswerArray[i] + this.userAnswer.substr(i + 1);           
								resultMessageColor = "green";
                resultMessage = "You picked a correct letter!";
							}
						}
					}
				} else {
					resultMessage = "You have picked this letter before!";
				}

				if (resultMessage === "Picked letter was not correct!") {
					this.checkNumberGuesses();
				}

				if (resultMessage === "Picked letter was not correct!" &&
					document.getElementById("incorrectQuessess").innerHTML.indexOf(this.userQuizGuess) ===
					-1) {
					//If user has quessed a wrong letter they have not quessed befor show it on the page
					document.getElementById("incorrectQuessess").innerHTML += this.userQuizGuess + ", ";
				}
        
        //Show results message on page
				document.getElementById("quessResultMessage").innerHTML ="<span style='color:"+resultMessageColor+"'>"+resultMessage+"</span>"; 
				document.getElementById("answerShow").innerHTML = "<p style='margin:0px; font-size:30px;letter-spacing: 10px;'>" +this.userAnswer +"</p>"; //Show userAnswer string on the page

				if (this.userAnswer === this.quizzAnswer && this.quizzAnswer !== "") {
					//When player input all the correct letters they win
					alert("You win !");
					this.resetGame();
				}
			};

			//////////////////////////////////////////// 

      	this.checkNumberGuesses = function() {
          
				this.numberOfGuessess--;
				this.drawStickMan();

				if (this.numberOfGuessess <= 0) {
					alert("You have run out of guesses and you lose");
					alert("The correct answer was " +  this.quizzAnswer);
					this.resetGame();
				} else {
					document.getElementById("answerQuessessNumber").innerHTML ="Number of wrong quessess remaing : <span style='color:blue'>" + this.numberOfGuessess +"</span>";
					return true;
				}
			}

			////////////////////////////////////////////////////////////////
			this.showWordLength = function() {
        //Use _ to show the user how many letter thier are in the word
				for (var i = 0; i < this.quizzAnswerArray.length; i++) { 
					this.userAnswer += "_";
				}       
				document.getElementById("answerShow").innerHTML = "<p style='margin:0px; font-size:30px;letter-spacing: 10px;'>" + this.userAnswer + "</p>";
			};
      
      //////////////////////////////////////////////////
			this.resetGame = function() { //Resets all the values of the game to their defaults

				this.numberOfGuessess = 10;
				this.quizzAnswer = "";
				this.userAnswer = "";
				this.quizzAnswerArray = [];
        this.userQuizGuess = "";//Hold user guess

				document.getElementById("gameContainer").style.display = "none";
				document.getElementById("answerShow").innerHTML = "";
				document.getElementById("answer").innerHTML = "";
				document.getElementById("quessResultMessage").innerHTML = "";
				document.getElementById("answerQuessessNumber").innerHTML = "";
				document.getElementById("incorrectQuessess").innerHTML = "";

				var canvas = document.getElementById("canvas-id");
				var context = canvas.getContext("2d");
				context.clearRect(0, 0, canvas.width, canvas.height);
				canvas.style.display = "none";
			};
      
			/////////////////////////////////////////////
			this.drawStickMan = function() { //Draw stick man when user inputs incorret answer

				document.getElementById("canvas-id").style.display = "block";
				var canvas = document.getElementById("canvas-id");
				var context = canvas.getContext("2d");
				context.strokeStyle = "black";
				context.fillStyle = "black";
				context.lineWidth = "3";
				context.beginPath();
				if (this.numberOfGuessess < 10) {
					context.moveTo(80, 90); //Botton bar - 1
					context.lineTo(10, 90);
				}
				if (this.numberOfGuessess < 9) {
					context.lineTo(10, 0); //Side bar
				}
				if (this.numberOfGuessess < 8) {
					context.lineTo(50, 0); //Top bar
				}
				if (this.numberOfGuessess < 7) {
					context.lineTo(50, 10);
					context.moveTo(58, 12);
					context.lineTo(58, 12);
					context.fillRect(50, 0, 3, 10); //Top bar down 4
				}
				if (this.numberOfGuessess < 6) {
					context.arc(52, 20, 10, 0, 2 * Math.PI); //Head
				}
				if (this.numberOfGuessess < 5) {
					context.fillRect(50, 29, 3, 30); //body
				}
				if (this.numberOfGuessess < 4) {
					context.moveTo(52, 36);
					context.lineTo(65, 56); //Right arm
				}
				if (this.numberOfGuessess < 3) {
					context.moveTo(52, 36); //Left arm
					context.lineTo(39, 56);
				}
				if (this.numberOfGuessess < 2) {
					context.moveTo(40, 80);
					context.lineTo(51, 56); //left leg
				}
				if (this.numberOfGuessess < 1) {
					context.lineTo(70, 76); //Right leg
				}
				context.stroke();        
			}
			////////////////////////////////
		}


