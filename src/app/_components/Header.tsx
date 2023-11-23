import Link from 'next/link'

const Header = () => (
  <header>
    <h1>Web Playground</h1>
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
          <Link href="/image-analyzer">Image Analyzer</Link>
          <Link href="/stocks">Stocks</Link>
        </li>
      </ul>
    </nav>
  </header>
)

export default Header
