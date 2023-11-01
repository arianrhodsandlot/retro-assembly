const isAppleMobile = /iphone|ipad|ipod/i.test(navigator.userAgent)
const isChromeLike = /chrome/i.test(navigator.userAgent)
const isMacLike = /macintosh/i.test(navigator.userAgent)
const isAppleMobileDesktopMode =
  !isChromeLike && isMacLike && /safari/i.test(navigator.userAgent) && screen.height <= 1366
export const mayNeedsUserInteraction = isAppleMobile || isAppleMobileDesktopMode
