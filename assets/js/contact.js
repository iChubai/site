(function () {
  function fallbackCopy(text) {
    var input = document.createElement("textarea");
    input.value = text;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.left = "-9999px";
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand("copy");
    } catch (error) {}
    document.body.removeChild(input);
    return Promise.resolve();
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () {
        return fallbackCopy(text);
      });
    }
    return fallbackCopy(text);
  }

  var qrRoot = null;
  var qrReturnFocus = null;

  function wechatQrUrl() {
    var sheets = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < sheets.length; i++) {
      var href = sheets[i].getAttribute("href") || "";
      if (href.indexOf("custom.css") !== -1) {
        return href.replace(/css\/custom\.css(\?.*)?$/, "img/wechat-qr.jpg");
      }
    }
    return "assets/img/wechat-qr.jpg";
  }

  function closeWechatQr() {
    if (!qrRoot || qrRoot.hidden) return;
    qrRoot.hidden = true;
    document.body.style.overflow = "";
    if (qrReturnFocus && qrReturnFocus.focus) qrReturnFocus.focus();
    qrReturnFocus = null;
  }

  function openWechatQr(trigger) {
    if (!qrRoot) {
      qrRoot = document.createElement("div");
      qrRoot.className = "wechat-qr";
      qrRoot.hidden = true;
      qrRoot.innerHTML =
        '<button type="button" class="wechat-qr-backdrop" aria-label="Close"></button>' +
        '<figure class="wechat-qr-dialog" role="dialog" aria-modal="true" aria-label="WeChat">' +
        '<img alt="WeChat QR code. Scan to add me as a friend.">' +
        '<button type="button" class="wechat-qr-close" aria-label="Close">&times;</button>' +
        "</figure>";
      qrRoot.querySelector("img").src = wechatQrUrl();
      qrRoot.querySelector(".wechat-qr-backdrop").addEventListener("click", closeWechatQr);
      qrRoot.querySelector(".wechat-qr-close").addEventListener("click", closeWechatQr);
      document.body.appendChild(qrRoot);
    }
    qrReturnFocus = trigger;
    qrRoot.hidden = false;
    document.body.style.overflow = "hidden";
    qrRoot.querySelector(".wechat-qr-close").focus();
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeWechatQr();
  });

  document.addEventListener("click", function (event) {
    var qrLink = event.target.closest(".social-icons a[href='#wechat']");
    if (qrLink) {
      event.preventDefault();
      openWechatQr(qrLink);
      return;
    }
    var link = event.target.closest("[data-copy]");
    if (!link) return;
    event.preventDefault();
    var text = link.getAttribute("data-copy");
    copyText(text).then(function () {
      var note = link.querySelector(".copy-note");
      if (note) {
        var previous = note.getAttribute("data-label") || note.textContent;
        note.setAttribute("data-label", previous);
        note.textContent = "Copied";
        window.setTimeout(function () {
          note.textContent = previous;
        }, 1200);
        return;
      }
      var previousTitle = link.getAttribute("data-title") || link.getAttribute("title");
      link.setAttribute("data-title", previousTitle);
      link.setAttribute("title", "Copied");
      window.setTimeout(function () {
        link.setAttribute("title", previousTitle);
      }, 1200);
    });
  }, true);
})();
