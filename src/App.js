import { useState } from "react";

const App = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState(""); //{This is currently set to string meaning its empty, thereby activating the 'Ask Me' button. When a value is added, the button changes to 'Clear button'}
  const [chatHistory, setChatHistory] = useState([]);

  const surpriseOptions = [
    "Who won the latest Nobel Prize?",
    "Where does Pizza come from?",
    "How do you make a BLT sandwich?",
  ];

  const surprise = () => {
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  // This gets response fom API
  // const getResponse = async () => {
  //   if (!value) {
  //     setError("Error! Please ask a question");
  //     return;
  //   }
  //   try {
  //     const options = {
  //       method: "POST",
  //       body: JSON.stringify({
  //         history: chatHistory,
  //         message: value,
  //       }),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     };
  //     const response = await fetch("http://localhost:8000/gemini", options);
  //     const data = await response.text();
  //     console.log(data);
  //     setChatHistory((oldChatHistory) => [
  //       ...oldChatHistory,
  //       {
  //         role: "user",
  //         parts: [value],
  //       },
  //       {
  //         role: "model",
  //         parts: [data],
  //       },
  //     ]);
  //     setValue("");
  //   } catch (error) {
  //     console.error(error);
  //     setError("Something went wrong! Please try again later");
  //   }
  // }

  // The code starts from here
  const getResponse = async () => {
    if (!value) {
      setError("Error! Please ask a question");
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory.map(item => ({
            role: item.role,
            parts: item.parts.map(part => ({ text: part.text })), // Ensure parts is formatted correctly
            // parts: Array.isArray(item.parts) ? item.parts : [item.parts],
          })),
          message: value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
  
      const response = await fetch("http://localhost:8000/gemini", options);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.text();
      console.log(data);
  
      setChatHistory(oldChatHistory => [
        ...oldChatHistory,
        {
          role: "user",
          parts: [{ text: value }], // Ensure parts is an array of objects with a `text` property
        },
        {
          role: "model",
          parts: [{ text: data }], // Ensure parts is an array of objects with a `text` property
        },
      ]);
      setValue("");
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setError("Something went wrong! Please try again later");
    }
  };
//And ends here
  const clear = () => {
    setValue("")
    setError("")
    setChatHistory([])
  }

  return (
    <div className="app">
      <p>
        What do you want to know?
        <button className="surprise" onClick={surprise} disabled={chatHistory}>
          Surprise Me!
        </button>
      </p>

      <div className="input-container">
        <input
          value={value}
          placeholder="Hi, my name is KUGA-BOT...?"
          onChange={(e) => setValue(e.target.value)}
        />
        {!error && <button onClick={getResponse}>Ask Me</button>}{" "}
        {/* When there is no error, it shows this */}
        {error && <button onClick={clear}>Clear</button>}{" "}
        {/* When there is an error, it shows this */}
      </div>

      {error && <p>{error}</p>}
      <div className="search-result">

        {/* {chatHistory.map((chatItem, _index) => ( */}
          {/* <div key={_index}> */}
            {/* <p className="answer"> */}
              {/* {chatItem.role} : {chatItem.parts} */}
            {/* </p> */}
          {/* </div> */}

        {/* New Code Here */}
        {chatHistory.map((chatItem, index) => (
          <div key={index}>
            <strong>{chatItem.role}:</strong>
            {chatItem.parts.map((part, partIndex) => (
              <div key={partIndex}>{part.text}</div> // Ensure rendering only text
            ))}
          </div>

        ))}
      </div>
    </div>

    //New code here
    

  );
};

export default App;
