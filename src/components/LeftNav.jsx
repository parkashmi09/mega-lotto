import { useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useScreenSize } from '../hooks';
import { useSiteConfig } from '../context/SiteConfigContext.jsx';
import { useLeftNav } from '../context/LeftNavContext.jsx';
import { Logo } from './Logo.jsx';

/* ── SVG icon paths ── */

// Casino nav icons
const ICON_ORIGINALS = 'M10.097 2.076h3.805l2.3 6.947H7.797zm-1.568 0H5.273c-.816 0-1.567.445-1.959 1.16L.458 8.453a2.2 2.2 0 0 0-.218.57h6.041a3 3 0 0 1 .075-.386zM.413 10.512c.099.201.23.39.391.558l9.187 9.587-3.479-10.145zm13.594 10.147 9.19-9.589c.16-.168.292-.357.39-.559h-6.1zM23.76 9.023h-6.042a3 3 0 0 0-.075-.387l-2.173-6.56h3.257c.816 0 1.567.445 1.96 1.16l2.856 5.216q.15.276.217.57M12 21.923 8.086 10.513h7.827z';
const ICON_SLOTS = 'M5.649 1.976a1 1 0 0 1 1.376-.327C8.87 2.785 10.8 3.282 12.882 3.456c1.908.16 4.475-.098 6.124-1.034a1 1 0 1 1 .988 1.74c-1.667.945-3.866 1.304-5.747 1.336.345 1.252.933 2.502 2.096 3.494a5.75 5.75 0 1 1-1.88.974c-1.238-1.288-1.85-2.792-2.198-4.138-2.848 1.144-4.513 2.872-5.11 5.038a5.75 5.75 0 1 1-2.047-.047c.54-2.525 2.108-4.5 4.485-5.904a13.7 13.7 0 0 1-3.617-1.563 1 1 0 0 1-.327-1.376M5.25 13.5a.75.75 0 0 1 .75-.75 3.75 3.75 0 0 1 3.75 3.75.75.75 0 0 1-1.5 0A2.25 2.25 0 0 0 6 14.25a.75.75 0 0 1-.75-.75M18 10.75a.75.75 0 0 0 0 1.5 2.25 2.25 0 0 1 2.25 2.25.75.75 0 0 0 1.5 0A3.75 3.75 0 0 0 18 10.75';
const ICON_LIVE_CASINO = 'M10.362 16.46a4.77 4.77 0 0 1-2.732-2.594 4.7 4.7 0 0 1-.363-2.276c.044-.513.17-1.002.363-1.455A4.74 4.74 0 0 1 12 7.25a4.74 4.74 0 0 1 4.37 2.885 4.7 4.7 0 0 1 .363 2.275 4.7 4.7 0 0 1-.363 1.456A4.74 4.74 0 0 1 12 16.75a4.7 4.7 0 0 1-1.639-.29M6.16 14.233a6.27 6.27 0 0 0 2.496 3.049c-1.368.619-2.972 1.247-4.53 1.62-1.897.457-3.504-.955-3.68-2.76A43 43 0 0 1 .25 12c0-1.635.09-3.046.197-4.141.176-1.806 1.783-3.218 3.68-2.762 1.558.374 3.161 1.002 4.529 1.621A6.27 6.27 0 0 0 6.16 9.767l-1.979-.494a.75.75 0 0 0-.364 1.455l1.98.495a6.3 6.3 0 0 0 0 1.555l-1.98.495a.75.75 0 0 0 .364 1.455zm11.678-4.466a6.27 6.27 0 0 0-2.495-3.048c1.368-.62 2.972-1.247 4.529-1.621 1.897-.456 3.504.956 3.68 2.762.107 1.095.197 2.506.197 4.14 0 1.635-.09 3.046-.197 4.141-.176 1.806-1.783 3.218-3.68 2.762-1.558-.374-3.162-1.002-4.53-1.621a6.27 6.27 0 0 0 2.496-3.049l1.98.495a.75.75 0 1 0 .363-1.455l-1.98-.495a6.3 6.3 0 0 0 0-1.555l1.98-.495a.75.75 0 1 0-.364-1.455z';
const ICON_GAMESHOWS = 'M9.66 8.398 6.908 1.055q-.242.144-.606.396c-.629.442-1.52 1.15-2.61 2.24s-1.798 1.981-2.24 2.61q-.254.364-.396.606l7.343 2.754c.149-.189.344-.413.597-.666s.477-.448.666-.597m1.381-.59c.25-.033.567-.058.959-.058s.71.025.959.057l2.719-7.25-.249-.046C14.673.38 13.542.25 12 .25S9.327.379 8.57.511l-.247.046zm3.298.59c.189.149.413.344.666.597s.448.477.597.666l7.343-2.754q-.144-.242-.396-.606c-.442-.629-1.15-1.52-2.24-2.61s-1.981-1.798-2.61-2.24q-.364-.254-.606-.396zm1.854 2.643c.032.25.057.567.057.959s-.025.71-.057.959l7.25 2.719.046-.249c.133-.756.261-1.887.261-3.429s-.128-2.673-.261-3.43l-.046-.247zm-.591 3.298a8 8 0 0 1-.597.666 8 8 0 0 1-.666.597l2.754 7.343q.241-.144.606-.396c.629-.442 1.52-1.15 2.61-2.24s1.798-1.981 2.24-2.61q.253-.364.396-.606zm-2.643 1.854a7 7 0 0 1-.959.057c-.392 0-.71-.025-.959-.057l-2.718 7.25.248.046c.756.133 1.887.261 3.429.261s2.673-.128 3.43-.261l.248-.046zm-3.298-.591a8 8 0 0 1-.666-.597 8 8 0 0 1-.597-.666l-7.343 2.754q.144.241.396.606c.442.629 1.15 1.52 2.24 2.61s1.981 1.798 2.61 2.24q.364.253.606.396zm-1.854-2.643A7 7 0 0 1 7.75 12c0-.392.025-.71.057-.959L.557 8.323l-.046.248C.38 9.327.25 10.458.25 12s.129 2.673.261 3.43l.046.248zm2.947-3.506a2 2 0 0 1 .15-.098 2 2 0 0 1 .176-.037c.182-.032.485-.068.92-.068s.738.036.92.068q.123.023.175.037.048.027.15.098c.152.106.392.295.7.603.307.307.496.547.602.698q.072.104.098.15.014.053.037.176c.032.182.068.485.068.92s-.036.738-.068.92q-.023.123-.037.175a2 2 0 0 1-.098.15 5.4 5.4 0 0 1-.603.7 5.4 5.4 0 0 1-.698.602q-.104.072-.15.098-.053.014-.176.037a5.4 5.4 0 0 1-.92.068c-.435 0-.738-.036-.92-.068a2 2 0 0 1-.175-.037 2 2 0 0 1-.15-.098 5.4 5.4 0 0 1-.7-.603 5.4 5.4 0 0 1-.602-.698 2 2 0 0 1-.098-.15 2 2 0 0 1-.037-.176A5.4 5.4 0 0 1 9.25 12c0-.435.036-.738.068-.92a2 2 0 0 1 .037-.175 2 2 0 0 1 .098-.15c.106-.152.295-.392.603-.7.307-.307.547-.496.698-.602';
const ICON_TABLES = 'M7.085 1.96c-1.93.516-3.341.983-4.31 1.34C1.417 3.799.703 5.178.984 6.56c.263 1.302.723 3.343 1.491 6.21.769 2.869 1.391 4.865 1.813 6.124.448 1.338 1.756 2.176 3.18 1.93a41 41 0 0 0 1.875-.373 5 5 0 0 1-.017-.226 62 62 0 0 1-.077-3.223c0-1.095.023-2.015.056-2.773a2 2 0 0 1-.265-.167 41 41 0 0 1-1.973-1.584 1.6 1.6 0 0 1-.469-1.75 40.399 40.399 0 0 1 .917-2.358c.21-.492.584-.826 1.032-.946s.94-.018 1.367.304a40 40 0 0 1 1.974 1.584q.19.166.317.368a4.8 4.8 0 0 1 1.57-.351c.737-.039 1.655-.07 2.769-.076l-.063-.235c-.768-2.868-1.391-4.865-1.813-6.124-.448-1.338-1.756-2.175-3.18-1.93-1.019.176-2.474.478-4.404.995m15.867 6.102c-.11.537-.251 1.199-.435 1.993a4.73 4.73 0 0 0-2.293-.726 57 57 0 0 0-2.126-.07l-.167-.63a117 117 0 0 0-1.538-5.29l.458.122c1.93.517 3.341.983 4.31 1.34 1.357.5 2.071 1.879 1.79 3.261M17 23.252c1.297 0 2.338-.032 3.145-.075a3.166 3.166 0 0 0 3.03-3.03c.043-.807.075-1.848.075-3.145s-.032-2.338-.075-3.145a3.166 3.166 0 0 0-3.03-3.03A60 60 0 0 0 17 10.752c-1.297 0-2.338.032-3.145.075a3.165 3.165 0 0 0-3.03 3.03 60 60 0 0 0-.075 3.145c0 1.297.033 2.338.075 3.145a3.165 3.165 0 0 0 3.03 3.03c.807.043 1.848.075 3.145.075m2.884-7.366a1.25 1.25 0 0 0-1.768-1.768l-.25.25a1.25 1.25 0 0 0 1.768 1.768zm-5.768 2.232a1.25 1.25 0 0 0 1.768 1.768l.25-.25a1.25 1.25 0 0 0-1.768-1.768z';

