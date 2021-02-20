function dotsThrottle(t, e, o) {
    let n, i, d, l = null, c = 0;
    o || (o = {});
    const s = function () {
        c = !1 === o.leading ? 0 : Date.now(), l = null, d = t.apply(n, i), l || (n = i = null)
    };
    return function () {
        const a = Date.now();
        c || !1 !== o.leading || (c = a);
        const r = e - (a - c);
        return n = this, i = arguments, r <= 0 || r > e ? (l && (clearTimeout(l), l = null), c = a, d = t.apply(n, i), l || (n = i = null)) : l || !1 === o.trailing || (l = setTimeout(s, r)), d
    }
}

let dotFixedNavPresent = !1, dotFixedNavId = "", dotFixedNavUp = !1, dotOffset = 0;

function easyScrollDots(t) {
    let e = document.querySelectorAll(".scroll-indicator");
    if (!0 === t.fixedNav && (dotFixedNavPresent = !0), dotFixedNavId = "" !== t.fixedNavId && t.fixedNavId, !0 === t.fixedNavUpward && (dotFixedNavUp = !0), t.offset > 0 && (dotOffset = t.offset), e.length) {
        const t = '<div class="scroll-indicator-controller"><span></span></div>';
        document.querySelector("body").lastElementChild.insertAdjacentHTML("afterend", t);
        const o = document.querySelector(".scroll-indicator-controller");
        void 0 === window.orientation && -1 === navigator.userAgent.indexOf("IEMobile") || o.classList.add("indi-mobile");
        const n = Array.prototype.slice.call(e);
        n.forEach(function (t, e) {
            const n = t.getAttribute("id"),
                i = t.getAttribute("data-scroll-indicator-title");
            let d = "";
            0 == e && (d = "active"), o.lastElementChild.insertAdjacentHTML("afterend", '<div class="' + d + '" data-indi-controller-id="' + n + '" onclick="scrollIndiClicked(\'' + n + "');\"><span>" + i + "</span><div></div></div>")
        });
        const i = o.querySelectorAll("[data-indi-controller-id]"),
            d = dotsThrottle(function () {
                let t = {};
                n.forEach(function (e) {
                    const o = e.getAttribute("id"), n = e.getBoundingClientRect().top;
                    t[o] = n
                });
                const e = Object.keys(t).map(function (e) {
                    return t[e]
                });
                Object.keys(t).forEach(function (n) {
                    t[n] == function () {
                        const t = e.filter(function (t) {
                            return t > -150
                        });
                        return Math.min.apply(null, t)
                    }() && (Array.prototype.forEach.call(i, function (t) {
                        t.classList.contains("active") && t.classList.remove("active")
                    }), o.querySelector('[data-indi-controller-id="' + n + '"]').classList.add("active"))
                })
            }, 300);
        window.addEventListener("scroll", d)
    }
}

function scrollIndiClicked(t) {
    if (window.jQuery) {
        const e = $("html, body");
        if (!0 === dotFixedNavPresent && dotFixedNavId.length) {
            const o = document.getElementById(dotFixedNavId).clientHeight, n = $("#" + t);
            if (!0 === dotFixedNavUp) {
                e.animate({scrollTop: n.offset().top - dotOffset}, 700);
                const t = document.body.getBoundingClientRect().top;
                setTimeout(function () {
                    document.body.getBoundingClientRect().top > t && e.animate({scrollTop: n.offset().top - o - dotOffset}, 400)
                }, 400)
            } else e.animate({scrollTop: n.offset().top - o - dotOffset}, 700)
        } else e.animate({scrollTop: $("#" + t).offset().top - dotOffset}, 700)
    } else if (!0 === dotFixedNavPresent && dotFixedNavId.length) {
        const e = document.getElementById(dotFixedNavId).clientHeight,
            o = document.getElementById(t);
        if (!0 === dotFixedNavUp) {
            window.scrollTo({top: o.offsetTop - dotOffset, left: 0, behavior: "smooth"});
            const t = document.body.getBoundingClientRect().top;
            setTimeout(function () {
                document.body.getBoundingClientRect().top > t && window.scrollTo({
                    top: o.offsetTop - e - dotOffset,
                    left: 0,
                    behavior: "smooth"
                })
            }, 400)
        } else window.scrollTo({
            top: o.offsetTop - e - dotOffset,
            left: 0,
            behavior: "smooth"
        })
    } else window.scrollTo({
        top: document.getElementById(t).offsetTop - dotOffset,
        left: 0,
        behavior: "smooth"
    })
}