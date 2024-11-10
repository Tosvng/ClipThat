import React from "react";

const Instructions = () => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold underline">How it works:</h2>
      <ul>
        <li>Step 1: Select the video you want to clip</li>
        <li>Step 2: Enter your keyword</li>
        <li>Step 3: Click the Generate button</li>
        <li>
          Step 4: Edited video clips will be in the Clip-That folder in your
          Documents folder
        </li>
      </ul>
      <div className="mt-4">
        <h2 className="text-md font-semibold underline">
          Choose your keyword wisely
        </h2>
        <ol>
          <li>
            You should select your keyword before you start recording your
            session.
          </li>
          <li>
            Whenever the keyword is said, the application clips the last 30
            seconds before the keyword was said.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default Instructions;
