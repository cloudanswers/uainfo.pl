/* eslint-disable @next/next/no-html-link-for-pages */
import Head from "next/head";
const Article = (props) => (
  <article className="blog-post">
    <h2 className="blog-post-title">Sample blog post</h2>
    <p className="blog-post-meta">
      {new Date(props.date * 1000).toDateString()} by{" "}
      <a href="#">
        {props.from.first_name} {props.from.last_name}
      </a>
    </p>
    <p style={{ whiteSpace: "pre-wrap" }}>{props.text}</p>
    {/* <pre>{JSON.stringify(props, undefined, 2)}</pre> */}
  </article>
);

const Header = () => (
  <header className="blog-header py-3">
    <div className="row flex-nowrap justify-content-between align-items-center">
      <div className="col-4 pt-1">
        {/* <a
          className="link-secondary"
          href="http://t.me/uainfopl_bot"
          target="_blank"
          rel="noreferrer"
        >
          Telegram Bot @uainfopl_bot
        </a> */}
      </div>
      <div className="col-4 text-center">
        <a className="blog-header-logo text-dark" href="/">
          uainfo.pl
        </a>
      </div>
      <div className="col-4 d-flex justify-content-end align-items-center">
        {/* <a className="link-secondary" href="#" aria-label="Search">
          search
        </a> */}
        <a
          className="btn btn-sm btn-outline-secondary"
          href="http://t.me/uainfopl_bot"
        >
          Telegram Bot @uainfopl_bot
        </a>
      </div>
    </div>
  </header>
);

