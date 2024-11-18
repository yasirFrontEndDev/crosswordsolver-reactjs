import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Single = () => {
  const [dictionary, setDictionary] = useState([]);
  const [inputPattern, setInputPattern] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedDictionary, setSelectedDictionary] = useState("big");
  const inputRefs = useRef([]);

  // Handle input change and shift focus to the next or previous input field
  const handleInputChange = (e, index) => {
    if (e.key === "Backspace" && index > 0) {
      const previousInput = inputRefs.current[index - 1];
      previousInput.focus();
      previousInput.value = ""; // Clear the previous input value
    } else if (e.target.value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Load dictionary data
  useEffect(() => {
    const loadDictionary = async () => {
      try {
        // const response = await fetch(`assets/dictionaries/${selectedDictionary}.txt`);
        //for gh-pages
        const response =await fetch(`/crosswordsolver-reactjs/assets/dictionaries/${selectedDictionary}.txt`);
        const text = await response.text();
        setDictionary(text.split("\n").map((line) => line.trim().toLowerCase()));
      } catch (error) {
        console.error("Error loading dictionary:", error.message);
        setMessage("Failed to load the dictionary. Please try again.");
      }
    };
    loadDictionary();
  }, [selectedDictionary]);

  // Find matches based on the pattern
  const findMatches = (pattern, dictionary) => {
    try {
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
    } catch (error) {
      console.error("Regex Error:", error.message);
      return [];
    }
  };

  // Get closest matches alphabetically
  const getClosestMatches = (dictionary, limit = 15) => {
    return dictionary.slice(0, limit);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const pattern = Array.from(e.target.elements)
      .filter((el) => el.type === "text" && el.value)
      .map((el) => el.value)
      .join("");

    setInputPattern(pattern);

    if (!pattern) {
      setMessage("Please enter a valid pattern.");
      setResults([]);
      return;
    }

    if (/^\d+$/.test(pattern)) {
      // If the input is numbers only, fetch closest matches
      const closestMatches = getClosestMatches(dictionary, 15);
      setResults(closestMatches);
      setMessage(`No exact matches found for "${pattern}". Showing closest matches:`);
      return;
    }

    const matches = findMatches(pattern, dictionary);

    if (matches.length === 0) {
      const closestMatches = getClosestMatches(dictionary, 15);
      setResults(closestMatches);
      setMessage(`No exact matches found for "${pattern}". Showing closest matches:`);
    } else {
      setResults(matches);
      setMessage(`Found ${matches.length} exact matches for "${pattern}".`);
    }
  };

  // Handle dictionary selection
  const handleDictionaryChange = (e) => {
    setSelectedDictionary(e.target.value);
  };

  return (
    <div>
      <div className="headerMain">
        <Link to="/">
          <img src="assets/codeword_solver.jpg" alt="Best Codeword Solver" />
          <h2 className="header-h2">Codeword Solver</h2>
        </Link>
      </div>

      <div className="wrapperMain">
        <main>
          <div className="gamelinks">
            <Link to="/">Single</Link> | <Link to="/multi">Multiple</Link>
            <br />
            <br />
          </div>

          <b>Instructions:</b> Enter the letters that you already have, with{" "}
          <code>.</code> or <code>?</code> for unique unknown letters, and
          numbers for <i>repeated</i> unknown letters.
          <br />
          <b>Examples:</b> <code>11.E</code> would match `ooze` and{" "}
          <code>112.2</code> would match `llama`.
          <form onSubmit={handleSubmit}>
            <div>
              {[...Array(15)].map((_, index) => (
                <input
                  key={index}
                  name={`l${index + 1}`}
                  id={`l${index + 1}`}
                  className="textbox"
                  maxLength="1"
                  type="text"
                  ref={(el) => (inputRefs.current[index] = el)} // Assign ref
                  onChange={(e) => {
                    if (e.target.value.length === 1 && index < inputRefs.current.length - 1) {
                      inputRefs.current[index + 1].focus(); // For regular navigation
                    }
                  }}
                  onKeyDown={(e) => handleInputChange(e, index)} 
                />
              ))}
              <input className="button" style={{ visibility: "hidden" }} />
            </div>
            <hr />
            <div>
              Dictionary{" "}
              <select onChange={handleDictionaryChange} name="dict" id="dict">
                <option value="big">Big (260k words)</option>
                <option value="original">Original (115k words)</option>
                <option value="pocket">Pocket (20k words)</option>
              </select>
              <input type="submit" className="button" value="Submit" />
            </div>
          </form>

          <hr />
          <p>
            Solutions for <b>{inputPattern.toUpperCase()}</b>
          </p>
          <div>
            <h3>{message}</h3>
            <ul>
              {results.map((result, index) => (
                <li key={index}>{result}</li>
              ))}
            </ul>
          </div>
          <hr />
          <b>Longer example:</b>
          <img src="assets/example.png" alt="How to solve codewords" /> is
          entered as <b>..A122.1R</b>
          <span className="smaller">
            <ul>
              <li>
                Letters one, two and seven are unique unknown letters, so we
                enter <b>.</b> in those positions.
              </li>
              <li>
                Third and ninth letters are known so we enter <b>A</b> and{" "}
                <b>R</b> in those positions.
              </li>
              <li>
                Fourth and eighth letters are repeated unknown letters, so we
                enter <b>1</b> in those positions.
              </li>
              <li>
                Letters five and six are a different set of repeated unknown
                letters, so we enter <b>2</b> in those positions.
              </li>
              <li>
                Thus we enter <b>..A122.1R</b> and get the only word that
                matches the pattern: <b>chauffeur.</b>
              </li>
            </ul>
          </span>

          <hr />
        </main>
      </div>

      <footer className="footerMain">
        <Link to="/privacy">Privacy Policy</Link> |{" "}
        <a href="mailto:mythomasgames@gmail.com">Contact</a>
      </footer>
    </div>
  );
};

export default Single;
