<style>
  .hero-body {
    align-items: flex-start;
    width: 100%;
    padding: 0;
  }

  .frame {
    width: 100%;
    height: 80vh;
  }

  textarea {
    min-height: 50vh;
  }

  #chat-window {
    /* background: rgba(25,5,55,0.1); */
    border-radius: 3px;
    height: 50vh;
    width: 100%;
    border: 3px solid rgba(50,10,110,.15);
    margin-bottom: 1rem;
  }
</style>

<svelte:head>
  <title>About</title>
</svelte:head>

<form class="frame" method="post">
  <space class="medium" />
  <!-- <div class="padded content"> -->
  <h1 class="u-text-center u-font-alt">Chat</h1>
  <r-grid columns="8">
    <r-cell span="1-2" class="hero fullscreen">
      <div class="hero-body">
        <!-- <div class="content"> -->

        <div class="frame__body u-no-padding">
          <div class="row u-no-padding level fill-height">
            <div class="col">

              <r-grid columns="8">
                <r-cell span="row" span-s="row">
                  <div class="form-group">
                    <label class="form-group-label">
                      <span class="icon">
                        <i class="fa-wrapper far fa-user" />
                      </span>
                    </label>
                    <input
                      type="text"
                      class="form-group-input"
                      placeholder="Enter your name" />
                  </div>
                  <div class="divider" />
                  <p class="u-text-center">Enter a name and chat away!</p>
                  <div class="divider" />
                </r-cell>

              </r-grid>
            </div>
            <space class="x-large" />
          </div>
        </div>
        <!-- </div> -->

      </div>
      <!-- </div> -->
    </r-cell>
    <r-cell span="3-8" span-s="row">
      <div class="chat-window-group">
        <div id="chat-window">
          <div id="output" />
        </div>
        <input type="text" id="message" placeholder="What's up?" />
        <!-- <div class="form-ext-control form-ext-checkbox">
                      <input id="check1" class="form-ext-input" type="checkbox" />
                      <label class="form-ext-label" for="check1">
                        Send me a copy.
                      </label>
                    </div>
  
                    <space /> -->

      </div>
      <div class="btn-group u-pull-right">
        <button class="btn-info" id="send-message">Send</button>
      </div>
    </r-cell>
  </r-grid>

</form>
