export function highlightGlossaryTerms(glossary) {
  const editableDivs = document.querySelectorAll(".string-div");

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

export function generateTranslationPrompt(sentences, glossary) {
  // Format sentences array
  const formattedSentences = sentences.map((each) => each);

  // Format glossary array
  const formattedGlossary = glossary.map(
    ({ term, target }) => `${term}: ${target[0].term}`
  );

  const glossaryTerm = matchGlossaryTerms(sentences[0], glossary);

  // Generate the prompt
  const prompt = `Translate into English: 
${formattedSentences.join("\n")}
Glossary:
${formattedGlossary.join("\n")}
"
`;
 const systemMsg = `You are a veteran translator. You will be provided with short sentences to translate.  You have 3 requirements:=
 1. Translate the text into the required language.
 2-Use the glossary for reference and ensure you replace any matching glossary terms in the sentences with matching translations. 
 3-Aside from the translation, do not provide any other output. 
 4-Do not use quotes, unless if they are part of the provided text`

  return [{role: "system", content:systemMsg},{ role: "assistant", content: prompt }];
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
