// Notes, based on 440Hz 
const notes = {"C0":16.35,"C#0":17.32,"D0":18.35,"D#0":19.45,"E0":20.6,"F0":21.83,"F#0":23.12,"G0":24.5,"G#0":25.96,"A0":27.5,"A#0":29.14,"B0":30.87,"C1":32.7,"C#1":34.65,"D1":36.71,"D#1":38.89,"E1":41.2,"F1":43.65,"F#1":46.25,"G1":49,"G#1":51.91,"A1":55,"A#1":58.27,"B1":61.74,"C2":65.41,"C#2":69.3,"D2":73.42,"D#2":77.78,"E2":82.41,"F2":87.31,"F#2":92.5,"G2":98,"G#2":103.83,"A2":110,"A#2":116.54,"B2":123.47,"C3":130.81,"C#3":138.59,"D3":146.83,"D#3":155.56,"E3":164.81,"F3":174.61,"F#3":185,"G3":196,"G#3":207.65,"A3":220,"A#3":233.08,"B3":246.94,"C4":261.63,"C#4":277.18,"D4":293.66,"D#4":311.13,"E4":329.63,"F4":349.23,"F#4":369.99,"G4":392,"G#4":415.3,"A4":440,"A#4":466.16,"B4":493.88,"C5":523.25,"C#5":554.37,"D5":587.33,"D#5":622.25,"E5":659.25,"F5":698.46,"F#5":739.99,"G5":783.99,"G#5":830.61,"A5":880,"A#5":932.33,"B5":987.77,"C6":1046.5,"C#6":1108.73,"D6":1174.66,"D#6":1244.51,"E6":1318.51,"F6":1396.91,"F#6":1479.98,"G6":1567.98,"G#6":1661.22,"A6":1760,"A#6":1864.66,"B6":1975.53,"C7":2093,"C#7":2217.46,"D7":2349.32,"D#7":2489.02,"E7":2637.02,"F7":2793.83,"F#7":2959.96,"G7":3135.96,"G#7":3322.44,"A7":3520,"A#7":3729.31,"B7":3951.07,"C8":4186.01,"C#8":4434.92,"D8":4698.63,"D#8":4978.03,"E8":5274.04,"F8":5587.65,"F#8":5919.91,"G8":6271.93,"G#8":6644.88,"A8":7040,"A#8":7458.62,"B8":7902.13};
const keyboardNoteMap = {
  "z" : "C3",
  "x" : "D3",
  "c" : "E3",
  "v" : "F3",
  "b" : "G3",
  "n" : "A3",
  "m" : "B3",
  "," : "C4",
  "." : "D4",

  "s" : "C#3",
  "d" : "D#3",
  "g" : "F#3",
  "h" : "G#3",
  "j" : "A#3",

  "q" : "C4",
  "w" : "D4",
  "e" : "E4",
  "r" : "F4",
  "t" : "G4",
  "y" : "A4",
  "u" : "B4",
  "i" : "C5",
  "o" : "D5",
  "p" : "E5",

  "2" : "C#4",
  "3" : "D#4",
  "5" : "F#4",
  "6" : "G#4",
  "7" : "A#4",
  "9" : "C#5",
  "0" : "D#5"
};