// Sport nav icons
const ICON_FOOTBALL = 'M12 .25C5.51.25.25 5.51.25 12S5.51 23.75 12 23.75 23.75 18.49 23.75 12 18.49.25 12 .25m-.75 2.027A9.75 9.75 0 0 0 2.277 11.25H5.5l2.8-2.1.7-3.5zm1.5 0v1.346l2.95 1.477 3.1-.9a9.7 9.7 0 0 0-6.05-1.923m7.488 3.073-2.338.678-1.65 3.472 1.75 3 3.498.75a9.7 9.7 0 0 0 .74-3.25 9.7 9.7 0 0 0-2-4.65m.985 9.4-2.723-.585-2.85 1.9-.35 2.75a9.7 9.7 0 0 0 5.923-4.065M10.85 21.2l.4-3.15-2.5-2.3H5.1a9.7 9.7 0 0 0 5.75 5.45m-7.326-7.45a9.7 9.7 0 0 0 1.076 3.15l1.15-2.1-.3-2.55-1.926-.75zm6.926-3l-2.2-1.5L6 11.75l-.4 3.2 1.45 2.6h3.8l2.1-1.6zm.6-2.25 2.2 1.5 2.55-.75 1.45-3.05L14.5 4.75 11.75 5.8z';
const ICON_BASKETBALL = 'M12 .25C5.51.25.25 5.51.25 12S5.51 23.75 12 23.75 23.75 18.49 23.75 12 18.49.25 12 .25m-1 2.052v4.95l-4.243 4.242-4.704-1.57a9.72 9.72 0 0 1 8.947-7.622m-9.44 9.133 4.197 1.4L11 18.09v3.608A9.74 9.74 0 0 1 2.277 12.75q0-.665.092-1.307zm10.44.816-3.94-3.94L12 4.37l3.94 3.94L12 12.25m1 9.448v-3.607l5.243-5.243 4.197-1.4q.091.643.092 1.307A9.74 9.74 0 0 1 13 21.698m5.757-11.204L13 16.252v-4.95l4.243-4.243 4.704 1.57a9.72 9.72 0 0 1-1.19 2.869m.72-4.4-4.198-1.402L13 2.302a9.74 9.74 0 0 1 6.477 4.791m-12.954 0A9.74 9.74 0 0 1 11 2.302v2.39l-2.28 2.28-4.197-1.4a9.7 9.7 0 0 1 2-1.478';
const ICON_TENNIS = 'M12 .25C5.51.25.25 5.51.25 12S5.51 23.75 12 23.75 23.75 18.49 23.75 12 18.49.25 12 .25m0 1.5c1.856 0 3.598.504 5.091 1.382a12.3 12.3 0 0 0-1.591 5.618 12.3 12.3 0 0 0 1.591 5.618A9.73 9.73 0 0 1 12 15.75a9.73 9.73 0 0 1-5.091-1.382 12.3 12.3 0 0 0 1.591-5.618 12.3 12.3 0 0 0-1.591-5.618A9.73 9.73 0 0 1 12 1.75m6.568 2.732a10.8 10.8 0 0 1-1.038 4.268 10.8 10.8 0 0 1 1.038 4.268 9.76 9.76 0 0 1 3.145-4.268 9.76 9.76 0 0 1-3.145-4.268m-13.136 0a9.76 9.76 0 0 1-3.145 4.268 9.76 9.76 0 0 1 3.145 4.268 10.8 10.8 0 0 1 1.038-4.268 10.8 10.8 0 0 1-1.038-4.268M22.213 10.73a11.3 11.3 0 0 0-3.683 3.02 9.73 9.73 0 0 1-1.439-1.382A12.3 12.3 0 0 0 15.5 8.75a12.3 12.3 0 0 0 1.591-3.618 9.73 9.73 0 0 1 1.439-1.382 11.3 11.3 0 0 0 3.683 3.02 11.3 11.3 0 0 0 0 3.96m-20.426 0a11.3 11.3 0 0 0 0-3.96 11.3 11.3 0 0 0 3.683-3.02A9.73 9.73 0 0 1 6.91 5.132 12.3 12.3 0 0 0 8.5 8.75a12.3 12.3 0 0 0-1.591 3.618 9.73 9.73 0 0 1-1.439 1.382 11.3 11.3 0 0 0-3.683-3.02';
const ICON_HORSE_RACING = 'M20.25 2.25c0-.69-.56-1.25-1.25-1.25s-1.25.56-1.25 1.25v.75H15l-3.5 3-5.5-.5-3.75 3.25v5l3.75-2.5 5 .5L14 9.25h2.75v5.5c0 .69.56 1.25 1.25 1.25s1.25-.56 1.25-1.25V3h1c.55 0 1-.45 1-1s-.45-1-1-1zM4 18.5v3.25c0 .69.56 1.25 1.25 1.25s1.25-.56 1.25-1.25V17l-2.5 1.5m12.75-3.75v7c0 .69.56 1.25 1.25 1.25s1.25-.56 1.25-1.25v-7z';
const ICON_ESPORTS = 'M6.5 1.25C4.16 1.25 2.25 3.16 2.25 5.5v2.55c0 3.55 1.17 7.02 3.34 9.86l1.29 1.7c.72.95 1.84 1.5 3.03 1.5h4.18c1.19 0 2.31-.55 3.03-1.5l1.29-1.7a15.88 15.88 0 0 0 3.34-9.86V5.5c0-2.34-1.91-4.25-4.25-4.25zm2 5.5a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 1 1 0-2h1v-1a1 1 0 0 1 1-1m6 1.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5m1.5 3a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5';
const ICON_CRICKET = 'M14.12 1.29a1 1 0 0 1 1.41 0l7.18 7.18a1 1 0 0 1 0 1.41l-1.42 1.42a1 1 0 0 1-1.41 0L12.7 4.12a1 1 0 0 1 0-1.41zM11.29 6.7a1 1 0 0 1 1.41 0l4.6 4.6a1 1 0 0 1 0 1.41l-5.66 5.66a3 3 0 0 1-2.52.87l-3.18-.32-.32-3.18a3 3 0 0 1 .87-2.52zm-3.54 7.07a1.25 1.25 0 1 0-1.77 1.77 1.25 1.25 0 0 0 1.77-1.77M2.64 19.95l-.93.93a1 1 0 0 0 1.41 1.41l.93-.93a3.5 3.5 0 0 0-1.41-1.41';
const ICON_INPLAY = 'M12 .25C5.51.25.25 5.51.25 12S5.51 23.75 12 23.75 23.75 18.49 23.75 12 18.49.25 12 .25M9.5 7.32a1 1 0 0 1 1.04.06l7 5a1 1 0 0 1 0 1.64l-7 4.5A1 1 0 0 1 9 17.75v-9.5a1 1 0 0 1 .5-.93';

