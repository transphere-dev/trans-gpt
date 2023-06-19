export function highlightGlossaryTerms(glossary) {
    const editableDivs = document.querySelectorAll('.string-div');

    
    editableDivs.forEach((editableDiv) => {
      const content = editableDiv.innerHTML;
  
      glossary.forEach((glossaryItem) => {
        const term = glossaryItem.term;
        const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters in the term
        const regex = new RegExp(`\\b${escapedTerm}\\b`, 'gi');
        const highlightedContent = content.replace(escapedTerm, `<span className="highlighted-term">$&</span>`);
  
        editableDiv.innerHTML = highlightedContent;
      });
    });
  }
  

export function generateTranslationPrompt(sentences, glossary) {
  // Format sentences array
  const formattedSentences = sentences.map((each) => each);

  // Format glossary array
  const formattedGlossary = glossary.map(({ term, target }) => `${term}: ${target[0].term}`);

  const glossaryTerm = matchGlossaryTerms(sentences[0],glossary)

  // Generate the prompt
  const prompt = `Translate the following sentences using the provided glossary:

Sentences:
${formattedSentences.join('\n')}

Glossary:
${glossaryTerm.join('\n')}

Translate each sentence into the target language using the glossary for reference. Make sure to replace any matching glossary terms found in the sentences with their translations.

TranslatedSentence is the target translation in english

Do not explain anything and do not use pinyin

Return only the target translation content!
Do not start or end with  "Translated sentences:"


`;

  

  return [{role:'assistant',content:prompt}];
}


function matchGlossaryTerms(sentence, glossary) {
  const matchedTerms = [];

  glossary.map((term) => {
    const regex = new RegExp(`\\b${term.term}\\b`, 'i');
    console.log(regex.test(sentence));
    if (regex.test(sentence)) {
      matchedTerms.push(`${term.term}: ${term.target[0].term}`);
    }
  });

  return matchedTerms;
}
