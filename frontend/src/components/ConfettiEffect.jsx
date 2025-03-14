import React, { useEffect } from "react";

const ConfettiEffect = () => {
  useEffect(() => {
    const confettiCount = 30; // Number of confetti elements
    const confettiContainer = document.createElement("div");
    confettiContainer.className = "confetti-container";
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div");
      confetti.innerText = "🎉";
      confetti.className = "confetti";
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
      confettiContainer.appendChild(confetti);

      setTimeout(() => confetti.remove(), 5000); // Remove after animation
    }

    return () => {
      confettiContainer.innerHTML = "";
    };
  }, []);

  return null;
};

export default ConfettiEffect;
