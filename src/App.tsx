import ImageAnalyzer from './components/ImageAnalyzer.tsx'

const App = () => (
  <div className="text-base font-mono grid grid-flow-row min-h-screen bg-amber-200">
    <header className="text-center pl-0 mt-3 sm:text-left sm:pl-4">
      <a
        href="https://github.com/tjmaynes/image-analyzer-app"
        className="text-2xl font-bold text-blue-600 dark:text-blue-500"
      >
        Image Analyzer
      </a>
    </header>
    <main className="flex flex-col justify-center p-6">
      <ImageAnalyzer initialImage="/images/sample.jpg" />
    </main>
    <footer className="pl-0 mb-4 sm:pl-4">
      <p className="text-sm text-center">
        Built for fun & learning by{' '}
        <a
          href="https://tjmaynes.com/"
          className="text-blue-600 dark:text-blue-500"
        >
          TJ Maynes
        </a>
      </p>
    </footer>
  </div>
)

export default App
