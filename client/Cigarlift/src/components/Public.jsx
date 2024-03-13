import { Link } from 'react-router-dom'

const Public = () => {
    const content = (
        <section className="public">
            <header>
                <h1>Welcome to <span className="nowrap">Cigarlift!</span></h1>
            </header>
            <main className="public__main">
                <p>Located in Beautiful Foo City, Cigarlift provides a trained staff ready to meet your cigar needs.</p>
                <address className="public__addr">
                    Cigarlift<br />
                    555 Foo Drive<br />
                    Foo City, CA 12345<br />
                    <a href="tel:+15555555555">(555) 555-5555</a>
                </address>
                <br />
            </main>
            <footer>
                <Link to="/login">Employee Login</Link>
            </footer>
        </section>

    )
    return content
}
export default Public