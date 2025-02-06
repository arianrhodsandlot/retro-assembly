// supported districts are listed here
// https://emulation.gametechwiki.com/index.php/GoodTools#Country_codes
const districtsIconMap = {
  A: <span className='icon-[twemoji--flag-australia] mr-2 size-4 align-middle' />,
  As: <span className='icon-[twemoji--globe-showing-asia-australia] mr-2 size-4 align-middle' />,
  B: <span className='icon-[twemoji--flag-brazil] mr-2 size-4 align-middle' />,
  C: <span className='icon-[twemoji--flag-canada] mr-2 size-4 align-middle' />,
  Ch: <span className='icon-[twemoji--flag-china] mr-2 size-4 align-middle' />,
  D: <span className='icon-[twemoji--flag-netherlands] mr-2 size-4 align-middle' />,
  E: <span className='icon-[twemoji--flag-european-union] mr-2 size-4 align-middle' />,
  F: <span className='icon-[twemoji--flag-france] mr-2 size-4 align-middle' />,
  G: <span className='icon-[twemoji--flag-germany] mr-2 size-4 align-middle' />,
  Gr: <span className='icon-[twemoji--flag-greece] mr-2 size-4 align-middle' />,
  HK: <span className='icon-[twemoji--flag-hong-kong-sar-china] mr-2 size-4 align-middle' />,
  I: <span className='icon-[twemoji--flag-italy] mr-2 size-4 align-middle' />,
  J: <span className='icon-[twemoji--flag-japan] mr-2 size-4 align-middle' />,
  K: <span className='icon-[twemoji--flag-south-korea] mr-2 size-4 align-middle' />,
  Nl: <span className='icon-[twemoji--flag-netherlands] mr-2 size-4 align-middle' />,
  No: <span className='icon-[twemoji--flag-norway] mr-2 size-4 align-middle' />,
  PD: <span className='icon-[twemoji--free-button] mr-2 size-4 align-middle' />,
  R: <span className='icon-[twemoji--flag-russia] mr-2 size-4 align-middle' />,
  S: <span className='icon-[twemoji--flag-spain] mr-2 size-4 align-middle' />,
  Sw: <span className='icon-[twemoji--flag-sweden] mr-2 size-4 align-middle' />,
  U: <span className='icon-[twemoji--flag-united-states] mr-2 size-4 align-middle' />,
  UK: <span className='icon-[twemoji--flag-united-kingdom] mr-2 size-4 align-middle' />,
  Unk: <span className='icon-[twemoji--red-question-mark] mr-2 size-4 align-middle' />,
  W: <span className='icon-[twemoji--flag-united-nations] mr-2 size-4 align-middle' />,
}

export function DistrictIcon({ district }: { district: string }) {
  return districtsIconMap[district]
}
