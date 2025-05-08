// ====================== LANGUAGE DATA ======================
export const languageData = {
    vi: {
      title: "Game Hứng Táo",
      startGame: "Chơi ngay",
      settings: "Cài đặt",
      fallSpeed: "Tốc độ rơi:",
      basketSpeed: "Tốc độ di chuyển giỏ:",
      controlType: "Chọn kiểu điều khiển:",
      keyboard: "Bàn phím",
      handtracking: "Hand Tracking",
      languageSelect: "Chọn ngôn ngữ:",
      save: "Lưu",
      back: "Quay lại",
      returnMenu: "Về Menu",
      score: "Điểm",
      time: "Thời gian",
      control: "Điều khiển"
    },
    en: {
      title: "Apple Catch Game",
      startGame: "Play Now",
      settings: "Settings",
      fallSpeed: "Fall Speed:",
      basketSpeed: "Basket Move Speed:",
      controlType: "Select Control Type:",
      keyboard: "Keyboard",
      handtracking: "Hand Tracking",
      languageSelect: "Select Language:",
      save: "Save",
      back: "Back",
      returnMenu: "Return to Menu",
      score: "Score",
      time: "Time",
      control: "Control"
    },
    zh: {
      title: "接苹果游戏",
      startGame: "开始游戏",
      settings: "设置",
      fallSpeed: "掉落速度:",
      basketSpeed: "篮子移动速度:",
      controlType: "选择控制方式:",
      keyboard: "键盘",
      handtracking: "手部追踪",
      languageSelect: "选择语言:",
      save: "保存",
      back: "返回",
      returnMenu: "返回菜单",
      score: "得分",
      time: "时间",
      control: "控制方式"
    }
  };
  
  // ====================== GAMESCENE ======================
  export class GameScene extends Phaser.Scene {
    constructor() {
      super("scene-game");
      this.player;
      this.target;
      this.cursor;
      this.score = 0;
      this.timeElapsed = 0;
      this.scoreText;
      this.timeText;
      this.controlText;
      this.mode = localStorage.getItem("gameMode") || "free";
      this.remainingTime = 60;
      this.timerText;
      this.gameEnded = false;
    }
  
    preload() {
      this.load.image("bg", "public/assets/caytao.png");
      this.load.image("basket", "public/assets/basket.png");
      this.load.image("apple", "public/assets/apple.png");
    }
  
    create() {
      if (this.mode === "60s") {
        this.timerText = this.add.text(300, 10, "60", {
          fontSize: "22px", fill: "#ff3333", stroke: "#000", strokeThickness: 2
        });
      }
  
      const lang = localStorage.getItem("language") || "vi";
      const texts = languageData[lang];
  
      this.add.image(0, 0, "bg").setOrigin(0, 0);
      this.player = this.physics.add.image(0, 500, "basket").setCollideWorldBounds(true);
      const fallSpeed = parseInt(localStorage.getItem("fallSpeed") || "50");
      this.target = this.physics.add.image(Math.random() * 500, 0, "apple").setVelocityY(fallSpeed);
  
      this.cursor = this.input.keyboard.createCursorKeys();
  
      this.scoreText = this.add.text(10, 10, `${texts.score}: 0`, {
        fontSize: "22px", fill: "#ffcc00", stroke: "#000", strokeThickness: 2
      });
      this.timeText = this.add.text(10, 40, `${texts.time}: 0s`, {
        fontSize: "20px", fill: "#66ff99", stroke: "#000", strokeThickness: 2
      });
      this.controlText = this.add.text(10, 70, "", {
        fontSize: "18px", fill: "#ffffff"
      });
      this.modeText = this.add.text(10, 100, "", {
        fontSize: "18px", fill: "#ffffff"
      });
  
      this.physics.add.overlap(this.player, this.target, this.catchApple, null, this);
    }
  
    update() {
      const lang = localStorage.getItem("language") || "vi";
      const texts = languageData[lang];
      const controlType = localStorage.getItem("controlType") || "keyboard";
      const basketSpeed = parseInt(localStorage.getItem("basketSpeed") || "200");
  
      this.controlText.setText(`${texts.control}: ${controlType === "keyboard" ? texts.keyboard : texts.handtracking}`);
      this.modeText.setText(`Chế độ: ${this.mode === "60s" ? "60 Giây" : "Tự Do"}`);
  
      if (this.mode === "60s" && !this.gameEnded) {
        this.remainingTime -= this.game.loop.delta / 1000;
        if (this.remainingTime <= 0) {
          this.remainingTime = 0;
          this.endGame();
        }
        this.timeText.setText(`${texts.time}: ${Math.floor(this.remainingTime)}s`);
      } else {
        this.timeElapsed += this.game.loop.delta / 1000;
        this.timeText.setText(`${texts.time}: ${Math.floor(this.timeElapsed)}s`);
      }
  
      if (controlType === "keyboard") {
        if (this.cursor.left.isDown) {
          this.player.setVelocityX(-basketSpeed);
        } else if (this.cursor.right.isDown) {
          this.player.setVelocityX(basketSpeed);
        } else {
          this.player.setVelocityX(0);
        }
      }
    }
  
    catchApple() {
      const lang = localStorage.getItem("language") || "vi";
      const texts = languageData[lang];
  
      this.score += 10;
      this.scoreText.setText(`${texts.score}: ${this.score}`);
      this.target.setY(0);
      this.target.setX(Math.random() * 500);
    }
  
    endGame() {
      this.gameEnded = true;
      this.physics.pause();
      const lang = localStorage.getItem("language") || "vi";
      const texts = languageData[lang];
  
      this.add.text(250, 220, `Kết thúc!\n${texts.score}: ${this.score}`, {
        fontSize: "28px",
        fill: "#ffffff",
        align: "center",
        stroke: "#000",
        strokeThickness: 3
      }).setOrigin(0.5);
    }
  }
  
  // ====================== MAIN GAME CONTROL ======================
  let game;
  let speedDown = 50;
  let basketSpeed = 200;
  
  function updateTexts() {
    const lang = localStorage.getItem("language") || "vi";
    const texts = languageData[lang];
  
    document.getElementById("gameTitle").innerText = texts.title;
    document.getElementById("startGameBtn").innerText = texts.startGame;
    document.getElementById("settingsBtn").innerText = texts.settings;
    document.getElementById("fallSpeedLabel").childNodes[0].textContent = texts.fallSpeed + " ";
    document.getElementById("basketSpeedLabel").childNodes[0].textContent = texts.basketSpeed + " ";
    document.getElementById("controlTypeTitle").innerText = texts.controlType;
    document.getElementById("keyboardLabel").innerText = texts.keyboard;
    document.getElementById("handtrackingLabel").innerText = texts.handtracking;
    document.getElementById("languageSelectTitle").innerText = texts.languageSelect;
    document.getElementById("saveSettingsBtn").innerText = texts.save;
    document.getElementById("backToMenuBtn").innerText = texts.back;
    document.getElementById("returnToMenuBtn").innerText = texts.returnMenu;
  }
  
  document.getElementById("settingsBtn").addEventListener("click", () => {
    document.getElementById("mainMenu").style.display = "none";
    document.getElementById("settings").style.display = "block";
  });
  
  document.getElementById("saveSettingsBtn").addEventListener("click", () => {
    speedDown = parseInt(document.getElementById("speedSlider").value);
    basketSpeed = parseInt(document.getElementById("basketSpeedSlider").value);
  
    const selectedControl = document.querySelector('input[name="controlType"]:checked').value;
    const selectedLanguage = document.getElementById("languageSelect").value;
    const selectedGameMode = document.querySelector('input[name="gameMode"]:checked').value;
  
    localStorage.setItem("gameMode", selectedGameMode);
    localStorage.setItem("controlType", selectedControl);
    localStorage.setItem("fallSpeed", speedDown);
    localStorage.setItem("basketSpeed", basketSpeed);
    localStorage.setItem("language", selectedLanguage);
  
    updateTexts();
    alert("Cài đặt đã được lưu!");
  });
  
  document.getElementById("backToMenuBtn").addEventListener("click", () => {
    document.getElementById("settings").style.display = "none";
    document.getElementById("mainMenu").style.display = "block";
  });
  
  document.getElementById("startGameBtn").addEventListener("click", () => {
    document.getElementById("mainMenu").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";
  
    if (game) game.destroy(true);
    game = new Phaser.Game({
      type: Phaser.WEBGL,
      width: 500,
      height: 500,
      canvas: document.querySelector("#gameCanvas"),
      physics: { default: "arcade", arcade: { gravity: { y: 0 } } },
      scene: [GameScene],
    });
  });
  
  document.getElementById("returnToMenuBtn").addEventListener("click", () => {
    document.getElementById("gameScreen").style.display = "none";
    document.getElementById("mainMenu").style.display = "block";
    if (game) game.destroy(true);
  });
  
  // Bắt đầu
  updateTexts();
  