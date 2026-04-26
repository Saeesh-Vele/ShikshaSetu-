const fs = require('fs');
const path = require('path');

const replacements = [
  // Components
  { from: /['"](?:\.\.\/)*app\/components\/CareerAssessmentQuiz['"]/g, to: "'@/features/career/components/CareerAssessmentQuiz'" },
  { from: /['"](?:\.\.\/)*components\/CareerAssessmentQuiz['"]/g, to: "'@/features/career/components/CareerAssessmentQuiz'" },
  { from: /['"](?:\.\.\/)*app\/components\/CareerPredictionCard['"]/g, to: "'@/features/career/components/CareerPredictionCard'" },
  { from: /['"](?:\.\.\/)*components\/CareerPredictionCard['"]/g, to: "'@/features/career/components/CareerPredictionCard'" },
  { from: /['"](?:\.\.\/)*app\/components\/CourseFlowchart['"]/g, to: "'@/features/career/components/CourseFlowchart'" },
  { from: /['"](?:\.\.\/)*components\/CourseFlowchart['"]/g, to: "'@/features/career/components/CourseFlowchart'" },
  
  { from: /['"](?:\.\.\/)*app\/components\/CollegeCard['"]/g, to: "'@/features/colleges/components/CollegeCard'" },
  { from: /['"](?:\.\.\/)*components\/CollegeCard['"]/g, to: "'@/features/colleges/components/CollegeCard'" },
  { from: /['"](?:\.\.\/)*app\/components\/CollegeExplorerMap['"]/g, to: "'@/features/colleges/components/CollegeExplorerMap'" },
  { from: /['"](?:\.\.\/)*components\/CollegeExplorerMap['"]/g, to: "'@/features/colleges/components/CollegeExplorerMap'" },
  { from: /['"](?:\.\.\/)*app\/components\/MapRoute['"]/g, to: "'@/features/colleges/components/MapRoute'" },
  { from: /['"](?:\.\.\/)*components\/MapRoute['"]/g, to: "'@/features/colleges/components/MapRoute'" },
  { from: /['"](?:\.\.\/)*app\/components\/MapView['"]/g, to: "'@/features/colleges/components/MapView'" },
  { from: /['"](?:\.\.\/)*components\/MapView['"]/g, to: "'@/features/colleges/components/MapView'" },
  
  { from: /['"](?:\.\.\/)*app\/components\/CareerChatbot['"]/g, to: "'@/features/ai-assistant/components/CareerChatbot'" },
  { from: /['"](?:\.\.\/)*components\/CareerChatbot['"]/g, to: "'@/features/ai-assistant/components/CareerChatbot'" },
  { from: /['"]\.\/components\/CareerChatbot['"]/g, to: "'@/features/ai-assistant/components/CareerChatbot'" },
  
  { from: /['"](?:\.\.\/)*app\/components\/HomeLocationPanel['"]/g, to: "'@/features/onboarding/components/HomeLocationPanel'" },
  { from: /['"](?:\.\.\/)*components\/HomeLocationPanel['"]/g, to: "'@/features/onboarding/components/HomeLocationPanel'" },
  { from: /['"]\.\/components\/HomeLocationPanel['"]/g, to: "'@/features/onboarding/components/HomeLocationPanel'" },
  { from: /['"](?:\.\.\/)*app\/components\/HomeLocationSelector['"]/g, to: "'@/features/onboarding/components/HomeLocationSelector'" },
  { from: /['"](?:\.\.\/)*components\/HomeLocationSelector['"]/g, to: "'@/features/onboarding/components/HomeLocationSelector'" },
  
  // Providers & Themes
  { from: /['"](?:\.\.\/)*components\/FirebaseAuthProvider['"]/g, to: "'@/components/providers/FirebaseAuthProvider'" },
  { from: /['"]@\/components\/FirebaseAuthProvider['"]/g, to: "'@/components/providers/FirebaseAuthProvider'" },
  { from: /['"](?:\.\.\/)*components\/theme-provider['"]/g, to: "'@/components/providers/theme-provider'" },
  { from: /['"]@\/components\/theme-provider['"]/g, to: "'@/components/providers/theme-provider'" },
  
  // Lib & Firebase
  { from: /['"](?:\.\.\/)*lib\/auth['"]/g, to: "'@/lib/firebase/auth'" },
  { from: /['"]@\/lib\/auth['"]/g, to: "'@/lib/firebase/auth'" },
  { from: /['"](?:\.\.\/)*lib\/firebase['"]/g, to: "'@/lib/firebase/firebase'" },
  { from: /['"]@\/lib\/firebase['"]/g, to: "'@/lib/firebase/firebase'" },
  { from: /['"](?:\.\.\/)*lib\/firestore['"]/g, to: "'@/lib/firebase/firestore'" },
  { from: /['"]@\/lib\/firestore['"]/g, to: "'@/lib/firebase/firestore'" },
  
  // Data
  { from: /['"](?:\.\.\/)*data\/careerQuestions['"]/g, to: "'@/features/career/data/careerQuestions'" },
  { from: /['"]@\/data\/careerQuestions['"]/g, to: "'@/features/career/data/careerQuestions'" },
  
  // Utils
  { from: /['"](?:\.\.\/)*utils\/distanceCalculator['"]/g, to: "'@/features/colleges/utils/distanceCalculator'" }
];

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next')) {
        results = results.concat(walkDir(file));
      }
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walkDir('./');
let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  
  replacements.forEach(r => {
    newContent = newContent.replace(r.from, r.to);
  });
  
  if (newContent !== content) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated imports in: ${file}`);
    changedFiles++;
  }
});

console.log(`\nComplete! Updated ${changedFiles} files.`);
