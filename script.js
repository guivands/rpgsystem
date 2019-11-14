// Code goes here

var app = angular.module("CharApp", ['ui.bootstrap']);

app.controller('CharCtrl', function($scope, $uibModal) {
  $scope.colors = ["00a4ef", "6ab43e", "e89d41", "fd4084"];
  $scope.charFormHeaderClass = '';
  $scope.rpgClassNames = ['barbarian','bard','cleric','druid','paladin','ranger','rogue','warrior','wizard'];
  $scope.showClass = [];
  $scope.classes = [];
  for (i in $scope.rpgClassNames) {
	  var rc = $scope.rpgClassNames[i];
	  $scope.classes.push({
		  lc: rc,
		  uc: rc.toUpperCase(),
		  cap: rc.charAt(0).toUpperCase() + rc.substring(1)
	  });
  }
  
  
  $scope.laneCharColors = ["#845EC2","#008E9B","#008F7A","#D65DB1","#FF6F91","#0089BA","#FF9671","#008F7A","#FF9671","#FFC75F","#F9F871","#2C73D2","#0081CF"];
  
  $scope.characters = [/*{
    "name":"Guilherme",
    "acr":"G",
    "class":"Druid",
    "init":22
  },{
    "name":"Daniel",
    "acr":"D",
    "class":"Warrior",
    "init":25
  },{
    "name":"Gabriel",
    "acr":"A",
    "class":"Druid",
    "init":17
  },{
    "name":"Victor",
    "acr":"V",
    "class":"Warrior",
    "init":26
  },{
    "name":"Cibele",
    "acr":"C",
    "class":"Warrior",
    "init":15
  },{
    "name":"Niki",
    "acr":"N",
    "class":"Druid",
    "init":12
  },{
    "name":"Pedreiro",
    "acr":"P",
    "class":"Paladin",
    "init":19
  }*/];
  $scope.turn = {};
  $scope.character = {};
  $scope.showCharForm = false;//!$scope.characters.length;
  $scope.showTurnForm = !$scope.characters.length;
  $scope.charTurn = null;
  $scope.started = false;
  
  function resetChar(s) {
    s.character = {
      "name":"",
      "class":"",
      "initiativeBonus":0,
      "initiative":null
    };
	s.charFormHeaderClass = "";
	s.showClass = {};
  }
  
  $scope.toggleCharForm = function() {
    $scope.showCharForm = !$scope.showCharForm;
  }
  $scope.openCharForm = function() {
	$scope.charModal = $uibModal.open({
		templateUrl: "createCharForm.html"
	});
  }
  
  var fill1Char = function(ch,i) {
    if(!i)i=1;
    ch.acr = ch.name.substring(i-1,i).toUpperCase();
    var has = false;
    for(j in $scope.characters) {
      if ($scope.characters[j].acr == ch.acr)
        var has = true;
    }
    if (has) fill1Char(ch,i+1);
  }
  
  $scope.selectClass = function(c) {
	var s = $scope.showClass;
	for (i in s){s[i] = false;};
	s[c] = true;
	console.log(c, s);
  }
  
  $scope.confirmClass = function(c) {
	  $scope.character.class = c;
	  $scope.charFormHeaderClass = c + "-header";
  }
  
  $scope.addChar = function() {
    try {
      fill1Char($scope.character);
      $scope.character.init = parseInt($scope.character.initiative) + parseInt($scope.character.initiativeBonus);
      $scope.characters.push($scope.character);
	  $('#myModal').modal('toggle');
      resetChar($scope);
      $scope.toggleCharForm();
    }catch(err){console.log(err);alert("Preencha os campos corretamente.");}
    return false;
  }
  
  $scope.roll = function() {
    $scope.character.initiative = parseInt(Math.random() * 20) + 1;
  }
  
  $scope.start = function() {
    var maxInit = -99;
    var chs = $scope.characters;
    for (i in chs)
      if (maxInit < chs[i].init)
        maxInit = chs[i].init;
    for (i in chs) {
      var c = chs[i];
      c.idle = (c.init - maxInit)*-1;
      c.race = [];
      if (c.idle) {
        c.race.push({"text":"idle","duration":c.idle});
      }
      c.busyTime = c.idle;
    }
    for (i in chs) {
      var c = chs[i];
      if (c.idle == 0) {
        $scope.charTurn = c;
        break;
      }
    }
    
    $scope.showTurnForm = true;
    $scope.started = true;
  }
  
  $scope.takeTurn = function() {
    var c = $scope.charTurn;
    var chs = $scope.characters;
    
    c.race.push({
      "text":$scope.turn.action,
      "duration":parseInt($scope.turn.duration)
    });
    $scope.turn = {};
    
    for (i in chs) {
      var c = chs[i];
      c.busyTime = 0;
      for (j in c.race) {
        c.busyTime += c.race[j].duration;
      }
    }
    
    var bt = 10000000000;
    for (i in chs) {
      var c = chs[i];
      if (c.busyTime < bt) {
        bt = c.busyTime;
        $scope.charTurn = c;
      }
    }
    
    document.getElementById('action').focus();
  }
  
  resetChar($scope);
});