// Mode switch icons
const ICON_CASINO_MODE = 'M13.591.785a2.65 2.65 0 0 0-3.191 0 76 76 0 0 1-2.372 1.712l-.021.015C5.77 4.084 3.443 5.72 1.962 7.747l-.005.006C.84 9.381.474 11.4.961 13.278c.877 3.599 5.034 5.386 8.456 4.237-.348 1.581-.669 3.216-.822 4.463-.106.861.512 1.6 1.367 1.678a22.3 22.3 0 0 0 4.076 0c.855-.079 1.473-.817 1.367-1.678-.153-1.246-.474-2.88-.821-4.46 3.42 1.143 7.57-.645 8.446-4.24.485-1.874.174-3.924-1-5.53-1.482-2.028-3.81-3.664-6.046-5.235l-.021-.016c-.814-.572-1.617-1.136-2.372-1.712';
const ICON_SPORTS_MODE = 'M3.504 3.283C5.394 1.393 7.993.257 11.037.06a1 1 0 0 0-.039.275V4.45q-.067.032-.133.068a22.5 22.5 0 0 0-2.64 1.71 27 27 0 0 0-2.632 2.23 3 3 0 0 0-.166.176L.942 7.436c.55-1.605 1.418-3.008 2.562-4.153m1.368 7.272L.45 9.375Q.251 10.53.25 11.779c0 3.46 1.167 6.41 3.254 8.496q.334.334.697.637l2.75-3.873a3 3 0 0 1-.068-.135 28 28 0 0 1-1.23-3.195 23.5 23.5 0 0 1-.78-3.154m3.656 7.717L5.853 22.04c1.751.968 3.835 1.49 6.147 1.49 2.287 0 4.352-.51 6.091-1.46l-2.804-3.742-.046.007c-.67.095-1.72.201-3.086.201-1.416 0-2.596-.114-3.339-.21a3 3 0 0 1-.288-.054m8.423-1.058 2.8 3.737a10 10 0 0 0 .745-.676c2.087-2.086 3.254-5.036 3.254-8.496q-.001-1.251-.2-2.406l-4.424 1.181-.009.057a23.5 23.5 0 0 1-.771 3.098 28 28 0 0 1-1.25 3.236 3 3 0 0 1-.145.27m1.62-8.582 4.487-1.198c-.55-1.604-1.418-3.007-2.562-4.15C18.606 1.392 16.006.256 12.96.06q.038.132.038.275V4.45q.068.03.135.067c.596.324 1.518.875 2.64 1.71a27 27 0 0 1 2.633 2.23q.087.085.165.176m-6.75-2.359a.37.37 0 0 1 .357 0c.52.284 1.361.785 2.401 1.558 1.1.818 1.943 1.586 2.436 2.063a.42.42 0 0 1 .131.38 21.5 21.5 0 0 1-.706 2.83 26 26 0 0 1-1.159 3.002.42.42 0 0 1-.322.25c-.586.082-1.542.18-2.804.18-1.312 0-2.405-.106-3.083-.193a.47.47 0 0 1-.372-.275 26 26 0 0 1-1.141-2.964 21.5 21.5 0 0 1-.707-2.83.42.42 0 0 1 .131-.38A25 25 0 0 1 9.42 7.83a20.5 20.5 0 0 1 2.401-1.558';

