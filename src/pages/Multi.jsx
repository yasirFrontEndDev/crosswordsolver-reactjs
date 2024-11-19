import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
const Multi = () => {
  const [selectedDictionary, setSelectedDictionary] = useState("big");
  const [dictionary, setDictionary] = useState([]);
  const [pattern1, setPattern1] = useState("");
  const [pattern2, setPattern2] = useState("");
  const [combinedResults, setCombinedResults] = useState([]);
  const inputRefsOne = useRef([]);
  const inputRefsTwo = useRef([]);

  // Load dictionary from local files
  useEffect(() => {
    const loadDictionary = async () => {
      try {
         // const response = await fetch(`assets/dictionaries/${selectedDictionary}.txt`);
        //for gh-pages
        const response = await fetch(`/crosswordsolver-reactjs/assets/dictionaries/${selectedDictionary}.txt`);
        
        if (!response.ok) throw new Error("Failed to load dictionary");
        const text = await response.text();
        const words = text.split("\n").map((line) => line.trim().toLowerCase());
        setDictionary(words);
      } catch (error) {
        console.error("Error loading dictionary:", error.message);
      }
    };
    loadDictionary();
  }, [selectedDictionary]);

  const handleInputChange = (e, index, set) => {
    const currentSet = set === "one" ? inputRefsOne : inputRefsTwo;
    const value = e.target.value;

    // Move to the next input if a valid character is entered
    if (value.length === 1 && /^[a-zA-Z0-9.]$/.test(value)) {
      if (index < currentSet.current.length - 1) {
        currentSet.current[index + 1].focus();
      }
    }
  };
  const handleKeyDown = (e, index, set) => {
    const currentSet = set === "one" ? inputRefsOne : inputRefsTwo;

    if (e.key === "Backspace" && !e.target.value) {
      if (index > 0) {
        const previousInput = currentSet.current[index - 1];
        previousInput.focus();
        previousInput.value = ""; // Clear the previous input value
      }
    }
  };
  // Canonicalize input patterns (convert special chars to wildcards)
  const canonicalizeInput = (inp) => {
    return inp.trim().toLowerCase().replace(/[ *?]/g, ".");
  };

  // Single-pattern search logic
  const singlePatternSearch = (words, inp) => {
    const letterCorrectMatches = lettersCorrect(inp, words);
    if (letterCorrectMatches.length === 0) {
      return ["> No exact results found, printing closest matches:\n"];
    }
    const uniqueWildcardMatches = wildcardsUnique(inp, letterCorrectMatches);
    if (uniqueWildcardMatches.length === 0) {
      return [
        "> No exact results found, printing closest matches:\n",
        ...letterCorrectMatches,
      ];
    }
    const matchedNumbers = numberPatterns(inp, uniqueWildcardMatches);
    if (matchedNumbers.length === 0) {
      return [
        "> No exact results found, printing closest matches:\n",
        ...uniqueWildcardMatches,
      ];
    }
    return matchedNumbers;
  };

  // Double-pattern search logic
  const doublePatternSearch = (words, pattern1, pattern2) => {
    const results1 = singlePatternSearch(words, pattern1);
    const results2 = singlePatternSearch(words, pattern2);

    if (results1.includes(">") || results2.includes(">")) return [];
    const output = [];

    results1.forEach((word1) => {
      const map1 = mapPattern(pattern1, word1);
      if (!map1) return;

      results2.forEach((word2) => {
        const map2 = mapPattern(pattern2, word2);
        if (!map2) return;

        let conflict = false;
        Object.entries(map1).forEach(([key, value]) => {
          if (map2[key] && map2[key] !== value) {
            conflict = true;
          }
        });

        if (!conflict) {
          output.push(`${word1}:${word2}`);
        }
      });
    });
    return output;
  };

  // Helper functions for patterns
  const lettersCorrect = (inp, words) => {
    const matched = [];
    const inpCharsOnly = inp.replace(/[^a-zA-Z -]/g, " ");
    words.filter((word) => word.length === inp.length).forEach((word) => {
      let match = true;
      for (let i = 0; i < inpCharsOnly.length; i++) {
        if (inpCharsOnly[i] !== " " && inpCharsOnly[i] !== word[i]) {
          match = false;
          break;
        }
      }
      if (match) matched.push(word);
    });
    return matched;
  };

  const wildcardsUnique = (inp, words) => {
    const matched = [];
    const wildcards = [...inp].map((ch, i) => (ch === "." ? i : -1)).filter((i) => i >= 0);
    const letters = new Set([...inp].filter((ch) => ch !== "."));
    words.forEach((word) => {
      let match = true;
      const usedLetters = new Set(letters);
      wildcards.forEach((index) => {
        if (usedLetters.has(word[index])) {
          match = false;
        } else {
          usedLetters.add(word[index]);
        }
      });
      if (match) matched.push(word);
    });
    return matched;
  };

  const numberPatterns = (inp, words) => {
    const matched = [];
    words.forEach((word) => {
      const letterToNum = {};
      const numToLetter = {};
      let match = true;
      [...inp].forEach((ch, i) => {
        if (/\d/.test(ch)) {
          const num = parseInt(ch);
          if (
            (numToLetter[num] && numToLetter[num] !== word[i]) ||
            (letterToNum[word[i]] && letterToNum[word[i]] !== num)
          ) {
            match = false;
          } else {
            numToLetter[num] = word[i];
            letterToNum[word[i]] = num;
          }
        } else if (letterToNum[word[i]] && letterToNum[word[i]] !== -1) {
          match = false;
        } else {
          letterToNum[word[i]] = -1;
        }
      });
      if (match) matched.push(word);
    });
    return matched;
  };

  const mapPattern = (pattern, word) => {
    const mapping = {};
    for (let i = 0; i < pattern.length; i++) {
      if (/\d/.test(pattern[i])) {
        if (mapping[pattern[i]] && mapping[pattern[i]] !== word[i]) {
          return null;
        }
        mapping[pattern[i]] = word[i];
      }
    }
    return mapping;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Build pattern1 and pattern2 from form inputs
    const pattern1 = canonicalizeInput(
      [...e.target.elements]
        .filter((el) => el.name.startsWith("l"))
        .map((el) => el.value)
        .join("")
    );
  
    const pattern2 = canonicalizeInput(
      [...e.target.elements]
        .filter((el) => el.name.startsWith("m"))
        .map((el) => el.value)
        .join("")
    );
  
    setPattern1(pattern1);
    setPattern2(pattern2);
  
    // Only calculate combined results if both patterns are present
    if (pattern1 && pattern2) {
      setCombinedResults(doublePatternSearch(dictionary, pattern1, pattern2));
    }
  };
  

    // Handle dictionary change
    const handleDictionaryChange = (e) => {
      setSelectedDictionary(e.target.value);
    };
  return (
    <div>
         {/* Header Section */}
      <div className="headerMain">
        <a href="index.htm">
          <img src="assets/codeword_solver.jpg" alt="Best Codeword Solver" />
          <h2 className="header-h2">Codeword Solver</h2>
        </a>
      </div>
      <div className="wrapperMain">
      <main>
      <div className="gamelinks">
      <Link to="/">Single</Link> |{" "}
      <Link to="/multi">Multiple</Link>
        <br />
        <br />
      </div>

      <b>Multi Pattern Solver</b>
      <br />
      With this advanced mode, you can solve two words at the same time. See below for an example.
      <hr />
      <div>Pattern 1</div>

      <form onSubmit={handleSubmit}>
        <div>
          {[...Array(15)].map((_, i) => (
            <input
            key={`l${i + 1}`}
            name={`l${i + 1}`}
            id={`l${i + 1}`}
            className="textbox"
            maxLength="1"
            type="text"
            ref={(el) => (inputRefsOne.current[i] = el)} // Assign ref
            onKeyDown={(e) => handleKeyDown(e, i, "one")} // Handle key down
            onChange={(e) => handleInputChange(e, i, "one")} // Handle input change
            />
          ))}
          <input className="button" style={{ visibility: "hidden" }} />
        </div>

        <hr />
        <div>Pattern 2</div>
        <p>
          {[...Array(15)].map((_, i) => (
            <input
            key={`m${i + 1}`}
            name={`m${i + 1}`}
            id={`m${i + 1}`}
            className="textbox"
            maxLength="1"
            type="text"
            ref={(el) => (inputRefsTwo.current[i] = el)} // Assign ref
            onKeyDown={(e) => handleKeyDown(e, i, "two")} // Handle key down
            onChange={(e) => handleInputChange(e, i, "two")} // Handle input change
            />
          ))}
          <input type="submit" className="button" style={{ visibility: "hidden" }} />
        </p>
        <hr />
        Dictionary
        <select onChange={handleDictionaryChange} name="dict" id="dict">
          <option value="big">Big (260k words)</option>
          <option value="original">Original (115k words)</option>
          <option value="pocket">Pocket (20k words)</option>
        </select>
        <input type="submit" className="button" value="submit" />
      </form>
      <hr />
          <p>
            Solutions for <b> {pattern1.toUpperCase()  + ":" + pattern2.toUpperCase()}</b>
          </p>
          <div>
            <h3>Results:</h3>
            <ul className="multiResults_Overflow">
    {combinedResults.map((match, index) => (
     <li key={index}>{match}</li>
    ))}
  </ul>
          </div>
      <hr />
      <img
        src="assets/example2.png"
        alt="Solving multiple codeword words"
        align="left"
        style={{ marginRight: "15px" }}
      />
      <b>Example:</b>
      <br />
      We want to solve the highlighted 8-letter word going across together with the 10-letter word going down.
      <br />
      <br />
      We enter:
      <br />
      <b>12321o54</b>
      <br />
      <b>5.324o...5</b>
      <br />
      <br />
      As a solution, we get <b>catacomb:metabolism</b>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <hr />
    </main>
    </div>
      {/* Footer Section */}
      <footer className="footerMain">
      <Link to="/privacy">Privacy Policy</Link> |{" "}
        <a href="mailto:mythomasgames@gmail.com">Contact</a>
      </footer>
    </div>
  )
}

export default Multi
