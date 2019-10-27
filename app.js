new Vue({
  el: '#app',
  data: {
    playerHealth: 100,
    monsterHealth: 100,
    isStarted: false,
    logs: [],
    minDamage: 5,
    maxDamage: 10,
    specialAttackGain: 6,
    actorPlayer: Symbol('You'),
    actorMonster: Symbol('Monster'),
    buttonsDisabled: false
  },
  methods: {
    initGame: function () {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.isStarted = false;
      this.logs = [];
      this.buttonsDisabled = false;
    },
    attack: function (specialAttack) {
      let monsterAttackDamage = this.generateMonsterAttackDamage();
      let playerAttackDamage = this.generatePlayerAttackDamage(specialAttack);

      this.monsterHealth -= playerAttackDamage;
      this.playerHealth -= monsterAttackDamage;

      this.logMonsterAttack(monsterAttackDamage);
      this.logPlayerAttack(playerAttackDamage);

      this.isFinished();
    },
    heal: function () {
      let monsterAttackDamage = this.generateMonsterAttackDamage();
      let heal = 10;

      this.playerHealth -= (monsterAttackDamage - heal);
      this.playerHealth = (this.playerHealth > 100) ? 100 : this.playerHealth;

      this.logMonsterAttack(monsterAttackDamage);
      this.logPlayerHeal(heal);

      this.isFinished();
    },
    isFinished: function () {
      let isMonsterWon = (this.playerHealth <= 0);
      let isPlayerWon = (this.monsterHealth <= 0 && !isMonsterWon);

      this.monsterHealth = (this.monsterHealth < 0) ? 0 : this.monsterHealth;
      this.playerHealth = (this.playerHealth < 0) ? 0 : this.playerHealth;

      if (isPlayerWon || isMonsterWon) {
        this.buttonsDisabled = true;
        setTimeout(() => {
          let message = (isPlayerWon ? 'You win!' : 'You lost!') + ' New Game?';
          if (confirm(message)) {
            this.initGame();
          }
          this.buttonsDisabled = false;
        }, 1000);
      }
    },
    generateRandomDamage: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    generatePlayerAttackDamage: function (specialAttack) {
      let minDamage = this.minDamage;
      let maxDamage = this.maxDamage;

      if (specialAttack) {
        minDamage += this.specialAttackGain;
        maxDamage += this.specialAttackGain;
      }
      return this.generateRandomDamage(minDamage, maxDamage);
    },
    generateMonsterAttackDamage: function () {
      let minDamage = this.minDamage + 1;
      let maxDamage = this.maxDamage + 3;

      return this.generateRandomDamage(minDamage, maxDamage);
    },
    addLog: function (actor, message) {
      this.logs.unshift({
        actor: actor,
        message: message
      });
    },
    logPlayerAttack: function (damage) {
      this.addLog(this.actorPlayer, 'PLAYER HITS MONSTER FOR ' + damage);
    },
    logMonsterAttack: function (damage) {
      this.addLog(this.actorMonster, 'MONSTER HITS PLAYER FOR ' + damage);
    },
    logPlayerHeal: function (heal) {
      this.addLog(this.actorPlayer, 'PLAYER HEALS HIMSELF FOR ' + heal);
    }
  }
});