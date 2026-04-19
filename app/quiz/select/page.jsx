import Link from "next/link";

export default function QuizSelect() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-green-100 transform hover:scale-105 transition-all duration-300">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-green-700 mb-4">Career Quiz Hub</h1>
          <p className="text-gray-600 text-lg">Choose your grade to start exploring your future!</p>
        </div>
        <div className="space-y-5">
          <Link href="/quiz/10th">
            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 text-lg font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg">
              <span>🎓</span>
              <span>10th Grade Quiz</span>
            </button>
          </Link>
          <br/>
          <Link href="/quiz/12th">
            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 text-lg font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg">
              <span>🎓</span>
              <span>12th Grade Quiz</span>
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="w-full bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 transition-all duration-300 text-lg font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg mt-2">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}