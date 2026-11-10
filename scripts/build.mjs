import { cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
const outputDir = process.env.SITE_OUTPUT_DIR || 'dist';
if (!['dist','docs'].includes(outputDir)) throw new Error('SITE_OUTPUT_DIR must be dist or docs');
const rawBase = (process.env.SITE_BASE_PATH || '').trim();
const basePath = rawBase === '/' ? '' : rawBase.replace(/\/+$/, '');
if (basePath && (!/^\/[A-Za-z0-9._\/-]+$/.test(basePath) || basePath.split('/').some(part => part === '.' || part === '..') || basePath.includes('//'))) throw new Error('Invalid SITE_BASE_PATH');
for (const path of ['src/layout.html', 'site/style.css', 'site/app.js', 'site/assets/chatgpt-beginner-10-questions.pdf', 'site/assets/chatgpt-beginner-cover.png']) {
  if (!(await stat(path)).size) throw new Error('Missing or empty file: ' + path);
}
await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp('site', outputDir, { recursive: true });
const layout = await readFile('src/layout.html', 'utf8');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const routes = { class: '/classes/', learning: '/roadmap/', reviews: '/reviews/', resources: '/resources/', team: '/instructors/', 'free-prep': '/roadmap/#free-prep' };
const routeLinks = html => html.replace(/href="#(class|learning|reviews|resources|team|free-prep)"/g, (_, key) => `href="${routes[key]}"`).replaceAll('href="#"', 'href="/"');
const readSection = name => readFile(`src/sections/${name}.html`, 'utf8');
const pageVisuals = {
  classes:{ emoji:'🤖', theme:'blue', title:'나만의 AI 비서', caption:'목적 정하기 · 만들기 · 실습하기', chip:'Zoom 온라인 수업' },
  roadmap:{ emoji:'🚀', theme:'peach', title:'나에게 맞는 다음 단계', caption:'AI 비서 · 콘텐츠 · 업무 자동화', chip:'결과물로 고르는 배움' },
  reviews:{ emoji:'💬', theme:'lilac', title:'먼저 배운 분들의 이야기', caption:'실습으로 만난 작은 변화', chip:'닉네임 일부 비공개' },
  resources:{ emoji:'📚', theme:'mint', title:'바로 꺼내 쓰는 AI 자료', caption:'입문 전자책부터 실습 자료까지', chip:'전자책 2종 · 활용 자료 6종' },
  instructors:{ emoji:'🧑‍🏫', theme:'lemon', title:'함께 익히는 AI 활용', caption:'배움이 실제 활용이 되도록', chip:'AI 디벨롭 강사진' }
};
const pages = [
  { key:'home', path:'/', label:'홈', title:'AI 디벨롭 — AI를 내 일에, 한 단계씩', description:'무료 입문 자료부터 나만의 AI 비서까지. 내 목표에 맞는 AI 배움과 수강생의 이야기를 만나보세요.', sections:['hero','reviews','topics','home-guide','home-resources','soft-closing'] },
  { key:'classes', path:'/classes/', label:'강의 소개', title:'강의 소개 | AI 디벨롭', description:'나만의 비서 챗봇 만들기. 3주·99,000원, Zoom 온라인 주 1회. 수업 목표와 신청 안내를 확인하세요.', intro:'직접 만들어보는 수업의 목표와 진행 방식을 확인하세요.', sections:['class','faq','paid-closing'] },
  { key:'roadmap', path:'/roadmap/', label:'3단계 로드맵', title:'3단계 로드맵 | AI 디벨롭', description:'AI 비서, 콘텐츠 제작, 업무 자동화. 만들고 싶은 결과와 사용 경험에 맞는 학습 방향을 찾아보세요.', intro:'AI 비서부터 콘텐츠와 업무 자동화까지, 만들고 싶은 결과에서 시작해요.', sections:['roadmap','examples','soft-closing'] },
  { key:'reviews', path:'/reviews/', label:'수강 후기', title:'수강 후기 | AI 디벨롭', description:'기존 AI 활용 강의를 함께한 분들의 후기 10건. 닉네임을 가린 수강 소감과 다음 배움에 대한 이야기를 만나보세요.', intro:'직접 실습하며 남겨주신 소감과 다음 배움에 대한 기대를 모았습니다.', sections:['reviews','soft-closing'] },
  { key:'resources', path:'/resources/', label:'무료 자료', title:'무료 전자책과 활용 자료 | AI 디벨롭', description:'ChatGPT 입문자 핵심 10문항 PDF, AI 활용법 완전초보 전자책, 인스타그램·블로그 노션 활용 자료를 이용하세요.', intro:'입문 전자책과 바로 써보는 실습 자료를 필요한 순간에 꺼내보세요.', sections:['resources','soft-closing'] },
  { key:'instructors', path:'/instructors/', label:'강사진', title:'강사진 | AI 디벨롭', description:'AI 디벨롭의 강민구·김시연·오명국·강정화 강사를 소개합니다.', intro:'배운 AI를 내 일에 쓸 수 있는 방법으로 이어가는 강사진을 소개합니다.', sections:['instructors','team-closing'] }
];
for (const page of pages) {
  const pieces = await Promise.all(page.sections.map(readSection));
  if (page.key === 'home') {
    const index = page.sections.indexOf('reviews');
    pieces[index] = pieces[index].replaceAll('id="reviews"', 'id="home-reviews"').replaceAll('reviews-title', 'home-reviews-title');
    pieces[index] = pieces[index].replace('section-wrap reviews-section', 'section-wrap reviews-section home-reviews-section')
      .replace('<h2 id="home-reviews-title">수강생이 전하는,<br>배움 이후의 이야기.</h2>', '<h2 id="home-reviews-title">직접 써본 분들의 이야기.</h2>')
      .replace('실습하며 느낀 변화와 다음에 배우고 싶은 것까지.<br>강의를 함께한 분들의 목소리를 담았습니다.', '실습을 통해 무엇을 경험했는지, 수강생의 목소리로 들어보세요.')
      .replace('기존 AI 활용 강의의 수강 후기에서 발췌했습니다. 특정 유료 과정의 구매 후기로 분류한 내용은 아닙니다. 닉네임은 일부 가리고, 프로필 사진은 표시하지 않았습니다.', '기존 AI 활용 강의에서 발췌한 후기입니다. 닉네임은 일부 비공개입니다.');
    const cards = pieces[index].match(/<figure\b[\s\S]*?<\/figure>/g);
    if (cards?.length !== 10) throw new Error('Expected 10 source review cards');
    const homeOrder = [7, 3, 6, 0, 1, 2, 4, 5, 8, 9];
    let reviewIndex = 0;
    pieces[index] = pieces[index].replace(/<figure\b[\s\S]*?<\/figure>/g, () => {
      const card = cards[homeOrder[reviewIndex]];
      reviewIndex += 1;
      return card.replace(/aria-label="후기 \d+ \/ 10"/, `aria-label="후기 ${reviewIndex} / 10"`);
    });
    pieces[index] = pieces[index].replace(/<div class="reviews-bottom">[\s\S]*?<\/div>/, '<div class="reviews-bottom"><span>배움을 함께한 분들의 이야기를 만나보세요.</span><a class="text-link" href="/reviews/">수강 후기 전체 보기 <svg class="icon"><use href="#i-arrow"/></svg></a></div>');
  }
  const visual = pageVisuals[page.key];
  const intro = page.key === 'home' ? '' : `<div class="section-wrap page-intro"><nav class="breadcrumbs" aria-label="현재 위치"><a href="/">홈</a><span aria-hidden="true">/</span><span aria-current="page">${escape(page.label)}</span></nav><div class="page-intro-grid"><div class="page-intro-copy"><span class="section-kicker">AI DEVELOP / ${page.key.toUpperCase()}</span><h1>${escape(page.label)}</h1><p>${escape(page.intro)}</p></div><div class="page-intro-art cover-${visual.theme}" aria-hidden="true"><span class="page-art-orbit"></span><span class="page-art-chip">${escape(visual.chip)}</span><span class="page-art-emoji">${visual.emoji}</span><div class="page-art-label"><strong>${escape(visual.title)}</strong><span>${escape(visual.caption)}</span></div></div></div></div>`;
  let html = layout.replaceAll('{{TITLE}}', escape(page.title)).replaceAll('{{DESCRIPTION}}', escape(page.description)).replaceAll('{{PAGE_KEY}}', page.key).replaceAll('{{BASE_PATH}}', escape(basePath)).replace('{{CONTENT}}', intro + '\n' + pieces.join('\n'));
  html = routeLinks(html);
  if (page.key !== 'home') {
    html = html.replace(`<a href="${page.path}">`, `<a href="${page.path}" aria-current="page">`);
  }
  html = html.replace(/\b(href|src)="(\/(?!\/)[^"]*)"/g, (_, attr, value) => `${attr}="${basePath}${value}"`);
  if (html.includes('{{')) throw new Error(`Unresolved template in ${page.path}`);
  const directory = page.path === '/' ? outputDir : `${outputDir}${page.path}`;
  await mkdir(directory, { recursive:true });
  await writeFile(`${directory}/index.html`, html);
}
await writeFile(`${outputDir}/.nojekyll`, '');
console.log(`Built ${pages.length} AI 디벨롭 pages in ${outputDir}/ with base path ${basePath || '/'}`);
