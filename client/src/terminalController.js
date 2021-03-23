import ComponentsBuilder from "./components.js";

export default class TerminalController {
  #usersCollors = new Map();
  constructor() {}

  #pickCollor() {
    return `#${(((1 << 24) * Math.random()) | 0).toString(16)}-fg`;
  }

  #getUserCollor(userName) {
    if (this.#usersCollors.has(userName))
      return this.#usersCollors.get(userName);

    const collor = this.#pickCollor();
    this.#usersCollors.set(userName, collor);

    return collor;
  }

  #onInputReceived(eventEmitter) {
    return function () {
      const message = this.getValue();
      console.log(message);
      this.clearValue();
    };
  }

  #onMessageReceived({ screen, chat }) {
    return (msg) => {
      const { userName, message } = msg;
      const collor = this.#getUserCollor(userName);
      chat.addItem(`{${collor}}{bold}${userName}{/}: ${message}`);
      screen.render();
    };
  }

  #registerEvents(eventEmitter, component) {
    eventEmitter.on("message:received", this.#onMessageReceived(component));
  }

  async initializeTable(eventEmitter) {
    const components = new ComponentsBuilder()
      .setScreen({ title: "HacherChat - Ramon Mello" })
      .setLayoutComponent()
      .setInputComponent(this.#onInputReceived(eventEmitter))
      .setChatComponent()
      .build();

    this.#registerEvents(eventEmitter, components);

    components.input.focus();
    components.screen.render();

    setInterval(() => {
      eventEmitter.emit("message:received", {
        message: "Olá",
        userName: "Ramon Mello",
      });
      eventEmitter.emit("message:received", {
        message: "Olá",
        userName: "Madara Maciel",
      });
    }, 2000);
  }
}
