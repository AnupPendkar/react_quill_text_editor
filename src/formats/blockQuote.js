import quill from "./quill";

// Blockquote
const Block = quill.import("blots/block");
class BlockquoteBlot extends Block {
  static blotName = "blockquote";
  static tagName = "blockquote";
}
quill.register(BlockquoteBlot);

// Bold
const Inline = quill.import("blots/inline");
class BoldBlot extends Inline {
  static blotName = "bold";
  static tagName = "strong";
}
quill.register(BoldBlot);

// Divider
const BlockEmbed = quill.import("blots/block/embed");
class DividerBlot extends BlockEmbed {
  static blotName = "divider";
  static tagName = "hr";
}
quill.register(DividerBlot);

// Image
const ImgEmbed = quill.import("blots/block/embed");
class ImageBlot extends ImgEmbed {
  static blotName = "image";
  static tagName = "img";

  static create(value) {
    let node = super.create();
    node.setAttribute("alt", value.alt);
    node.setAttribute("src", value.url);
    return node;
  }
  static value(node) {
    return {
      alt: node.getAttribute("alt"),
      url: node.getAttribute("src"),
    };
  }
}
quill.register(ImageBlot);

// Italic
const Italic = quill.import("blots/inline");
class ItalicBlot extends Italic {
  static blotName = "italic";
  static tagName = "em";
}
quill.register(ItalicBlot);

// Link
const Link = quill.import("blots/inline");
class LinkBlot extends Link {
  static blotName = "link";
  static tagName = "a";
  static create(url) {
    let node = super.create();
    // Sanitize url if desired
    node.setAttribute("href", url);
    // Okay to set other non-format related attributes
    node.setAttribute("target", "_blank");
    return node;
  }
  static formats(node) {
    // We will only be called with a node already
    // determined to be a Link blot, so we do
    // not need to check ourselves
    return node.getAttribute("href");
  }
}
quill.register(LinkBlot);

// Tweet
const TweetBlockEmbed = quill.import("blots/block/embed");

class TweetBlot extends TweetBlockEmbed {
  static blotName = "tweet";
  static tagName = "div";
  static className = "tweet";
  static create(id) {
    let node = super.create();
    node.dataset.id = id;
    // twttr.widgets.createTweet(id, node);
    return node;
  }
  static value(domNode) {
    return domNode.dataset.id;
  }
}
quill.register(TweetBlot);

// Video
const VideoBlockEmbed = quill.import("blots/block/embed");
class VideoBlot extends VideoBlockEmbed {
  static blotName = "video";
  static tagName = "iframe";

  static create(url) {
    let node = super.create();
    node.setAttribute("src", url);
    node.setAttribute("frameborder", "0");
    node.setAttribute("allowfullscreen", true);
    return node;
  }

  static formats(node) {
    let format = {};
    if (node.hasAttribute("height")) {
      format.height = node.getAttribute("height");
    }
    if (node.hasAttribute("width")) {
      format.width = node.getAttribute("width");
    }
    return format;
  }

  static value(node) {
    return node.getAttribute("src");
  }

  format(name, value) {
    if (name === "height" || name === "width") {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name, value);
      }
    } else {
      super.format(name, value);
    }
  }
}
quill.register(VideoBlot);

export default quill;
