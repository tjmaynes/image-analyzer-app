const Welcome = () => (
  <div>
    <h2>Background</h2>
    <p>
      <strong>Image Analyzer</strong> is a proof-of-concept web application that
      analyzes your images using{' '}
      <strong>
        <a href="https://ai.googleblog.com/2017/06/mobilenets-open-source-models-for.html">
          MobileNet
        </a>
      </strong>{' '}
      and{' '}
      <strong>
        <a href="https://chat.openai.com/chat">ChatGPT</a>
      </strong>
      . <strong>Warning</strong>: Proof-of-concept tool is not super accurate,
      your results may vary.
    </p>
    <blockquote>
      <strong>Technical Notes: </strong>MobileNet classifies your images in the
      browser using Tensorflow.js. ChatGPT describes your images using a
      GraphQL-based API running on a Cloudflare Worker.
      <footer>
        <cite>
          Ping me at <a href="https://twitter.com/tjmaynes">@tjmaynes</a> for
          any feedback. Enjoy!
        </cite>
      </footer>
    </blockquote>
  </div>
)

export default Welcome
