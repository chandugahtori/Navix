


// VOICE SETUP

const synth = window.speechSynthesis;
let selectedVoice = null;


const preferredFemaleVoiceNames = [
    "Samantha", 
    "Susan",    
    "Google UK English Female", 
    "Google US English" 
];

function loadVoices() {
    const voices = synth.getVoices();
    const foundVoice = voices.find(voice => 
        voice.lang.startsWith('en') && 
        preferredFemaleVoiceNames.some(name => voice.name.includes(name))
    );
    const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));

    if (foundVoice) {
        selectedVoice = foundVoice;
    } else if (englishVoices.length > 0) {
        selectedVoice = englishVoices[0]; 
    } else {
        console.warn("No English voices found. Using browser default.");
    }
    
    if (selectedVoice) {
        console.log("AI Voice selected:", selectedVoice.name);
    }
}

if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices;
} else {
    loadVoices();
}

// MAIN APPLICATION LOGIC
const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  const btn = document.querySelector("#listen-btn");
  
  btn.addEventListener("click", function () {
    
    function speak(text) {
      const utterance = new SpeechSynthesisUtterance(text);
            if (selectedVoice) {
          utterance.voice = selectedVoice;
      }
      

      utterance.pitch = 1.6; 
      
   
      utterance.rate = 1.1; 
      window.speechSynthesis.speak(utterance);
    }
    
    // Function to handle recognized commands (unchanged logic)
    function handleCommand(command) {
      speak(`I heard: ${command}. Executing command.`);

      if (command.includes("open youtube")) {
        speak("Opening YouTube .");
        window.open("https://www.youtube.com", "_blank");
      } else if (command.includes("open google")) {
        speak("Directing to Google's main page.");
        window.open("https://www.google.com", "_blank");
      } else if (command.includes("open facebook")) {
        speak("Opening Facebook.");
        window.open("https://www.facebook.com", "_blank");
      } else if (command.includes("open instagram")) {
        speak("Opening Instagram.");
        window.open("https://www.instagram.com", "_blank");
      } else if (command.includes("open whatsapp")) {
        speak("Opening WhatsApp.");
        window.open("https://web.whatsapp.com", "_blank");
      } else if (command.includes("how are you")) {
        speak("I'm running perfectly, thanks for asking! Feeling electric today.");
      } else if (command.includes("what time is it") || command.includes("time please")) {
        const now = new Date();
        speak(`The current time is ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}.`);
      } 
      
      else if (command.includes("search youtube for")) {
        const query = command.replace("search youtube for", "").trim();
        speak(`Searching YouTube for ${query}`);
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, "_blank");
      }
      
      else if (command.includes("search wikipedia for")) {
        const query = command.replace("search wikipedia for", "").trim();
        speak(`Searching Wikipedia for ${query}`);
        window.open(`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`, "_blank");
      }
      
      else {
        speak("Command not directly recognized. Searching Google for " + command);
        window.open(
          `https://www.google.com/search?q=${encodeURIComponent(command)}`,
          "_blank"
        );
      }
    }
  
    speak("Hello, I am Navix .  How may I assist you?");

    setTimeout(() => {
      btn.innerHTML = "Listening...👂";
      btn.classList.add("listening");
      recognition.start();
    }, 4000); 
  
    recognition.onresult = (event) => {
      recognition.stop(); 
      const command = event.results[0][0].transcript.toLowerCase();
      handleCommand(command);
    };
  
    recognition.onend = () => {
      btn.innerHTML = "🎙️ Start Listening";
      btn.classList.remove("listening");
    };
    
    // Handle errors
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        speak("There was a speech recognition error. Please try again.");
        btn.innerHTML = "🎙️ Start Listening";
        btn.classList.remove("listening");
    };
  });