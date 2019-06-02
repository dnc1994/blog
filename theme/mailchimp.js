export default function Mailchimp () {
  return <>
    <link href="//cdn-images.mailchimp.com/embedcode/classic-10_7.css" rel="stylesheet" type="text/css"/>
    <style>{`
      #mc_embed_signup {
        background:#fff;
        clear:left;
        font:14px Helvetica,Arial,sans-serif;
      }
      #mc_embed_signup form {
        padding-left: 0;
        display: flow-root;
        margin-bottom: 50px;
      }
      #mc_embed_signup div#mce-responses {
        margin: 0;
        padding: 0;
      }
      #mc_embed_signup div#mce-responses, #mc_embed_signup .mc-field-group {
        width: 100%;
      }
    `}</style>
    <div id="mc_embed_signup">
      <form action="https://gmail.us20.list-manage.com/subscribe/post?u=deb5fccf82c431d4bf8465c52&amp;id=839c6f3f76" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
        <div id="mc_embed_signup_scroll">
          <h2>Subscribe</h2>
          <div class="mc-field-group">
            <label for="mce-FNAME">Your First Name </label>
            <input type="text" value="" name="FNAME" class="required" id="mce-FNAME"/>
          </div>
          <div class="mc-field-group">
            <label for="mce-EMAIL">Your Email Address </label>
            <input type="email" value="" name="EMAIL" class="required email" id="mce-EMAIL"/>
          </div>
          <div id="mce-responses" class="clear">
            <div class="response" id="mce-error-response" style={{display:'none'}}></div>
            <div class="response" id="mce-success-response" style={{display:'none'}}></div>
            <div style={{
              position: 'absolute',
              left: -5000
            }} aria-hidden="true"><input type="text" name="b_deb5fccf82c431d4bf8465c52_839c6f3f76" tabindex="-1" value=""/></div>
            <div class="clear">
              <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button"/>
            </div>
          </div>
        </div>
      </form>
    </div>
    <script type='text/javascript' src='//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js'></script>
    <script type='text/javascript' dangerouslySetInnerHTML={{
      __html: `
      (function($) {window.fnames = new Array(); window.ftypes = new Array();fnames[1]='FNAME';ftypes[1]='text';fnames[0]='EMAIL';ftypes[0]='email';fnames[2]='LNAME';ftypes[2]='text';fnames[3]='ADDRESS';ftypes[3]='address';fnames[4]='PHONE';ftypes[4]='phone';}(jQuery));var $mcj = jQuery.noConflict(true);
      `
    }}></script>
  </>
}
