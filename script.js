
"use strict";

// NAVUMSH — The Science of Inheritance
// Interactive Genetics Learning Lab

// ------------------------------------
// 1. MONOHYBRID CROSS SIMULATOR
// ------------------------------------

const parent1 = document.getElementById("parent1");
const parent2 = document.getElementById("parent2");
const dominance = document.getElementById("dominance");
const calculateButton = document.getElementById("calculate");
const punnettResult = document.getElementById("punnett-result");

function getGametes(genotype) {
  return genotype.split("");
}

function makeGenotype(a, b) {
  if (a.toUpperCase() === b.toUpperCase()) {
    return a === a.toUpperCase() ? a + b : b + a;
  }
  return a.toUpperCase() + b.toLowerCase();
}

function calculateMonohybrid() {
  const first = getGametes(parent1.value);
  const second = getGametes(parent2.value);

  const outcomes = [];

  second.forEach(a => {
    first.forEach(b => {
      outcomes.push(makeGenotype(a, b));
    });
  });

  const counts = {};
  outcomes.forEach(genotype => {
    counts[genotype] = (counts[genotype] || 0) + 1;
  });

  const model = dominance.value;

  let result = `
    <h3>Predicted Punnett square</h3>
    <div class="punnett-grid">
      <div class="header-cell"></div>
      <div class="header-cell">${first[0]}</div>
      <div class="header-cell">${first[1]}</div>
  `;

  second.forEach((allele, row) => {
    result += `<div class="header-cell">${allele}</div>`;
    result += `<div>${outcomes[row * 2]}</div>`;
    result += `<div>${outcomes[row * 2 + 1]}</div>`;
  });

  result += "</div><h3>Genotype probabilities</h3>";

  Object.keys(counts).sort().forEach(genotype => {
    const percentage = counts[genotype] / 4 * 100;
    result += `<p><strong>${genotype}:</strong> ${percentage}%</p>`;
  });

  const phenotypeGroups = {};

  outcomes.forEach(genotype => {
    let phenotype;

    if (model === "complete") {
      phenotype = genotype.includes("B") ? "Dominant phenotype" : "Recessive phenotype";
    } else if (model === "incomplete") {
      phenotype = genotype === "BB" ? "First-parent phenotype" :
        genotype === "bb" ? "Second-parent phenotype" :
        "Intermediate phenotype";
    } else {
      phenotype = genotype === "BB" ? "First allele expression" :
        genotype === "bb" ? "Second allele expression" :
        "Both alleles expressed";
    }

    phenotypeGroups[phenotype] = (phenotypeGroups[phenotype] || 0) + 1;
  });

  result += "<h3>Phenotype probabilities</h3>";

  Object.entries(phenotypeGroups).forEach(([name, count]) => {
    result += `<p><strong>${name}:</strong> ${count / 4 * 100}%</p>`;
  });

  result += `
    <div class="result-text">
      These are expected probabilities for each offspring under
      this simplified genetic model. Actual family outcomes can vary.
    </div>
  `;

  punnettResult.innerHTML = result;
}

if (calculateButton) {
  calculateButton.addEventListener("click", calculateMonohybrid);
  calculateMonohybrid();
}

// ------------------------------------
// 2. DIHYBRID CROSS SIMULATOR
// ------------------------------------

function getDihybridGametes(genotype) {
  const first = [genotype[0], genotype[1]];
  const second = [genotype[2], genotype[3]];
  const gametes = [];

  first.forEach(a => {
    second.forEach(b => {
      const pair = a + b;
      if (!gametes.includes(pair)) gametes.push(pair);
    });
  });

  return gametes;
}

function combineAlleles(a, b) {
    if (a.toUpperCase() !== b.toUpperCase()) {
        if (a === a.toUpperCase()) {
            return a + b;
        } else {
            return b + a;
        }
    }

    return a + b;
}

const dcalculate = document.getElementById("dcalculate");

