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

  // Handle input change and shift focus to next input field
  const handleInputChange = (e, index, set) => {
    const currentSet = set === "one" ? inputRefsOne : inputRefsTwo;

    if (e.key === "Backspace" && !e.target.value) {
      if (index > 0) {
        const previousInput = currentSet.current[index - 1];
        previousInput.focus();
      }
    } else if (e.target.value.length === 1 && /^[a-zA-Z0-9.]$/.test(e.target.value)) {
      if (index < currentSet.current.length - 1) {
        currentSet.current[index + 1].focus();
      }
    }
  };

  // Load dictionary when the component mounts or dictionary changes
  useEffect(() => {
    const loadDictionary = async () => {
      try {
        // const response = await fetch(`assets/dictionaries/${selectedDictionary}.txt`);
         //for gh-pages
         const response =await fetch(`/crosswordsolver-reactjs/assets/dictionaries/${selectedDictionary}.txt`);
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

  // Function to find matches for a pattern
  const findMatches = (pattern, dictionary) => {
    if (!pattern) return [];
    const letterMapping = {};
    let regexPattern = "";

    for (const char of pattern) {
      if (/\d/.test(char)) {
        if (!letterMapping[char]) {
          letterMapping[char] = `(?<group${char}>.)`;
          regexPattern += letterMapping[char];
        } else {
          regexPattern += `\\k<group${char}>`;
        }
      } else if (char === "." || char === "?") {
        regexPattern += ".";
      } else {
        regexPattern += char;
      }
    }

    try {
      const regex = new RegExp(`^${regexPattern}$`, "i");
      return dictionary.filter((word) => regex.test(word));
    } catch {
      return [];
    }
  };
  // Combine patterns logic
  const combineDoublePatterns = (matches1, matches2, pattern1, pattern2) => {
    let combinedMatches = [];

    const mapPattern = (pattern, word) => {
      let mapping = {};
      for (let i = 0; i < pattern.length; i++) {
        let char = pattern[i];
        if (/\d/.test(char)) {
          if (!mapping[char]) {
            mapping[char] = word[i];
          } else if (mapping[char] !== word[i]) {
            return null;
          }
        } else if (char !== "." && char !== word[i]) {
          return null;
        }
      }
      return mapping;
    };

    matches1.forEach((word1) => {
      const map1 = mapPattern(pattern1, word1);
      if (!map1) return;

      matches2.forEach((word2) => {
        const map2 = mapPattern(pattern2, word2);
        if (!map2) return;

        let conflict = false;
        for (const [key, value] of Object.entries(map1)) {
          if (map2[key] && map2[key] !== value) {
            conflict = true;
            break;
          }
        }

        if (!conflict) {
          combinedMatches.push(`${word1}:${word2}`);
        }
      });
    });

    return combinedMatches;
  };
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const pattern1 = Array.from(e.target.elements)
        .filter((el) => el.name.startsWith("l") && el.value)
        .map((el) => el.value)
        .join("");
    const pattern2 = Array.from(e.target.elements)
        .filter((el) => el.name.startsWith("m") && el.value)
        .map((el) => el.value)
        .join("");

    setPattern1(pattern1);
    setPattern2(pattern2);

    const matches1 = findMatches(pattern1, dictionary);
    const matches2 = findMatches(pattern2, dictionary);


    if (pattern1 && pattern2) {
        // Directly use the combined results function
        setCombinedResults(combineDoublePatterns(matches1, matches2, pattern1, pattern2));
    }
    console.log(combinedResults , "comb");
    
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
            ref={(el) => (inputRefsOne.current[i] = el)}
            onKeyDown={(e) => handleInputChange(e, i, "one")}
      onChange={(e) => {
        if (e.target.value.length === 1 && i < inputRefsOne.current.length - 1) {
          inputRefsOne.current[i + 1].focus();
        }
      }}
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
            onKeyDown={(e) => handleInputChange(e, i, "two")}
            onChange={(e) => {
              if (e.target.value.length === 1 && i < inputRefsTwo.current.length - 1) {
                inputRefsTwo.current[i + 1].focus();
              }
            }}
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