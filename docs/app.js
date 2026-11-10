const SITE_BASE_PATH=(document.querySelector('meta[name="site-base-path"]')?.content||'').replace(/\/+$/,'');
const sitePath=path=>SITE_BASE_PATH+path;
// Preserve links shared before categories became separate pages.
const legacyPages = {'#class':'/classes/','#learning':'/roadmap/','#reviews':'/reviews/','#resources':'/resources/','#team':'/instructors/','#free-prep':'/roadmap/#free-prep'};
function redirectLegacyPage(){if((location.pathname===sitePath('/')||location.pathname===sitePath('/index.html'))&&legacyPages[location.hash])location.replace(sitePath(legacyPages[location.hash]));}
redirectLegacyPage();
window.addEventListener('hashchange',redirectLegacyPage);
const KAKAO = 'http://pf.kakao.com/_xgrjxaX/chat';
const PDF = sitePath('/assets/chatgpt-beginner-10-questions.pdf');
const ONLINE_EBOOK = 'https://url.kr/he1eak';
const arrow = '<svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg>';
const download = '<svg class="icon" aria-hidden="true"><use href="#i-download"/></svg>';
const dialog = document.querySelector('#site-dialog');
const content = document.querySelector('#dialog-content');
let returnFocus;
const external = (label='카카오로 상담 신청') => `<a class="btn btn-primary" href="${KAKAO}" target="_blank" rel="noopener noreferrer">${label} ${arrow}<span class="sr-only">새 창 열림</span></a>`;
const levels = {
  beginner:{title:'나만의 비서 챗봇 만들기',label:'1단계 · AI 비서',outcome:'내 목적에 맞는 비서 챗봇 1개',intro:'자주 하는 일 하나를 골라, 나에게 맞는 지시문을 정리하고 비서 챗봇을 만들어보는 과정입니다.'},
  intermediate:{title:'내 콘텐츠 제작 루틴 만들기',label:'2단계 · AI 콘텐츠 제작',outcome:'나만의 콘텐츠와 제작 템플릿',intro:'기본적인 AI 질문에 익숙하고, 글·이미지·카드뉴스 제작을 반복 가능한 방식으로 익히고 싶은 분을 위한 과정 기획입니다.',modules:[['대상과 메시지 정하기','누구에게 무엇을 전할지 정하고 콘텐츠를 기획합니다.'],['만들고 수정하기','이미지·글·카드뉴스의 결과물을 만들고 원하는 부분을 다듬는 실습을 구상합니다.'],['나의 제작 루틴 정리하기','다음 콘텐츠에도 재사용할 질문과 제작 기준을 정리합니다.']]},
  advanced:{title:'반복 업무 흐름 연결하기',label:'3단계 · AI 업무 자동화',outcome:'입력부터 검토까지 연결한 업무 흐름',intro:'AI를 실제 업무에 사용해봤고, 반복하는 작업을 단계별로 연결하고 싶은 분을 위한 과정 기획입니다.',modules:[['반복 작업 나누기','입력, 처리, 결과 확인의 단계로 업무 흐름을 정리합니다.'],['도구 연결하기','필요한 AI·업무 도구와 연결 조건을 확인하는 실습을 구상합니다.'],['예외와 검토 기준 세우기','오류에 대응하고 사람이 확인할 지점을 정리합니다.']]}
};
const coursePrice = '<div class="course-price"><div class="price-original"><span>정가</span><del>290,000원</del></div><div class="price-sale"><span class="price-sale-label">할인가</span><strong>99,000<small>원</small></strong></div></div>';
const inquiryMessages = {
  beginner:["[AI 디벨롭 / 1단계 수강 문의]","나만의 비서 챗봇 만들기(3주·정가 290,000원 → 할인가 99,000원) 과정을 문의합니다.","진행 안내: Zoom 온라인, 주 1회, 총 3회, 회당 약 60~90분 예정.","만들고 싶은 비서: [직접 입력]","현재 AI 사용 경험: [직접 입력]","개강일과 요일·시간, 사용할 AI 도구, 추가 구독 비용, 결제 방법과 환불 기준을 안내받고 싶습니다."].join('\n'),
  intermediate:["[AI 디벨롭 / 2단계 관심 문의]","AI 콘텐츠 제작 과정에 관심이 있습니다.","현재 사용하는 AI 도구: [직접 입력]","가장 만들고 싶은 콘텐츠: [글 / 이미지 / 카드뉴스 등]","가장 어려운 점: [직접 입력]","수강 가능한 시간대: [선택 입력]","희망 가격대: [선택 입력]","과정의 기간·가격이 미정이며, 이 메시지는 수강 신청이나 결제가 아닌 관심 문의임을 확인했습니다."].join('\n'),
  advanced:["[AI 디벨롭 / 3단계 관심 문의]","AI 업무 자동화 과정에 관심이 있습니다.","현재 하는 업무와 사용하는 도구: [직접 입력]","줄이고 싶은 반복 작업: [직접 입력]","이미 AI를 적용해본 일: [직접 입력]","수강 가능한 시간대: [선택 입력]","희망 가격대: [선택 입력]","과정의 기간·가격이 미정이며, 이 메시지는 수강 신청이나 결제가 아닌 관심 문의임을 확인했습니다."].join('\n')
};
const escapeHtml = value => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function inquiryBlock(key){return `<details class="inquiry-template"><summary>카카오에 보낼 문의 문구 미리 보기</summary><pre tabindex="0">${escapeHtml(inquiryMessages[key])}</pre></details><div class="dialog-actions inquiry-actions"><button class="btn btn-outline" data-copy-inquiry="${key}">문의 문구 복사</button>${external(key==='beginner'?'카카오로 수강 문의':'카카오로 관심 문의')}</div><p class="inquiry-copy-status" role="status" aria-live="polite"></p><p class="dialog-note">문구를 복사한 뒤 카카오 채널에서 대괄호 부분을 바꿔 직접 보내주세요. 버튼을 누르는 것만으로 문의가 전송되거나 신청이 완료되지는 않습니다.</p>`;}
function prepRecommendation(needsPrep){return needsPrep?'<div class="quiz-prep-note"><strong>AI가 처음이라면 무료 준비부터.</strong><p>핵심 10문항 소책자로 사용 목적과 원하는 답변 방식을 먼저 정리해보세요.</p><button class="text-link" data-modal="ebook">무료 전자책 받기 '+arrow+'</button></div>':'';}
function enrollmentView({recommended=false,needsPrep=false}={}){
  openDialog(`<span class="dialog-kicker">${recommended?'목표에 맞는 과정 · 추천 결과':'1단계 · AI DEVELOP CLASS'}</span><h2 class="dialog-title" id="dialog-title">나만의 비서 챗봇 만들기</h2><p class="dialog-description">내 목적에 맞는 비서 챗봇 1개를 만드는 것이 학습 목표입니다. 일정과 준비 조건을 확인한 뒤 신청을 결정하세요.</p><div class="course-fact-row"><span>3주 · 주 1회</span><span>Zoom 온라인</span><span>회당 약 60~90분 예정</span></div><div class="dialog-info offer-modal-info"><div><strong>3주 과정 수강료</strong>${coursePrice}</div><p>총 3회 예정 · 개강일과 요일·시간은 안내 예정</p></div>${prepRecommendation(needsPrep)}<div class="purchase-checklist"><strong>신청 전에 확인할 정보</strong><ul><li>개강일·요일·시간과 담당 강사</li><li>사용할 AI 도구와 추가 구독 비용 여부</li><li>결제 방법과 환불 기준</li></ul><p>아직 확정 안내 전인 항목은 카카오 상담에서 확인해주세요. 온라인 결제 링크는 준비 중입니다.</p></div>${inquiryBlock('beginner')}`);
}
async function copyPlainText(value){
  if(navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(value);return;}catch{}}
  const previous=document.activeElement;
  const area=document.createElement('textarea');area.value=value;area.setAttribute('aria-label','복사할 문의 문구');area.style.position='fixed';area.style.opacity='0';(dialog.open?content:document.body).append(area);area.focus();area.select();
  try{if(!document.execCommand('copy'))throw new Error('Copy unavailable');}finally{area.remove();previous?.focus({preventScroll:true});}
}
async function copyInquiry(button){
  const key=button.dataset.copyInquiry;
  if(!inquiryMessages[key])return;
  const status=content.querySelector('.inquiry-copy-status');
  try{await copyPlainText(inquiryMessages[key]);if(button.isConnected){button.textContent='문의 문구를 복사했어요 ✓';if(status)status.textContent='카카오 채널에서 내용을 수정한 뒤 직접 보내주세요.';}}
  catch{const details=content.querySelector('.inquiry-template');if(details){details.open=true;details.querySelector('pre')?.focus();}if(status)status.textContent='자동 복사를 사용할 수 없어요. 위 문의 문구를 직접 선택해서 복사해주세요.';}
}
function openDialog(html){
  if(!dialog.open){returnFocus=document.activeElement;dialog.showModal();document.body.classList.add('dialog-open');}
  content.innerHTML=html;
  dialog.scrollTop=0;
  requestAnimationFrame(()=>{const title=content.querySelector('#dialog-title');if(title){title.tabIndex=-1;title.focus({preventScroll:true});}});
}
function closeDialog(){dialog.close();}
dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');returnFocus?.focus({preventScroll:true});});
document.querySelector('.dialog-close').addEventListener('click',closeDialog);
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
function levelView(key,recommended=false,needsPrep=false){const l=levels[key];if(!l)return;
  if(key==='beginner'){enrollmentView({recommended,needsPrep});return;}
  openDialog(`<span class="dialog-kicker">${recommended?'목표에 맞는 과정 · 추천 결과':l.label}</span><h2 class="dialog-title" id="dialog-title">${l.title}</h2><div class="course-fact-row"><span>기획 중</span><span>기간·가격 미정</span></div><p class="dialog-description">${l.intro}</p>${prepRecommendation(needsPrep)}<div class="dialog-info"><strong>기획 중인 학습 목표</strong><p>${l.outcome}</p></div><ol class="level-detail-list">${l.modules.map(([t,d])=>`<li><div><strong>${t}</strong><small>${d}</small></div></li>`).join('')}</ol><p class="dialog-note interest-note">확정된 판매 상품이 아닙니다. 배우고 싶은 내용과 현재 겪는 어려움을 남겨주시면 과정 기획에 참고합니다. 관심 문의는 신청·예약·결제로 처리되지 않습니다.</p>${inquiryBlock(key)}`);
}
function showModal(type){
  if(type==='ebook')openDialog(`<div class="dialog-icon" aria-hidden="true"><svg class="spark-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M2 12h20M5 5l14 14M5 19 19 5"/></svg></div><span class="dialog-kicker">AI DEVELOP · FREE EBOOKS</span><h2 class="dialog-title" id="dialog-title">나에게 필요한<br>무료 전자책을 골라보세요.</h2><p class="dialog-description">ChatGPT를 내게 맞게 설정하는 실습 소책자와<br>AI 활용법 완전초보 전자책을 만나보세요.</p><div class="ebook-dialog-list"><section><span class="level-tag">PDF · 20쪽</span><h3>ChatGPT 입문자가 반드시 답해야 할 핵심 10문항</h3><p>사용 목적부터 말투와 답변 형식까지. 10개의 답을 나만의 ChatGPT 기본 설정문으로 정리해보세요.</p><a class="btn btn-primary" href="${PDF}" download="ChatGPT_입문자_핵심10문항_소책자.pdf">PDF 소책자 내려받기 ${download}</a><a class="pdf-preview-link" href="${PDF}" target="_blank" rel="noopener noreferrer">PDF 먼저 보기 ↗<span class="sr-only">새 창 열림</span></a></section><section><span class="level-tag">온라인 전자책</span><h3>AI 활용법 완전초보 전자책</h3><p>AI를 처음 접하는 분을 위한 전자책입니다. 아래 링크에서 열어보세요.</p><a class="btn btn-outline" href="${ONLINE_EBOOK}" target="_blank" rel="noopener noreferrer">온라인 전자책 열기 ${arrow}<span class="sr-only">새 창 열림</span></a></section></div><p class="dialog-note">이 사이트에서는 전자책 이용을 위해 이메일이나 연락처를 수집하지 않습니다. 온라인 전자책은 외부 사이트에서 새 창으로 열립니다.</p>`);
  else if(type==='enroll')enrollmentView();
  else if(type==='curriculum')openDialog(`<span class="dialog-kicker">3-WEEK LEARNING GOALS · 구성안</span><h2 class="dialog-title" id="dialog-title">만들고, 써보고,<br>다듬는 3주.</h2><p class="dialog-description">Zoom 온라인 · 주 1회 · 총 3회 예정<br>회당 약 60~90분으로 예상하고 있습니다.</p><ol class="level-detail-list"><li><div><strong>1주차 · 내 비서가 맡을 일 정하기</strong><small>반복해서 부탁할 일 하나를 고르고, 비서의 목적과 기본 지시문을 정리합니다.</small></div></li><li><div><strong>2주차 · 챗봇을 만들고 질문해보기</strong><small>목적에 맞게 비서를 구성하고, 질문을 바꿔가며 응답을 시험해봅니다.</small></div></li><li><div><strong>3주차 · 내 일에 적용하고 개선하기</strong><small>실제 사용 상황에서 부족한 점을 찾아 지시문과 응답 기준을 다듬습니다.</small></div></li></ol><div class="dialog-info"><strong>학습 목표: 내 목적에 맞는 비서 챗봇 1개</strong><p>3주 과정 수강료</p>${coursePrice}</div><p class="dialog-note">위 내용은 커리큘럼 구성안입니다. 개강일, 담당 강사, 사용할 AI 도구와 추가 구독 필요 여부, 최종 수업 구성은 안내 예정입니다.</p><div class="dialog-actions"><button class="btn btn-primary" data-modal="enroll">수강 조건 확인 · 신청 안내 ${arrow}</button></div>`);
  else if(type==='quiz')startQuiz();
  else if(type==='privacy')openDialog(`<span class="dialog-kicker">SITE INFORMATION</span><h2 class="dialog-title" id="dialog-title">이용 및 개인정보 안내</h2><p class="dialog-description">AI 디벨롭의 교육 안내와 무료 입문 자료를 제공하는 사이트입니다.</p><div class="dialog-info"><strong>개인정보 수집</strong><p>이 사이트는 상담 신청서, 이메일 수집, 광고·분석 추적 기능을 사용하지 않습니다. 단계 추천 답변은 브라우저에서만 처리하며 서버에 저장하지 않습니다.</p><br><strong>카카오 상담</strong><p>카카오 버튼은 외부 카카오 채널로 이동합니다. 문의 문구 복사는 메시지를 자동 전송하지 않습니다. 직접 보내는 내용과 개인정보는 카카오 채널의 처리 안내를 확인해주세요.</p><br><strong>결제 및 수업 안내</strong><p>사이트 내 결제는 아직 제공하지 않습니다. 수업 일정·진행 방식·결제·환불 조건은 신청 전 카카오 채널에서 확인해주세요.</p><br><strong>무료 자료와 외부 링크</strong><p>PDF 소책자는 사이트에서 바로 내려받을 수 있습니다. 온라인 전자책과 노션 자료는 외부 사이트에서 새 창으로 열립니다. 외부 사이트의 이용·개인정보 안내는 해당 사이트에서 확인해주세요.</p></div>`);
}
document.addEventListener('click',event=>{const modal=event.target.closest('[data-modal]');if(modal){event.preventDefault();showModal(modal.dataset.modal);}const level=event.target.closest('[data-level]');if(level)levelView(level.dataset.level);const quiz=event.target.closest('[data-quiz-answer]');if(quiz)quizAnswer(Number(quiz.dataset.quizAnswer));const inquiry=event.target.closest('[data-copy-inquiry]');if(inquiry)copyInquiry(inquiry);});
const quizQuestions=[{title:'지금 가장 만들고 싶은 것은요?',options:[['내 목적에 맞는 AI 비서','자주 부탁하는 일을 돕는 비서 챗봇'],['내가 꾸준히 만들 콘텐츠','글·이미지·카드뉴스 제작 루틴'],['반복 업무를 연결하는 흐름','AI·업무 도구를 활용하는 자동화']]},{title:'AI는 어느 정도 사용해보셨나요?',options:[['아직 처음이거나 몇 번만 써봤어요.','무료 준비 자료부터 살펴보고 싶어요.'],['기본 질문과 답변은 익숙해요.','내 목적에 맞는 결과물을 만들고 싶어요.'],['이미 내 업무에서 사용하고 있어요.','제작이나 업무 흐름을 발전시키고 싶어요.']]}];
let quizStep=0,quizScores=[];
function startQuiz(){quizStep=0;quizScores=[];renderQuiz();}
function renderQuiz(){const q=quizQuestions[quizStep];openDialog(`<div class="quiz-progress" aria-label="${quizStep+1} / 2 단계"><span class="active"></span><span class="${quizStep===1?'active':''}"></span></div><span class="dialog-kicker">FIND YOUR GOAL · ${quizStep+1} / 2</span><h2 class="dialog-title" id="dialog-title">${q.title}</h2><p class="dialog-description">목표와 사용 경험에 맞춰 살펴볼 과정을 추천합니다.</p><div class="quiz-options">${q.options.map(([t,d],i)=>`<button class="quiz-option" data-quiz-answer="${i}"><span class="quiz-letter">${String.fromCharCode(65+i)}</span><span><strong>${t}</strong><small>${d}</small></span></button>`).join('')}</div><p class="dialog-note">공식 수준 평가가 아닌 학습 방향 추천입니다. 답변은 저장하지 않으며, 준비 중인 과정은 관심 문의로 안내합니다.</p>`);}
function quizAnswer(answer){if(answer<0||answer>2||quizStep>=2)return;quizScores.push(answer);quizStep++;if(quizStep<2)renderQuiz();else{levelView(['beginner','intermediate','advanced'][quizScores[0]],true,quizScores[1]===0);}}
const examples={write:{before:'“회의 내용 좀 정리해줘.”',after:'“아래 회의 내용을 <strong>결정 사항 · 담당자 · 다음 할 일</strong>로 나눠 표로 정리해줘. 정해지지 않은 항목은 추측하지 말고 ‘미정’으로 표시해줘.”'},plan:{before:'“SNS 콘텐츠 아이디어 좀 줘.”',after:'“<strong>[대상 독자]</strong>를 위한 <strong>[주제]</strong> 콘텐츠를 기획하고 있어. 독자의 고민을 먼저 3개 정리한 뒤, 고민별 콘텐츠 아이디어와 제목을 하나씩 제안해줘.”'},assistant:{before:'“내 비서처럼 일해줘.”',after:'“너는 내 <strong>글쓰기 비서</strong>야. 독자는 AI 입문자이고, 짧고 쉬운 문장을 선호해. 내가 주제를 주면 <strong>독자 · 목적 · 분량</strong>을 먼저 질문한 뒤 초안을 만들어줘.”'}};
const tabs=[...document.querySelectorAll('[data-example]')];
function selectTab(tab){tabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;});const e=examples[tab.dataset.example];document.querySelector('#example-before').textContent=e.before;document.querySelector('#example-after').innerHTML=e.after;document.querySelector('#example-panel').setAttribute('aria-labelledby',tab.id);document.querySelector('#copy-prompt').innerHTML='질문 복사하기 <span aria-hidden="true">↗</span>';}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectTab(tab));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();selectTab(tabs[next]);tabs[next].focus();});});
document.querySelector('#copy-prompt')?.addEventListener('click',async event=>{const button=event.currentTarget;const value=document.querySelector('#example-after').textContent;try{if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(value);else{const area=document.createElement('textarea');area.value=value;area.style.position='fixed';area.style.opacity='0';document.body.append(area);area.select();const ok=document.execCommand('copy');area.remove();if(!ok)throw new Error('Copy unavailable');}button.textContent='복사했어요 ✓';document.querySelector('#copy-status').textContent='질문을 복사했습니다.';}catch{button.textContent='복사할 질문 보기';openDialog(`<h2 class="dialog-title" id="dialog-title">질문을 선택해서 복사해주세요</h2><p class="dialog-description">이 환경에서는 자동 복사를 사용할 수 없어요.</p><div class="dialog-info" style="user-select:all"></div>`);content.querySelector('.dialog-info').textContent=value;}});
document.querySelector('#year').textContent=new Date().getFullYear();

