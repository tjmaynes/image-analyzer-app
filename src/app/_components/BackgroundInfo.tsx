const BackgroundInfo = () => (
  <p className="background-info">
    A proof-of-concept web application that analyzes your images using{' '}
    <strong>
      <a href="https://ai.googleblog.com/2017/06/mobilenets-open-source-models-for.html">
        MobileNet
      </a>
    </strong>{' '}
    (via TensorflowJS),{' '}
    <strong>
      <a href="https://chat.openai.com/chat">ChatGPT</a>
    </strong>{' '}
    (for generating image descriptions), and{' '}
    <strong>
      <a href="https://developers.cloudflare.com/kv/learning/how-kv-works/">
        Cloudflare KV
      </a>
    </strong>{' '}
    (read-only database pairing &quot;image name&quot; to &quot;image
    description&quot;). I built this web application to learn how to run maching
    learning models in web browsers. Please contact me on{' '}
    <a href="https://linkedin.com/in/tjmaynes">LinkedIn</a> for any feedback or
    concerns. Enjoy! 😀
  </p>
)

export default BackgroundInfo
