import React from 'react'
import { Link } from 'react-router-dom'

const Privacy = () => {
  return (
    <div className='mainBody'>
         <div className="container">
      <header className='headerPrivacy'>
        <h1>Our Use of Cookies</h1>
      </header>

      <section className="content">
        <p>
          A cookie is a file containing an identifier (a string of letters and numbers) that is sent by a web server
          to a web browser and is stored by the browser. The identifier is then sent back to the server each time
          the browser requests a page from the server. Cookies may be either "persistent" cookies or "session"
          cookies: a persistent cookie will be stored by a web browser and will remain valid until its set expiry
          date, unless deleted by the user before the expiry date; a session cookie, on the other hand, will expire
          at the end of the user session, when the web browser is closed. Cookies do not typically contain any
          information that personally identifies a user, but personal information that we store about you may be
          linked to the information stored in and obtained from cookies.
        </p>

        <p>
          We use Google Analytics to analyze the use of our website. Google Analytics gathers information about
          website use by means of cookies. The information gathered relating to our website is used to create
          reports about the use of our website. Google's privacy policy is available at:{" "}
          <a
            href="https://www.google.com/policies/privacy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.google.com/policies/privacy/
          </a>
        </p>

        <p>
          Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary
          from browser to browser, and from version to version. You can however obtain up-to-date information about
          blocking and deleting cookies via these links:
        </p>

        <ul className='privacyUl'>
          <li>
            <a
              href="https://support.google.com/chrome/answer/95647?hl=en"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chrome
            </a>
          </li>
          <li>
            <a
              href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences"
              target="_blank"
              rel="noopener noreferrer"
            >
              Firefox
            </a>
          </li>
          <li>
            <a
              href="http://www.opera.com/help/tutorials/security/cookies/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Opera
            </a>
          </li>
          <li>
            <a
              href="https://support.microsoft.com/en-gb/help/17442/windows-internet-explorer-delete-manage-cookies"
              target="_blank"
              rel="noopener noreferrer"
            >
              Internet Explorer
            </a>
          </li>
          <li>
            <a
              href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac"
              target="_blank"
              rel="noopener noreferrer"
            >
              Safari
            </a>
          </li>
          <li>
            <a
              href="https://privacy.microsoft.com/en-us/windows-10-microsoft-edge-and-privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Edge
            </a>
          </li>
        </ul>

        <p>
          Please note that blocking cookies may have a negative impact on the functions of many websites, including
          our Site. Some features of the Site may cease to be available to you.
        </p>

        <h2>Advertising</h2>
        <p>
          This Site is affiliated with CMI Marketing, Inc., d/b/a Raptive (“Raptive”) for the purposes of placing
          advertising on the Site, and Raptive will collect and use certain data for advertising purposes. To learn
          more about Raptive’s data usage, click here:{" "}
          <a
            href="https://raptive.com/creator-advertising-privacy-statement/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://raptive.com/creator-advertising-privacy-statement/
          </a>
        </p>
      </section>

      <footer className='footerPrivacy'>
        <Link to="/" className="btn-go-home">
          Go Back Home
        </Link>
      </footer>
    </div>
    </div>
  )
}

export default Privacy