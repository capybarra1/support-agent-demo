'use strict';
const el = (id) => document.getElementById(id);
let submitted = false;
let failureSimulated = false;
function stage(index) {
  for (let i=0;i<4;i++) el(`step-${i}`).classList.toggle('active', i === index);
}
function result(text, error = false) {
  const output=el('outcome');
  output.textContent=text;
  output.classList.remove('hidden');
  output.classList.toggle('error',error);
}
el('information').addEventListener('submit',(event)=>{
  event.preventDefault();
  const context=el('context').value.trim();
  if(!context){el('context').focus();return;}
  el('description').value=`问题：时间筛选后持续加载，刷新未恢复。\n补充信息：${context}`;
  el('information').classList.add('hidden');
  el('preview').classList.remove('hidden');
  stage(1);
});
el('preview').addEventListener('submit',(event)=>{
  event.preventDefault();
  if(submitted)return;
  if(!el('title').value.trim()||!el('description').value.trim()){
    result('请填写工单标题和问题描述。',true);return;
  }
  stage(2);
  if(el('simulate-failure').checked&&!failureSimulated){
    failureSimulated=true;
    result('演示接口未完成创建。你的预览仍保留，可再次确认重试。',true);
    stage(1);return;
  }
  submitted=true;
  el('confirm').disabled=true;
  el('cancel').disabled=true;
  el('title').readOnly=true;
  el('description').readOnly=true;
  el('query').classList.remove('hidden');
  result(`已生成演示工单 DEMO-001：${el('title').value.trim()}。这是本页的虚构记录，未向外部系统发送。`);
  stage(3);
});
el('cancel').addEventListener('click',()=>{
  el('preview').classList.add('hidden');
  result('已取消，未创建工单。你可以重新体验。');
  stage(0);
});
el('query').addEventListener('click',()=>{
  result('DEMO-001 · 演示状态：待人工分派。该状态为固定示例，不是实时 Jira 查询。');
});
el('reset').addEventListener('click',()=>{
  submitted=false;failureSimulated=false;
  el('information').reset();el('preview').reset();
  el('information').classList.remove('hidden');el('preview').classList.add('hidden');
  el('outcome').classList.add('hidden');el('query').classList.add('hidden');
  el('confirm').disabled=false;el('cancel').disabled=false;
  el('title').readOnly=false;el('description').readOnly=false;
  stage(0);el('context').focus();
});