function calculateDihybrid() {
  const p1 = document.getElementById("dparent1").value;
  const p2 = document.getElementById("dparent2").value;

  const g1 = getDihybridGametes(p1);
  const g2 = getDihybridGametes(p2);

  const outcomes = [];

  g2.forEach(a => {
    g1.forEach(b => {
      outcomes.push(crossDihybridGametes(a, b));
    });
  });

  const counts = {};
  outcomes.forEach(genotype => {
    counts[genotype] = (counts[genotype] || 0) + 1;
  });

  const phenotypeCounts = {};

  outcomes.forEach(genotype => {
    const phenotype =
      (genotype[0] === genotype[0].toUpperCase() ? "A" : "a") +
      (genotype[2] === genotype[2].toUpperCase() ? "B" : "b");

    phenotypeCounts[phenotype] = (phenotypeCounts[phenotype] || 0) + 1;
  });

  let html = "<h3>Possible offspring genotypes</h3>";

  html += '<div class="punnett-grid">';

  html += '<div class="header-cell"></div>';
  g1.forEach(g => html += `<div class="header-cell">${g}</div>`);

  g2.forEach(a => {
    html += `<div class="header-cell">${a}</div>`;
    g1.forEach(b => {
      html += `<div>${crossDihybridGametes(a, b)}</div>`;
    });
  });

  html += "</div><h3>Genotype probabilities</h3>";

  Object.keys(counts).sort().forEach(genotype => {
    html += `<p><strong>${genotype}:</strong> ${counts[genotype] / outcomes.length * 100}%</p>`;
  });

  html += "<h3>Phenotype probabilities</h3>";

  Object.entries(phenotypeCounts).forEach(([phenotype, count]) => {
    html += `<p><strong>${phenotype}:</strong> ${count / outcomes.length * 100}%</p>`;
  });

  html += `
    <div class="result-text">
      This model assumes independent assortment and complete dominance
      at both genes. Linked genes may produce different probabilities.
    </div>
  `;

  document.getElementById("dihybrid-result").innerHTML = html;
}

if (dcalculate) {
  dcalculate.addEventListener("click", calculateDihybrid);
  calculateDihybrid();
}

// ------------------------------------
// 3. INHERITANCE PATTERN EXPLORER
// ------------------------------------

const patternDescriptions = {
  complete: `
    <h3>Complete dominance</h3>
    In a heterozygote, one allele determines the phenotype under
    the model. The other allele is not visibly expressed in that
    particular trait. Dominance does not mean better or more common.
  `,

  incomplete: `
    <h3>Incomplete dominance</h3>
    A heterozygote has an intermediate phenotype between the two
    homozygotes. For example, certain flower varieties show
    intermediate flower colours.
  `,

  codominance: `
    <h3>Codominance</h3>
    Both alleles are expressed in the heterozygote. The human
    ABO blood group AB phenotype is a familiar example.
  `,

  xlinked: `
    <h3>X-linked recessive inheritance</h3>
    A recessive variant on the X chromosome can cause a condition.
    Fathers pass their X chromosome to daughters, not sons.
    Mothers can pass an X-linked allele to children of either sex.
  `,

  mitochondrial: `
    <h3>Mitochondrial inheritance</h3>
    Mitochondrial DNA is usually inherited from the mother.
    Heteroplasmy and differences in tissue distribution can
    influence how mitochondrial conditions appear.
  `,

  polygenic: `
    <h3>Polygenic inheritance</h3>
    Multiple genes contribute to a characteristic. Environmental
    factors may also influence its expression. Many human traits
    are complex rather than controlled by one dominant allele.
  `
};

const patternSelect = document.getElementById("pattern");
const patternResult = document.getElementById("pattern-result");

function showPattern() {
  patternResult.innerHTML = patternDescriptions[patternSelect.value];
}

if (patternSelect) {
  patternSelect.addEventListener("change", showPattern);
  showPattern();
}

// ------------------------------------
// 4. MEIOSIS STAGE EXPLORER
// ------------------------------------

