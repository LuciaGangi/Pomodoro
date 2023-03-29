interface Task {
    id: string;
    title: string;
    completed: boolean;
  }
  
  const tasks: Task[] = [];
  let time = 0;
  let timer: number | null = null;
  let timerBreak: number | null = null;

  let current: string | null = null;
  let statusApp: string = "stop";
  
  const bAdd = document.querySelector("#bAdd") as HTMLButtonElement;
  const itTask = document.querySelector("#itTask") as HTMLInputElement;
  const form = document.querySelector("#form") as HTMLFormElement;
  
  renderTasks();
  renderTime();
  
  form.addEventListener("submit", (e: Event) => {
    e.preventDefault();
    if (itTask.value !== "") {
      createTask(itTask.value);
      itTask.value = "";
      renderTasks();
    }
  });
  
  function createTask(value: string): void {
    const newTask: Task = {
      id: (Math.random() * 100).toString(36).slice(2),
      title: value,
      completed: false,
    };
  
    tasks.unshift(newTask);
  }
  
  function renderTasks(): void {
    const html: string[] = tasks.map((task: Task) => {
      return `
        <div class="task">
          <div class="completed">${
            task.completed
              ? "<span class='done'>Done</span>"
              : `<button class="start-button" data-id="${task.id}">Start</button></div>`
          }
          <div class="title">${task.title}</div>
        </div>`;
    });
    const tasksContainer = document.querySelector("#tasks") as HTMLElement;
    tasksContainer.innerHTML = html.join("");
  
    const startButtons = document.querySelectorAll(".task .start-button");
    startButtons.forEach((startButton) => {
      startButton.addEventListener("click", () => {
        if (!timer) {
          startButtonHandler(startButton.getAttribute("data-id") as string);
          startButton.textContent = "En progreso...";
        }
      });
    });
  }
  
  function startButtonHandler(id: string): void {
    time = 25 * 60;
    current = id;
    const taskId = tasks.findIndex((task) => task.id === id);
    document.querySelector("#time #taskName")!.textContent = tasks[taskId].title;
    timer = setInterval(() => {
      timerHandler(id);
    }, 1000);
  }
  
  function timerHandler(id: string | null = null): void {
    time--;
    renderTime();
    if (time === 0) {
      markComplete(id!);
      clearInterval(timer!);
      renderTasks();
      startBreak();
    }
  }
  
  function markComplete(id: string): void {
    const taskId = tasks.findIndex((task) => task.id === id);
    tasks[taskId].completed = true;
  }
  
  function startBreak(): void {
    time = 5 * 60;
    document.querySelector("#time #taskName")!.textContent = "Break";
    timerBreak = setInterval(timerBreakHandler, 1000);
  }
  
  function timerBreakHandler(): void {
    time--;
    renderTime();
    if (time === 0) {
      clearInterval(timerBreak!);
      current = null;
      document.querySelector("#time #taskName")!.textContent = "";
      renderTime();
    }
  }

  function renderTime(): void {
    const timeDiv = document.querySelector<HTMLDivElement>("#time #value");
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    if (timeDiv !== null) {
      timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
  }
  