"use strict";

function element(tag, content, className) {
  const node = document.createElement(tag);
  if (content) node.textContent = content;
  if (className) node.className = className;
  return node;
}

function mathText(tag, content, className) {
  const node = element(tag, "", className);
  let offset = 0;

  for (const match of content.matchAll(/([A-Za-zΑ-Ωα-ω])_([A-Za-z0-9]+)/g)) {
    const [notation, variable, subscript] = match;
    node.append(content.slice(offset, match.index));
    const symbol = element("span", variable, "math-symbol");
    symbol.append(element("sub", subscript));
    node.append(symbol);
    offset = match.index + notation.length;
  }

  node.append(content.slice(offset));
  return node;
}

function noteLink(slug) {
  return "./note.html?slug=" + encodeURIComponent(slug);
}

function renderCatalog() {
  const search = document.querySelector("#search");
  const filters = document.querySelector("#filters");
  const cards = document.querySelector("#cards");
  const status = document.querySelector("#status");
  const categories = ["全部", ...new Set(notes.map(note => note.category))];
  let activeCategory = "全部";

  function updateResults() {
    const terms = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const matchingNotes = notes.filter(note => {
      const searchableText = [note.title, note.category, note.summary, ...note.keywords].join(" ").toLowerCase();
      return (activeCategory === "全部" || note.category === activeCategory)
        && terms.every(term => searchableText.includes(term));
    });

    status.textContent = matchingNotes.length
      ? `共 ${matchingNotes.length} 篇筆記`
      : "目前沒有符合的筆記，試試其他關鍵字或類別。";

    cards.replaceChildren(...matchingNotes.map(note => {
      const link = element("a", "", "card");
      link.href = noteLink(note.slug);
      link.append(
        element("span", note.category, "tag"),
        element("h3", note.title),
        element("p", note.summary),
        element("span", "閱讀筆記 →", "card-action")
      );
      return link;
    }));
  }

  for (const category of categories) {
    const button = element("button", category, "filter");
    button.type = "button";
    button.setAttribute("aria-pressed", String(category === activeCategory));
    button.addEventListener("click", () => {
      activeCategory = category;
      for (const filter of filters.children) {
        filter.setAttribute("aria-pressed", String(filter === button));
      }
      updateResults();
    });
    filters.append(button);
  }

  search.addEventListener("input", updateResults);
  window.addEventListener("pageshow", updateResults);
  updateResults();
}

function noteSection(title, ...children) {
  const section = element("section", "", "note-section");
  section.append(element("h2", title), ...children);
  return section;
}

function renderNote(article) {
  const slug = new URLSearchParams(window.location.search).get("slug");
  const note = notes.find(entry => entry.slug === slug);
  if (!note) {
    article.append(element("h1", "找不到這篇筆記"), element("p", "請回到目錄選擇要閱讀的主題。"));
    return;
  }

  document.title = note.title + "｜電子學筆記";
  const header = element("header", "", "note-heading");
  header.append(element("span", note.category, "tag"), element("h1", note.title), element("p", note.summary, "lede"));

  const solution = element("details");
  const steps = element("ol");
  steps.append(...note.example.steps.map(step => mathText("li", step)));
  solution.append(element("summary", "展開解答"), steps, mathText("p", note.example.answer, "answer"));
  solution.addEventListener("toggle", () => {
    solution.querySelector("summary").textContent = solution.open ? "收起解答" : "展開解答";
  });

  article.append(
    header,
    noteSection("核心觀念", mathText("p", note.concept)),
    noteSection("公式與適用條件", mathText("p", note.formula, "formula"), mathText("p", note.condition)),
    noteSection("例題", mathText("p", note.example.question), solution),
    noteSection("容易出錯的地方", mathText("p", note.pitfall))
  );

  if (note.source) {
    article.append(element("footer", "資料來源｜" + note.source, "note-source"));
  }
}

const article = document.querySelector("#note");
if (article) {
  renderNote(article);
} else {
  renderCatalog();
}