// Lottery icons
const ICON_LOTTERY = 'M19 5.25c1.24 0 2.25 1.01 2.25 2.25v2a.75.75 0 0 1-.53.72 1.75 1.75 0 0 0 0 3.36.75.75 0 0 1 .53.72v2c0 1.24-1.01 2.25-2.25 2.25H5c-1.24 0-2.25-1.01-2.25-2.25v-2a.75.75 0 0 1 .53-.72 1.75 1.75 0 0 0 0-3.36A.75.75 0 0 1 2.75 9.5v-2C2.75 6.26 3.76 5.25 5 5.25zM8.5 8a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0V9a1 1 0 0 0-1-1m4.75 0a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0V9a1 1 0 0 0-1-1';
const ICON_TROPHY = 'M6 2.25A1.75 1.75 0 0 0 4.25 4v.25H2.5A1.75 1.75 0 0 0 .75 6v1.5a3.75 3.75 0 0 0 3.75 3.75h.36A6.76 6.76 0 0 0 11 15.94v2.31H8a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5h-3v-2.31a6.76 6.76 0 0 0 6.14-4.69h.36A3.75 3.75 0 0 0 23.25 7.5V6a1.75 1.75 0 0 0-1.75-1.75h-1.75V4A1.75 1.75 0 0 0 18 2.25zM4.25 5.75v3.75A2.25 2.25 0 0 1 2.25 7.5V6a.25.25 0 0 1 .25-.25zm15.5 0h1.75a.25.25 0 0 1 .25.25v1.5a2.25 2.25 0 0 1-2 2.24V5.75z';
const ICON_RECEIPT = 'M5.5 1.25C4.26 1.25 3.25 2.26 3.25 3.5v18a.75.75 0 0 0 1.14.64L7 20.38l2.61 1.76a.75.75 0 0 0 .84 0L13 20.38l2.61 1.76a.75.75 0 0 0 .84 0L19 20.38l2.61 1.76a.75.75 0 0 0 1.14-.64v-18c0-1.24-1.01-2.25-2.25-2.25zM7.5 7a1 1 0 0 0 0 2h9a1 1 0 1 0 0-2zm0 4a1 1 0 1 0 0 2h9a1 1 0 1 0 0-2z';

