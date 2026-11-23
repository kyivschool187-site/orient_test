(function () {
  const levels = [
    {
      id: "pochatkovyi",
      title: "Початковий",
      lead: "Знаки, кольори, масштаб, компас, рельєф, простий шлях, легенда, безпека і чесна гра.",
      tests: window.ORIENT_TESTS || []
    },
    {
      id: "serednii",
      title: "Середній",
      lead: "Слова дистанції, точне місце, легенда, рельєф, спринт і порядок пунктів.",
      tests: window.ORIENT_MIDDLE || []
    },
    {
      id: "ekspert",
      title: "Експерт",
      lead: "Схожі знаки, повернення на точку, атака пункту, довгий варіант і рельєф без чисел.",
      tests: window.ORIENT_EXPERT || []
    }
  ];
  const allTests = levels.reduce(function (list, level) { return list.concat(level.tests); }, []);
  const figures = window.ORIENT_FIGURES;
  const app = document.getElementById("app");
  const historySlot = document.getElementById("history-slot");
  const STORE = "orientuvannia-testy-v1";

  const view = { name: "levels", levelId: null, testId: null, index: 0, phase: "answer", picks: [], correct: 0 };

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORE);
      const data = raw ? JSON.parse(raw) : { attempts: [], best: {} };
      if (!data || !Array.isArray(data.attempts)) return { attempts: [], best: {} };
      if (!data.best || typeof data.best !== "object") data.best = {};
      return data;
    } catch (err) {
      return { attempts: [], best: {} };
    }
  }

  function saveAttempt(entry) {
    const data = loadStore();
    data.attempts.unshift(entry);
    data.attempts = data.attempts.slice(0, 30);
    const prev = data.best[entry.testId];
    if (typeof prev !== "number" || entry.percent > prev) data.best[entry.testId] = entry.percent;
    try {
      localStorage.setItem(STORE, JSON.stringify(data));
    } catch (err) {
      /* приватний режим може блокувати сховище */
    }
  }

  function bestFor(id) {
    const data = loadStore();
    let best = typeof data.best[id] === "number" ? data.best[id] : null;
    data.attempts.forEach(function (item) {
      if (item.testId !== id || typeof item.percent !== "number") return;
      best = best == null ? item.percent : Math.max(best, item.percent);
    });
    return best;
  }

  function findLevel(id) {
    return levels.find(function (item) { return item.id === id; }) || null;
  }

  function levelOfTest(id) {
    return levels.find(function (level) {
      return level.tests.some(function (test) { return test.id === id; });
    }) || null;
  }

  function findTest(id) {
    return allTests.find(function (item) { return item.id === id; }) || null;
  }

  function levelTests() {
    const level = findLevel(view.levelId);
    return level ? level.tests : [];
  }

  function percentOf(correct, total) {
    if (!total) return 0;
    return Math.round((correct / total) * 100);
  }

  function choiceCorrect(question, pick) {
    return pick === question.answer;
  }

  function matchCorrect(question, pick) {
    if (!pick) return false;
    return question.rows.every(function (row) { return pick[row.id] === row.answer; });
  }

  function isCorrect(question, pick) {
    return question.kind === "match" ? matchCorrect(question, pick) : choiceCorrect(question, pick);
  }

  function comment(percent) {
    if (percent === 100) return "Усі відповіді правильні. Можна брати наступний тест.";
    if (percent >= 80) return "Міцно. Варто ще раз глянути лише ті питання, де була помилка.";
    if (percent >= 50) return "Основа вже є. Пройдіть тест ще раз і читайте пояснення.";
    return "Для першого разу це нормально. Поверніться до пояснень і спробуйте знову.";
  }

  function h(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function renderHistory() {
    historySlot.replaceChildren();
    const attempts = loadStore().attempts.slice(0, 5);
    if (!attempts.length) return;
    historySlot.appendChild(h("h2", null, "У цьому браузері"));
    const list = h("ul", "history");
    attempts.forEach(function (item) {
      const test = findTest(item.testId);
      const level = levelOfTest(item.testId);
      const li = h("li");
      li.appendChild(h("span", null, (level ? level.title + " · " : "") + (test ? test.title : "Тест")));
      li.appendChild(h("strong", null, item.percent + "%"));
      list.appendChild(li);
    });
    historySlot.appendChild(list);
  }

  function renderLevels() {
    const block = document.createElement("div");
    block.appendChild(h("h2", null, "Оберіть рівень"));
    block.appendChild(h("p", "muted", "Кожен рівень має свій список тестів. Найкращий результат пам’ятається окремо для кожного тесту."));
    const grid = h("div", "level-grid");
    levels.forEach(function (level) {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "level-card";
      card.appendChild(h("strong", null, level.title));
      card.appendChild(h("span", null, level.tests.length + " тестів. " + level.lead));
      card.addEventListener("click", function () {
        view.name = "home";
        view.levelId = level.id;
        render();
      });
      grid.appendChild(card);
    });
    block.appendChild(grid);
    app.replaceChildren(block);
    renderHistory();
  }

  function renderHome() {
    const level = findLevel(view.levelId);
    const tests = levelTests();
    const block = document.createElement("div");
    const back = h("button", "text-btn btn secondary", "Усі рівні");
    back.type = "button";
    back.addEventListener("click", function () {
      view.name = "levels";
      render();
    });
    block.appendChild(back);
    block.appendChild(h("h2", null, level ? level.title : "Оберіть тест"));
    block.appendChild(h("p", "muted", "Кожен тест має кілька питань. Після відповіді одразу видно, чи так, і чому."));
    const grid = h("div", "test-grid");
    tests.forEach(function (test, index) {
      const card = h("article", "test-card");
      const kicker = h("div", "test-kicker");
      const left = h("span");
      left.appendChild(h("span", "num", String(index + 1)));
      kicker.appendChild(left);
      const best = bestFor(test.id);
      kicker.appendChild(h("span", best == null ? null : "best", best == null ? test.questions.length + " питань" : "Найкраще: " + best + "%"));
      card.appendChild(kicker);
      card.appendChild(h("h3", null, test.title));
      card.appendChild(h("p", "muted", test.summary));
      const button = h("button", "btn", "Почати");
      button.type = "button";
      button.addEventListener("click", function () { startTest(test.id); });
      card.appendChild(button);
      grid.appendChild(card);
    });
    block.appendChild(grid);
    app.replaceChildren(block);
    renderHistory();
  }

  function startTest(id) {
    const owner = levelOfTest(id);
    if (owner) view.levelId = owner.id;
    view.name = "quiz";
    view.testId = id;
    view.index = 0;
    view.phase = "answer";
    view.picks = [];
    view.correct = 0;
    render();
    app.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function current() {
    const test = findTest(view.testId);
    return { test: test, question: test.questions[view.index] };
  }

  function renderQuiz() {
    const pack = current();
    const test = pack.test;
    const question = pack.question;
    const tests = levelTests();
    const total = test.questions.length;
    const block = document.createElement("div");

    const head = h("header", "quiz-head");
    head.appendChild(h("p", "quiz-kicker", "Тест " + (tests.indexOf(test) + 1) + " з " + tests.length));
    head.appendChild(h("h2", null, test.title));
    head.appendChild(h("p", "progress-label", "Питання " + (view.index + 1) + " з " + total));
    const track = h("div", "track");
    track.setAttribute("aria-hidden", "true");
    const bar = h("div", "track-bar");
    bar.style.width = Math.round(((view.index + 1) / total) * 100) + "%";
    track.appendChild(bar);
    head.appendChild(track);
    block.appendChild(head);

    block.appendChild(h("p", "prompt", question.prompt));
    if (question.figure) {
      const slot = h("div", "figure-slot");
      const drawn = figures.render(question.figure);
      if (drawn) slot.appendChild(drawn);
      block.appendChild(slot);
    }

    const form = document.createElement("form");
    if (question.kind === "match") form.appendChild(renderMatch(question));
    else form.appendChild(renderChoice(question));

    const error = h("p", "form-error", "");
    error.hidden = true;
    form.appendChild(error);

    const submit = h("button", "btn", "Відповісти");
    submit.type = "submit";
    form.appendChild(submit);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const pick = readPick(question, form);
      if (!pick.complete) {
        error.hidden = false;
        error.textContent = question.kind === "match" ? "Заповніть усі рядки." : "Оберіть відповідь.";
        return;
      }
      error.hidden = true;
      grade(question, pick.pick, form);
    });
    block.appendChild(form);

    const back = h("button", "text-btn btn secondary", "До списку тестів");
    back.type = "button";
    back.style.marginTop = "0.8rem";
    back.addEventListener("click", function () {
      view.name = "home";
      render();
    });
    block.appendChild(back);
    app.replaceChildren(block);
  }

  function renderChoice(question) {
    const field = document.createElement("fieldset");
    field.className = "option-list";
    field.appendChild(h("legend", "visually-hidden", "Варіанти відповіді"));
    question.options.forEach(function (option) {
      const label = document.createElement("label");
      label.className = "option";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "answer";
      input.value = option.id;
      label.appendChild(input);
      const text = h("span");
      text.appendChild(document.createTextNode(option.label));
      if (option.figure) {
        text.appendChild(figures.render(option.figure));
      }
      label.appendChild(text);
      field.appendChild(label);
    });
    return field;
  }

  function renderMatch(question) {
    const wrap = h("div", "match-list");
    question.rows.forEach(function (row) {
      const rowEl = h("div", "match-row");
      rowEl.dataset.row = row.id;
      const label = h("label", null, row.label);
      const selectId = "row-" + row.id;
      label.setAttribute("for", selectId);
      const select = document.createElement("select");
      select.id = selectId;
      select.name = row.id;
      const empty = document.createElement("option");
      empty.value = "";
      empty.textContent = "Оберіть…";
      select.appendChild(empty);
      question.choices.forEach(function (choice) {
        const opt = document.createElement("option");
        opt.value = choice.id;
        opt.textContent = choice.label;
        select.appendChild(opt);
      });
      rowEl.appendChild(label);
      rowEl.appendChild(select);
      wrap.appendChild(rowEl);
    });
    return wrap;
  }

  function readPick(question, form) {
    if (question.kind === "match") {
      const pick = {};
      let complete = true;
      question.rows.forEach(function (row) {
        const value = form.querySelector('[name="' + row.id + '"]').value;
        pick[row.id] = value;
        if (!value) complete = false;
      });
      return { complete: complete, pick: pick };
    }
    const chosen = form.querySelector("input[name=answer]:checked");
    return { complete: !!chosen, pick: chosen ? chosen.value : "" };
  }

  function grade(question, pick, form) {
    const ok = isCorrect(question, pick);
    if (ok) view.correct += 1;
    view.picks.push({ pick: pick, ok: ok });
    view.phase = "feedback";
    form.querySelectorAll("input, select, button").forEach(function (node) { node.disabled = true; });

    if (question.kind === "choice") {
      form.querySelectorAll(".option").forEach(function (label) {
        const input = label.querySelector("input");
        if (input.value === question.answer) {
          label.classList.add("is-correct");
          label.appendChild(h("span", "badge", "правильна"));
        } else if (input.checked) {
          label.classList.add("is-wrong");
          label.appendChild(h("span", "badge", "ваша"));
        }
      });
    } else {
      question.rows.forEach(function (row) {
        const rowEl = form.querySelector('[data-row="' + row.id + '"]');
        const good = pick[row.id] === row.answer;
        rowEl.classList.add(good ? "is-correct" : "is-wrong");
        const choice = question.choices.find(function (item) { return item.id === row.answer; });
        if (!good && choice) {
          rowEl.appendChild(h("p", "fig-caption", "Правильно: " + choice.label));
        }
      });
    }

    const box = h("div", "feedback " + (ok ? "is-correct" : "is-wrong"));
    box.setAttribute("role", "status");
    box.appendChild(h("h3", null, ok ? "Правильна відповідь" : "Неправильна відповідь"));
    box.appendChild(h("p", null, question.explain));
    const next = h("button", "btn", view.index + 1 === current().test.questions.length ? "До результату" : "Далі");
    next.type = "button";
    next.addEventListener("click", function () {
      if (view.index + 1 >= current().test.questions.length) finish();
      else {
        view.index += 1;
        view.phase = "answer";
        render();
      }
    });
    box.appendChild(h("div", "btn-row")).appendChild(next);
    form.insertAdjacentElement("afterend", box);
  }

  function finish() {
    const test = findTest(view.testId);
    const total = test.questions.length;
    const correct = view.correct;
    const percent = percentOf(correct, total);
    saveAttempt({ testId: test.id, correct: correct, total: total, percent: percent, ts: Date.now() });
    view.name = "result";
    view.percent = percent;
    render();
  }

  function renderResult() {
    const test = findTest(view.testId);
    const tests = levelTests();
    const total = test.questions.length;
    const correct = view.correct;
    const percent = view.percent;
    const block = document.createElement("div");
    block.appendChild(h("p", "quiz-kicker", "Результат"));
    block.appendChild(h("h2", null, test.title));
    const score = h("div", "score-block");
    const ring = h("div", "score-ring");
    ring.style.setProperty("--p", String(percent));
    ring.appendChild(h("span", null, percent + "%"));
    score.appendChild(ring);
    const words = h("div");
    words.appendChild(h("p", "prompt", "Успішність " + percent + "%. Правильних відповідей: " + correct + " з " + total + "."));
    words.appendChild(h("p", null, comment(percent)));
    score.appendChild(words);
    block.appendChild(score);

    const review = h("ol", "review");
    test.questions.forEach(function (question, index) {
      const item = view.picks[index];
      const li = document.createElement("li");
      const mark = h("div", "mark " + (item.ok ? "ok" : "no"), (item.ok ? "Правильно. " : "Помилка. ") + question.prompt);
      li.appendChild(mark);
      if (!item.ok) li.appendChild(h("p", "muted", question.explain));
      review.appendChild(li);
    });
    block.appendChild(review);

    const row = h("div", "btn-row");
    const again = h("button", "btn", "Ще раз");
    again.type = "button";
    again.addEventListener("click", function () { startTest(test.id); });
    const home = h("button", "btn secondary", "Усі тести");
    home.type = "button";
    home.addEventListener("click", function () { view.name = "home"; render(); });
    const nextIndex = (tests.indexOf(test) + 1) % tests.length;
    const next = h("button", "btn secondary", "Наступний тест");
    next.type = "button";
    next.addEventListener("click", function () { startTest(tests[nextIndex].id); });
    row.appendChild(again);
    row.appendChild(next);
    row.appendChild(home);
    block.appendChild(row);
    app.replaceChildren(block);
    renderHistory();
    app.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function render() {
    const level = findLevel(view.levelId);
    if (view.name === "levels") document.title = "Тести з орієнтування";
    else if (view.name === "home") document.title = (level ? level.title + " — " : "") + "Тести з орієнтування";
    else document.title = findTest(view.testId).title + " — Тести з орієнтування";
    if (view.name === "levels") renderLevels();
    else if (view.name === "home") renderHome();
    else if (view.name === "quiz") renderQuiz();
    else renderResult();
  }

  render();
})();
