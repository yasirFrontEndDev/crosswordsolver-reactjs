import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
const Multi = () => {
    // const matchesTwo = findMatches(patternTwo, dictionary);
    const [selectedDictionary, setSelectedDictionary] = useState("big");
    const [dictionary, setDictionary] = useState([]);
    const [pattern1, setPattern1] = useState("");
    const [pattern2, setPattern2] = useState("");
    const [results1, setResults1] = useState([]);
    const [results2, setResults2] = useState([]);
    const inputRefsOne = useRef([]); // Ref for first set of inputs (pattern1)
  const inputRefsTwo = useRef([]); // Ref for second set of inputs (pattern2)

  // Handle input change and shift focus to next input field
  const handleInputChange = (e, index, set) => {
    if (e.target.value.length === 1) {
      // Move focus to the next input in the same set
      const nextInput = set === "one" ? inputRefsOne : inputRefsTwo;
      if (index < nextInput.current.length - 1) {
        nextInput.current[index + 1].focus();
      }
    }
  };
    // Load dictionary when the component mounts or dictionary changes
    useEffect(() => {
      const loadDictionary = async () => {
        try {
          const response = await fetch(`/assets/dictionaries/${selectedDictionary}.txt`);
          console.log(response);
          const text = await response.text();
          console.log(text);
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
  
      regexPattern = `^${regexPattern}$`;
      const regex = new RegExp(regexPattern, "i");
      return dictionary.filter((word) => regex.test(word));
    };
  
    // Handle form submission
    const handleSubmit = (e) => {
      e.preventDefault();
  
      // Extract patterns from inputs
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
  
      // Find matches for both patterns
      const matches1 = findMatches(pattern1, dictionary);
      const matches2 = findMatches(pattern2, dictionary);
  
      setResults1(matches1);
      setResults2(matches2);
  
      console.log("Pattern 1 matches:", matches1);
      console.log("Pattern 2 matches:", matches2);
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
            onChange={(e) => handleInputChange(e, i, "one")}
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
            onChange={(e) => handleInputChange(e, i, "two")}
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
            Solutions for <b> {pattern1  + ":" + pattern2}</b>
          </p>
          <div>
            <h3>Results:</h3>
            <ul>
    {results1.map((res1, index) => (
      <li key={index}>
        {res1}:{results2[index]}
      </li>
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