// General icons
const ICON_REWARDS = 'M7.625 2.5C6.786 2.5 6 3.244 6 4.5c0 .494.146.935.376 1.274 1.218-.012 2.705-.02 4.482-.023a6.2 6.2 0 0 0-.872-1.729C9.302 3.073 8.47 2.5 7.625 2.5M4 4.5c0 .452.068.89.195 1.3-.667.01-1.177.02-1.539.027C2.11 5.84 1.257 6.05.94 6.895.828 7.192.75 7.559.75 8s.078.808.19 1.105c.317.846 1.17 1.056 1.716 1.068 1.24.027 4.225.077 9.344.077 5.12 0 8.104-.05 9.344-.077.546-.012 1.399-.222 1.717-1.068.111-.297.189-.664.189-1.105s-.078-.808-.19-1.105c-.317-.846-1.17-1.056-1.716-1.068-.362-.008-.872-.018-1.54-.028.128-.41.196-.847.196-1.299 0-2.058-1.401-4-3.625-4-1.78 0-3.136 1.177-3.983 2.353q-.21.29-.392.598a8 8 0 0 0-.392-.598C10.761 1.677 9.405.5 7.625.5 5.402.5 4 2.442 4 4.5m9.142 1.25c1.777.004 3.264.012 4.482.024.23-.34.376-.78.376-1.274 0-1.256-.786-2-1.625-2-.845 0-1.677.573-2.36 1.522a6.2 6.2 0 0 0-.873 1.729M2.25 11.66v-.015q.211.025.373.027c1.19.026 3.954.073 8.627.077v11.498c-2.658-.016-4.591-.119-5.885-.222-1.564-.124-2.803-1.3-2.94-2.888-.094-1.076-.175-2.598-.175-4.637zm19.127.012c-1.19.026-3.954.073-8.627.077v11.498c2.658-.016 4.591-.119 5.885-.222 1.564-.124 2.803-1.3 2.94-2.888.094-1.076.175-2.598.175-4.637v-3.855q-.211.025-.373.027';
const ICON_SUPPORT = 'M3.593.497C5.295.377 8.043.25 12 .25s6.705.128 8.407.247c1.63.114 2.93 1.342 3.08 2.99.133 1.456.263 3.675.263 6.763s-.13 5.307-.263 6.763c-.15 1.648-1.45 2.876-3.08 2.99-1.637.115-4.243.237-7.962.247l-3.632 3.112c-.81.695-2.063.119-2.063-.95v-2.248a92 92 0 0 1-3.157-.16c-1.63-.115-2.93-1.343-3.08-2.991C.38 15.557.25 13.338.25 10.25s.13-5.307.263-6.763C.663 1.84 1.963.611 3.593.497m3.858 11.167a1 1 0 0 1 1.385.287C9.488 12.945 10.7 13.5 12 13.5s2.512-.555 3.164-1.549a1 1 0 1 1 1.672 1.098C15.738 14.722 13.824 15.5 12 15.5c-1.823 0-3.738-.778-4.836-2.451a1 1 0 0 1 .287-1.385';

