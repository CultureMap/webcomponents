import { Component, Element, h } from "@stencil/core";

const ATTR_PLAYLIST_URL = "data-playlist-url";
const ATTR_JWP_KEY = "data-jwp-key";

/**
 * Showcase of videos from a JWPlayer playlist. Contains a video player above and a scrolling "drawer" of video
 * thumbnails below.
 *
 * @remarks
 *
 * This is a unique web component because it only renders once. After the first render, the JWP library takes over
 * rendering for the video player, and the Owl Carousel library takes over rendering for the drawer. Its only
 * properties are exposed as standard data attributes, because they're only used once for the first render.
 *
 * Required data attributes:
 *
 * `data-playlist-url`: Full URL to the JW Player playlist.
 * `data-jwp-key`: The JW Player API key suitable for use in JavaScript and HTML.
 */
@Component({
  tag: "cm-jwp-showcase",
  shadow: false
})
export class JwpShowcase {

  /** Reference to the host element. */
  @Element() host: HTMLElement;

  /** List of videos retrieved from the JWP API. */
  playlist: Array<any>;

  /** Reference to the video player container. */
  playerEl: HTMLDivElement;

  /** Reference to the carousel container. */
  drawerEl: HTMLDivElement;

  /** JWP object returned from jwplayer().setup(). */
  jwPlayer: any;

  /** Owl Carousel object returned from $().owlCarousel(). */
  owlCarousel: any;

  /** Fetches the playlist from the JWP API before rendering. */
  componentWillLoad() {
    const playlistUrl = this.host.getAttribute(ATTR_PLAYLIST_URL);

    return fetch(playlistUrl)
      .then(data => data.json())
      .then(({ playlist }) => this.playlist = playlist);
  }

  /** Creates the JW video player and the Owl Carousel after the first render. */
  componentDidLoad() {
    const jwpKey = this.host.getAttribute(ATTR_JWP_KEY);

    // Create the player
    this.jwPlayer = window["jwplayer"](this.playerEl).setup({
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

  /** Removes the JW video player and Owl Carousel when the host element gets disconnected. */
  disconnectedCallback() {
    this.jwPlayer && this.jwPlayer.remove();
    this.owlCarousel && this.owlCarousel("destroy");
  }

  /* Move the JW video player to another video in the playlist. */
  selectVideo(index) {
    this.jwPlayer.playlistItem(index);
  }

  /** Renders the element prior to the JW video player and Owl Carousel taking over rendering. */
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
}