const meiosisStages = {
  prophase: `
    <h3>Prophase I</h3>
    Homologous chromosomes pair up. Crossing over can exchange
    DNA segments between non-sister chromatids, generating
    genetic variation.
  `,

  metaphase: `
    <h3>Metaphase I</h3>
    Homologous chromosome pairs align at the cell equator.
    Their orientation contributes to independent assortment
    of unlinked genes.
  `,

  anaphase: `
    <h3>Anaphase I</h3>
    Homologous chromosomes move toward opposite poles.
    Sister chromatids generally remain together.
  `,

  telophase: `
    <h3>Telophase I</h3>
    The cell divides to form two haploid cells, with chromosomes
    still consisting of two sister chromatids.
  `,

  meiosis2: `
    <h3>Meiosis II</h3>
    Sister chromatids separate. In the usual process, the result
    is four haploid cells, each with one set of chromosomes.
  `
};

const meiosisSelect = document.getElementById("meiosis-stage");
const meiosisResult = document.getElementById("meiosis-result");

function showMeiosis() {
  meiosisResult.innerHTML = meiosisStages[meiosisSelect.value];
}

if (meiosisSelect) {
  meiosisSelect.addEventListener("change", showMeiosis);
  showMeiosis();
}

// ------------------------------------
// 5. GENETICS QUIZ
// ------------------------------------

const questions = [
  {
    question: "What is an allele?",
    options: [
      "A version of a gene",
      "A type of cell",
      "A complete chromosome",
      "A protein"
    ],
    answer: 0,
    explanation: "An allele is an alternative version of a gene."
  },
  {
    question: "What is the genotype of a heterozygous individual?",
    options: ["BB", "bb", "Bb", "None of these"],
    answer: 2,
    explanation: "A heterozygote has two different alleles."
  },
  {
    question: "Which process can exchange DNA between homologous chromosomes?",
    options: ["Translation", "Crossing over", "Transcription", "Mutation only"],
    answer: 1,
    explanation: "Crossing over occurs during prophase I of meiosis."
  },
  {
    question: "What is the expected phenotype ratio for Bb × Bb under complete dominance?",
    options: ["1:1", "2:1", "3:1", "1:2:1"],
    answer: 2,
    explanation: "Three out of four expected outcomes show the dominant phenotype."
  },
  {
    question: "Which blood group demonstrates codominance?",
    options: ["O", "A", "B", "AB"],
    answer: 3,
    explanation: "The A and B alleles are both expressed in blood group AB."
  },
  {
    question: "How many haploid cells usually result from meiosis?",
    options: ["One", "Two", "Three", "Four"],
    answer: 3,
    explanation: "Meiosis usually produces four haploid cells."
  }
];

let questionIndex = 0;
let score = 0;
let answered = false;

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const feedbackElement = document.getElementById("feedback");
const scoreElement = document.getElementById("score");
const nextButton = document.getElementById("next-question");

function showQuestion() {
  const current = questions[questionIndex];

  questionElement.textContent =
    `Question ${questionIndex + 1} of ${questions.length}: ${current.question}`;

  optionsElement.innerHTML = "";
  feedbackElement.textContent = "";
  answered = false;

  current.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "quiz-option";
    button.textContent = option;

    button.addEventListener("click", () => {
      if (answered) return;

      answered = true;

      if (index === current.answer) {
        score++;
        feedbackElement.textContent = "Correct! " + current.explanation;
      } else {
        feedbackElement.textContent =
          "Not quite. Correct answer: " +
          current.options[current.answer] +
          ". " + current.explanation;
      }

      scoreElement.textContent =
        `Your score: ${score} / ${questions.length}`;

      Array.from(optionsElement.children).forEach((button, i) => {
        button.disabled = true;
        if (i === current.answer) {
          button.style.borderColor = "#287b4d";
        }
      });
    });

    optionsElement.appendChild(button);
  });

  scoreElement.textContent = `Your score: ${score} / ${questions.length}`;
}

if (nextButton) {
  nextButton.addEventListener("click", () => {
    questionIndex++;

    if (questionIndex >= questions.length) {
      questionElement.textContent = "Quiz completed!";
      optionsElement.innerHTML = "";
      feedbackElement.textContent =
        `You scored ${score} out of ${questions.length}.`;
      nextButton.textContent = "Restart quiz";
      questionIndex = -1;
      return;
    }

    if (questionIndex === 0) {
      score = 0;
      nextButton.textContent = "Next question";
    }

    showQuestion();
  });

  showQuestion();
}