angular.module("app",[]).controller("AppCtrl", function($scope,$interval) {
  $scope.notes = notes;
  $scope.editor = false;
  
  $scope.chanels = [
    {
      type: 'sine',
      volume: 1.0,
      notes: []
    },
    {
      type: 'sine',
      volume: 1.0,
      notes: []
    },
    {
      type: 'sine',
      volume: 1.0,
      notes: []
    },
    {
      type: 'sine',
      volume: 1.0,
      notes: []
    },
    {
      type: 'sine',
      volume: 1.0,
      notes: []
    },
    {
      type: 'sine',
      volume: 1.0,
      notes: []
    },
    {
      type: 'sine',
      volume: 1.0,
      notes: []
    },
    {
      type: 'sine',
      volume: 1.0,
      notes: []
    },
  ];
  
 
  
  $scope.editNotes = function(index) {
    $scope.editor = true;
    $scope.selectedChanel = index;
  };
  
  $scope.addBar = function() {
    for(let ch of $scope.chanels) {
      for(let i = 0; i < 8; i++) {
        ch.notes.push("none");
        
      }
    }
  };
  $scope.addBar();
  
  $scope.speed=120
  $scope.playPauseLabel = "play";
  
  $scope.oscillators = [];
  $scope.context = undefined;
  function initOscillators() {
    $scope.context = new (window.AudioContext || window.webkitAudioContext)();
    
    for(let i = 0; i < 8; i++) {
      $scope.oscillators[i] = {
        oscillator : $scope.context.createOscillator(),
        gain: $scope.context.createGain(),
        stopGain : $scope.context.createGain(),
        filter: $scope.context.createBiquadFilter()
      };
      $scope.oscillators[i].oscillator.type = 'sine';
      $scope.oscillators[i].filter.type = 'allpass';
      $scope.oscillators[i].stopGain.gain.value = 0;
      $scope.oscillators[i].oscillator.connect($scope.oscillators[i].stopGain)
      $scope.oscillators[i].stopGain.connect($scope.oscillators[i].filter)
      $scope.oscillators[i].filter.connect($scope.oscillators[i].gain);
      $scope.oscillators[i].gain.connect($scope.context.destination);
      $scope.oscillators[i].oscillator.start();
      
    }     
    console.log($scope.oscillators)
  }
  
  $scope.playInterval = undefined;
  $scope.selectedChanel = 0;
  $scope.playIndex = 0;
  $scope.playPause = function() {
    if($scope.playInterval == undefined) {
      $scope.playPauseLabel = "stop";
      $scope.playInterval = $interval(function() {
        
        for(let i = 0; i < 8; i++) {
          let note = $scope.chanels[i].notes[$scope.playIndex];
          if(note == "none") {
            //ignore
          }
          else if(note == "stop") {
            let intrv = setInterval(function() {
              $scope.oscillators[i].stopGain.gain.value -= 0.01;
              if($scope.oscillators[i].stopGain.gain.value <= 0) {
                clearInterval(intrv);
              }
            },1)
          }
          else {
            console.log($scope.oscillators[i].stopGain.gain.value);
            $scope.oscillators[i].stopGain.gain.value = 1;
            $scope.oscillators[i].oscillator.frequency.value = $scope.notes[note];
            //try{$scope.oscillators[i].gain.connect($scope.context.destination);} catch(e) {}
          }
        }
        $scope.playIndex++;
        if($scope.playIndex >= $scope.chanels[0].notes.length)
          $scope.playIndex = 0;
      }, (1000* 60/ ($scope.speed*4)));
    }
    else {
      for(let i = 0; i < 8; i++) {
        //try{$scope.oscillators[i].gain.disconnect($scope.context.destination);}catch(e){}
      }
      $interval.cancel($scope.playInterval);
      $scope.playPauseLabel = "play";
      $scope.playInterval=undefined;
    }
  };
  
  initOscillators();
  
  $scope.loadFile = function() {
    $scope.chanels = JSON.parse($scope.loadStr);
  };
  
  $scope.exportFile = function() {
    $scope.exportStr = JSON.stringify($scope.chanels,1," ");
  };

  document.addEventListener("keydown", function(event) {
    console.log(notes[keyboardNoteMap[event.key]]);
    $scope.oscillators[$scope.selectedChanel].stopGain.gain.value = 1;
    $scope.oscillators[$scope.selectedChanel].oscillator.frequency.value = notes[keyboardNoteMap[event.key]]
    //try{$scope.oscillators[$scope.selectedChanel].gain.connect($scope.context.destination);}catch(e){};
  });

  document.addEventListener("keyup", function(event) {
    if(event.key == ' '){
      let intrv = setInterval(function() {
        $scope.oscillators[$scope.selectedChanel].stopGain.gain.value -= 0.05;
        if($scope.oscillators[$scope.selectedChanel].stopGain.gain.value <= 0.0) {
          clearInterval(intrv);
        }
      },1)
    }
  });

  $scope.setChanel = (ch) => $scope.selectedChanel = ch;

  
});