// Shared mobile navigation for every static page.
const siteHeader = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('#primary-navigation');
function setMenuOpen(open){
  siteHeader?.classList.toggle('is-menu-open',open);
  menuToggle?.setAttribute('aria-expanded',String(open));
}
menuToggle?.addEventListener('click',()=>setMenuOpen(menuToggle.getAttribute('aria-expanded')!=='true'));
primaryNav?.addEventListener('click',event=>{if(event.target.closest('a'))setMenuOpen(false);});
document.addEventListener('click',event=>{if(menuToggle?.getAttribute('aria-expanded')==='true'&&!siteHeader.contains(event.target))setMenuOpen(false);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!dialog.open&&menuToggle?.getAttribute('aria-expanded')==='true'){setMenuOpen(false);menuToggle.focus();}});
window.matchMedia('(min-width:901px)').addEventListener('change',event=>{if(event.matches)setMenuOpen(false);});

// One review at a time, with manual controls and reading/motion safeguards.
document.querySelectorAll('[data-review-carousel]').forEach(carousel=>{
  const viewport=carousel.querySelector('[data-review-viewport]');
  const track=carousel.querySelector('[data-review-track]');
  const cards=[...track.children];
  const toggle=carousel.querySelector('[data-review-toggle]');
  const counter=carousel.querySelector('[data-review-counter]');
  const announcement=carousel.querySelector('[data-review-announcement]');
  const motion=window.matchMedia('(prefers-reduced-motion:reduce)');
  let userPaused=motion.matches,hoverPaused=false,focusPaused=false,inView=false,index=0,timer=null;
  function metrics(){
    const gap=Number.parseFloat(getComputedStyle(track).gap)||0;
    const width=cards[0]?.getBoundingClientRect().width||viewport.clientWidth;
    const step=width+gap;
    const visible=Math.max(1,Math.round((viewport.clientWidth+gap)/step));
    return {step,visible,max:Math.max(0,cards.length-visible)};
  }
  function updateCounter(){
    const {visible,max}=metrics();
    index=Math.max(0,Math.min(max,index));
    const end=Math.min(cards.length,index+visible);
    const label=(end===index+1?String(index+1):`${index+1}–${end}`)+` / ${cards.length}`;
    if(counter.textContent!==label)counter.textContent=label;
    carousel.dataset.reviewIndex=String(index);
  }
  function goTo(next,{manual=false,instant=false}={}){
    const {step,max}=metrics();
    index=Math.max(0,Math.min(max,next));
    viewport.scrollTo({left:index*step,behavior:instant||motion.matches?'instant':'smooth'});
    updateCounter();
    if(manual)announcement.textContent=`${index+1}번째 후기부터 표시합니다.`;
  }
  function clearTimer(){if(timer!==null){clearInterval(timer);timer=null;}}
  function refresh(){
    clearTimer();
    toggle.querySelector('span').textContent=userPaused?'자동 넘김 시작':'일시정지';
    toggle.querySelector('use').setAttribute('href',userPaused?'#i-play':'#i-pause');
    toggle.setAttribute('aria-label',userPaused?'후기 자동 넘김 시작':'후기 자동 넘김 일시정지');
    const canPlay=!userPaused&&!hoverPaused&&!focusPaused&&inView&&!document.hidden&&!dialog.open&&metrics().max>0;
    carousel.dataset.reviewAutoplay=canPlay?'running':'paused';
    if(canPlay)timer=setInterval(()=>{
      const max=metrics().max;
      if(index>=max)goTo(0,{instant:true});else goTo(index+1);
    },3000);
  }
  function pauseByChoice(){userPaused=true;refresh();}
  function move(delta){
    pauseByChoice();
    const max=metrics().max;
    const next=index+delta;
    goTo(next<0?max:next>max?0:next,{manual:true,instant:next<0||next>max});
  }
  carousel.querySelector('[data-review-prev]').addEventListener('click',()=>move(-1));
  carousel.querySelector('[data-review-next]').addEventListener('click',()=>move(1));
  toggle.addEventListener('click',()=>{userPaused=!userPaused;if(!userPaused)focusPaused=false;refresh();});
  viewport.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch'){hoverPaused=true;refresh();}});
  viewport.addEventListener('pointerleave',()=>{hoverPaused=false;refresh();});
  viewport.addEventListener('pointerdown',pauseByChoice,{passive:true});
  viewport.addEventListener('wheel',event=>{if(Math.abs(event.deltaX)>Math.abs(event.deltaY))pauseByChoice();},{passive:true});
  carousel.addEventListener('focusin',()=>{focusPaused=true;refresh();});
  carousel.addEventListener('focusout',()=>requestAnimationFrame(()=>{if(!carousel.contains(document.activeElement)){focusPaused=false;refresh();}}));
  viewport.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    if(event.key==='ArrowLeft')move(-1);else if(event.key==='ArrowRight')move(1);else{pauseByChoice();goTo(event.key==='Home'?0:metrics().max,{manual:true,instant:true});}
  });
  viewport.addEventListener('scroll',()=>{index=Math.round(viewport.scrollLeft/metrics().step);updateCounter();},{passive:true});
  if('IntersectionObserver' in window){
    new IntersectionObserver(entries=>{inView=entries[0].isIntersecting&&entries[0].intersectionRatio>=.25;refresh();},{threshold:.25}).observe(viewport);
  }else inView=true;
  new ResizeObserver(()=>{goTo(Math.min(index,metrics().max),{instant:true});refresh();}).observe(viewport);
  new MutationObserver(refresh).observe(dialog,{attributes:true,attributeFilter:['open']});
  motion.addEventListener('change',()=>{if(motion.matches)userPaused=true;refresh();});
  document.addEventListener('visibilitychange',refresh);
  window.addEventListener('pagehide',clearTimer);
  window.addEventListener('pageshow',refresh);
  updateCounter();refresh();
});
