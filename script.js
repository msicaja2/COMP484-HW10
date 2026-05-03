//////////////////////// HOMEWORK 10 CODE ADDITIONS (console) ////////////////////////
// Further code changes found at line 344

// Message Logging examples
console.log("Log Info: App started");
console.info("Info: User opened Giga Pet Game");
console.warn("Warning: This is a demo warning");
console.error("Error: This is a demo error");

console.table([
  { feature: "Celery Button", status: "working" },
  { feature: "Play Button", status: "working" },
  { feature: "Exercise Button", status: "working" },
  { feature: "Treat Button", status: "working" },
  { feature: "Start Button", status: "working" }
]);

console.group("Project 2 Debug Group");
console.log("Current page:", document.title);
console.log("Current URL:", location.href);
console.groupEnd();

console.log("%cCustom Log: Project 2 DevTools Demo", "color: blue; font-size: 18px; font-weight: bold;");

////////////////// Original Project 2 code //////////////////

$(function() { // Makes sure that your function is called once all the DOM elements of the page are ready to be used.
    
    // Called function to update the name, happiness, and weight of our pet in our HTML
    checkAndUpdatePetInfoInHtml();
  
    // When each button is clicked, it will "call" function for that button (functions are below)
    $('.treat-button').click(clickedTreatButton);
    $('.play-button').click(clickedPlayButton);
    $('.exercise-button').click(clickedExerciseButton);
    $('.start-button').click(clickedStartButton);
    $('.celery-button').click(clickedCeleryButton);
    $('.feed-neutron-star').click(clickedNeutronStar);
    $('.fly-button').click(clickedFlyButton);
    $('.customize-pet').click(clickedCustomize);
    $('.feed-kibble').click(feedKibble);
    
  })
  
    // Add a variable "pet_info" equal to a object with the name (string), weight (number), and happiness (number) of your pet
    var pet_info = {name:"???????", weight:"??", happiness:"??", energy: "??"};

    // Initialize variables
    var started = false;
    var passedInitialState = false;
    var petLeft = false;
    var overweight = false;
    var isTransitioning = false;
    var energy, weight, wags;
  
    function clickedStartButton() {
      // If transition is currently happening, return to stop function
      if (isTransitioning) {
        return; // ignore click
      }

      // Change transition flag
      isTransitioning = true;

      // Prompt to name your pet
      pet_info.name = prompt("Enter your pet's name:");

      // If the player has aleady started hide container again
      if (started) {
        $('.pet-image-container').hide();
      }

      // Play audio
      $('#entrance-audio')[0].play();

      // Delay showing the pet for 4 seconds using setTimeout,
      // after 2 second delay, allow transition again with the transition flag,
      // then use fadeIn() to smoothly make the pet visible on the screen.
      setTimeout(function() {
        $('.pet-image-container').fadeIn();
        isTransitioning = false;
      }, 4000); // Last number 4000ms indicates to wait 4 seconds until fadeIn triggers.

      // Change button label and set start to true, set petLeft to false, set passed initial state as false
      $('.start-button').text('RESET');
      started = true;
      petLeft = false;
      passedInitialState = false;
      overweight = false;

      // Initialize weight and wags
      weight = 30;
      wags = 70;
      energy = 40;

      // Reinitialize speech bubble and pet image
      $('#speech-bubble').attr('src', 'images/initial_speech.png');
      $('.pet-image').attr('src', 'images/hound.jpg');

      // Update pet info
      checkAndUpdatePetInfoInHtml();
    }

    function clickedTreatButton() {
      // Increase pet happiness
      // Increase pet weight

      // If transition is currently happening, return to stop function
      if (isTransitioning) {
        return; // ignore click
      }

      if (!petLeft && !overweight) {
        energy += 10;
        weight += 12;
        wags += 15;
        // Play bite sound
        $('#bite-audio')[0].play();
        checkAndUpdatePetInfoInHtml();
      }
    }
    
    function clickedPlayButton() {
      // Increase pet happiness
      // Decrease pet weight
      // Decrease pet energy

      // If transition is currently happening, return to stop function
      if (isTransitioning) {
        return; // ignore click
      }

      if (!petLeft) {
        if (energy < 20) {
          $('#speech-bubble').attr('src', 'images/energy.png');
        }
        else {
          energy -= 20;
          wags += 20;
          weight -= 12;
          // Play bite sound
          $('#bark-audio')[0].play();
          checkAndUpdatePetInfoInHtml();
        }
      }
    }
    
    function clickedExerciseButton() {
      // Decrease pet happiness
      // Decrease pet weight
      // Decrease pet energy

      // If transition is currently happening, return to stop function
      if (isTransitioning) {
        return; // ignore click
      }

      if (!petLeft) {
        if (energy < 20) {
          $('#speech-bubble').attr('src', 'images/energy.png');
        }
        else {
          weight -= 12;
          wags -= 10;
          energy -= 15;
          // Play bite sound
          $('#bark-audio')[0].play();
          checkAndUpdatePetInfoInHtml();
        }
      }
    }

    function clickedCeleryButton() {
      // Increase pet weight
      // Increase pet energy
      // Decrease pet happiness

      // If transition is currently happening, return to stop function
      if (isTransitioning) {
        return; // ignore click
      }

      if (!petLeft && !overweight) {
        energy += 20;
        weight += 8;
        wags -= 13;

        // Play bite sound
        $('#bite-audio')[0].play();
        checkAndUpdatePetInfoInHtml();
      }
    }
  
    function checkAndUpdatePetInfoInHtml() {
      // Make any necessary changes to not show negatives or weird energy levels
      checkWeightAndHappinessBeforeUpdating();

      // Update attributes
      pet_info.weight = weight;
      pet_info.happiness = wags;
      pet_info.energy = energy;

      updateStatus();
      updatePetInfoInHtml();
    }

    function updateStatus() { // Update the status of the pet after an action

      if (weight <= 70) {
        overweight = false;
      }
      else {
        overweight = true;
      }
      

      if ((weight < 15 || wags < 30) && !petLeft) { // If user makes pet too underweight or sad, pet runs away
        petAbandon();
      }
      else if (wags > 150 && !petLeft) { // If the pet becomes too happy, make it fly away (leaves as well)
        petFly();
      }
      else if (weight > 70) { // If pet is full, mark as full and change speech bubble
        $('#speech-bubble').attr('src', 'images/overweight.png');
      }
      else if (!passedInitialState) { // If player is just starting out, pass the initial state and update message
        checkForInitialStateChange();
      }
      else if (weight < 45 && (wags >= 100 && wags <= 150)) { // Pet is happy, but hungry
        $('#speech-bubble').attr('src', 'images/hungry.png');
      }
      else if ((weight >= 45 && weight <= 70) && wags < 100) { // Pet is full, but not happy
        $('#speech-bubble').attr('src', 'images/sad.png');
      }
      else if (weight < 45 && wags < 100) { // Pet is hungry and sad
        $('#speech-bubble').attr('src', 'images/hungry_and_sad.png');
      }
      else if (weight >= 45 && wags >= 100) { // Pet is happy and full
        $('#speech-bubble').attr('src', 'images/happy_and_full.png');
      }
    }

    function checkForInitialStateChange() { // Check if certain conditions have been met to leave initial state

      // If any of the following conditions are true, update pet message and mark as passed the initial state.
      // Needed so once a significant event occurs, pet's initial message is removed and doesn't show again
      // unless user resets

      if (weight < 45 && (wags >= 100 && wags <= 150)) { // Pet is happy, but hungry
        $('#speech-bubble').attr('src', 'images/hungry.png');
        passedInitialState = true;
      }
      else if ((weight >= 45 && weight <= 70) && wags < 100) { // Pet is full, but not happy
        $('#speech-bubble').attr('src', 'images/sad.png');
        passedInitialState = true;
      }
      else if (weight >= 45 && wags >= 100) { // Pet is happy and full
        $('#speech-bubble').attr('src', 'images/happy_and_full.png');
        passedInitialState = true;
      }
    }

    function petFly() { // triggered when the pet becomes to happy
      // enable is transition flag
      isTransitioning = true;

      // Indicate pet has left
      petLeft = true;

      // Call fadeOut() to gradually and smoothly hide the pet container from the screen
      $('.pet-image-container').fadeOut();

      // Play leaving audio
      $('#fly-audio')[0].play();

      // Use set time out to trigger this delay
      setTimeout(function() {
        // Change images
        $('.pet-image').attr('src', 'images/left.png');
        $('#speech-bubble').attr('src', 'images/pet_fly_message.png');

        $('.pet-image-container').fadeIn();
        isTransitioning = false;
      }, 4000); // Last number 4000ms indicates to wait 4 seconds until fadeIn triggers
    }

    function petAbandon() {
      // enable is transition flag
      isTransitioning = true;

      // Indicate pet has left
      petLeft = true;
      // Hide container
      $('.pet-image-container').fadeOut();

      // Play leaving audio
      $('#exit-audio')[0].play();

      // Use set time out to trigger this delay
      setTimeout(function() {
        // Change images
        $('.pet-image').attr('src', 'images/left.png');
        $('#speech-bubble').attr('src', 'images/runaway_message.png');

        $('.pet-image-container').fadeIn();
        isTransitioning = false;
      }, 10000); // Last number 4000 indicates to wait 4 seconds until fadeIn triggers
    }
    
    function checkWeightAndHappinessBeforeUpdating() { // Fix inconsitencies in attributes
      // Fix weight of 0 or less
      if (weight < 1) {
        weight = 1;
      }

      // Remove negative wags
      if (wags < 0) {
        wags = 0;
      }

      // Fix energy if below 0% or above 100%
      if (energy < 0) {
        energy = 0;
      }
      else if (energy > 100) {
        energy = 100;
      }
    }
    
    // Updates your HTML with the current values in your pet_info object
    function updatePetInfoInHtml() {
      if (!started) {
        $('.name').text('?????');
        $('.weight').text('??');
        $('.happiness').text('??');
        $('.energy').text('??');
      }
      else {
        $('.name').text(pet_info['name']);
        $('.weight').text(pet_info['weight']);
        $('.happiness').text(pet_info['happiness']);
        $('.energy').text(pet_info['energy']);
      }
      
    }
  
    ///////////////////////// Further code changes //////////////////////////

    // Cause a violation
    function clickedNeutronStar() {
      if (started) {
        console.warn("Overfeeding pet... this may cause performance issues!");

        const startTime = Date.now();

        // Play bite sound
        $('#star_explode')[0].play();

        // Run for ~3 seconds (long task)
        while (Date.now() - startTime < 5000) {
            // add weight continously
            weight += 10000;
        }

        console.log("Finished feeding a neutron star");
        checkAndUpdatePetInfoInHtml();
      }
    }

    // Type error: undefined "fly" and activate causes type error
    function clickedFlyButton() {
      if (started) {
        console.warn("Pet tried to use a nonexistent ability (flight)...");

        // Play bite sound
        $('#flight-audio')[0].play();

        pet_info.fly.activate(); 
      }
    }

    // 404 error: Redirect to a page that doesn't exist
    function clickedCustomize() {
      if (started) {
        console.log("Loading customization options...");

        fetch("customize-pet-options.json") // file doesn't exist
            .catch(err => console.error("Customization failed:", err));
      }
    }

    function feedKibble() {
      if (started) {
        // Intentionally create a weight addition value as a string
        var weightAddition = "10";

        // Add new addition to the weight (if not fixed, will concatenate instead)
        //weight += weightAddition;
        weight += Number(weightAddition); // fix

        checkAndUpdatePetInfoInHtml();
      }
    }