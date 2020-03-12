<svelte:head>
  <title>About</title>
</svelte:head>

<div class="content">

  <div class="hero fullscreen">
    <div class="hero-body">
      <div class="content">
        <form class="frame u-no-padding" method="post">
          <div class="frame__body u-no-padding">
            <div class="row u-no-padding level fill-height">
              <div class="col">
                <space class="x-large" />
                <div class="padded content">
                  <h1 class="u-text-center u-font-alt">Contact Us</h1>
                  <div class="divider" />
                  <p class="u-text-center">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                  <div class="divider" />

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

                  <div class="form-group">
                    <label class="form-group-label">
                      <span class="icon">
                        <i class="fa-wrapper far fa-envelope" />
                      </span>
                    </label>
                    <input
                      type="email"
                      class="form-group-input"
                      placeholder="Enter your email" />
                  </div>

                  <div class="form-section section-inline">
                    <div class="section-body">
                      <div class="form-group col-6">
                        <label class="form-group-label">
                          <span class="icon">
                            <i class="fa-wrapper far fa-calendar" />
                          </span>
                        </label>
                        <input
                          type="date"
                          class="form-group-input"
                          placeholder="Enter your birthday (or not)" />
                      </div>
                      <div class="form-group col-6">
                        <label class="form-group-label">
                          <span class="icon">
                            <i class="fa-wrapper far fa-calendar" />
                          </span>
                        </label>
                        <select
                          class="select form-group-input"
                          placeholder="Choose one">
                          <option>Bug Report</option>
                          <option>Feature Request</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <textarea placeholder="Tell us what's wrong" />

                  <div class="form-ext-control form-ext-checkbox">
                    <input id="check1" class="form-ext-input" type="checkbox" />
                    <label class="form-ext-label" for="check1">
                      Send me a copy.
                    </label>
                  </div>

                  <space />

                  <div class="btn-group u-pull-right">
                    <button class="btn-info">Send</button>
                  </div>

                </div>
                <space class="x-large" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
