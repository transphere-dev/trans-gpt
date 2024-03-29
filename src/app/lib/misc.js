export function highlightGlossaryTerms(glossary) {
  const editableDivs = document.querySelectorAll(".source");

  editableDivs.forEach((editableDiv) => {
    const content = editableDiv.innerHTML;

    glossary.forEach((glossaryItem) => {
      const term = glossaryItem.term;
      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters in the term
      const regex = new RegExp(`\\b${escapedTerm}\\b`, "gi");
      const highlightedContent = content.replace(
        escapedTerm,
        `<span className="highlighted-term">$&</span>`
      );

      editableDiv.innerHTML = highlightedContent;
    });
  });
}

export function generateTranslationPrompt(systemMsg, sentences, glossary) {
  // Format sentences array
  const formattedSentences = sentences.map((each) => each);

  // Format glossary array
  const formattedGlossary = glossary.map(
    ({ term, target }) => `${term}: ${target[0].term}`
  );

  const glossaryTerm = matchGlossaryTerms(sentences[0], glossary);

  // Generate the prompt
  const prompt = `
  Sentence:
${formattedSentences.join("\n")}
Glossary:
${
  glossaryTerm.length > 0
    ? glossaryTerm.join("\n")
    : "No glossary terms provided. Translate without a glossary"
}`;
  return [
    { role: "system", content: systemMsg },
    { role: "user", content: prompt },
  ];
}

function matchGlossaryTerms(sentence, glossary) {
  const matchedTerms = [];

  glossary.map((term) => {
    const regex = new RegExp(`${term.term}`, "i");

    if (regex.test(sentence)) {
      matchedTerms.push(`${term.term}: ${term.target[0].term}`);
    }
  });

  return matchedTerms;
}

export function getTableData() {
  const tableRows = document.getElementsByClassName("table-row");
  const data = [];

  for (let i = 0; i < tableRows.length; i++) {
    const source =
      tableRows[i].children[0].getElementsByClassName("source")[0].innerText;
    const target = tableRows[i].children[1].innerText;

    data.push({ source, target });
  }

  return data;
}