export default function Home({ messages }) {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        <Header />
        <div className="nav-scroller py-1 mb-2">
          <nav className="nav d-flex justify-content-between">
            <a className="p-2 link-secondary" href="#">
              World
            </a>
            <a className="p-2 link-secondary" href="#">
              U.S.
            </a>
            <a className="p-2 link-secondary" href="#">
              Technology
            </a>
            <a className="p-2 link-secondary" href="#">
              Design
            </a>
            <a className="p-2 link-secondary" href="#">
              Culture
            </a>
            <a className="p-2 link-secondary" href="#">
              Business
            </a>
            <a className="p-2 link-secondary" href="#">
              Politics
            </a>
            <a className="p-2 link-secondary" href="#">
              Opinion
            </a>
            <a className="p-2 link-secondary" href="#">
              Science
            </a>
            <a className="p-2 link-secondary" href="#">
              Health
            </a>
            <a className="p-2 link-secondary" href="#">
              Style
            </a>
            <a className="p-2 link-secondary" href="#">
              Travel
            </a>
          </nav>
        </div>
      </div>

      <main className="container">
        <div className="p-4 p-md-5 mb-4 text-white rounded bg-dark">
          <div className="col-md-6 px-0">
            <h1 className="display-4 fst-italic">
              Title of a longer featured blog post
            </h1>
            <p className="lead my-3">
              Multiple lines of text that form the lede, informing new readers
              quickly and efficiently about what???s most interesting in this
              post???s contents.
            </p>
            <p className="lead mb-0">
              <a href="#" className="text-white fw-bold">
                Continue reading...
              </a>
            </p>
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-md-6">
            <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
              <div className="col p-4 d-flex flex-column position-static">
                <strong className="d-inline-block mb-2 text-primary">
                  World
                </strong>
                <h3 className="mb-0">Featured post</h3>
                <div className="mb-1 text-muted">Nov 12</div>
                <p className="card-text mb-auto">
                  This is a wider card with supporting text below as a natural
                  lead-in to additional content.
                </p>
                <a href="#" className="stretched-link">
                  Continue reading
                </a>
              </div>
              <div className="col-auto d-none d-lg-block">
                <svg
                  className="bd-placeholder-img"
                  width="200"
                  height="250"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Placeholder: Thumbnail"
                  preserveAspectRatio="xMidYMid slice"
                  focusable="false"
                >
                  <title>Placeholder</title>
                  <rect width="100%" height="100%" fill="#55595c" />
                  <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                    Thumbnail
                  </text>
                </svg>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
              <div className="col p-4 d-flex flex-column position-static">
                <strong className="d-inline-block mb-2 text-success">
                  Design
                </strong>
                <h3 className="mb-0">Post title</h3>
                <div className="mb-1 text-muted">Nov 11</div>
                <p className="mb-auto">
                  This is a wider card with supporting text below as a natural
                  lead-in to additional content.
                </p>
                <a href="#" className="stretched-link">
                  Continue reading
                </a>
              </div>
              <div className="col-auto d-none d-lg-block">
                <svg
                  className="bd-placeholder-img"
                  width="200"
                  height="250"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Placeholder: Thumbnail"
                  preserveAspectRatio="xMidYMid slice"
                  focusable="false"
                >
                  <title>Placeholder</title>
                  <rect width="100%" height="100%" fill="#55595c" />
                  <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                    Thumbnail
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-5">
          <div className="col-md-8">
            <h3 className="pb-4 mb-4 fst-italic border-bottom">
              From the Firehose
            </h3>

            {messages
              .filter((m) => m._mod_status != "reject")
              .filter((m) => m.update.message.text?.length > 5)
              .map((m) => (
                <Article key={m.update_id} {...m.update.message} />
              ))}

            <nav className="blog-pagination" aria-label="Pagination">
              <a className="btn btn-outline-primary" href="#">
                Older
              </a>
              <a className="btn btn-outline-secondary disabled">Newer</a>
            </nav>
          </div>

          <div className="col-md-4">
            <div className="position-sticky" style={{ top: "2rem" }}>
              <div className="p-4 mb-3 bg-light rounded">
                <h4 className="fst-italic">About</h4>
                <p className="mb-0">
                  Customize this section to tell your visitors a little bit
                  about your publication, writers, content, or something else
                  entirely. Totally up to you.
                </p>
              </div>

              <div className="p-4">
                <h4 className="fst-italic">Archives</h4>
                <ol className="list-unstyled mb-0">
                  <li>
                    <a href="#">March 2021</a>
                  </li>
                  <li>
                    <a href="#">February 2021</a>
                  </li>
                  <li>
                    <a href="#">January 2021</a>
                  </li>
                  <li>
                    <a href="#">December 2020</a>
                  </li>
                  <li>
                    <a href="#">November 2020</a>
                  </li>
                  <li>
                    <a href="#">October 2020</a>
                  </li>
                  <li>
                    <a href="#">September 2020</a>
                  </li>
                  <li>
                    <a href="#">August 2020</a>
                  </li>
                  <li>
                    <a href="#">July 2020</a>
                  </li>
                  <li>
                    <a href="#">June 2020</a>
                  </li>
                  <li>
                    <a href="#">May 2020</a>
                  </li>
                  <li>
                    <a href="#">April 2020</a>
                  </li>
                </ol>
              </div>

              <div className="p-4">
                <h4 className="fst-italic">Elsewhere</h4>
                <ol className="list-unstyled">
                  <li>
                    <a href="#">GitHub</a>
                  </li>
                  <li>
                    <a href="#">Twitter</a>
                  </li>
                  <li>
                    <a href="#">Facebook</a>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="blog-footer">
        <p>
          Blog template built for{" "}
          <a href="https://getbootstrap.com/">Bootstrap</a> by{" "}
          <a href="https://twitter.com/mdo">@mdo</a>.
        </p>
        <p>
          <a href="#">Back to top</a>
        </p>
      </footer>
    </div>
  );
}

export async function getServerSideProps(context) {
  const storage = require("../storage");
  const messageKeys = [];
  for await (const message of storage.list("messages", "")) {
    messageKeys.push(message);
  }
  console.log({ messageKeys });
  const messages = await Promise.all(
    messageKeys.reverse().map((mk) =>
      storage
        .get(mk)
        .then(JSON.parse)
        // ignore invalid json for now
        .catch((e) => "")
    )
  );
  return {
    props: {
      messages,
    }, // will be passed to the page component as props
  };
}
