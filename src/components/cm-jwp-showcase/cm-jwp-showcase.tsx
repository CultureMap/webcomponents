import { Component, Element, State, h } from "@stencil/core";

const ATTR_PLAYLIST_URL = "data-playlist-url";
const ATTR_JWP_KEY = "data-jwp-key";

@Component({
  tag: "cm-jwp-showcase",
  shadow: false
})
export class CmJwpShowcase {

  @Element() host: HTMLElement;
  @State() playlist: Array<any>;

  playerEl: HTMLDivElement;
  drawerEl: HTMLDivElement;

  jwPlayer: any;
  owlCarousel: any;

  componentWillLoad() {
    const playlistUrl = this.host.getAttribute(ATTR_PLAYLIST_URL);

    return fetch(playlistUrl)
      .then(data => data.json())
      .then(({ playlist }) => this.playlist = playlist);
  }

  componentDidLoad() {
    const jwpKey = this.host.getAttribute(ATTR_JWP_KEY);

    // Create the player
    this.jwPlayer = window["jwplayer"](this.playerEl).setup({
      autostart: false,  // TODO: remove and let player determine
      key: jwpKey,
      playlist: this.playlist,
      preload: "metadata",
    });

    // Turn the drawer into a carousel
    this.owlCarousel = window["jQuery"](this.drawerEl).owlCarousel({
      dotsEach: 4,
      items: 4,
      margin: 10,
      mouseDrag: false,
      pullDrag: false,
      touchDrag: false,
    });
  }

  render() {

    // Construct the thumbnails if they're ready
    const thumbnails = this.playlist
      ? this.playlist.map((item, index) =>
        <div>
          <div class="cm-jwp-showcase-item">
            <img src={item.images[0].src} alt={item.title} onClick={_ => this.selectVideo(index)}
                 style={{ cursor: "pointer" }}/>
          </div>
          <div class="cm-jwp-showcase-title">
            <p onClick={_ => this.selectVideo(index)} style={{ cursor: "pointer" }}>{item.title}</p>
          </div>
        </div>)
      : [];

    // Render the element
    return [
      <div style={{ marginBottom: "10px" }}>
        <div class="cm-jwp-showcase-player" ref={el => this.playerEl = el as HTMLDivElement}/>
      </div>,
      <div>
        <div class="cm-jwp-showcase-drawer owl-carousel owl-theme" ref={el => this.drawerEl = el as HTMLDivElement}>
          {thumbnails}
        </div>
      </div>];
  }

  selectVideo(index) {
    this.jwPlayer.playlistItem(index);
  }

  disconnectedCallback() {
    this.jwPlayer && this.jwPlayer.remove();
    this.owlCarousel && this.owlCarousel("destroy");
  }
}