// Map Sport enum values → { icon, labelKey, route }
const SPORT_NAV_MAP = {
  football:     { icon: ICON_FOOTBALL,     labelKey: 'app.football',     to: '/sports/football' },
  basketball:   { icon: ICON_BASKETBALL,   labelKey: 'app.basketball',   to: '/sports/basketball' },
  tennis:       { icon: ICON_TENNIS,       labelKey: 'app.tennis',       to: '/sports/tennis' },
  horse_racing: { icon: ICON_HORSE_RACING, labelKey: 'app.horseRacing',  to: '/sports/horse-racing' },
  esports:      { icon: ICON_ESPORTS,      labelKey: 'app.esports',      to: '/sports/esports' },
  cricket:      { icon: ICON_CRICKET,      labelKey: 'app.cricket',      to: '/sports/cricket' },
};

export function LeftNav() {
  const { t } = useTranslation();
  const { isDesktop } = useScreenSize();
  const { platformName, logo, config, isCasinoActive, isLotteryActive, isOriginalEnabled, isTableEnabled } = useSiteConfig();
  const { expanded, toggleExpanded } = useLeftNav();

  const hasCasino = isCasinoActive;
  const hasSports = (config?.active_sports || []).length > 0;
  const hasLottery = isLotteryActive;

  /* ── Build nav items dynamically from config ── */
  const navItems = useMemo(() => {
    const items = [];

    // Lottery section
    if (hasLottery) {
      items.push({ to: '/lottery', labelKey: 'lottery.draws', iconPath: ICON_LOTTERY });
      items.push({ to: '/lottery/results', labelKey: 'lottery.results', iconPath: ICON_TROPHY });
      items.push({ to: '/lottery/my-tickets', labelKey: 'lottery.myTickets', iconPath: ICON_RECEIPT });
    }

    // Casino section
    if (hasCasino) {
      const hasOriginals = (config?.active_originals || []).length > 0;
      if (hasOriginals) items.push({ to: '/casino/originals', labelKey: 'app.originals', iconPath: ICON_ORIGINALS });
      if (isOriginalEnabled('slots')) items.push({ to: '/casino/slots', labelKey: 'app.slots', iconPath: ICON_SLOTS });
      if (isOriginalEnabled('live_casino')) items.push({ to: '/casino/live', labelKey: 'app.liveCasino', iconPath: ICON_LIVE_CASINO });
      items.push({ to: '/casino/gameshows', labelKey: 'app.gameShows', iconPath: ICON_GAMESHOWS });
      const hasTables = (config?.active_tables || []).length > 0;
      if (hasTables) items.push({ to: '/casino/tables', labelKey: 'app.tableGames', iconPath: ICON_TABLES });
    }

    // Sports section
    if (hasSports) {
      if (hasCasino && items.length > 0) items.push({ divider: true });
      // InPlay always first when sports are active
      items.push({ to: '/sports/in-play', labelKey: 'app.inPlay', iconPath: ICON_INPLAY });
      for (const sport of config.active_sports) {
        const meta = SPORT_NAV_MAP[sport];
        if (meta) items.push({ to: meta.to, labelKey: meta.labelKey, iconPath: meta.icon });
      }
    }

    return items;
  }, [config, hasCasino, hasSports, hasLottery, isOriginalEnabled, isTableEnabled]);

  /* ── Style helpers (unchanged) ── */
  const linkClass = ({ isActive }) =>
    `group relative flex outline-none cursor-pointer py-1 transition-colors delay-300 duration-200 ease-in-out
     focus-visible:ring-2 focus-visible:ring-[var(--color-button-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background-secondary)]
     ${expanded ? 'left-nav-link-expanded flex-row items-center gap-3 w-full min-w-0 px-3 rounded-full' : 'flex-col items-center gap-2.5 max-w-[68px] px-1'}
     ${isActive ? 'nav-link-active text-[var(--color-bottom-navigation-selected-foreground)]' : 'text-[var(--color-foreground-muted-1)] hover:text-[var(--color-foreground-primary)]'}
     ${expanded && isActive ? 'bg-[var(--color-bottom-navigation-selected-surface)]' : ''}`;

  const iconWrapper =
    'flex h-[36px] w-[36px] items-center justify-center rounded-full transition-all duration-200 ease-out shrink-0 ' +
    'group-[.nav-link-active]:bg-[var(--color-bottom-navigation-selected-surface)] ' +
    'group-[.nav-link-active.left-nav-link-expanded]:bg-transparent';

  const modeSwitchLinkClass = ({ isActive }) =>
    `group relative flex flex-col items-center outline-none cursor-pointer px-1 transition-all duration-200 ease-out
     focus-visible:ring-2 focus-visible:ring-[var(--color-button-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background-secondary)]
     ${expanded ? 'flex-row flex-1 justify-center left-nav-mode-switch-expanded' : 'rounded-[50%]'}
     ${isActive ? 'nav-link-active text-[var(--color-foreground-primary)]' : 'text-[var(--color-foreground-muted-1)] hover:text-[var(--color-foreground-primary)]'}
     ${expanded && isActive ? 'bg-[var(--color-button-primary)] text-[var(--color-button-primary-foreground)]' : ''}`;

  const modeSwitchIconWrapper =
    'flex h-[36px] w-[36px] items-center justify-center rounded-full transition-all duration-200 ease-out shrink-0 ' +
    'bg-transparent text-[var(--color-foreground-muted-1)] ' +
    'group-hover:bg-[var(--color-control-secondary-active)] group-hover:text-[var(--color-control-secondary-foreground-active)] group-hover:scale-105 ' +
    'group-[.nav-link-active]:bg-[var(--color-button-primary)] group-[.nav-link-active]:text-[var(--color-button-primary-foreground)] group-[.nav-link-active]:scale-100 ' +
    'group-[.nav-link-active.left-nav-mode-switch-expanded]:bg-transparent';

  const NavIcon = ({ path }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={24} height={24} className="size-5 self-center transition-colors">
      <path fillRule="evenodd" d={path} clipRule="evenodd" fill="currentColor" stroke="transparent" />
    </svg>
  );

  return (
    <div
      className={`${!expanded?'w-[100px]':'w-[300px]'} transition-all z-left-nav fixed top-0 left-0 grid h-dvh overscroll-none py-[var(--bl-padding-y)] pl-[var(--bl-padding-x)] duration-300 ease-in-out local-z-stack hidden xl:grid xl:translate-x-0`}
    >
      <nav data-testid="left-nav" className="flex h-full w-full min-h-0">
        <div className="rounded-[32px] bg-[var(--color-background-secondary)] relative flex flex-col flex-1 min-h-0 w-full overflow-hidden pt-8 border border-[var(--color-foreground-muted-1)]/10 shadow-lg">
        {/* Glass Effect Background */}
        <div className="absolute -top-[470px] -left-[470px] opacity-40 pointer-events-none select-none" aria-hidden>
          <svg className="size-[690px] min-w-[690px]" viewBox="0 0 690 690" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#left-nav-blur)">
              <path d="M200 345C200 264.919 264.919 200 345 200V200C425.081 200 490 264.919 490 345V345C490 425.081 425.081 490 345 490V490C264.919 490 200 425.081 200 345V345Z" fill="var(--color-effect-glassmorphism)" />
            </g>
            <defs>
              <filter id="left-nav-blur" x="0" y="0" width="690" height="690" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur" />
              </filter>
            </defs>
          </svg>
        </div>

        {/* Top row: centered logo */}
        <div className="relative flex w-full items-center justify-center h-[44px] pt-3 pb-2">
          <NavLink to="/" className="block rounded-lg p-1 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--color-button-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background-secondary)] outline-none">
            <Logo className={expanded ? 'w-[68px]' : 'w-[52px]'} />
          </NavLink>
        </div>

        {/* Mode Switch (Casino / Sports) – only show when BOTH are enabled */}
        {hasCasino && hasSports && (
          <div className={`flex mt-5 ${expanded ? 'flex-row justify-center px-3' : 'flex-col items-center'}`}>
            <div className={`left-nav-mode-switch rounded-[40px] bg-[var(--color-background-primary)] relative z-[1] ring-1 ring-[var(--color-foreground-muted-1)]/15 shadow-sm flex ${expanded ? 'flex-row w-full max-w-full [&>a:first-child]:rounded-l-[40px] [&>a:last-child]:rounded-r-[40px]' : 'flex-col gap-2 w-fit'}`}>
              <NavLink to="/casino" className={modeSwitchLinkClass}>
                <div className={modeSwitchIconWrapper}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={24} height={24} className="size-5 transition-[width,height] duration-300">
                    <path fillRule="evenodd" d={ICON_CASINO_MODE} clipRule="evenodd" fill="currentColor" stroke="transparent" />
                  </svg>
                </div>
              </NavLink>
              <NavLink to="/sports" className={modeSwitchLinkClass}>
                <div className={modeSwitchIconWrapper}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={24} height={24} className="size-5 transition-[width,height] duration-300">
                    <path fillRule="evenodd" d={ICON_SPORTS_MODE} clipRule="evenodd" fill="currentColor" stroke="transparent" />
                  </svg>
                </div>
              </NavLink>
            </div>
          </div>
        )}

        {/* Scrollable Nav Items */}
        <div className="left-nav-scroll flex-1 overflow-y-auto overflow-x-hidden min-h-0 overscroll-y-auto px-2">
          <div className={`flex flex-col gap-1 py-1 ${expanded ? 'items-stretch px-1' : 'items-center'}`}>
            {navItems.map((item, index) =>
              item.divider ? (
                <div key={`divider-${index}`} className={`h-px bg-[var(--color-foreground-muted-1)]/25 my-1 ${expanded ? 'w-full' : 'w-[80%]'}`} aria-hidden />
              ) : (
                <NavLink key={item.to} to={item.to} className={linkClass}>
                  <div className={iconWrapper}>
                    <NavIcon path={item.iconPath} />
                  </div>
                  <span className={`font-bold uppercase tracking-wide truncate ${expanded ? 'text-sm' : 'text-[10px] text-center'}`}>{t(item.labelKey)}</span>
                </NavLink>
              )
            )}
          </div>
        </div>

        {/* Expand Toggle */}
        {isDesktop && (
          <div className={`flex shrink-0 items-center px-4 pt-3 pb-4 rounded-b-[32px] bg-[var(--color-background-secondary)] ${!expanded ? 'justify-center' : 'justify-end'}`}>
            <button
              type="button"
              onClick={toggleExpanded}
              aria-expanded={expanded}
              aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
              className="flex size-9 items-center justify-center rounded-full
                text-[var(--color-foreground-muted-3)] hover:text-[var(--color-foreground-primary)]
                hover:bg-[var(--color-control-secondary-active)] transition-all duration-200 cursor-pointer
                focus-visible:ring-2 focus-visible:ring-[var(--color-button-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background-secondary)] outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                shapeRendering="geometricPrecision"
                textRendering="geometricPrecision"
                className={`left-nav-expand-icon size-6 ${expanded ? 'right' : ''}`}
                aria-hidden
              >
                <style>{`
                  .left-nav-expand-icon .vertical-line {
                    transform-origin: center;
                    transition: transform 0.3s ease, all 0.3s ease;
                    transform: translate(15px, 0px);
                  }
                  .left-nav-expand-icon.right .vertical-line {
                    transform: translate(8px, 0px);
                  }
                  .left-nav-expand-icon .arrow {
                    transform: translate(3.748165px, 8.499688px);
                    transition: transform 0.3s ease, all 0.3s ease;
                  }
                  .left-nav-expand-icon.right .arrow {
                    transform: translate(calc(3.748165px + (9.57px * 1.75)), 8.499688px) rotate3d(0, 1, 0, 180deg);
                  }
                `}</style>
                <path
                  d="M3.31785,22.2281c1.6358.1329,4.23145.272,7.93215.272c1.5462-.0528,5.9548-.1113,7.9321-.2719c1.6439-.1335,2.9124-1.4019,3.046-3.0459.1329-1.6358.2719-4.2314.2719-7.9322c0-3.70065-.139-6.2963-.2719-7.93209-.1336-1.64393-1.4021-2.91234-3.046-3.045905C17.7842.158525,12.7962.052785,11.25,0c-3.7007,0-6.29635.13904-7.93215.271945C1.67393.40551.405515,1.67392.271945,3.31784.13904,4.95365,0,7.5493,0,11.25s.139035,6.2964.271945,7.9321c.133565,1.644,1.401985,2.9124,3.045905,3.046Z"
                  transform="translate(.775757 0.74995)"
                  fill="currentColor"
                />
                <g>
                  <path
                    className="arrow transition-transform"
                    d="M5.74814,3.50025c0-1.48814-.06404-2.39893-.11982-2.910189-.02285-.209476-.142-.38118-.31675-.46553-.17516-.084554-.38412-.070583-.5622.044523-.34249.22139-.88247.601825-1.67185 1.238036-.91805.73992-1.41067 1.28841-1.66431 1.62243-.21519.28339-.21516.65808.00005.94145.25363.33396.74624.88241 1.66425 1.62243.78948.6364 1.32949 1.01686 1.67199 1.23823.17806.11506.38698.129.56212.04446.17472-.08435.29384-.25604.31669-.46549.05578-.51121.11983-1.42205.11983-2.91035Z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                    fill="var(--color-background-secondary)"
                  />
                  <g className="vertical-line" transform="translate(15,0)" fill="var(--color-background-secondary)">
                    <rect width="1.5" height="24" rx="0" ry="0" transform="translate(0,0)" />
                  </g>
                </g>
              </svg>
            </button>
          </div>
        )}
        </div>
      </nav>
    </div>
  );
}

export default LeftNav;
